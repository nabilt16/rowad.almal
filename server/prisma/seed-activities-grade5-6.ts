/**
 * seed-activities-grade5-6.ts
 * Populates activityConfig for Grade 5 and Grade 6 legacy lessons.
 * Run: cd server && npx tsx prisma/seed-activities-grade5-6.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type StepInteraction =
  | {
      type: 'input';
      placeholder?: string;
      expected: string | number;
      tolerance?: number;
    }
  | {
      type: 'multiple_choice' | 'selection';
      choices: { text: string; correct?: boolean }[];
    };

type Step = {
  title: string;
  description?: string;
  content?: string;
  interaction?: StepInteraction;
  feedback?: { correct?: string; wrong?: string };
};

type StepActivityConfig = {
  title?: string;
  steps: Step[];
};

const ACTIVITIES: Record<
  string,
  {
    activityType: string;
    activityConfig: StepActivityConfig;
  }
> = {
  g5_l2: {
    activityType: 'time_machine',
    activityConfig: {
      title: 'آلة الزمن المالي',
      steps: [
        {
          title: 'قوة المال تتغير مع الزمن',
          content:
            'في 2005 كان 100 ₪ تشتري أكثر مما تشتريه اليوم. هذا الفرق يسمى التضخم — أي أن المال يفقد بعض قوته الشرائية مع الوقت.',
        },
        {
          title: 'فكر في المثال',
          description:
            'يقال أن 100 ₪ في 2005 كانت تعادل حوالي 200 ₪ اليوم. ماذا يعني هذا عن قيمة المال؟',
          interaction: {
            type: 'multiple_choice',
            choices: [
              {
                text: 'التضخم يجعل المال يفقد جزءاً من قوته الشرائية مع الزمن',
                correct: true,
              },
              {
                text: 'المال اليوم أغلى قيمة من الماضي',
                correct: false,
              },
              { text: 'القيمة لا تتغير أبداً', correct: false },
            ],
          },
          feedback: {
            correct: '✅ بالضبط! التضخم يعني أن نفس المبلغ يشتري أقل اليوم.',
            wrong: '❌ ليست هذه الفكرة الصحيحة. المال يفقد جزءاً من قوته الشرائية مع الزمن.',
          },
        },
        {
          title: 'الدرس المهم',
          content:
            'لذلك التوفير وحده لا يكفي. المال الذكي هو الذي ينمو بسرعة أكبر من التضخم أو يستثمر ليحافظ على قيمته.',
        },
      ],
    },
  },

  g5_l7: {
    activityType: 'wassam_party',
    activityConfig: {
      title: 'الحاجة أم الرغبة؟',
      steps: [
        {
          title: 'سامي في المتجر',
          content:
            'سامي يملك 60 ₪ فقط لباقي الأسبوع. رأى لعبة جديدة بـ55 ₪ لكنه يحتاج أيضاً مواصلات وغداء. هذا السؤال هو الفرق بين الحاجة والرغبة.',
        },
        {
          title: 'اختر الخيار الذكي',
          description:
            'إذا كان لديك 60 ₪، ماذا تفعل عندما تكون الحاجات أهم من الرغبات؟',
          interaction: {
            type: 'multiple_choice',
            choices: [
              {
                text: 'أشتري اللعبة الآن لأن الفرصة قد لا تتكرر',
                correct: false,
              },
              {
                text: 'أحتفظ بالمال وأدخر لتشتريها لاحقاً بعد أن أضمن حاجاتي',
                correct: true,
              },
              {
                text: 'أتخلى عن اللعبة نهائياً مهما كان',
                correct: false,
              },
            ],
          },
          feedback: {
            correct:
              '🎉 ممتاز! الاحتفاظ بالمال لحاجة أساسية أولاً ثم التوفير للعبة لاحقاً هو خيار ذكي.',
            wrong:
              '❌ ليس هذا هو الخيار الذكي الآن. ركز على تغطية الحاجات الأساسية أولاً قبل الرغبات.',
          },
        },
      ],
    },
  },

  g5_l11: {
    activityType: 'maryam_detective',
    activityConfig: {
      title: 'قارن قبل أن تشتري',
      steps: [
        {
          title: 'ريم تقارن الأسعار',
          content:
            'ريم وجدت نفس الحقيبة في ثلاثة أماكن بأسعار مختلفة. مقارنتها للخيارات وفّرت لها مالاً دون مجهود كبير.',
        },
        {
          title: 'اختر أفضل صفقة',
          description:
            'إذا كان السعر في الموقع 32 ₪ + 8 ₪ شحن، وفي مكتبة المدينة 38 ₪، أين تشتري؟',
          interaction: {
            type: 'multiple_choice',
            choices: [
              { text: 'الموقع لأنه الأرخص قبل الشحن', correct: false },
              { text: 'مكتبة المدينة 38 ₪ لأنها أوفر بعد حساب الشحن', correct: true },
              { text: 'مكتبة المدرسة لأنها الأقرب', correct: false },
            ],
          },
          feedback: {
            correct:
              '🎉 ممتاز! الحساب الذكي يشمل الشحن. الأوفر هو 38 ₪ دون انتظار.',
            wrong:
              '❌ تذكر أن تابعة الشحن تزيد من السعر الحقيقي. احسب التكلفة الكاملة قبل اختيارك.',
          },
        },
      ],
    },
  },

  g5_l13: {
    activityType: 'amir_steps',
    activityConfig: {
      title: 'حاسب الربح الحقيقي',
      steps: [
        {
          title: 'أمير يريد أن يصبح منتجاً',
          content:
            'أمير صنع عصير ليمون لبيع في الحي. إذا حسب قيمة المواد فقط فقد ظن أنه ربح 20 ₪، لكنه نسي أن يحسب قيمة وقت عمله.',
        },
        {
          title: 'ما الربح الحقيقي؟',
          description:
            'المبيعات كانت 50 ₪. المواد تكلفت 20 ₪. إذا قدرنا قيمة عمله بثمن 10 ₪ للساعة واشتغل ساعتين، فما الربح الحقيقي؟',
          interaction: {
            type: 'multiple_choice',
            choices: [
              { text: '10 ₪ فقط', correct: true },
              { text: '20 ₪', correct: false },
              { text: '30 ₪', correct: false },
            ],
          },
          feedback: {
            correct:
              '🎉 صحيح! التكلفة الكاملة = 20 ₪ مواد + 20 ₪ وقت. الربح الحقيقي = 50 - 40 = 10 ₪.',
            wrong:
              '❌ اعد الحساب: الربح يجب أن يأخذ في الاعتبار تكلفة المواد وقيمة وقت العمل معاً.',
          },
        },
      ],
    },
  },

  g5_l18: {
    activityType: 'city_council',
    activityConfig: {
      title: 'التوازن بيني والمجتمع',
      steps: [
        {
          title: 'قرار التبرع الذكي',
          content:
            'أسامة قرر أن يوزع 300 ₪ بين شراء لعبة وتبرع لمحتاجين. التبرع جزء مهم من المسؤولية الاجتماعية، لكن يجب أن لا يضيع أهدافه الشخصية.',
        },
        {
          title: 'ما الخيار الأنسب؟',
          interaction: {
            type: 'multiple_choice',
            choices: [
              {
                text: 'يشتري اللعبة فقط ويحتفظ ببقية المال',
                correct: false,
              },
              {
                text: 'يشتري اللعبة ويخصص 50 ₪ للتبرع',
                correct: true,
              },
              {
                text: 'يتبرع بكل المال ولا يشتري اللعبة',
                correct: false,
              },
            ],
          },
          feedback: {
            correct:
              '🎉 توازن ممتاز! يمكنك أن تشتري ما تريد وتحافظ على جزء من المسؤولية الاجتماعية.',
            wrong:
              '❌ القرار الذكي هو تحقيق توازن بين أهدافك الشخصية ومساعدة الآخرين، وليس التضحية الكاملة أو الإهمال الكامل.',
          },
        },
      ],
    },
  },

  g6_l2: {
    activityType: 'smart_shopper',
    activityConfig: {
      title: 'المستهلك الذكي',
      steps: [
        {
          title: 'عمر في السوبرماركت',
          content:
            'عمر لاحظ أن السعر الأقل لا يعني دائماً الأفضل. بشراء نفس المنتج بسعر وحدة أقل، يمكن أن يوفر الكثير من المال.',
        },
        {
          title: 'اختر العبوة الأوفر',
          products: [
            { label: 'العلبة الأولى', price: 4, weight: '200 غرام' },
            { label: 'العلبة الثانية', price: 6, weight: '400 غرام' },
          ],
          interaction: {
            type: 'multiple_choice',
            choices: [
              { text: 'العلبة الأولى لأن سعرها أقل', correct: false },
              { text: 'العلبة الثانية لأن سعر الغرام أقل', correct: true },
              { text: 'كلاهما متساويان', correct: false },
            ],
          },
          feedback: {
            correct:
              '✅ ممتاز! العلبة الثانية: 6÷400 = 1.5 أغورة/غرام. العلبة الأولى: 4÷200 = 2 أغورة/غرام. الأكبر أوفر!',
            wrong:
              '❌ احسب سعر الغرام: العلبة الأولى 4÷200 = 2 أغورة/غرام، العلبة الثانية 6÷400 = 1.5 أغورة/غرام — الثانية أوفر!',
          },
        },
      ],
    },
  },

  g6_l3: {
    activityType: 'vat_calculator',
    activityConfig: {
      title: 'حاسب السعر قبل الضريبة',
      steps: [
        {
          title: 'سامي ودفع الضريبة',
          content:
            'سامي دفع 590 ₪ لهاتف، لكن السعر المعلن كان 500 ₪ قبل ضريبة القيمة المضافة (18%). يحتاج لحساب السعر قبل الضريبة من السعر النهائي.',
        },
        {
          title: 'ما السعر قبل الضريبة؟',
          description:
            'استخدم المعادلة: السعر النهائي ÷ 1.18 = السعر قبل ضريبة القيمة المضافة.',
          interaction: {
            type: 'input',
            placeholder: 'اكتب الرقم هنا',
            expected: 500,
            tolerance: 1,
          },
          feedback: {
            correct:
              '✅ ممتاز! 590 ÷ 1.18 = 500 ₪ تقريباً. هذا هو السعر قبل الضريبة.',
            wrong:
              '❌ حاول مرة أخرى. تذكر أن تقسم السعر النهائي على 1.18 لحساب السعر قبل ضريبة القيمة المضافة.',
          },
        },
      ],
    },
  },

  g6_l4: {
    activityType: 'inflation_timeline',
    activityConfig: {
      title: 'التضخم والزمن',
      steps: [
        {
          title: 'التضخم يقلل من قيمة المال',
          content:
            'في الماضي كانت الأسعار أقل. 100 ₪ كانت تشتري أكثر من اليوم بسبب التضخم. هذا يعني أن المال يحتاج أن ينمو ليحافظ على قيمته.',
        },
        {
          title: 'أين القوة الشرائية أكبر؟',
          interaction: {
            type: 'multiple_choice',
            choices: [
              { text: '1000 ₪ بعد 18 سنة تساوي 1000 ₪ اليوم', correct: false },
              { text: '1000 ₪ بعد 18 سنة تساوي حوالي 500 ₪ من حيث القوة الشرائية اليوم', correct: true },
              { text: '1000 ₪ بعد 18 سنة تساوي 1500 ₪ اليوم', correct: false },
            ],
          },
          feedback: {
            correct:
              '✅ صحيح! التضخم يعني أن القوة الشرائية تنخفض، ولذلك 1000 ₪ بعد سنة طويلة لا تساوي 1000 ₪ اليوم.',
            wrong:
              '❌ التفكير الصحيح هو أن التضخم يجعل القوة الشرائية أقل بمرور الوقت. حاول أن تعيد الحساب.',
          },
        },
      ],
    },
  },

  g6_l5: {
    activityType: 'digital_payment',
    activityConfig: {
      title: 'الدفع الرقمي الآمن',
      steps: [
        {
          title: 'الهاتف يحل محل المحفظة',
          content:
            'Apple Pay وGoogle Pay لا يرسلان رقم بطاقتك الحقيقي. يرسلون رمزاً مؤقتاً لكل عملية، مما يجعل الدفع الرقمي أكثر أماناً.',
        },
        {
          title: 'ما الفرق في الأمان؟',
          interaction: {
            type: 'multiple_choice',
            choices: [
              {
                text: 'Apple Pay يرسل رمزاً مشفراً مؤقتاً بدل رقم البطاقة الحقيقي',
                correct: true,
              },
              {
                text: 'لا فرق — كلاهما يرسل رقم البطاقة للمتجر',
                correct: false,
              },
              {
                text: 'البطاقة العادية أكثر أماناً لأنها ملموسة',
                correct: false,
              },
            ],
          },
          feedback: {
            correct:
              '✅ ممتاز! الدفع الرقمي يستخدم Tokenization للحماية من سرقة بيانات البطاقة.',
            wrong:
              '❌ تذكر أن الدفع الرقمي لا يشارك رقم البطاقة الحقيقي. يُرسل رمزاً مؤقتاً لكل عملية.',
          },
        },
      ],
    },
  },

  g6_l6: {
    activityType: 'phishing_detector',
    activityConfig: {
      title: 'رسالة الاحتيال أم حقيقية؟',
      steps: [
        {
          title: 'نادين تواجه رسالة مشبوهة',
          content:
            'جاءتها رسالة تقول إن حسابها موقوف ويطلب منها إدخال بيانات البطاقة عبر رابط. هذا هو نوع الاحتيال الشائع.',
        },
        {
          title: 'ماذا تفعل؟',
          interaction: {
            type: 'multiple_choice',
            choices: [
              {
                text: 'أتجاهل الرسالة وأفتح التطبيق الرسمي للتحقق',
                correct: true,
              },
              {
                text: 'أضغط الرابط وأدخل البيانات لأن الحساب موقوف',
                correct: false,
              },
              { text: 'أحذف الرسالة فقط', correct: false },
            ],
          },
          feedback: {
            correct:
              '✅ ممتاز! الذهاب إلى المصدر الرسمي هو أفضل طريقة للتحقق من الرسائل المشبوهة.',
            wrong:
              '❌ الضغط على الروابط المشبوهة هو الطريق الأسهل لسرقة بياناتك. كن حذراً.',
          },
        },
      ],
    },
  },

  g6_l9: {
    activityType: 'compound_interest',
    activityConfig: {
      title: 'الفائدة المركبة',
      steps: [
        {
          title: 'المال ينمو مع نفسه',
          content:
            'الفائدة المركبة تعني أنك تكسب فائدة على المبلغ الأصلي وأيضاً على الفائدة السابقة. هذا يجعل المال ينمو أسرع مع الزمن.',
        },
        {
          title: 'كم سنة لتضاعف مالك؟',
          interaction: {
            type: 'multiple_choice',
            choices: [
              { text: '8 سنوات', correct: false },
              { text: '9 سنوات', correct: true },
              { text: '12 سنة', correct: false },
            ],
          },
          feedback: {
            correct:
              '✅ مضبوط! قاعدة 72 تقول: 72 ÷ 8 = 9 سنوات لتضاعف المال بعائد 8%.',
            wrong:
              '❌ حاول مرة أخرى. القاعدة 72 ÷ نسبة الفائدة تعطي عدد السنوات لتضاعف المال.',
          },
        },
      ],
    },
  },

  g6_l10: {
    activityType: 'stock_simulation',
    activityConfig: {
      title: 'سوق الأسهم بسهولة',
      steps: [
        {
          title: 'الاستثمار مقابل التوفير',
          content:
            'الاستثمار في الأسهم يعني أنك تشتري جزءاً من شركة وتشاركها الربح والخسارة. السند أقل خطورة لأنه قرض بفائدة ثابتة.',
        },
        {
          title: 'ما الفرق الجوهري؟',
          interaction: {
            type: 'multiple_choice',
            choices: [
              {
                text: 'السهم ملكية في شركة، والسند قرض للحكومة أو الشركة',
                correct: true,
              },
              { text: 'كلاهما نفس الشيء', correct: false },
              { text: 'السند أكثر ربحاً دائماً', correct: false },
            ],
          },
          feedback: {
            correct:
              '✅ ممتاز! هذا الفرق هو أساس فهم الاستثمار والأدوات المالية.',
            wrong:
              '❌ ليس هذا الفارق الصحيح. افهم الفرق بين الملكية والقرض.',
          },
        },
      ],
    },
  },

  g6_l14: {
    activityType: 'business_calculator',
    activityConfig: {
      title: 'احسب نقطة التعادل',
      steps: [
        {
          title: 'سارة تريد أن تعرف متى تبدأ الربح',
          content:
            'التكاليف الثابتة 120 ₪ وسعر البيع 10 ₪ وتكلفة الوحدة 4 ₪. نقطة التعادل هي عدد الوحدات التي تغطي التكلفة الكلية.',
        },
        {
          title: 'كم وحدة تحتاج أن تبيع؟',
          description: 'استخدم المعادلة: التكاليف الثابتة ÷ (سعر البيع - التكلفة المتغيرة).',
          interaction: {
            type: 'input',
            placeholder: 'اكتب عدد الوحدات',
            expected: 20,
            tolerance: 0.5,
          },
          feedback: {
            correct:
              '✅ صحيح! 120 ÷ (10 - 4) = 20 وحدة. بعد بيع الوحدة الـ21 تبدأ الربح.',
            wrong:
              '❌ ليس هذا العدد الصحيح. احسب الفرق بين سعر البيع وتكلفة الوحدة أولاً.',
          },
        },
      ],
    },
  },

  g6_l15: {
    activityType: 'business_model',
    activityConfig: {
      title: 'ما هو نموذج العمل؟',
      steps: [
        {
          title: 'أفكار المشروع يجب أن تكون أكثر من مجرد فكرة',
          content:
            'نموذج العمل يحدد من يدفع، كيف تكسب المال، وما هي التكاليف. بدون هذا لا يعتبر المشروع حقيقي.',
        },
        {
          title: 'اختر النموذج الصحيح',
          interaction: {
            type: 'multiple_choice',
            choices: [
              {
                text: 'توصيل طعام بعمولة 15% من كل طلب',
                correct: true,
              },
              {
                text: 'فكرة تطبيق جميل بدون تحديد من يدفع',
                correct: false,
              },
              {
                text: 'مشروع بدون حساب التكاليف',
                correct: false,
              },
            ],
          },
          feedback: {
            correct:
              '✅ ممتاز! هذا يحدد العميل والربح وطريقة العمل بوضوح.',
            wrong:
              '❌ النموذج الصحيح يحدد كيف تكسب المال ومن سيدفع مقابل الخدمة.',
          },
        },
      ],
    },
  },

  g6_l20: {
    activityType: 'independence_plan',
    activityConfig: {
      title: 'من الحلم إلى الخطة',
      steps: [
        {
          title: 'الخطة المالية المستقبلية',
          content:
            'الفرق بين الحلم والهدف هو أن الهدف له خطة واضحة ومواعيد. التخطيط يجعل الحلم قابلاً للتنفيذ.',
        },
        {
          title: 'ما الفرق بين الحلم والهدف؟',
          interaction: {
            type: 'multiple_choice',
            choices: [
              { text: 'الحلم والهدف نفس الشيء', correct: false },
              {
                text: 'الهدف له خطة عمل ومواعيد، والحلم لا',
                correct: true,
              },
              {
                text: 'الأحلام أهم من الأهداف لأنها تلهم فقط',
                correct: false,
              },
            ],
          },
          feedback: {
            correct:
              '✅ تمام! الهدف هو حلم مع خطة قابلة للتنفيذ ومواعيد واضحة.',
            wrong:
              '❌ فكر في أن الهدف يتطلب خطة ومواعيد، أما الحلم فهو مجرد رغبة بدون تنفيذ.',
          },
        },
      ],
    },
  },
};

export async function applyGrade56ActivityConfigs(prismaClient: PrismaClient) {
  console.log('Applying Grade 5 and 6 activity configs...');
  for (const [legacyId, data] of Object.entries(ACTIVITIES)) {
    await prismaClient.lesson.update({
      where: { legacyId },
      data: {
        activityType: data.activityType,
        activityConfig: data.activityConfig as unknown as Record<string, unknown>,
      },
    });
    console.log(`  Updated ${legacyId}`);
  }
}

async function main() {
  try {
    await applyGrade56ActivityConfigs(prisma);
    console.log('\n✅ Grade 5 and 6 activity configs applied.');
  } catch (error) {
    console.error('Error applying activity configs:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1]?.includes('seed-activities-grade5-6.ts')) {
  main();
}
