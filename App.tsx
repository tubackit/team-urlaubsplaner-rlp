import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useLayoutEffect,
} from 'react';
import { Employee, TimeOff, TimeOffType, Department } from './types';
import {
  GERMAN_MONTH_NAMES,
  GERMAN_DAY_NAMES_SHORT,
  TIME_OFF_TYPE_DETAILS,
  HOLIDAY_DATA,
} from './constants';

// --- Helper Functions ---
const getDaysInMonth = (year: number, month: number): Date[] => {
  const date = new Date(Date.UTC(year, month, 1));
  const days: Date[] = [];
  while (date.getUTCMonth() === month) {
    days.push(new Date(date));
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return days;
};

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

const isWeekend = (date: Date): boolean => {
  const day = date.getUTCDay();
  return day === 6 || day === 0; // Saturday or Sunday
};

const getInitialEmployees = (): Employee[] => {
  const defaultEmployee = {
    id: '1',
    name: 'Max Mustermann',
    department: Department.OFFICE,
    timeOff: [] as TimeOff[],
  };
  const savedJSON = localStorage.getItem('employees');

  // Explicitly handle the valid empty state first.
  if (savedJSON === '[]') {
    return [];
  }

  // Try to parse and validate any other stored data.
  if (savedJSON) {
    try {
      const parsedData = JSON.parse(savedJSON);
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        // Perform migration on each item to ensure data integrity
        return parsedData.map(emp => ({
          id: emp.id || String(Date.now() + Math.random()),
          name: emp.name || 'Unnamed',
          department: emp.department || Department.OFFICE,
          timeOff: emp.timeOff || [],
        }));
      }
    } catch (error) {
      console.error(
        'Failed to parse employees from localStorage, falling back to default:',
        error
      );
      // Fall through to return default employee if parsing fails
    }
  }

  // Fallback for no data, invalid data, or parsing errors.
  return [defaultEmployee];
};

// --- Helper Components ---

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const UserPlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

interface TimeOffSelectorProps {
  onSelect: (type: TimeOffType | null) => void;
  onClose: () => void;
  position: { top: number; left: number };
}

