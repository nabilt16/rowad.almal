import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, 'output');

interface QuizChoice {
  text: string;
  correct: boolean;
}

interface Lesson {
  legacyId: string;
  title: string;
  subtitle: string;
  bgEmoji: string;
  quizQuestion: string;
  quizChoices: QuizChoice[];
  activityType: string;
  sortOrder: number;
  storyText: string;
  conceptText: string;
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
}

interface GlossaryTerm {
  ar: string;
  he: string;
  def: string;
}

interface GlossaryUnit {
  unit: number;
  unitName: string;
  terms: GlossaryTerm[];
}

interface GuideLesson {
  title: string;
  goal: string;
  steps: unknown[];
  questions: string[];
  tips: unknown[];
}

interface GuideUnit {
  name: string;
  lessons: GuideLesson[];
}

interface GradeData {
  units: Unit[];
  badges: Badge[];
  glossary?: GlossaryUnit[];
  guide: Record<string, GuideUnit>;
}

let totalErrors = 0;
let totalWarnings = 0;

function error(msg: string) {
  console.error(`  ❌ ERROR: ${msg}`);
  totalErrors++;
}

function warn(msg: string) {
  console.warn(`  ⚠️  WARN: ${msg}`);
  totalWarnings++;
}

function ok(msg: string) {
  console.log(`  ✅ ${msg}`);
}

function validateGrade(gradeNumber: number, data: GradeData) {
  console.log(`\n===== Validating Grade ${gradeNumber} =====`);

  // Units
  if (data.units.length !== 5) {
    error(`Expected 5 units, got ${data.units.length}`);
  } else {
    ok(`5 units found`);
  }

  // Lessons
  const totalLessons = data.units.reduce((sum, u) => sum + u.lessons.length, 0);
  console.log(`  📚 ${totalLessons} lessons found`);

  // Check each lesson
  let quizIssues = 0;
  let missingStory = 0;
  let missingConcept = 0;

  for (const unit of data.units) {
    for (const lesson of unit.lessons) {
      // Check quiz has exactly one correct answer
      const correctCount = lesson.quizChoices.filter(c => c.correct).length;
      if (lesson.quizQuestion && correctCount !== 1) {
        error(`Lesson ${lesson.legacyId}: quiz has ${correctCount} correct answers (expected 1)`);
        quizIssues++;
      }

      // Check quiz has choices
      if (lesson.quizQuestion && lesson.quizChoices.length < 2) {
        error(`Lesson ${lesson.legacyId}: quiz has only ${lesson.quizChoices.length} choices`);
        quizIssues++;
      }

      // Check story
      if (!lesson.storyText || lesson.storyText.length < 10) {
        warn(`Lesson ${lesson.legacyId}: missing or very short story`);
        missingStory++;
      }

      // Check concept
      if (!lesson.conceptText || lesson.conceptText.length < 10) {
        warn(`Lesson ${lesson.legacyId}: missing or very short concept`);
        missingConcept++;
      }

      // Check title
      if (!lesson.title) {
        error(`Lesson ${lesson.legacyId}: missing title`);
      }
    }
  }

  if (quizIssues === 0) {
    ok('All quizzes have exactly one correct answer');
  }
  if (missingStory === 0) {
    ok('All lessons have stories');
  }
  if (missingConcept === 0) {
    ok('All lessons have concepts');
  }

  // Badges
  console.log(`  🏅 ${data.badges.length} badges found`);
  for (const badge of data.badges) {
    if (!badge.icon || !badge.nameAr || !badge.requirementType) {
      error(`Badge ${badge.badgeKey}: missing required fields`);
    }
  }
  ok(`All badges have required fields`);

  // Glossary (grades 5 and 6 only)
  if (gradeNumber >= 5) {
    if (!data.glossary || data.glossary.length === 0) {
      error(`Grade ${gradeNumber} should have glossary terms`);
    } else {
      const totalTerms = data.glossary.reduce((sum, u) => sum + u.terms.length, 0);
      ok(`Glossary: ${data.glossary.length} units, ${totalTerms} terms`);
    }
  }

  // Guide
  const guideUnits = Object.keys(data.guide).length;
  const guideLessons = Object.values(data.guide).reduce(
    (sum, u) => sum + u.lessons.length, 0
  );
  ok(`Guide: ${guideUnits} units, ${guideLessons} lessons`);
}

// Main
console.log('Content Validation');
console.log('==================');

for (const [gradeNum, filename] of [
  [4, 'grade4.json'],
  [5, 'grade5.json'],
  [6, 'grade6.json'],
] as const) {
  const filePath = path.join(outputDir, filename);
  if (!fs.existsSync(filePath)) {
    error(`Missing file: ${filePath}`);
    continue;
  }
  const data: GradeData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  validateGrade(gradeNum, data);
}

// Summary
console.log('\n===== Summary =====');

const g4: GradeData = JSON.parse(fs.readFileSync(path.join(outputDir, 'grade4.json'), 'utf-8'));
const g5: GradeData = JSON.parse(fs.readFileSync(path.join(outputDir, 'grade5.json'), 'utf-8'));
const g6: GradeData = JSON.parse(fs.readFileSync(path.join(outputDir, 'grade6.json'), 'utf-8'));

const totalLessons = [g4, g5, g6].reduce(
  (sum, g) => sum + g.units.reduce((s, u) => s + u.lessons.length, 0), 0
);
const totalBadges = g4.badges.length + g5.badges.length + g6.badges.length;
const totalGlossary = (g5.glossary?.reduce((s, u) => s + u.terms.length, 0) ?? 0) +
  (g6.glossary?.reduce((s, u) => s + u.terms.length, 0) ?? 0);

console.log(`  Total lessons: ${totalLessons}`);
console.log(`  Total badges: ${totalBadges}`);
console.log(`  Total glossary terms: ${totalGlossary}`);
console.log(`  Errors: ${totalErrors}`);
console.log(`  Warnings: ${totalWarnings}`);

if (totalErrors > 0) {
  console.log('\n❌ Validation failed!');
  process.exit(1);
} else {
  console.log('\n✅ Validation passed!');
}
