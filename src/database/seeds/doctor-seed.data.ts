import { Specialization } from '../../doctor/enums/specialization.enum';
import { getSpecializationLabel } from '../../doctor/enums/specialization.labels';

export const SEED_EMAIL_DOMAIN = 'schedula-seed.test';

export interface DoctorSeedRecord {
  seedEmail: string;
  fullName: string;
  specialization: string;
  experience: number;
  qualification: string;
  consultationFee: number;
  availability: string;
  profileDetails: string;
}

interface DoctorTemplate {
  fullName: string;
  experience: number;
  qualification: string;
  consultationFee: number;
  availability: string;
  profileDetails: string;
}

const DOCTORS_BY_SPECIALIZATION: Record<
  Specialization,
  DoctorTemplate[]
> = {
  [Specialization.CARDIOLOGIST]: [
    {
      fullName: 'Dr. Rahul Sharma',
      experience: 15,
      qualification: 'MBBS, DM',
      consultationFee: 1200,
      availability: 'Mon-Fri 9AM-5PM',
      profileDetails:
        'Senior cardiologist specializing in preventive heart care and hypertension management.',
    },
    {
      fullName: 'Dr. Ananya Iyer',
      experience: 10,
      qualification: 'MBBS, MD',
      consultationFee: 900,
      availability: 'Mon-Sat 10AM-6PM',
      profileDetails:
        'Expert in echocardiography and cardiac rehabilitation programs.',
    },
    {
      fullName: 'Dr. Vikram Desai',
      experience: 20,
      qualification: 'MBBS, DNB',
      consultationFee: 1500,
      availability: 'Tue-Sun 8AM-2PM',
      profileDetails:
        'Interventional cardiologist with extensive experience in angioplasty procedures.',
    },
    {
      fullName: 'Dr. Meera Nair',
      experience: 8,
      qualification: 'MBBS, MD',
      consultationFee: 800,
      availability: 'Mon-Wed-Fri 11AM-7PM',
      profileDetails:
        "Focuses on women's heart health and lifestyle-related cardiac conditions.",
    },
  ],
  [Specialization.DERMATOLOGIST]: [
    {
      fullName: 'Dr. Priya Menon',
      experience: 12,
      qualification: 'MBBS, MD',
      consultationFee: 700,
      availability: 'Mon-Fri 9AM-5PM',
      profileDetails:
        'Treats acne, eczema, and cosmetic dermatology concerns with evidence-based care.',
    },
    {
      fullName: 'Dr. Arjun Kapoor',
      experience: 6,
      qualification: 'MBBS, DNB',
      consultationFee: 600,
      availability: 'Mon-Sat 10AM-6PM',
      profileDetails:
        'Specializes in skin allergy testing and pediatric dermatology.',
    },
    {
      fullName: 'Dr. Kavita Rao',
      experience: 14,
      qualification: 'MBBS, MD',
      consultationFee: 850,
      availability: 'Sat-Sun 9AM-1PM',
      profileDetails:
        'Experienced in psoriasis, vitiligo, and advanced laser skin treatments.',
    },
  ],
  [Specialization.NEUROLOGIST]: [
    {
      fullName: 'Dr. Sanjay Verma',
      experience: 18,
      qualification: 'MBBS, DM',
      consultationFee: 1400,
      availability: 'Mon-Thu 8AM-4PM',
      profileDetails:
        'Neurologist focused on stroke recovery, epilepsy, and migraine management.',
    },
    {
      fullName: 'Dr. Neha Gupta',
      experience: 9,
      qualification: 'MBBS, MD',
      consultationFee: 950,
      availability: 'Mon-Fri 9AM-5PM',
      profileDetails:
        'Provides care for neuropathy, dizziness, and memory-related disorders.',
    },
    {
      fullName: 'Dr. Rohit Malhotra',
      experience: 22,
      qualification: 'MBBS, DM',
      consultationFee: 1800,
      availability: 'Tue-Sun 8AM-2PM',
      profileDetails:
        'Senior consultant for Parkinson\'s disease and movement disorders.',
    },
  ],
  [Specialization.GASTROENTEROLOGIST]: [
    {
      fullName: 'Dr. Amit Patel',
      experience: 11,
      qualification: 'MBBS, DM',
      consultationFee: 1100,
      availability: 'Mon-Sat 10AM-6PM',
      profileDetails:
        'Specialist in liver disorders, IBS, and digestive health evaluations.',
    },
    {
      fullName: 'Dr. Shreya Joshi',
      experience: 7,
      qualification: 'MBBS, MD',
      consultationFee: 750,
      availability: 'Mon-Wed-Fri 11AM-7PM',
      profileDetails:
        'Experienced in endoscopy procedures and nutritional gut health counseling.',
    },
    {
      fullName: 'Dr. Karan Singh',
      experience: 16,
      qualification: 'MBBS, DNB',
      consultationFee: 1300,
      availability: 'Mon-Fri 9AM-5PM',
      profileDetails:
        'Treats GERD, ulcerative colitis, and chronic abdominal pain syndromes.',
    },
  ],
  [Specialization.ORTHOPEDIC_SURGEON]: [
    {
      fullName: 'Dr. Harish Reddy',
      experience: 19,
      qualification: 'MBBS, MS',
      consultationFee: 1000,
      availability: 'Mon-Fri 9AM-5PM',
      profileDetails:
        'Orthopedic surgeon specializing in joint replacement and sports injuries.',
    },
    {
      fullName: 'Dr. Pooja Bhatia',
      experience: 8,
      qualification: 'MBBS, MS',
      consultationFee: 850,
      availability: 'Mon-Sat 10AM-6PM',
      profileDetails:
        'Focuses on fracture care, arthritis management, and post-surgery rehabilitation.',
    },
    {
      fullName: 'Dr. Manish Agarwal',
      experience: 13,
      qualification: 'MBBS, DNB',
      consultationFee: 950,
      availability: 'Tue-Sun 8AM-2PM',
      profileDetails:
        'Experienced in spine disorders and minimally invasive orthopedic procedures.',
    },
  ],
  [Specialization.PEDIATRICIAN]: [
    {
      fullName: 'Dr. Lakshmi Krishnan',
      experience: 10,
      qualification: 'MBBS, MD',
      consultationFee: 600,
      availability: 'Mon-Fri 9AM-5PM',
      profileDetails:
        'Pediatrician providing newborn care, vaccination, and childhood illness treatment.',
    },
    {
      fullName: 'Dr. Aditya Choudhary',
      experience: 5,
      qualification: 'MBBS, DNB',
      consultationFee: 500,
      availability: 'Sat-Sun 9AM-1PM',
      profileDetails:
        'Gentle approach to pediatric asthma, allergies, and growth monitoring.',
    },
    {
      fullName: 'Dr. Ritu Saxena',
      experience: 14,
      qualification: 'MBBS, MD',
      consultationFee: 700,
      availability: 'Mon-Sat 10AM-6PM',
      profileDetails:
        'Child health specialist with expertise in adolescent nutrition and development.',
    },
  ],
  [Specialization.PSYCHIATRIST]: [
    {
      fullName: 'Dr. Anil Mehta',
      experience: 17,
      qualification: 'MBBS, MD',
      consultationFee: 1200,
      availability: 'Mon-Wed-Fri 11AM-7PM',
      profileDetails:
        'Psychiatrist treating anxiety, depression, and stress-related disorders.',
    },
    {
      fullName: 'Dr. Divya Kulkarni',
      experience: 9,
      qualification: 'MBBS, DNB',
      consultationFee: 900,
      availability: 'Mon-Fri 9AM-5PM',
      profileDetails:
        'Provides counseling and medication management for mood and sleep disorders.',
    },
    {
      fullName: 'Dr. Suresh Pillai',
      experience: 21,
      qualification: 'MBBS, MD',
      consultationFee: 1500,
      availability: 'Tue-Sun 8AM-2PM',
      profileDetails:
        'Senior psychiatrist specializing in OCD, PTSD, and addiction recovery support.',
    },
  ],
  [Specialization.ENT_SPECIALIST]: [
    {
      fullName: 'Dr. Nisha Fernandes',
      experience: 12,
      qualification: 'MBBS, MS',
      consultationFee: 800,
      availability: 'Mon-Fri 9AM-5PM',
      profileDetails:
        'ENT specialist for sinus issues, hearing loss, and throat infections.',
    },
    {
      fullName: 'Dr. Gaurav Thakur',
      experience: 6,
      qualification: 'MBBS, DNB',
      consultationFee: 650,
      availability: 'Mon-Sat 10AM-6PM',
      profileDetails:
        'Treats tonsillitis, vertigo, and pediatric ear-nose-throat conditions.',
    },
    {
      fullName: 'Dr. Leela Banerjee',
      experience: 15,
      qualification: 'MBBS, MS',
      consultationFee: 950,
      availability: 'Mon-Thu 8AM-4PM',
      profileDetails:
        'Experienced in voice disorders, sleep apnea evaluation, and allergy-related ENT care.',
    },
  ],
  [Specialization.OPHTHALMOLOGIST]: [
    {
      fullName: 'Dr. Rajesh Kaur',
      experience: 11,
      qualification: 'MBBS, MS',
      consultationFee: 750,
      availability: 'Mon-Fri 9AM-5PM',
      profileDetails:
        'Ophthalmologist specializing in cataract surgery and diabetic eye care.',
    },
    {
      fullName: 'Dr. Farhan Ali',
      experience: 8,
      qualification: 'MBBS, DNB',
      consultationFee: 700,
      availability: 'Sat-Sun 9AM-1PM',
      profileDetails:
        'Expert in glaucoma screening, refractive errors, and dry eye treatment.',
    },
    {
      fullName: 'Dr. Sunita Das',
      experience: 16,
      qualification: 'MBBS, MS',
      consultationFee: 900,
      availability: 'Tue-Sun 8AM-2PM',
      profileDetails:
        'Provides comprehensive retina care and pediatric vision assessments.',
    },
  ],
  [Specialization.GYNECOLOGIST]: [
    {
      fullName: 'Dr. Aparna Shetty',
      experience: 13,
      qualification: 'MBBS, MS',
      consultationFee: 850,
      availability: 'Mon-Sat 10AM-6PM',
      profileDetails:
        "Gynecologist focused on prenatal care, PCOS, and women's wellness programs.",
    },
    {
      fullName: 'Dr. Kiran Oberoi',
      experience: 10,
      qualification: 'MBBS, DNB',
      consultationFee: 800,
      availability: 'Mon-Fri 9AM-5PM',
      profileDetails:
        'Specializes in fertility counseling and minimally invasive gynecologic procedures.',
    },
    {
      fullName: 'Dr. Mohini Shah',
      experience: 18,
      qualification: 'MBBS, MS',
      consultationFee: 1100,
      availability: 'Mon-Wed-Fri 11AM-7PM',
      profileDetails:
        'Senior consultant for high-risk pregnancy and menopause management.',
    },
  ],
  [Specialization.UROLOGIST]: [
    {
      fullName: 'Dr. Deepak Rana',
      experience: 14,
      qualification: 'MBBS, MS',
      consultationFee: 950,
      availability: 'Mon-Fri 9AM-5PM',
      profileDetails:
        'Urologist treating kidney stones, urinary infections, and prostate health.',
    },
    {
      fullName: 'Dr. Ishita Mukherjee',
      experience: 7,
      qualification: 'MBBS, DNB',
      consultationFee: 750,
      availability: 'Mon-Thu 8AM-4PM',
      profileDetails:
        'Provides care for bladder disorders and male reproductive health concerns.',
    },
    {
      fullName: 'Dr. Yusuf Khan',
      experience: 20,
      qualification: 'MBBS, MS',
      consultationFee: 1250,
      availability: 'Tue-Sun 8AM-2PM',
      profileDetails:
        'Experienced in urologic oncology and minimally invasive stone removal.',
    },
  ],
  [Specialization.PULMONOLOGIST]: [
    {
      fullName: 'Dr. Varun Bhatt',
      experience: 12,
      qualification: 'MBBS, MD',
      consultationFee: 900,
      availability: 'Mon-Sat 10AM-6PM',
      profileDetails:
        'Pulmonologist specializing in asthma, COPD, and chronic cough evaluation.',
    },
    {
      fullName: 'Dr. Helen Thomas',
      experience: 9,
      qualification: 'MBBS, DNB',
      consultationFee: 800,
      availability: 'Mon-Fri 9AM-5PM',
      profileDetails:
        'Expert in sleep-related breathing disorders and pulmonary rehabilitation.',
    },
    {
      fullName: 'Dr. Prakash Naidu',
      experience: 17,
      qualification: 'MBBS, DM',
      consultationFee: 1150,
      availability: 'Mon-Wed-Fri 11AM-7PM',
      profileDetails:
        'Senior lung specialist with focus on interstitial lung disease and tuberculosis care.',
    },
  ],
  [Specialization.GENERAL_PHYSICIAN]: [
    {
      fullName: 'Dr. Suman Luthra',
      experience: 8,
      qualification: 'MBBS, MD',
      consultationFee: 500,
      availability: 'Mon-Fri 9AM-5PM',
      profileDetails:
        'General physician offering primary care, fever management, and chronic disease follow-ups.',
    },
    {
      fullName: 'Dr. Tarun Mehra',
      experience: 5,
      qualification: 'MBBS',
      consultationFee: 400,
      availability: 'Mon-Sat 10AM-6PM',
      profileDetails:
        'Provides routine health checkups, diabetes screening, and preventive care guidance.',
    },
    {
      fullName: 'Dr. Geeta Pillai',
      experience: 12,
      qualification: 'MBBS, MD',
      consultationFee: 600,
      availability: 'Sat-Sun 9AM-1PM',
      profileDetails:
        'Trusted family physician with expertise in hypertension and thyroid monitoring.',
    },
    {
      fullName: 'Dr. Imran Qureshi',
      experience: 15,
      qualification: 'MBBS, MD',
      consultationFee: 650,
      availability: 'Mon-Thu 8AM-4PM',
      profileDetails:
        'Experienced in geriatric care, viral illnesses, and holistic wellness planning.',
    },
  ],
  [Specialization.ENDOCRINOLOGIST]: [
    {
      fullName: 'Dr. Charu Sinha',
      experience: 11,
      qualification: 'MBBS, DM',
      consultationFee: 1000,
      availability: 'Mon-Fri 9AM-5PM',
      profileDetails:
        'Endocrinologist managing diabetes, thyroid disorders, and hormonal imbalances.',
    },
    {
      fullName: 'Dr. Nitin Bose',
      experience: 9,
      qualification: 'MBBS, MD',
      consultationFee: 850,
      availability: 'Tue-Sun 8AM-2PM',
      profileDetails:
        'Specializes in metabolic syndrome, obesity counseling, and pituitary disorders.',
    },
    {
      fullName: 'Dr. Revathi Menon',
      experience: 14,
      qualification: 'MBBS, DM',
      consultationFee: 1100,
      availability: 'Mon-Wed-Fri 11AM-7PM',
      profileDetails:
        'Expert in pediatric endocrinology and insulin therapy optimization.',
    },
  ],
  [Specialization.ONCOLOGIST]: [
    {
      fullName: 'Dr. Ashok Varma',
      experience: 19,
      qualification: 'MBBS, DM',
      consultationFee: 2000,
      availability: 'Mon-Fri 9AM-5PM',
      profileDetails:
        'Medical oncologist providing chemotherapy planning and cancer survivorship care.',
    },
    {
      fullName: 'Dr. Pallavi Deshmukh',
      experience: 10,
      qualification: 'MBBS, MD',
      consultationFee: 1500,
      availability: 'Mon-Sat 10AM-6PM',
      profileDetails:
        'Focuses on breast and cervical cancer screening with compassionate patient support.',
    },
    {
      fullName: 'Dr. Cyrus D\'Souza',
      experience: 23,
      qualification: 'MBBS, DM',
      consultationFee: 2500,
      availability: 'Mon-Thu 8AM-4PM',
      profileDetails:
        'Senior oncologist experienced in hematologic malignancies and targeted therapy.',
    },
  ],
  [Specialization.NEPHROLOGIST]: [
    {
      fullName: 'Dr. Bindu Narayanan',
      experience: 13,
      qualification: 'MBBS, DM',
      consultationFee: 1100,
      availability: 'Mon-Fri 9AM-5PM',
      profileDetails:
        'Nephrologist specializing in chronic kidney disease and dialysis management.',
    },
    {
      fullName: 'Dr. Harsh Vardhan',
      experience: 8,
      qualification: 'MBBS, MD',
      consultationFee: 900,
      availability: 'Mon-Sat 10AM-6PM',
      profileDetails:
        'Treats electrolyte imbalances, kidney stones, and post-transplant follow-up care.',
    },
    {
      fullName: 'Dr. Olivia Pereira',
      experience: 16,
      qualification: 'MBBS, DM',
      consultationFee: 1300,
      availability: 'Tue-Sun 8AM-2PM',
      profileDetails:
        'Expert in hypertensive nephropathy and renal nutrition counseling.',
    },
  ],
};

export function getDoctorSeedData(): DoctorSeedRecord[] {
  const records: DoctorSeedRecord[] = [];
  let index = 1;

  for (const specialization of Object.values(
    Specialization,
  )) {
    const doctors =
      DOCTORS_BY_SPECIALIZATION[specialization];

    for (const doctor of doctors) {
      records.push({
        seedEmail: `seed.doctor.${String(index).padStart(3, '0')}@${SEED_EMAIL_DOMAIN}`,
        fullName: doctor.fullName,
        specialization:
          getSpecializationLabel(specialization),
        experience: doctor.experience,
        qualification: doctor.qualification,
        consultationFee: doctor.consultationFee,
        availability: doctor.availability,
        profileDetails: doctor.profileDetails,
      });
      index++;
    }
  }

  return records;
}

export const DOCTOR_SEED_COUNT =
  getDoctorSeedData().length;
