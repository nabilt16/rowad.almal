/**
 * extract-content.ts
 *
 * Parses three HTML reference files (Grades 4, 5, 6) and extracts all
 * educational content (units/lessons, badges, glossary, teacher guide)
 * into structured JSON files.
 *
 * Usage:  npx tsx scripts/extract-content.ts
 * Output: scripts/output/grade4.json, grade5.json, grade6.json
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface QuizChoice {
  text: string;
  correct: boolean;
}

interface Lesson {
  legacyId: string;
  title: string;
  subtitle: string;
  bgEmoji: string;
  bgColor: string;
  goal: string;
  storyTitle: string;
  storyText: string;
  conceptTitle: string;
  conceptText: string;
  conceptHtml: string;
  quizQuestion: string;
  quizChoices: QuizChoice[];
  activityType: string;
  activityConfig: Record<string, unknown>;
  sortOrder: number;
}

interface Unit {
  number: number;
  title: string;
  color: string;
  lessons: Lesson[];
}

interface Badge {
  badgeKey: string;
  icon: string;
  nameAr: string;
  requirementType: string;
  requirementValue: number;
  requirementKey: string | null;
}

interface GlossaryTerm {
  ar: string;
  he: string;
  def: string;
  ex: string;
}

interface GlossaryUnit {
  unit: number;
  unitName: string;
  unitColor: string;
  icon: string;
  terms: GlossaryTerm[];
}

interface GuideStep {
  text: string;
  time: string;
}

interface GuideTip {
  icon: string;
  text: string;
}

interface GuideLesson {
  title: string;
  goal: string;
  steps: GuideStep[];
  questions: string[];
  tips: GuideTip[];
  totalTime: string;
}

interface GuideUnit {
  name: string;
  lessons: GuideLesson[];
}

interface GradeOutput {
  units: Unit[];
  badges: Badge[];
  glossary?: GlossaryUnit[];
  guide: Record<string, GuideUnit>;
}

// ---------------------------------------------------------------------------
// Grade 4 activity type mapping (lesson id -> activity type)
// Based on the buildActivityL* function implementations in the HTML
// ---------------------------------------------------------------------------

const GRADE4_ACTIVITY_MAP: Record<string, string> = {
  l1: "ordering", // ordering stages of money evolution + multiple_choice
  l2: "calculation", // calculate remaining money + true_false
  l3: "classification", // match payment methods to features + multiple_choice
  l4: "multiple_choice", // choose correct answer about digital money
  l5: "classification", // classify need vs want
  l6: "calculation", // budget calculation + ordering
  l7: "calculation", // savings goal calculation
  l7b: "multiple_choice", // giving/charity decision
  l8: "true_false", // identify ad tricks
  l9: "calculation", // compare value across products
  l9b: "calculation", // recycling earnings calculation
  l4a: "calculation", // cost vs selling price
  l4b: "multiple_choice", // choose best business idea
  l4c: "multiple_choice", // customer understanding
  l4d: "calculation", // break-even calculation
  l5a: "multiple_choice", // taxes purpose
  l5b: "true_false", // bank true/false
  l5c: "multiple_choice", // credit card decisions
  l5d: "calculation", // dream savings calculation
};

// ---------------------------------------------------------------------------
// Extraction helpers
// ---------------------------------------------------------------------------

/**
 * Extract ALL inline <script>...</script> blocks from an HTML file
 * and return them as separate strings.  This is necessary because the
 * HTML files split the app code across multiple script tags.
 */
function extractAllScriptBlocks(html: string): string[] {
  const scriptRegex = /<script(?:\s[^>]*)?>(?!<\/script>)([\s\S]*?)<\/script>/gi;
  const blocks: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = scriptRegex.exec(html)) !== null) {
    const content = match[1].trim();
    // Skip empty blocks and external-only script tags
    if (content.length > 0) {
      blocks.push(content);
    }
  }

  if (blocks.length === 0) {
    throw new Error("No inline <script> blocks found in file");
  }

  return blocks;
}

/**
 * Find a JS constant assignment and extract the full object/array literal
 * using bracket-depth tracking.  Searches across multiple script blocks.
 *
 * Supports: const X = {...};  var X = [...];  let X = {...};
 */
function extractJSConstant(
  blocks: string[],
  name: string,
  type: "{" | "[" = "{"
): string | null {
  // Try each block individually to avoid cross-block contamination
  for (const script of blocks) {
    const result = extractJSConstantFromBlock(script, name, type);
    if (result) return result;
  }
  return null;
}

