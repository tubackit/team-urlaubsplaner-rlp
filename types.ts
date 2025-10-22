export enum TimeOffType {
  VACATION = 'Urlaub',
  OVERTIME = 'Überstundenfrei',
  SICK = 'Krank',
}

export enum Department {
  OFFICE = 'Büro',
  SHIPPING = 'Versand',
}

export interface TimeOff {
  date: string; // YYYY-MM-DD
  type: TimeOffType;
}

export interface Employee {
  id: string;
  name: string;
  department: Department;
  timeOff: TimeOff[];
}

export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
}

export interface SchoolHolidayPeriod {
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}
