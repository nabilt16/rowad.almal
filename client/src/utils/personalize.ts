/**
 * Client-side personalization engine.
 * Replaces character names, parent names, and gender-specific verb forms
 * based on the student's profile data.
 *
 * This is a port of server/src/utils/personalize.ts for use in the browser.
 */

export interface PersonalizeContext {
  studentName: string;
  gender: 'male' | 'female';
  dadName: string;
  dadJob: string;
  momName: string;
  momJob: string;
}

/**
 * 24 gender conjugation patterns.
 * Each entry: [regex, maleForm, femaleForm]
 * When the student is female, the male form is replaced with the female form.
 */
const GENDER_PATTERNS: Array<[RegExp, string, string]> = [
  // Present-tense verbs (يفعل → تفعل)
  [/\bيتعلم\b/g, 'يتعلم', 'تتعلم'],
  [/\bيعرف\b/g, 'يعرف', 'تعرف'],
  [/\bيستطيع\b/g, 'يستطيع', 'تستطيع'],
  [/\bيريد\b/g, 'يريد', 'تريد'],
  [/\bيحب\b/g, 'يحب', 'تحب'],
  [/\bيفكر\b/g, 'يفكر', 'تفكر'],
  [/\bيدخر\b/g, 'يدخر', 'تدخر'],
  [/\bيوفر\b/g, 'يوفر', 'توفر'],
  [/\bيشتري\b/g, 'يشتري', 'تشتري'],
  [/\bيحتاج\b/g, 'يحتاج', 'تحتاج'],
  [/\bيساعد\b/g, 'يساعد', 'تساعد'],
  [/\bيذهب\b/g, 'يذهب', 'تذهب'],

  // Descriptive nouns / adjectives
  [/\bصديقنا\b/g, 'صديقنا', 'صديقتنا'],
  [/\bبطلنا\b/g, 'بطلنا', 'بطلتنا'],
  [/\bالطالب\b/g, 'الطالب', 'الطالبة'],
  [/\bالصغير\b/g, 'الصغير', 'الصغيرة'],
  [/\bالذكي\b/g, 'الذكي', 'الذكية'],

  // Past-tense verbs (فعل → فعلت)
  [/\bقرر\b/g, 'قرر', 'قررت'],
  [/\bذهب\b/g, 'ذهب', 'ذهبت'],
  [/\bوجد\b/g, 'وجد', 'وجدت'],
  [/\bفكّر\b/g, 'فكّر', 'فكّرت'],
  [/\bتعلّم\b/g, 'تعلّم', 'تعلّمت'],
  [/\bأراد\b/g, 'أراد', 'أرادت'],
  [/\bاستطاع\b/g, 'استطاع', 'استطاعت'],
];

/**
 * Personalizes lesson/story text by substituting placeholder character names
 * with the student's actual name, parent names, and adjusting gender forms.
 */
export function personalizeText(text: string, ctx: PersonalizeContext): string {
  let result = text;

  // Replace character names with student name
  result = result.replace(/\bأمير\b/g, ctx.studentName);
  result = result.replace(/\bسارة\b/g, ctx.studentName);
  result = result.replace(/\bليلى\b/g, ctx.studentName);

  // Replace parent placeholder names
  result = result.replace(/أبو أمير/g, ctx.dadName);
  result = result.replace(/أم أمير/g, ctx.momName);

  // Gender conjugation — only needed for female students
  if (ctx.gender === 'female') {
    for (const [pattern, , femaleForm] of GENDER_PATTERNS) {
      result = result.replace(pattern, femaleForm);
    }
  }

  return result;
}