function extractJSConstantFromBlock(
  script: string,
  name: string,
  type: "{" | "["
): string | null {
  // Match patterns like: const UNITS = {  or  var GLOSSARY_TERMS = [
  const patterns = [
    new RegExp(`(?:const|let|var)\\s+${name}\\s*=\\s*\\${type}`),
    new RegExp(`${name}\\s*=\\s*\\${type}`),
  ];

  let startIdx = -1;
  for (const pattern of patterns) {
    const m = pattern.exec(script);
    if (m) {
      // Position at the opening bracket
      startIdx = m.index + m[0].length - 1;
      break;
    }
  }

  if (startIdx === -1) return null;

  const openBracket = type;
  const closeBracket = type === "{" ? "}" : "]";

  let depth = 1;
  let i = startIdx + 1;
  let inString: string | null = null; // track quote type: ', ", or `
  let escaped = false;
  let inTemplateExpr = 0; // depth of ${...} inside template literals

  while (i < script.length && depth > 0) {
    const ch = script[i];

    if (escaped) {
      escaped = false;
      i++;
      continue;
    }

    if (ch === "\\") {
      escaped = true;
      i++;
      continue;
    }

    if (inString === "`") {
      // Inside a template literal — handle ${...} expressions
      if (ch === "$" && i + 1 < script.length && script[i + 1] === "{") {
        inTemplateExpr++;
        i += 2; // skip ${
        continue;
      }
      if (inTemplateExpr > 0) {
        // Inside a template expression — track braces
        if (ch === "{") {
          inTemplateExpr++;
        } else if (ch === "}") {
          inTemplateExpr--;
          if (inTemplateExpr === 0) {
            // Exited the template expression, back in template string
            i++;
            continue;
          }
        }
        // Characters inside template expressions don't affect outer depth
        i++;
        continue;
      }
      // Closing backtick (not inside an expression)
      if (ch === "`") {
        inString = null;
      }
      i++;
      continue;
    }

    if (inString) {
      // Inside a single or double quoted string
      if (ch === inString) {
        inString = null;
      }
    } else {
      // Not inside any string
      if (ch === "'" || ch === '"' || ch === "`") {
        inString = ch;
      } else if (ch === "/" && i + 1 < script.length && script[i + 1] === "/") {
        // Line comment — skip to end of line
        const eol = script.indexOf("\n", i);
        i = eol === -1 ? script.length : eol + 1;
        continue;
      } else if (ch === "/" && i + 1 < script.length && script[i + 1] === "*") {
        // Block comment — skip to */
        const endComment = script.indexOf("*/", i + 2);
        i = endComment === -1 ? script.length : endComment + 2;
        continue;
      } else if (ch === openBracket) {
        depth++;
      } else if (ch === closeBracket) {
        depth--;
      }
    }

    i++;
  }

  if (depth !== 0) {
    console.warn(
      `  [WARN] Bracket mismatch when extracting ${name} (depth=${depth})`
    );
    return null;
  }

  return script.substring(startIdx, i);
}

/**
 * Safely evaluate a JS data literal (object or array) into a JS value.
 * The extracted source must be a pure data literal (no function calls).
 */
