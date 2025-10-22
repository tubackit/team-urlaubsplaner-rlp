import { Employee } from '../../types';

export const exportToCSV = (employees: Employee[], year: number) => {
  const headers = ['Mitarbeiter', 'Abteilung', 'Datum', 'Typ'];
  const rows = [headers];

  employees.forEach(emp => {
    emp.timeOff.forEach(timeOff => {
      rows.push([emp.name, emp.department, timeOff.date, timeOff.type]);
    });
  });

  const csvContent = rows
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `urlaubsplaner-${year}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (employees: Employee[], year: number) => {
  const data = {
    year,
    exportDate: new Date().toISOString(),
    employees: employees.map(emp => ({
      ...emp,
      timeOffCount: emp.timeOff.length,
    })),
  };

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `urlaubsplaner-${year}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateReport = (employees: Employee[], year: number) => {
  const stats = {
    totalEmployees: employees.length,
    totalTimeOff: employees.reduce((sum, emp) => sum + emp.timeOff.length, 0),
    byType: {} as Record<string, number>,
    byDepartment: {} as Record<string, number>,
  };

  employees.forEach(emp => {
    // Count by department
    stats.byDepartment[emp.department] =
      (stats.byDepartment[emp.department] || 0) + 1;

    // Count by time off type
    emp.timeOff.forEach(timeOff => {
      stats.byType[timeOff.type] = (stats.byType[timeOff.type] || 0) + 1;
    });
  });

  return {
    year,
    generatedAt: new Date().toISOString(),
    statistics: stats,
    employees: employees.map(emp => ({
      name: emp.name,
      department: emp.department,
      timeOffCount: emp.timeOff.length,
      timeOff: emp.timeOff,
    })),
  };
};
