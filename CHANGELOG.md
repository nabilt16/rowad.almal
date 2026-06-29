# Changelog — رواد المال (Rowad AlMal)

All significant changes to this project, from initial migration through the current session.

---

## [In-session changes] — 2026-04-06

### Simulations — New interactive 🎮 steps

#### `client/src/components/simulations/NeedsWantsSimulation.tsx` (new)
- Added full needs-vs-wants simulation for lesson **l5**
- 8 purchasable items (food, transport, game, etc.), live budget bar, buy/remove toggle
- Results screen with احتياجات/رغبات breakdown and a smart extra-insight line:
  - If only needs bought: "بقي معك X ₪ — ماذا ستفعل بها؟"
  - If a need was missed: "لو وفّرت X ₪ أكثر، كنت قادراً على شراء..."
- Accepts `personalBudget` prop; falls back to 30 ₪ default

#### `client/src/components/simulations/WeeklyBudgetSimulation.tsx` (new)
- Added weekly budget simulation for lesson **l6** (ميزانيتي الأسبوعية)
- 14-event pool shuffled randomly each week, 7 days, Pay/Skip per day
- Tracks remaining balance; shows ranOutOnDay if budget hits zero
- Results: spent/saved boxes, day-by-day list, contextual feedback
- Accepts `personalBudget` prop; falls back to 30 ₪ default

#### `client/src/components/simulations/JuiceStandSimulation.tsx` (new)
- Added juice-stand business simulation for lesson **l4a** (عصير خالد)
- 3 products (🍋 🍊 🍉), price slider 1–15 ₪, 5 customers with hidden budgets
- Live profit-per-cup display; warning "هيك رح تخسر على كل كأس! ⚠️" when price < cost
- Customer-by-customer results; counterfactual insight ("لو خفّضت السعر ₪1...")
- Results buttons: "جرّب مرة ثانية" (same product) + "غيّر المنتج" (full reset)
- Accepts `personalBudget` prop (capital fixed at 20 ₪ per spec)

#### `client/src/components/simulations/CreditCardSimulation.tsx` (new)
- Added credit card simulation for lesson **l5c** (بطاقة الائتمان — قوة أم فخ؟)
- 4 months, 3 purchase options per month (essential / want / impulse)
- Monthly budget = `personalBudget × 4` (default 50 × 4 = 200 ₪); no overspending allowed — items that exceed remaining budget are greyed out
- Savings jar panel (left column) shows `/saving-box-N.png` per month (1→2→3→4) with smooth fade-in on image change; jar stays locked during months 1–3, opens on results screen
- Month-end summary: bought items list, totals, green savings box
- Results screen: large total-saved amount, per-month breakdown row, month-by-month timeline, verdict message
  - ≥25% of total budget saved → "أنت عملت توفير حقيقي! 🏆"
  - Some savings → "بداية كويسة — الشهر الجاي وفّر أكثر 💪"
  - Zero savings → "صرفت كل شي — شو كان ممكن تتخلى عنه؟ 🤔"
- Dream-progress section on results screen: reads `dreamName`/`dreamCost` from UIStore, shows progress bar and motivational message
- Jar panel: 150 px during shopping/results, 220 px on month-end screen

#### `client/src/components/simulations/ValueCompareSimulation.tsx` (new)
- Added value-comparison simulation for lesson **l9** (أُقارن وأختار الأفضل)
- 3 rounds: shampoo (unit cost per 100 ml), shoes (cost per month over lifetime), subscription (monthly vs annual)
- Child taps which product they think is better value; app reveals true unit costs
- Progress dots turn green/red after each round
- Results: score out of 3, round-by-round breakdown with full explanations
  - 3/3 → "أنت مستهلك ذكي! 🏆"
  - 2/3 → "كتير كويس — بس في واحدة راحت منك 💪"
  - ≤1/3 → "المقارنة صعبة — جرّب مرة ثانية 🔄"

#### `client/src/components/simulations/ProfitLossSimulation.tsx` (new)
- Added profit/loss simulation for lesson **l4d** (ربح أم خسارة؟)
- 3 products to choose from: 🧁 كيك (cost 8 ₪), 🧃 عصير (cost 5 ₪), 📿 إكسسوار (cost 12 ₪)
- Price slider (1–50 ₪): live per-unit profit/loss; hint shows minimum price to cover cost
- Quantity slider (1–20): live totals — revenue, cost, net profit/loss
- Break-even visual: progress bar with orange marker at break-even point; child's quantity shown as green/red fill
- Results: verdict message, 3-stat grid, detailed breakdown including break-even point

---

### LessonPage — Simulation wiring

#### `client/src/pages/LessonPage.tsx`
- Removed `ActivityCard` from lesson page (was duplicating quiz content for multiple-choice lessons)
- Extended `SectionKey` to include `'simulation'`; added 🎮 step to progress tracker
- `hasSimulation` flag checks `legacyId` for l5, l6, l4a, l5c, l9, l4d
- `ALL_SECTIONS` shows 4 steps for lessons with simulations; 3 steps otherwise
- `allDone` / `completedCount` respect whether simulation is present
- Each simulation rendered conditionally by `legacyId`; receives `personalBudget` from UIStore

---

### Onboarding

#### `client/src/components/onboarding/OnboardingOverlay.tsx`
- Removed parent-occupation fields: dadName, dadJob, momName, momJob
- Reduced from 4 steps to 3 steps
- Submit payload now only sends: studentName, gender, whoWorks

