import { useState, useEffect, useCallback } from 'react';
import { Employee, Department, TimeOffType } from '../../types';

const STORAGE_KEY = 'employees';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load employees from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setEmployees(parsed);
        }
      }
    } catch (err) {
      setError('Fehler beim Laden der Mitarbeiterdaten');
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save employees to localStorage
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
      } catch (err) {
        setError('Fehler beim Speichern der Mitarbeiterdaten');
        console.error('Error saving employees:', err);
      }
    }
  }, [employees, loading]);

  const addEmployee = useCallback((name: string, department: Department) => {
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: name.trim(),
      department,
      timeOff: [],
    };
    setEmployees(prev => [...prev, newEmployee]);
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  }, []);

  const updateEmployee = useCallback(
    (id: string, updates: Partial<Employee>) => {
      setEmployees(prev =>
        prev.map(emp => (emp.id === id ? { ...emp, ...updates } : emp))
      );
    },
    []
  );

  const addTimeOff = useCallback(
    (employeeId: string, date: string, type: string) => {
      setEmployees(prev =>
        prev.map(emp => {
          if (emp.id === employeeId) {
            const updatedTimeOff = emp.timeOff.filter(t => t.date !== date);
            updatedTimeOff.push({ date, type: type as TimeOffType });
            return { ...emp, timeOff: updatedTimeOff };
          }
          return emp;
        })
      );
    },
    []
  );

  const removeTimeOff = useCallback((employeeId: string, date: string) => {
    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            timeOff: emp.timeOff.filter(t => t.date !== date),
          };
        }
        return emp;
      })
    );
  }, []);

  return {
    employees,
    loading,
    error,
    addEmployee,
    deleteEmployee,
    updateEmployee,
    addTimeOff,
    removeTimeOff,
  };
};
