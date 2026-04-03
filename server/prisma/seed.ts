import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

interface QuizChoice {
  text: string;
  correct: boolean;
}

interface LessonData {
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

interface UnitData {
  number: number;
  title: string;
  color: string;
  lessons: LessonData[];
}

interface BadgeData {
  badgeKey: string;
  icon: string;
  nameAr: string;
  requirementType: string;
  requirementValue: number;
  requirementKey: string | null;
}

interface GlossaryTermData {
  ar: string;
  he: string;
  def: string;
  ex: string;
}

interface GlossaryUnitData {
  unit: number;
  unitName: string;
  unitColor: string;
  icon: string;
  terms: GlossaryTermData[];
}

interface GuideStepData {
  text: string;
  time: string;
}

interface GuideTipData {
  icon: string;
  text: string;
}

interface GuideLessonData {
  title: string;
  goal: string;
  steps: GuideStepData[];
  questions: string[];
  tips: GuideTipData[];
  totalTime: string;
}

interface GuideUnitData {
  name: string;
  lessons: GuideLessonData[];
}

interface GradeData {
  units: UnitData[];
  badges: BadgeData[];
  glossary?: GlossaryUnitData[];
  guide: Record<string, GuideUnitData>;
}

function loadGradeData(filename: string): GradeData {
  const filePath = path.join(__dirname, '../../scripts/output', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

async function main() {
  console.log('Seeding database...');

  // ── Admin user ──
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@rowad.almal';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`  Admin user: ${adminEmail}`);

  // ── Grades ──
  const gradeConfigs = [
    { number: 4, nameAr: 'الصف الرابع', slug: 'grade-4', file: 'grade4.json' },
    { number: 5, nameAr: 'الصف الخامس', slug: 'grade-5', file: 'grade5.json' },
    { number: 6, nameAr: 'الصف السادس', slug: 'grade-6', file: 'grade6.json' },
  ];

  for (const gc of gradeConfigs) {
    console.log(`\n  Processing Grade ${gc.number}...`);
    const data = loadGradeData(gc.file);

    // Create grade
    const grade = await prisma.grade.upsert({
      where: { number: gc.number },
      update: { nameAr: gc.nameAr, slug: gc.slug },
      create: { number: gc.number, nameAr: gc.nameAr, slug: gc.slug },
    });

    // ── Units & Lessons ──
    let lessonCount = 0;
    for (const unitData of data.units) {
      const unit = await prisma.unit.upsert({
        where: { gradeId_number: { gradeId: grade.id, number: unitData.number } },
        update: { title: unitData.title, color: unitData.color, sortOrder: unitData.number },
        create: {
          gradeId: grade.id,
          number: unitData.number,
          title: unitData.title,
          color: unitData.color,
          sortOrder: unitData.number,
        },
      });

      for (const lesson of unitData.lessons) {
        await prisma.lesson.upsert({
          where: { legacyId: lesson.legacyId },
          update: {
            title: lesson.title,
            subtitle: lesson.subtitle,
            bgEmoji: lesson.bgEmoji,
            bgColor: lesson.bgColor,
            goal: lesson.goal,
            storyTitle: lesson.storyTitle,
            storyText: lesson.storyText,
            conceptTitle: lesson.conceptTitle,
            conceptText: lesson.conceptText,
            conceptHtml: lesson.conceptHtml,
            quizQuestion: lesson.quizQuestion,
            quizChoices: lesson.quizChoices as unknown as Record<string, unknown>[],
            activityType: lesson.activityType,
            activityConfig: lesson.activityConfig as Record<string, unknown>,
            sortOrder: lesson.sortOrder,
          },
          create: {
            unitId: unit.id,
            legacyId: lesson.legacyId,
            title: lesson.title,
            subtitle: lesson.subtitle,
            bgEmoji: lesson.bgEmoji,
            bgColor: lesson.bgColor,
            goal: lesson.goal,
            storyTitle: lesson.storyTitle,
            storyText: lesson.storyText,
            conceptTitle: lesson.conceptTitle,
            conceptText: lesson.conceptText,
            conceptHtml: lesson.conceptHtml,
            quizQuestion: lesson.quizQuestion,
            quizChoices: lesson.quizChoices as unknown as Record<string, unknown>[],
            activityType: lesson.activityType,
            activityConfig: lesson.activityConfig as Record<string, unknown>,
            sortOrder: lesson.sortOrder,
          },
        });
        lessonCount++;
      }
    }
    console.log(`    ${data.units.length} units, ${lessonCount} lessons`);

    // ── Badges ──
    for (const badge of data.badges) {
      await prisma.badge.upsert({
        where: { gradeId_badgeKey: { gradeId: grade.id, badgeKey: badge.badgeKey } },
        update: {
          icon: badge.icon,
          nameAr: badge.nameAr,
          requirementType: badge.requirementType as any,
          requirementValue: badge.requirementValue,
          requirementKey: badge.requirementKey,
        },
        create: {
          gradeId: grade.id,
          badgeKey: badge.badgeKey,
          icon: badge.icon,
          nameAr: badge.nameAr,
          requirementType: badge.requirementType as any,
          requirementValue: badge.requirementValue,
          requirementKey: badge.requirementKey,
        },
      });
    }
    console.log(`    ${data.badges.length} badges`);

    // ── Glossary (grades 5 and 6 only) ──
    if (data.glossary && data.glossary.length > 0) {
      let termCount = 0;
      for (const gUnit of data.glossary) {
        const glossaryUnit = await prisma.glossaryUnit.upsert({
          where: { gradeId_unitNumber: { gradeId: grade.id, unitNumber: gUnit.unit } },
          update: {
            unitName: gUnit.unitName,
            unitColor: gUnit.unitColor,
            icon: gUnit.icon,
          },
          create: {
            gradeId: grade.id,
            unitNumber: gUnit.unit,
            unitName: gUnit.unitName,
            unitColor: gUnit.unitColor,
            icon: gUnit.icon,
          },
        });

        // Delete existing terms for this glossary unit and recreate
        await prisma.glossaryTerm.deleteMany({
          where: { glossaryUnitId: glossaryUnit.id },
        });

        for (const term of gUnit.terms) {
          await prisma.glossaryTerm.create({
            data: {
              glossaryUnitId: glossaryUnit.id,
              termAr: term.ar,
              termHe: term.he || '',
              definition: term.def,
              example: term.ex || '',
            },
          });
          termCount++;
        }
      }
      console.log(`    ${termCount} glossary terms`);
    }

    // ── Teacher Guide ──
    if (data.guide) {
      let guideLessonCount = 0;
      for (const [unitNumStr, guideUnit] of Object.entries(data.guide)) {
        const unitNum = parseInt(unitNumStr);
        const gUnit = await prisma.guideUnit.upsert({
          where: { gradeId_unitNumber: { gradeId: grade.id, unitNumber: unitNum } },
          update: { unitName: guideUnit.name },
          create: {
            gradeId: grade.id,
            unitNumber: unitNum,
            unitName: guideUnit.name,
          },
        });

        // Delete existing guide lessons and recreate
        await prisma.guideLesson.deleteMany({
          where: { guideUnitId: gUnit.id },
        });

        for (const lesson of guideUnit.lessons) {
          await prisma.guideLesson.create({
            data: {
              guideUnitId: gUnit.id,
              title: lesson.title,
              goal: lesson.goal || '',
              totalTime: lesson.totalTime || '',
              steps: (lesson.steps || []) as any,
              questions: (lesson.questions || []) as any,
              tips: (lesson.tips || []) as any,
            },
          });
          guideLessonCount++;
        }
      }
      console.log(`    ${guideLessonCount} guide lessons`);
    }
  }

  console.log('\n✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
