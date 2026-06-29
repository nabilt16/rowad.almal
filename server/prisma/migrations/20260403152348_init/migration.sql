-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "BadgeRequirementType" AS ENUM ('LESSON_COUNT', 'SAVINGS_STARTED', 'UNIT_COMPLETED', 'GOAL_SET', 'STREAK_REACHED');

-- CreateEnum
CREATE TYPE "BucketTransactionType" AS ENUM ('INCOME', 'USE_SPEND', 'USE_GIVE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "gender" TEXT NOT NULL DEFAULT 'male',
    "whoWorks" TEXT NOT NULL DEFAULT 'both',
    "dadName" TEXT NOT NULL DEFAULT '',
    "dadJob" TEXT NOT NULL DEFAULT '',
    "momName" TEXT NOT NULL DEFAULT '',
    "momJob" TEXT NOT NULL DEFAULT '',
    "onboarded" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "nameAr" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "gradeId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#1565C0',
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "legacyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "bgEmoji" TEXT NOT NULL DEFAULT '📚',
    "bgColor" TEXT NOT NULL DEFAULT '#1565C0',
    "goal" TEXT NOT NULL DEFAULT '',
    "storyTitle" TEXT NOT NULL DEFAULT '',
    "storyText" TEXT NOT NULL DEFAULT '',
    "conceptTitle" TEXT NOT NULL DEFAULT '',
    "conceptText" TEXT NOT NULL DEFAULT '',
    "conceptHtml" TEXT NOT NULL DEFAULT '',
    "quizQuestion" TEXT NOT NULL DEFAULT '',
    "quizChoices" JSONB NOT NULL DEFAULT '[]',
    "activityType" TEXT NOT NULL DEFAULT '',
    "activityConfig" JSONB NOT NULL DEFAULT '{}',
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "quizCompleted" BOOLEAN NOT NULL DEFAULT false,
    "quizCorrect" BOOLEAN NOT NULL DEFAULT false,
    "storyRead" BOOLEAN NOT NULL DEFAULT false,
    "conceptRead" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "score" DOUBLE PRECISION,
    "answers" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "ActivityResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Streak" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Streak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "gradeId" TEXT NOT NULL,
    "badgeKey" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "requirementType" "BadgeRequirementType" NOT NULL,
    "requirementValue" INTEGER NOT NULL,
    "requirementKey" TEXT,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BucketConfig" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "allowance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "spendPct" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "savePct" DOUBLE PRECISION NOT NULL DEFAULT 30,
    "givePct" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "spendBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "saveBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "giveBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "saveGoalName" TEXT NOT NULL DEFAULT '',
    "saveGoalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "giveGoalName" TEXT NOT NULL DEFAULT '',
    "giveGoalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "BucketConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BucketTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "BucketTransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "spendDelta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "saveDelta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "giveDelta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BucketTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlossaryUnit" (
    "id" TEXT NOT NULL,
    "gradeId" TEXT NOT NULL,
    "unitNumber" INTEGER NOT NULL,
    "unitName" TEXT NOT NULL,
    "unitColor" TEXT NOT NULL DEFAULT '#1565C0',
    "icon" TEXT NOT NULL DEFAULT '📖',

    CONSTRAINT "GlossaryUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlossaryTerm" (
    "id" TEXT NOT NULL,
    "glossaryUnitId" TEXT NOT NULL,
    "termAr" TEXT NOT NULL,
    "termHe" TEXT NOT NULL DEFAULT '',
    "definition" TEXT NOT NULL,
    "example" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "GlossaryTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuideUnit" (
    "id" TEXT NOT NULL,
    "gradeId" TEXT NOT NULL,
    "unitNumber" INTEGER NOT NULL,
    "unitName" TEXT NOT NULL,

    CONSTRAINT "GuideUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuideLesson" (
    "id" TEXT NOT NULL,
    "guideUnitId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "goal" TEXT NOT NULL DEFAULT '',
    "totalTime" TEXT NOT NULL DEFAULT '',
    "steps" JSONB NOT NULL DEFAULT '[]',
    "questions" JSONB NOT NULL DEFAULT '[]',
    "tips" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "GuideLesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_number_key" ON "Grade"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_slug_key" ON "Grade"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_gradeId_number_key" ON "Unit"("gradeId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_legacyId_key" ON "Lesson"("legacyId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonProgress_userId_lessonId_key" ON "LessonProgress"("userId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityResult_userId_lessonId_key" ON "ActivityResult"("userId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "Streak_userId_key" ON "Streak"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_gradeId_badgeKey_key" ON "Badge"("gradeId", "badgeKey");

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_userId_badgeId_key" ON "UserBadge"("userId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "BucketConfig_userId_key" ON "BucketConfig"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryUnit_gradeId_unitNumber_key" ON "GlossaryUnit"("gradeId", "unitNumber");

-- CreateIndex
CREATE UNIQUE INDEX "GuideUnit_gradeId_unitNumber_key" ON "GuideUnit"("gradeId", "unitNumber");

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityResult" ADD CONSTRAINT "ActivityResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityResult" ADD CONSTRAINT "ActivityResult_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Streak" ADD CONSTRAINT "Streak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketConfig" ADD CONSTRAINT "BucketConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BucketTransaction" ADD CONSTRAINT "BucketTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossaryUnit" ADD CONSTRAINT "GlossaryUnit_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossaryTerm" ADD CONSTRAINT "GlossaryTerm_glossaryUnitId_fkey" FOREIGN KEY ("glossaryUnitId") REFERENCES "GlossaryUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideUnit" ADD CONSTRAINT "GuideUnit_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideLesson" ADD CONSTRAINT "GuideLesson_guideUnitId_fkey" FOREIGN KEY ("guideUnitId") REFERENCES "GuideUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
