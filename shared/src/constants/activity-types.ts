export const ACTIVITY_TYPES = {
  // Grade 4
  MULTIPLE_CHOICE: 'multiple_choice',
  ORDERING: 'ordering',
  CLASSIFICATION: 'classification',
  TRUE_FALSE: 'true_false',
  CALCULATION: 'calculation',

  // Grade 5
  AMIR_STEPS: 'amir_steps',
  SOUQ_ACTIVITY: 'souq_activity',
  WASSAM_PARTY: 'wassam_party',
  MARYAM_DETECTIVE: 'maryam_detective',
  TIME_MACHINE: 'time_machine',
  CITY_COUNCIL: 'city_council',

  // Grade 6
  SMART_SHOPPER: 'smart_shopper',
  VAT_CALCULATOR: 'vat_calculator',
  COMPOUND_INTEREST: 'compound_interest',
  STOCK_SIMULATION: 'stock_simulation',
  BUSINESS_CALCULATOR: 'business_calculator',
  PHISHING_DETECTOR: 'phishing_detector',
  INFLATION_TIMELINE: 'inflation_timeline',
} as const;

export type ActivityType = typeof ACTIVITY_TYPES[keyof typeof ACTIVITY_TYPES];
