import { TimeOffType, Holiday, SchoolHolidayPeriod } from './types';

export const TIME_OFF_TYPE_DETAILS: {
  [key in TimeOffType]: { label: string; color: string; short: string };
} = {
  [TimeOffType.VACATION]: { label: 'Urlaub', color: 'bg-blue-500', short: 'U' },
  [TimeOffType.OVERTIME]: {
    label: 'Überstundenfrei',
    color: 'bg-green-500',
    short: 'Ü',
  },
  [TimeOffType.SICK]: { label: 'Krank', color: 'bg-orange-500', short: 'K' },
};

export const GERMAN_MONTH_NAMES = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

export const GERMAN_DAY_NAMES_SHORT = [
  'So',
  'Mo',
  'Di',
  'Mi',
  'Do',
  'Fr',
  'Sa',
];

interface YearData {
  publicHolidays: Holiday[];
  schoolHolidays: SchoolHolidayPeriod[];
}

export const HOLIDAY_DATA: Record<number, YearData> = {
  2025: {
    publicHolidays: [
      { date: '2025-01-01', name: 'Neujahr' },
      { date: '2025-04-18', name: 'Karfreitag' },
      { date: '2025-04-21', name: 'Ostermontag' },
      { date: '2025-05-01', name: 'Tag der Arbeit' },
      { date: '2025-05-29', name: 'Christi Himmelfahrt' },
      { date: '2025-06-09', name: 'Pfingstmontag' },
      { date: '2025-06-19', name: 'Fronleichnam' },
      { date: '2025-10-03', name: 'Tag der Deutschen Einheit' },
      { date: '2025-11-01', name: 'Allerheiligen' },
      { date: '2025-12-25', name: '1. Weihnachtstag' },
      { date: '2025-12-26', name: '2. Weihnachtstag' },
    ],
    schoolHolidays: [
      { name: 'Osterferien', startDate: '2025-04-14', endDate: '2025-04-25' },
      { name: 'Pfingstferien', startDate: '2025-06-10', endDate: '2025-06-13' },
      { name: 'Sommerferien', startDate: '2025-07-07', endDate: '2025-08-15' },
      { name: 'Herbstferien', startDate: '2025-10-13', endDate: '2025-10-24' },
      {
        name: 'Weihnachtsferien',
        startDate: '2025-12-22',
        endDate: '2026-01-07',
      }, // Corrected end date into next year
    ],
  },
  2026: {
    publicHolidays: [
      { date: '2026-01-01', name: 'Neujahr' },
      { date: '2026-04-03', name: 'Karfreitag' },
      { date: '2026-04-06', name: 'Ostermontag' },
      { date: '2026-05-01', name: 'Tag der Arbeit' },
      { date: '2026-05-14', name: 'Christi Himmelfahrt' },
      { date: '2026-05-25', name: 'Pfingstmontag' },
      { date: '2026-06-04', name: 'Fronleichnam' },
      { date: '2026-10-03', name: 'Tag der Deutschen Einheit' },
      { date: '2026-11-01', name: 'Allerheiligen' },
      { date: '2026-12-25', name: '1. Weihnachtstag' },
      { date: '2026-12-26', name: '2. Weihnachtstag' },
    ],
    schoolHolidays: [
      { name: 'Osterferien', startDate: '2026-03-30', endDate: '2026-04-10' },
      { name: 'Pfingstferien', startDate: '2026-05-26', endDate: '2026-05-29' },
      { name: 'Sommerferien', startDate: '2026-06-29', endDate: '2026-08-07' },
      { name: 'Herbstferien', startDate: '2026-10-05', endDate: '2026-10-16' },
      {
        name: 'Weihnachtsferien',
        startDate: '2026-12-23',
        endDate: '2026-12-31',
      },
    ],
  },
};