function safeEval<T>(source: string, label: string): T | null {
  try {
    // Wrap in parentheses so the parser treats { ... } as an expression
    const fn = new Function(`return (${source});`);
    return fn() as T;
  } catch (err) {
    console.warn(`  [WARN] Failed to eval ${label}: ${(err as Error).message}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Transform helpers
// ---------------------------------------------------------------------------

function mapReq(req: number | string): {
  requirementType: string;
  requirementValue: number;
  requirementKey: string | null;
} {
  if (typeof req === "number") {
    return {
      requirementType: "LESSON_COUNT",
      requirementValue: req,
      requirementKey: null,
    };
  }
  switch (req) {
    case "savings":
      return {
        requirementType: "SAVINGS_STARTED",
        requirementValue: 1,
        requirementKey: null,
      };
    case "goal":
      return {
        requirementType: "GOAL_SET",
        requirementValue: 1,
        requirementKey: null,
      };
    case "streak":
      return {
        requirementType: "STREAK_REACHED",
        requirementValue: 3,
        requirementKey: null,
      };
    case "unit2":
      return {
        requirementType: "UNIT_COMPLETED",
        requirementValue: 1,
        requirementKey: "2",
      };
    case "unit3":
      return {
        requirementType: "UNIT_COMPLETED",
        requirementValue: 1,
        requirementKey: "3",
      };
    case "unit4":
      return {
        requirementType: "UNIT_COMPLETED",
        requirementValue: 1,
        requirementKey: "4",
      };
    case "unit5":
      return {
        requirementType: "UNIT_COMPLETED",
        requirementValue: 1,
        requirementKey: "5",
      };
    default:
      console.warn(`  [WARN] Unknown badge req: ${req}`);
      return {
        requirementType: "UNKNOWN",
        requirementValue: 0,
        requirementKey: null,
      };
  }
}

function transformUnits(
  rawUnits: Record<
    string,
    {
      title: string;
      color: string;
      lessons: Array<{
        id: string;
        title: string;
        sub: string;
        bg: string;
        bgColor: string;
        goal: string;
        story: { title?: string; text: string };
        concept: {
          title?: string;
          text?: string;
          html?: string;
          htmlId?: string;
        };
        quiz: {
          q: string;
          choices: Array<{ text: string; ok: boolean; fb?: string }>;
        };
        activity?: { type: string };
      }>;
    }
  >,
  gradeActivityMap?: Record<string, string>
): Unit[] {
  const units: Unit[] = [];
  let globalSortOrder = 1;

  const unitNumbers = Object.keys(rawUnits)
    .map(Number)
    .sort((a, b) => a - b);

  for (const num of unitNumbers) {
    const raw = rawUnits[num];
    const lessons: Lesson[] = [];

    for (const l of raw.lessons) {
      // Determine activity type
      let activityType = "";
      if (l.activity && l.activity.type) {
        activityType = l.activity.type;
      } else if (gradeActivityMap && gradeActivityMap[l.id]) {
        activityType = gradeActivityMap[l.id];
      }

      lessons.push({
        legacyId: l.id,
        title: l.title,
        subtitle: l.sub || "",
        bgEmoji: l.bg || "",
        bgColor: l.bgColor || "",
        goal: l.goal || "",
        storyTitle: l.story?.title || "",
        storyText: l.story?.text || "",
        conceptTitle: l.concept?.title || "",
        conceptText: l.concept?.text || "",
        conceptHtml: l.concept?.html || l.concept?.htmlId || "",
        quizQuestion: l.quiz?.q || "",
        quizChoices: (l.quiz?.choices || []).map((c) => ({
          text: c.text,
          correct: !!c.ok,
        })),
        activityType,
        activityConfig: {},
        sortOrder: globalSortOrder++,
      });
    }

    units.push({
      number: num,
      title: raw.title,
      color: raw.color,
      lessons,
    });
  }

  return units;
}

function transformBadges(
  rawBadges: Array<{
    id: string;
    icon: string;
    name: string;
    req: number | string;
  }>
): Badge[] {
  return rawBadges.map((b) => {
    const mapped = mapReq(b.req);
    return {
      badgeKey: b.id,
      icon: b.icon,
      nameAr: b.name,
      ...mapped,
    };
  });
}

function transformGuide(
  rawGuide: Record<
    string,
    {
      name: string;
      lessons: Array<{
        title: string;
        goal: string;
        steps: Array<{ text: string; time: string }>;
        questions: string[];
        tips: Array<{ icon: string; text: string }>;
        totalTime: string;
      }>;
    }
  >
): Record<string, GuideUnit> {
  const guide: Record<string, GuideUnit> = {};
  for (const [key, unit] of Object.entries(rawGuide)) {
    guide[key] = {
      name: unit.name,
      lessons: unit.lessons.map((l) => ({
        title: l.title,
        goal: l.goal,
        steps: l.steps.map((s) => ({ text: s.text, time: s.time })),
        questions: l.questions,
        tips: l.tips.map((t) => ({ icon: t.icon, text: t.text })),
        totalTime: l.totalTime,
      })),
    };
  }
  return guide;
}

// ---------------------------------------------------------------------------
// Process a single grade
// ---------------------------------------------------------------------------

function processGrade(
  filePath: string,
  gradeLabel: string,
  options: {
    hasGlossary: boolean;
    activityMap?: Record<string, string>;
    expectedLessons?: number;
    expectedBadges?: number;
    expectedGlossaryTerms?: number;
  }
): GradeOutput | null {
  console.log(`\n===== Processing ${gradeLabel} =====`);
  console.log(`  File: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`  [ERROR] File not found: ${filePath}`);
    return null;
  }

  const html = fs.readFileSync(filePath, "utf-8");
  console.log(`  File size: ${(html.length / 1024).toFixed(0)} KB`);

  let scriptBlocks: string[];
  try {
    scriptBlocks = extractAllScriptBlocks(html);
    const totalSize = scriptBlocks.reduce((acc, b) => acc + b.length, 0);
    console.log(
      `  Script blocks: ${scriptBlocks.length} blocks, ${(totalSize / 1024).toFixed(0)} KB total`
    );
  } catch (err) {
    console.error(`  [ERROR] ${(err as Error).message}`);
    return null;
  }

  // --- UNITS ---
  let units: Unit[] = [];
  const unitsRaw = extractJSConstant(scriptBlocks, "UNITS", "{");
  if (unitsRaw) {
    const parsed = safeEval<Record<string, any>>(unitsRaw, "UNITS");
    if (parsed) {
      units = transformUnits(parsed, options.activityMap);
      const totalLessons = units.reduce(
        (acc, u) => acc + u.lessons.length,
        0
      );
      console.log(
        `  UNITS: ${units.length} units, ${totalLessons} lessons total`
      );
      if (options.expectedLessons && totalLessons !== options.expectedLessons) {
        console.warn(
          `  [WARN] Expected ${options.expectedLessons} lessons, got ${totalLessons}`
        );
      }
    }
  } else {
    console.warn("  [WARN] Could not extract UNITS");
  }

  // --- BADGES ---
  let badges: Badge[] = [];
  const badgesRaw = extractJSConstant(scriptBlocks, "BADGES", "[");
  if (badgesRaw) {
    const parsed = safeEval<Array<any>>(badgesRaw, "BADGES");
    if (parsed) {
      badges = transformBadges(parsed);
      console.log(`  BADGES: ${badges.length} badges`);
      if (options.expectedBadges && badges.length !== options.expectedBadges) {
        console.warn(
          `  [WARN] Expected ${options.expectedBadges} badges, got ${badges.length}`
        );
      }
    }
  } else {
    console.warn("  [WARN] Could not extract BADGES");
  }

  // --- GLOSSARY (Grades 5 and 6 only) ---
  let glossary: GlossaryUnit[] | undefined;
  if (options.hasGlossary) {
    const glossaryRaw = extractJSConstant(scriptBlocks, "GLOSSARY_TERMS", "[");
    if (glossaryRaw) {
      const parsed = safeEval<GlossaryUnit[]>(glossaryRaw, "GLOSSARY_TERMS");
      if (parsed) {
        glossary = parsed;
        const totalTerms = parsed.reduce(
          (acc, u) => acc + u.terms.length,
          0
        );
        console.log(
          `  GLOSSARY: ${parsed.length} units, ${totalTerms} terms total`
        );
        if (
          options.expectedGlossaryTerms &&
          totalTerms !== options.expectedGlossaryTerms
        ) {
          console.warn(
            `  [WARN] Expected ${options.expectedGlossaryTerms} terms, got ${totalTerms}`
          );
        }
      }
    } else {
      console.warn("  [WARN] Could not extract GLOSSARY_TERMS");
    }
  }

  // --- GUIDE ---
  let guide: Record<string, GuideUnit> = {};
  const guideRaw = extractJSConstant(scriptBlocks, "GUIDE", "{");
  if (guideRaw) {
    const parsed = safeEval<Record<string, any>>(guideRaw, "GUIDE");
    if (parsed) {
      guide = transformGuide(parsed);
      const totalGuideLessons = Object.values(guide).reduce(
        (acc, u) => acc + u.lessons.length,
        0
      );
      console.log(
        `  GUIDE: ${Object.keys(guide).length} units, ${totalGuideLessons} lessons total`
      );
    }
  } else {
    console.warn("  [WARN] Could not extract GUIDE");
  }

  // Build output
  const output: GradeOutput = { units, badges, guide };
  if (glossary) {
    output.glossary = glossary;
  }

  return output;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log("Content Extraction Script");
  console.log("=========================");

  const rootDir = path.resolve(__dirname, "..");
  const refDir = path.join(rootDir, "reference-files");
  const outDir = path.join(rootDir, "scripts", "output");

  // Ensure output directory exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
    console.log(`Created output directory: ${outDir}`);
  }

  // --- Grade 4 ---
  const grade4 = processGrade(
    path.join(refDir, "rawad-alshekel.html"),
    "Grade 4",
    {
      hasGlossary: false,
      activityMap: GRADE4_ACTIVITY_MAP,
      expectedLessons: 19,
      expectedBadges: 8,
    }
  );
  if (grade4) {
    const outPath = path.join(outDir, "grade4.json");
    fs.writeFileSync(outPath, JSON.stringify(grade4, null, 2), "utf-8");
    console.log(`  => Written to ${outPath}`);
  }

  // --- Grade 5 ---
  const grade5 = processGrade(
    path.join(refDir, "grade5.html"),
    "Grade 5",
    {
      hasGlossary: true,
      expectedLessons: 19,
      expectedBadges: 12,
      expectedGlossaryTerms: 23,
    }
  );
  if (grade5) {
    const outPath = path.join(outDir, "grade5.json");
    fs.writeFileSync(outPath, JSON.stringify(grade5, null, 2), "utf-8");
    console.log(`  => Written to ${outPath}`);
  }

  // --- Grade 6 ---
  const grade6 = processGrade(
    path.join(refDir, "grade6.html"),
    "Grade 6",
    {
      hasGlossary: true,
      expectedLessons: 20,
      expectedBadges: 12,
      expectedGlossaryTerms: 29,
    }
  );
  if (grade6) {
    const outPath = path.join(outDir, "grade6.json");
    fs.writeFileSync(outPath, JSON.stringify(grade6, null, 2), "utf-8");
    console.log(`  => Written to ${outPath}`);
  }

  console.log("\n===== Done =====");
}

main();
