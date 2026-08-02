export interface NotaryService {
  id: string;
  name: string;
  description: string;
  fee: number;
  feeLabel: string;
  category: 'standard' | 'special';
  iconName: string;
}

export interface TravelOption {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface TravelBracket {
  id: string;
  milesRange: string;
  fee: number;
}

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string;
  quantity: number;
  locationType: string;
  customAddress: string;
  distanceBracketId: string;
  customDistanceMiles?: number;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  additionalNotes?: string;
  estimatedNotaryFee: number;
  estimatedTravelFee: number;
  estimatedTotal: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

// Pricing Constants based on Florida Maximum Fees (Chapter 117, Florida Statutes)
export const NOTARY_SERVICES: NotaryService[] = [
  {
    id: 'acknowledgment',
    name: 'Acknowledgment',
    description: 'Declaring a signature was made willingly before the notary. Per notarial act.',
    fee: 10,
    feeLabel: '$10 per act',
    category: 'standard',
    iconName: 'FileCheck'
  },
  {
    id: 'jurat',
    name: 'Jurat (Oath/Affirmation with Signature)',
    description: 'Signing a document and swearing/affirming its truthfulness under oath. Per notarial act.',
    fee: 10,
    feeLabel: '$10 per act',
    category: 'standard',
    iconName: 'PenTool'
  },
  {
    id: 'oath_without_jurat',
    name: 'Oath or Affirmation (Without Jurat)',
    description: 'Administering a verbal oath or affirmation without a signature. Per notarial act.',
    fee: 10,
    feeLabel: '$10 per act',
    category: 'standard',
    iconName: 'FileSignature'
  },
  {
    id: 'certified_copy',
    name: 'Certified Copy of Original',
    description: 'Attesting that a copy is a true and accurate replication of an original (when authorized). Per act.',
    fee: 10,
    feeLabel: '$10 per act',
    category: 'standard',
    iconName: 'Copy'
  },
  {
    id: 'marriage',
    name: 'Solemnizing a Marriage',
    description: 'Performing a wedding ceremony as a authorized Florida public officer. Per ceremony.',
    fee: 30,
    feeLabel: '$30 per ceremony',
    category: 'special',
    iconName: 'Heart'
  }
];

export const TRAVEL_OPTIONS: TravelOption[] = [
  {
    id: 'home',
    name: 'Home',
    description: 'We come to your home so you can handle what matters most.',
    iconName: 'Home'
  },
  {
    id: 'office',
    name: 'Office',
    description: 'We come to your office to keep your business moving forward.',
    iconName: 'Briefcase'
  },
  {
    id: 'hospital',
    name: 'Hospital',
    description: 'We come to you or your loved one at the hospital when it matters most.',
    iconName: 'Activity'
  },
  {
    id: 'nursing_home',
    name: 'Nursing Home',
    description: 'We come to your loved one at the nursing home with care and respect.',
    iconName: 'Users'
  }
];

export const TRAVEL_BRACKETS: TravelBracket[] = [
  { id: 'under_10', milesRange: '0 - 10 Miles', fee: 25 },
  { id: '11_to_20', milesRange: '11 - 20 Miles', fee: 40 },
  { id: '21_to_30', milesRange: '21 - 30 Miles', fee: 50 },
  { id: '31_to_40', milesRange: '31 - 40 Miles', fee: 60 },
  { id: 'over_40', milesRange: '41+ Miles', fee: 60 } // Base $60 + $1.00 per mile
];

export type ScheduleStatus = 'home' | 'away' | 'unavailable';

export interface WeeklySchedule {
  [dayOfWeek: string]: {
    [timeSlot: string]: ScheduleStatus;
  };
}

export const ALL_TIME_SLOTS = [
  "12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", 
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", 
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", 
  "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"
];

export const DAYS_OF_WEEK = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export const isTypicalWorkingHour = (day: string, slot: string): boolean => {
  // Typical working hours: Mon-Fri, 8:00 AM to 6:00 PM (inclusive)
  const isWeekend = day === 'Saturday' || day === 'Sunday';
  if (isWeekend) return false;

  const typicalSlots = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
  ];
  return typicalSlots.includes(slot);
};

export const DEFAULT_WEEKLY_SCHEDULE: WeeklySchedule = DAYS_OF_WEEK.reduce((acc, day) => {
  acc[day] = {};
  ALL_TIME_SLOTS.forEach(slot => {
    // Weekdays standard typical hours default to 'home' (online booking), others default to 'away' (inquiry only)
    acc[day][slot] = isTypicalWorkingHour(day, slot) ? 'home' : 'away';
  });
  return acc;
}, {} as WeeklySchedule);