const TimeOffSelector: React.FC<TimeOffSelectorProps> = ({
  onSelect,
  onClose,
  position,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{ top: position.top, left: position.left }}
      className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 flex flex-col gap-1"
    >
      {Object.values(TimeOffType).map(type => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200`}
        >
          {TIME_OFF_TYPE_DETAILS[type].label}
        </button>
      ))}
      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
      <button
        onClick={() => onSelect(null)}
        className="w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
      >
        Löschen
      </button>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>(getInitialEmployees);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeDepartment, setNewEmployeeDepartment] =
    useState<Department>(Department.OFFICE);
  const [popover, setPopover] = useState<{
    position: { top: number; left: number };
    employeeId: string;
    date: string;
  } | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const todayStr = useMemo(() => formatDate(new Date()), []);

  const currentYear = currentDate.getFullYear();

  const yearData = useMemo(() => {
    const data = HOLIDAY_DATA[currentYear] || {
      publicHolidays: [],
      schoolHolidays: [],
    };
    const prevYearData = HOLIDAY_DATA[currentYear - 1] || {
      publicHolidays: [],
      schoolHolidays: [],
    };

    const schoolHolidays = [...data.schoolHolidays];
    prevYearData.schoolHolidays.forEach(period => {
      const endDate = new Date(period.endDate + 'T00:00:00Z');
      if (endDate.getUTCFullYear() === currentYear) {
        schoolHolidays.push(period);
      }
    });

    return { ...data, schoolHolidays };
  }, [currentYear]);

  const { publicHolidays, schoolHolidays } = yearData;

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  useLayoutEffect(() => {
    const today = new Date();
    if (
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth()
    ) {
      const container = scrollContainerRef.current;
      const todayCell = document.getElementById(`header-day-${todayStr}`);

      if (container && todayCell) {
        const stickyColumnWidth = 150; // Corresponds to grid-cols-[150px_...]
        const viewportCenter =
          stickyColumnWidth + (container.offsetWidth - stickyColumnWidth) / 2;
        const cellCenter = todayCell.offsetLeft + todayCell.offsetWidth / 2;

        const scrollLeft = cellCenter - viewportCenter;

        container.scrollTo({
          left: scrollLeft,
          behavior: 'auto',
        });
      }
    }
  }, [currentDate, employees, todayStr]);

  const holidayData = useMemo(() => {
    const publicHolidayMap = new Map<string, string>();
    publicHolidays.forEach(h => {
      if (new Date(h.date + 'T00:00:00Z').getUTCFullYear() === currentYear) {
        publicHolidayMap.set(h.date, h.name);
      }
    });

    const schoolHolidayMap = new Map<string, string>();
    schoolHolidays.forEach(period => {
      const current = new Date(period.startDate + 'T00:00:00Z');
      const end = new Date(period.endDate + 'T00:00:00Z');
      while (current <= end) {
        if (current.getUTCFullYear() === currentYear) {
          if (!isWeekend(current)) {
            schoolHolidayMap.set(formatDate(current), period.name);
          }
        }
        current.setUTCDate(current.getUTCDate() + 1);
      }
    });
    return { publicHolidayMap, schoolHolidayMap };
  }, [publicHolidays, schoolHolidays, currentYear]);

  const sortedEmployees = useMemo(() => {
    return [...employees].sort((a, b) => {
      const departmentOrder = {
        [Department.OFFICE]: 1,
        [Department.SHIPPING]: 2,
      };
      const aDept = a.department || Department.OFFICE;
      const bDept = b.department || Department.OFFICE;

      if (departmentOrder[aDept] !== departmentOrder[bDept]) {
        return departmentOrder[aDept] - departmentOrder[bDept];
      }
      return a.name.localeCompare(b.name);
    });
  }, [employees]);

  // Memoize expensive calculations - currently unused but ready for optimization
  // const employeeTimeOffMaps = useMemo(() => {
  //     return new Map(
  //         employees.map(emp => [
  //             emp.id,
  //             new Map(emp.timeOff.map(t => [t.date, t.type]))
  //         ])
  //     );
  // }, [employees]);

  const departmentOrder = useMemo(
    () => [Department.OFFICE, Department.SHIPPING],
    []
  );
  const employeesByDepartment = useMemo(() => {
    const grouped = new Map<Department, Employee[]>();
    departmentOrder.forEach(dep => grouped.set(dep, []));

    sortedEmployees.forEach(emp => {
      grouped.get(emp.department)?.push(emp);
    });

    return grouped;
  }, [sortedEmployees, departmentOrder]);

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmployeeName.trim()) {
      setEmployees([
        ...employees,
        {
          id: Date.now().toString(),
          name: newEmployeeName.trim(),
          department: newEmployeeDepartment,
          timeOff: [],
        },
      ]);
      setNewEmployeeName('');
    }
  };

  const handleDeleteEmployee = (id: string) => {
    const confirmMessage =
      employees.length === 1
        ? 'Dies ist der letzte Mitarbeiter. Möchten Sie die Liste wirklich leeren?'
        : 'Mitarbeiter wirklich löschen?';
    if (window.confirm(confirmMessage)) {
      setEmployees(currentEmployees =>
        currentEmployees.filter(emp => emp.id !== id)
      );
    }
  };

  const handleUpdateTimeOff = (
    employeeId: string,
    date: string,
    type: TimeOffType | null
  ) => {
    setEmployees(emps =>
      emps.map(emp => {
        if (emp.id === employeeId) {
          const updatedTimeOff = emp.timeOff.filter(t => t.date !== date);
          if (type !== null) {
            updatedTimeOff.push({ date, type });
          }
          return { ...emp, timeOff: updatedTimeOff };
        }
        return emp;
      })
    );
    setPopover(null);
  };

  const handleCellClick = (
    e: React.MouseEvent<HTMLDivElement>,
    employeeId: string,
    date: string,
    isClickable: boolean
  ) => {
    if (!isClickable) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPopover({
      position: { top: rect.top, left: rect.left },
      employeeId,
      date,
    });
  };

  const daysInMonth = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const monthName = GERMAN_MONTH_NAMES[currentDate.getMonth()];

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      {popover && (
        <TimeOffSelector
          position={popover.position}
          onClose={() => setPopover(null)}
          onSelect={type =>
            handleUpdateTimeOff(popover.employeeId, popover.date, type)
          }
        />
      )}
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Team Urlaubsplaner
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Rheinland-Pfalz (2025 & 2026)
          </p>
        </header>

        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Vorheriger Monat"
              data-test-id="prev-month-button"
            >
              <ChevronLeftIcon />
            </button>
            <h2 className="text-xl font-semibold w-48 text-center">
              {monthName} {currentYear}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRightIcon />
            </button>
          </div>
          <form
            onSubmit={handleAddEmployee}
            className="flex items-center gap-2 flex-wrap"
          >
            <input
              type="text"
              value={newEmployeeName}
              onChange={e => setNewEmployeeName(e.target.value)}
              placeholder="Neuer Mitarbeiter"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              value={newEmployeeDepartment}
              onChange={e =>
                setNewEmployeeDepartment(e.target.value as Department)
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={Department.OFFICE}>{Department.OFFICE}</option>
              <option value={Department.SHIPPING}>{Department.SHIPPING}</option>
            </select>
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <UserPlusIcon className="w-5 h-5" />
            </button>
          </form>
        </div>

        {!(currentYear in HOLIDAY_DATA) ? (
          <div className="flex justify-center items-center p-16 bg-white dark:bg-gray-800 rounded-lg shadow">
            <span className="text-lg text-center">
              Für das Jahr {currentYear} sind keine Feiertagsdaten hinterlegt.
              <br />
              Bitte wählen Sie 2025 oder 2026.
            </span>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center p-16 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">
              Keine Mitarbeiter vorhanden
            </h3>
            <p className="text-gray-500">
              Fügen Sie Ihren ersten Mitarbeiter hinzu, um mit der Planung zu
              beginnen.
            </p>
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <div className="min-w-[1200px]">
              <div className="grid grid-cols-[150px_repeat(31,minmax(0,1fr))] sticky top-0 z-20">
                <div className="p-2 border-r border-b border-gray-200 dark:border-gray-600 font-semibold text-sm sticky left-0 bg-gray-100 dark:bg-gray-700 z-20">
                  Mitarbeiter
                </div>
                {daysInMonth.map(day => {
                  const isToday = formatDate(day) === todayStr;
                  return (
                    <div
                      key={day.toISOString()}
                      id={isToday ? `header-day-${todayStr}` : undefined}
                      className={`text-center p-1 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 ${isWeekend(day) ? 'bg-gray-100 dark:bg-gray-600' : ''} ${isToday ? 'bg-blue-200 dark:bg-blue-800/50' : ''}`}
                    >
                      <span
                        className={`text-xs ${isToday ? 'text-blue-800 dark:text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}
                      >
                        {GERMAN_DAY_NAMES_SHORT[day.getUTCDay()]}
                      </span>
                      <div
                        className={`font-semibold text-sm ${isToday ? 'text-blue-900 dark:text-white' : ''}`}
                      >
                        {day.getUTCDate()}
                      </div>
                    </div>
                  );
                })}
                {Array.from({ length: 31 - daysInMonth.length }).map((_, i) => (
                  <div
                    key={`filler-${i}`}
                    className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                  ></div>
                ))}
              </div>

              {departmentOrder.map(department => {
                const departmentEmployees =
                  employeesByDepartment.get(department);
                if (!departmentEmployees || departmentEmployees.length === 0) {
                  return null;
                }
                return (
                  <React.Fragment key={department}>
                    <div className="grid grid-cols-[150px_repeat(31,minmax(0,1fr))]">
                      <div className="p-1.5 border-y border-r border-gray-300 dark:border-gray-600 font-semibold text-sm bg-gray-100 dark:bg-gray-700 z-10 text-left pl-4 sticky left-0">
                        {department}
                      </div>
                      <div className="col-span-31 border-y border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"></div>
                    </div>
                    {departmentEmployees.map(emp => {
                      const timeOffMap = new Map(
                        emp.timeOff.map(t => [t.date, t.type])
                      );
                      return (
                        <div
                          key={emp.id}
                          className="grid grid-cols-[150px_repeat(31,minmax(0,1fr))]"
                        >
                          <div className="p-2 border-r border-gray-200 dark:border-gray-600 font-semibold text-sm flex items-center justify-between group sticky left-0 bg-white dark:bg-gray-800 z-10">
                            <span className="truncate" title={emp.name}>
                              {emp.name}
                            </span>
                            <button
                              onClick={() => handleDeleteEmployee(emp.id)}
                              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                          {daysInMonth.map(day => {
                            const dateStr = formatDate(day);
                            const timeOffType = timeOffMap.get(dateStr) as
                              | TimeOffType
                              | undefined;
                            const isPublicHoliday =
                              holidayData.publicHolidayMap.has(dateStr);
                            const isSchoolHoliday =
                              holidayData.schoolHolidayMap.has(dateStr);
                            const weekend = isWeekend(day);
                            const isToday = dateStr === todayStr;

                            let cellClass =
                              'border-r border-gray-200 dark:border-gray-600 h-10 relative transition-colors';
                            let tooltipText = '';
                            const isClickable = !weekend;

                            if (
                              timeOffType &&
                              TIME_OFF_TYPE_DETAILS[timeOffType]
                            ) {
                              cellClass += ` ${TIME_OFF_TYPE_DETAILS[timeOffType].color}`;
                              tooltipText =
                                TIME_OFF_TYPE_DETAILS[timeOffType].label;
                            } else if (isPublicHoliday) {
                              cellClass += ' bg-red-200 dark:bg-red-900/50';
                              tooltipText =
                                holidayData.publicHolidayMap.get(dateStr) ||
                                'Feiertag';
                            } else if (isSchoolHoliday) {
                              cellClass +=
                                ' bg-purple-200 dark:bg-purple-900/50';
                              tooltipText =
                                holidayData.schoolHolidayMap.get(dateStr) ||
                                'Schulferien';
                            } else if (weekend) {
                              cellClass += ' bg-gray-100 dark:bg-gray-700/50';
                            }

                            if (isClickable) {
                              cellClass +=
                                ' cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700';
                            } else {
                              cellClass += ' cursor-not-allowed';
                            }

                            if (isToday) {
                              cellClass += ' ring-2 ring-blue-500 ring-inset';
                            }

                            return (
                              <div
                                key={dateStr}
                                className={cellClass}
                                title={tooltipText}
                                onClick={e =>
                                  handleCellClick(
                                    e,
                                    emp.id,
                                    dateStr,
                                    isClickable
                                  )
                                }
                              >
                                {popover?.employeeId === emp.id &&
                                  popover?.date === dateStr && (
                                    <div className="absolute inset-0 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800"></div>
                                  )}
                              </div>
                            );
                          })}
                          {Array.from({ length: 31 - daysInMonth.length }).map(
                            (_, i) => (
                              <div
                                key={`filler-${i}`}
                                className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-600"
                              ></div>
                            )
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <h3 className="font-semibold mr-4">Legende:</h3>
          {Object.values(TIME_OFF_TYPE_DETAILS).map(detail => (
            <div key={detail.label} className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full ${detail.color}`}></span>
              <span>{detail.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-red-200 dark:bg-red-900/50 border border-red-300 dark:border-red-800"></span>
            <span>Gesetzl. Feiertag</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-purple-200 dark:bg-purple-900/50 border border-purple-300 dark:border-purple-800"></span>
            <span>Schulferien</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600"></span>
            <span>Wochenende</span>
          </div>
        </div>
      </div>
    </div>
  );
}
