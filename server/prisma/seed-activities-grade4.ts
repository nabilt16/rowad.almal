/**
 * seed-activities-grade4.ts
 * Populates activityConfig for all Grade 4 lessons.
 * Run: cd server && npx tsx prisma/seed-activities-grade4.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ACTIVITIES: Record<string, { activityType: string; activityConfig: Record<string, unknown> }> = {
  l1: {
    activityType: 'ordering',
    activityConfig: {
      instruction: 'رتّب مراحل تطور المال من الأقدم إلى الأحدث',
      items: ['🔄 المقايضة المباشرة', '🥇 الذهب والفضة', '💳 البطاقات والهاتف'],
      correctOrder: [0, 1, 2],
    },
  },

  l2: {
    activityType: 'calculation',
    activityConfig: {
      instruction: 'ياسمين في البوفيه',
      questions: [
        {
          question: 'مع ياسمين 20 ₪، اشترت ساندويتش بـ8 ₪ وعصيراً بـ7 ₪. كم يبقى معها؟',
          answer: 5,
          unit: '₪',
          hint: '20 - 8 - 7 = ؟',
        },
      ],
    },
  },

  l3: {
    activityType: 'classification',
    activityConfig: {
      instruction: 'صنّف كل موقف حسب طريقة الدفع الأنسب',
      items: [
        { id: 'a', text: '⚡ الكهرباء منقطعة والمحل بعيد عن الإنترنت', category: 'cash' },
        { id: 'b', text: '📱 صديقك يحتاج تحويل 20 ₪ وأنت في المدرسة', category: 'digital' },
        { id: 'c', text: '🥪 ساندويتش في البوفيه المدرسي', category: 'cash' },
        { id: 'd', text: '💸 دفع فاتورة لأحد الأقارب عن بُعد', category: 'digital' },
      ],
      categories: [
        { id: 'cash', label: '💵 نقد', color: '#FFB300' },
        { id: 'digital', label: '📱 Bit / PayBox', color: '#42A5F5' },
      ],
    },
  },

  l4: {
    activityType: 'multiple_choice',
    activityConfig: {
      question: 'نادين تلاحظ: عندما تدفع بهاتفها لا تحزن، لكن عند إخراج ورقة 50 ₪ تتردد. ما السبب الحقيقي؟',
      choices: [
        { text: 'الهاتف أسرع من المحفظة', correct: false, feedback: 'السرعة ليست السبب الحقيقي...' },
        { text: 'لا ترى المال يذهب جسدياً عند الدفع الرقمي', correct: true, feedback: '🎉 الورقة ملموسة وتراها تذهب، أما الرقم على الشاشة فلا تشعر به بنفس الطريقة!' },
        { text: 'المال الرقمي أقل قيمة', correct: false, feedback: 'المال الرقمي بنفس القيمة! السبب نفسي وليس مالياً.' },
      ],
    },
  },

  l5: {
    activityType: 'classification',
    activityConfig: {
      instruction: 'صنّف كل بند — هل هو حاجة أم رغبة؟',
      items: [
        { id: 'a', text: '🍞 خبز', category: 'need' },
        { id: 'b', text: '💊 دواء للمرض', category: 'need' },
        { id: 'c', text: '🍫 شوكولاتة', category: 'want' },
        { id: 'd', text: '📚 كتاب مدرسي', category: 'need' },
        { id: 'e', text: '🎮 لعبة فيديو', category: 'want' },
      ],
      categories: [
        { id: 'need', label: '✅ حاجة', color: '#4CAF50' },
        { id: 'want', label: '⭐ رغبة', color: '#FF9800' },
      ],
    },
  },

  l6: {
    activityType: 'calculation',
    activityConfig: {
      instruction: 'ريم وأسبوعها الأبيض',
      questions: [
        {
          question: 'مصروف ريم الأسبوعي 30 ₪. أنفقت: 10 ₪ (شيبس+عصير) + 15 ₪ (سينما) + 8 ₪ (فطور). بكم تجاوزت ميزانيتها؟',
          answer: 3,
          unit: '₪',
          hint: '10 + 15 + 8 = 33 ← 33 - 30 = ؟',
        },
      ],
    },
  },

  l7: {
    activityType: 'calculation',
    activityConfig: {
      instruction: 'يوسف والكتاب',
      questions: [
        {
          question: 'يوسف يريد كتاباً بـ55 ₪ ويوفر 8 ₪ كل أسبوع. كم أسبوعاً يحتاج؟',
          answer: 7,
          unit: 'أسابيع',
          hint: '55 ÷ 8 ≈ 6.9 → 7 أسابيع',
        },
        {
          question: 'هدف جديد: كتاب بـ48 ₪ — يوفر 8 ₪ أسبوعياً. كم أسبوعاً يحتاج؟',
          answer: 6,
          unit: 'أسابيع',
          hint: '48 ÷ 8 = ؟',
        },
      ],
    },
  },

  l7b: {
    activityType: 'multiple_choice',
    activityConfig: {
      question: 'كريم وفّر 40 ₪ وزميله تامر يرتجف بلا كنزة في البرد — الكنزة بـ35 ₪. ماذا يفعل كريم؟',
      choices: [
        { text: 'يحتفظ بماله لأنه وفّر طويلاً', correct: false, feedback: 'التوفير مهم، لكن هناك حاجة حقيقية أمامه الآن...' },
        { text: 'يشتري الكنزة لتامر', correct: true, feedback: '🎉 قلب كبير! كريم شعر بسعادة حقيقية بعد القرار. المال الذي تعطيه يعود إليك بشكل آخر!' },
        { text: 'يخبر المعلمة بدلاً من الشراء', correct: false, feedback: 'كريم يملك الحل بيده الآن!' },
      ],
    },
  },

  l8: {
    activityType: 'true_false',
    activityConfig: {
      instruction: 'لكل إعلان — هل هو مفيد (صواب) أم فخ (خطأ)؟',
      statements: [
        {
          text: '«اشترِ الآن! العرض ينتهي الليلة فقط!»',
          correct: false,
          feedback: 'فخ! الضغط الزمني مصطنع في أغلب الأحيان.',
        },
        {
          text: '«اشترِ 2 بسعر 1 اليوم فقط!»',
          correct: false,
          feedback: 'فخ! هل تحتاج اثنتين فعلاً؟',
        },
        {
          text: '«خضار طازج من المزرعة — وصل اليوم»',
          correct: true,
          feedback: 'مفيد! هذا مجرد إعلام عن منتج حقيقي.',
        },
      ],
    },
  },

  l9: {
    activityType: 'calculation',
    activityConfig: {
      instruction: 'نور وحيرة الحذاء',
      questions: [
        {
          question: 'الحذاء الأرخص بـ55 ₪ يدوم 6 أشهر فقط. إذا اشتريته مرتين خلال السنة كم ستدفع؟',
          answer: 110,
          unit: '₪',
          hint: '55 × 2 = ؟',
        },
      ],
    },
  },

  l9b: {
    activityType: 'calculation',
    activityConfig: {
      instruction: 'ياسمين وزجاجات الحي',
      questions: [
        {
          question: 'ياسمين جمعت 80 زجاجة — كل زجاجة = 0.25 ₪. كم ستحصل من المحطة؟',
          answer: 20,
          unit: '₪',
          hint: '80 × 0.25 = ؟',
        },
      ],
    },
  },

  l4a: {
    activityType: 'calculation',
    activityConfig: {
      instruction: 'عمر وعربة العصير',
      questions: [
        {
          question: 'عمر اشترى مواد بـ9 ₪ وباع 6 أكواب بـ3 ₪ للكوب. كم ربح؟',
          answer: 9,
          unit: '₪',
          hint: '(6 × 3) - 9 = ؟',
        },
        {
          question: 'سارة اشترت مواد لصنع الكعك بـ12 ₪ وباعت الكعك كله بـ20 ₪. كم ربحت؟',
          answer: 8,
          unit: '₪',
          hint: '20 - 12 = ؟',
        },
      ],
    },
  },

  l4b: {
    activityType: 'multiple_choice',
    activityConfig: {
      question: 'يوسف يجيد الطبخ وجيرانه مشغولون دائماً ولا وقت لهم للطهي. ما المشروع الأنسب له؟',
      choices: [
        { text: 'تعليم الرياضيات للأطفال', correct: false, feedback: 'هذا لا يناسب مهارة يوسف في الطبخ!' },
        { text: 'تحضير وجبات أو حلويات للبيع للجيران', correct: true, feedback: '🎉 يوسف يجيد الطبخ والجيران يحتاجون — وصفة نجاح مثالية!' },
        { text: 'فتح دكانة كبيرة', correct: false, feedback: 'الدكانة الكبيرة تحتاج رأس مال كبير. ابدأ صغيراً وكبّر مع الوقت!' },
      ],
    },
  },

  l4c: {
    activityType: 'multiple_choice',
    activityConfig: {
      question: 'أحمد باع عصير ليمون لكن لم يشترِ منه أحد. الزملاء قالوا: «مر جداً! نريده بارداً!». ماذا يفعل؟',
      choices: [
        { text: 'يستمر في نفس الطريقة لأن العصير لذيذ', correct: false, feedback: 'إذا لم يشترِ أحد يجب التغيير!' },
        { text: 'يستمع للملاحظات ويضيف سكراً وثلجاً', correct: true, feedback: '🎉 أحمد استمع لزبائنه — في الأسبوع الثاني باع 30 كوباً!' },
        { text: 'يوقف المشروع ويبحث عن شيء آخر', correct: false, feedback: 'الفشل الأول درس وليس نهاية! استمع وطوّر المنتج أولاً.' },
      ],
    },
  },

  l4d: {
    activityType: 'calculation',
    activityConfig: {
      instruction: 'تامر من الخسارة للربح',
      questions: [
        {
          question: 'تامر دفع 45 ₪ للمواد وباع 10 أكواب بـ3 ₪. بكم خسر؟',
          answer: 15,
          unit: '₪',
          hint: '(10 × 3) = 30 ← 45 - 30 = ؟',
        },
        {
          question: 'خالد اشترى مواد بـ24 ₪ ويبيع كل كوب بـ4 ₪. كم كوباً يحتاج يبيع لاسترداد تكلفته؟',
          answer: 6,
          unit: 'أكواب',
          hint: '24 ÷ 4 = ؟',
        },
      ],
    },
  },

  l5a: {
    activityType: 'multiple_choice',
    activityConfig: {
      question: 'رنا سألت: «من أين يأتي مال الحكومة لدفع رواتب المعلمين وبناء الطرق؟»',
      choices: [
        { text: 'الحكومة تطبع المال كما تريد', correct: false, feedback: 'طباعة مال بدون غطاء تسبب التضخم!' },
        { text: 'كل من يعمل أو يشتري يدفع جزءاً كضريبة', correct: true, feedback: '🎉 الضرائب هي الطريقة التي نبني بها المجتمع معاً. كل شخص يساهم بجزء صغير.' },
        { text: 'الحكومة تأخذ المال من الأغنياء فقط', correct: false, feedback: 'كل من يعمل أو يشتري يدفع نوعاً من الضرائب!' },
      ],
    },
  },

  l5b: {
    activityType: 'true_false',
    activityConfig: {
      instruction: 'صواب أم خطأ عن البنك؟',
      statements: [
        {
          text: 'البنك يدفع لك فائدة مقابل إيداع مالك لديه',
          correct: true,
          feedback: 'صحيح! الفائدة هي مكافأة توفير مالك في البنك.',
        },
        {
          text: 'البنك يقرض مالك لآخرين بفائدة أعلى ويأخذ الفرق كربح',
          correct: true,
          feedback: 'صحيح! هذه هي دورة البنك.',
        },
        {
          text: 'إيداع المال في البنك لا يزيده أبداً',
          correct: false,
          feedback: 'خطأ! البنك يدفع فائدة على المبلغ المودع.',
        },
      ],
    },
  },

  l5c: {
    activityType: 'multiple_choice',
    activityConfig: {
      question: 'سلمى تريد حذاءً بـ200 ₪ لكن عندها 150 ₪ فقط. ماذا تفعل؟',
      choices: [
        { text: 'تشتري الآن وتدفع لاحقاً بالبطاقة', correct: false, feedback: 'خطر! إذا لم يكن عندها 200 ₪ عند الدفع ستدفع فائدة ويكبر الدين.' },
        { text: 'تنتظر حتى توفر الـ50 ₪ الباقية', correct: true, feedback: '🎉 قرار حكيم! الانتظار والتوفير أفضل بكثير من الوقوع في فخ الديون.' },
        { text: 'تأخذ قرضاً لشراء الحذاء', correct: false, feedback: 'ستدفع أكثر من قيمة الحذاء بسبب الفائدة. الأفضل التوفير.' },
      ],
    },
  },

  l5d: {
    activityType: 'calculation',
    activityConfig: {
      instruction: 'حلم مريم الكبير',
      questions: [
        {
          question: 'مريم تحلم بمكتبة تكلف 10,000 ₪ وتستطيع توفير 100 ₪ كل شهر. كم شهراً تحتاج؟',
          answer: 100,
          unit: 'شهر',
          hint: '10000 ÷ 100 = ؟',
        },
        {
          question: 'هدف: دراجة بـ600 ₪ — يستطيع توفير 50 ₪ كل شهر. كم شهراً يحتاج؟',
          answer: 12,
          unit: 'شهر',
          hint: '600 ÷ 50 = ؟',
        },
      ],
    },
  },
};

export async function applyGrade4ActivityConfigs(prismaClient: PrismaClient) {
  console.log('Applying Grade 4 activity configs...\n');

  const lessons = await prismaClient.lesson.findMany({
    select: { id: true, legacyId: true, activityType: true },
    where: { unit: { grade: { number: 4 } } },
    orderBy: { sortOrder: 'asc' },
  });

  console.log(`Found ${lessons.length} Grade 4 lessons in DB`);

  let updated = 0;
  let skipped = 0;

  for (const lesson of lessons) {
    const lid = lesson.legacyId;
    if (!lid || !ACTIVITIES[lid]) {
      console.log(`  SKIP  ${lid || '(no legacyId)'}`);
      skipped++;
      continue;
    }

    const { activityType, activityConfig } = ACTIVITIES[lid];

    await prismaClient.lesson.update({
      where: { id: lesson.id },
      data: { activityType, activityConfig },
    });

    console.log(`  OK    ${lid} → ${activityType}`);
    updated++;
  }

  console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`);
}

async function main() {
  try {
    await applyGrade4ActivityConfigs(prisma);
    console.log('\n✅ Grade 4 activity configs applied.');
  } catch (error) {
    console.error('Error applying activity configs:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1]?.includes('seed-activities-grade4.ts')) {
  main();
}