#### `client/src/components/onboarding/BudgetOnboardingOverlay.tsx` (new)
- Two-screen budget onboarding shown once per session after profile onboarding
- **Screen 1**: weekly budget slider (10–100 ₪, step 5, default 50); note "الفلوس مش بتيجي من الهوا..." in bold gold
- **Screen 2**: 50/30/20 split visualization — needs / wants / saving with colored cards
- **Screen 3**: dream input — text field for dream name + slider 50–2000 ₪ for cost; saves to UIStore
- On completion: saves `personalBudget` and optionally `dreamName`/`dreamCost`

#### `client/src/components/layout/AppShell.tsx`
- Added `showBudgetOnboarding` logic: triggers after profile onboarding, once per session
- Renders `BudgetOnboardingOverlay` when conditions met

---

### State management

#### `client/src/stores/uiStore.ts`
- Added `personalBudget: number | null` (default null)
- Added `setPersonalBudget(budget: number)`
- Added `dreamName: string | null` (default null)
- Added `dreamCost: number | null` (default null)
- Added `setDream(name: string, cost: number)`

---

### Bug fixes

#### `client/src/components/activities/Classification.tsx`
- Fixed: `\u00D7` escape code showing as literal text in remove-item button
- Changed to actual `×` character

#### `client/src/components/activities/Calculation.tsx`
- Fixed: `placeholder="\u0627..."` (Arabic unicode escapes) showing as raw codes
- JSX string attributes don't process `\uXXXX` escapes; changed to actual Arabic text

#### `client/src/components/lessons/ConceptCard.tsx`
- Added `whiteSpace: 'pre-wrap'` to `textStyle` so numbered lists render on separate lines
- Added `whiteSpace: 'normal'` override in `htmlContainerStyle` so the fix doesn't affect HTML concept content (e.g. l2 banknote cards)

#### `client/src/components/onboarding/ProfileDisplay.tsx`
- Fixed crash when `profile.whoWorks` is undefined after making the field optional

#### `client/src/components/onboarding/ProfileEditOverlay.tsx`
- Updated to handle optional `whoWorks`, `dadName`, `dadJob`, `momName`, `momJob`

---

### Shared types / validation

#### `shared/src/validators/profile.ts`
- Made `whoWorks`, `dadName`, `dadJob`, `momName`, `momJob` all `.optional()` in `onboardingSchema`

#### `shared/src/types/profile.ts`
- Made same fields optional in `OnboardingData` interface

#### `shared/src/types/auth.ts`
- Made same fields optional in `StudentProfile`

---

### Seed data

#### `server/prisma/seed-activities-grade4.ts` (new)
- Seeds `activityConfig` for all 19 Grade 4 lessons matched by `legacyId`
- Maps lesson IDs to activity types: ordering, calculation, classification, multiple_choice, true_false

#### `scripts/output/grade4.json`
- l2 (الشيكل الإسرائيلي): increased `.nl-name` and `.nl-use` font sizes from 11 px to 15 px for tablet readability
- l2: added hover-zoom CSS for coins and banknotes

---

## [2026-04-04] — Git commits

| Commit | Change |
|--------|--------|
| `8fb21a5` | Reset lesson completion state when navigating to a new lesson (`LessonPage.tsx`) |
| `2a520f6` | Lock next-lesson button until all 3 sections are completed (`LessonPage.tsx`) |
| `0c55076` | Show next lesson button in completion banner after finishing a lesson (`LessonPage.tsx`) |
| `ad85bd0` | Randomly shuffle quiz choices on each lesson load (`QuizCard.tsx`) |
| `6a18487` | Restore scroll position when returning to grade page from a lesson (`GradePage.tsx`) |
| `2946741` | Switch SavingBoxIcon to use photo image from `public/saving-box.png` |
| `b7de5da` | Replace bucket emoji with custom SVG money saving box (قجة) |
| `f5f049a` | Replace دلو/دلاء with قجة/قجج throughout the app |
| `aca48b2` | Fix onboarding submission: POST→PUT and replace والادخار with والتوفير |
| `af10df4` | Show onboarding overlay when user has no profile yet (`AppShell.tsx`) |
| `bddd625` | Scroll to top when opening a lesson page (`LessonPage.tsx`) |
| `a4e7975` | Replace all دخر verb forms with توفير equivalents (content/copy) |

## [2026-04-03] — Git commits

| Commit | Change |
|--------|--------|
| `a615781` | Use الطالب as fallback name instead of email username (`usePersonalize.ts`) |
| `8e49114` | Always replace [اسم_الطالب] — fallback to email username if no profile |
| `53bdeb9` | Replace [اسم_الطالب] placeholder with actual student name in quiz (`QuizCard.tsx`) |
| `1be2417` | Replace ادخار with توفير throughout the app (copy/content) |
| `77ec2fd` | Fix teacher guide crash — align types with actual DB data shape (`TeacherGuide.tsx`) |
| `049efae` | Match goal label font size to goal text 16 px → 21 px (`LessonBanner.tsx`) |
| `f3e5927` | Allow retry on wrong quiz answer until correct (`QuizCard.tsx`) |
| `d1b7711` | Increase lesson list item font size in GradePage |
| `afcc760` | Increase section heading sizes and unify font to IBM Plex Arabic |
| `d394a4b` | Increase goal text size in `LessonBanner.tsx` |
| `9998842` | Fix goal emoji rendering as literal escape in `LessonBanner.tsx` |
| `03288cb` | Add bill flip on click in shekel concept content (`ConceptCard.tsx`) |
| `28704fa` | Inline coin and bill images in concept HTML during extraction (`scripts/`) |
| `6eff80f` | Fix htmlId concept content not rendering in lessons (`gradeStore.ts`) |
| `3ced4ea` | Switch lesson content font to IBM Plex Arabic |
| `bcdc17d` | Full-stack migration of Rowad AlMal from standalone HTML to React/Node monorepo |
