import { Specialization } from './specialization.enum';

export const SPECIALIZATION_LABELS: Record<
  Specialization,
  string
> = {
  [Specialization.CARDIOLOGIST]: 'Cardiologist',
  [Specialization.DERMATOLOGIST]: 'Dermatologist',
  [Specialization.NEUROLOGIST]: 'Neurologist',
  [Specialization.GASTROENTEROLOGIST]:
    'Gastroenterologist',
  [Specialization.ORTHOPEDIC_SURGEON]:
    'Orthopedic Surgeon',
  [Specialization.PEDIATRICIAN]: 'Pediatrician',
  [Specialization.PSYCHIATRIST]: 'Psychiatrist',
  [Specialization.ENT_SPECIALIST]: 'ENT Specialist',
  [Specialization.OPHTHALMOLOGIST]: 'Ophthalmologist',
  [Specialization.GYNECOLOGIST]: 'Gynecologist',
  [Specialization.UROLOGIST]: 'Urologist',
  [Specialization.PULMONOLOGIST]: 'Pulmonologist',
  [Specialization.GENERAL_PHYSICIAN]:
    'General Physician',
  [Specialization.ENDOCRINOLOGIST]: 'Endocrinologist',
  [Specialization.ONCOLOGIST]: 'Oncologist',
  [Specialization.NEPHROLOGIST]: 'Nephrologist',
};

export function getSpecializationLabel(
  specialization: Specialization,
): string {
  return SPECIALIZATION_LABELS[specialization];
}

export function getAllowedSpecializationValues(): string {
  return Object.values(Specialization).join(', ');
}
