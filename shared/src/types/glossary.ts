export interface GlossaryTerm {
  id: string;
  glossaryUnitId: string;
  termAr: string;
  termHe: string;
  definition: string;
  example: string;
}

export interface GlossaryUnit {
  id: string;
  gradeId: string;
  unitNumber: number;
  unitName: string;
  unitColor: string;
  icon: string;
  terms: GlossaryTerm[];
}
