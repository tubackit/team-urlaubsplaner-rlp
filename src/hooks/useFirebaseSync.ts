import { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp,
  getDocs,
  where
} from 'firebase/firestore';
import { db } from '../services/firebaseService';
import { Employee, TimeOffType } from '../types';

interface FirebaseEmployee extends Omit<Employee, 'id'> {
  id?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

interface FirebaseTimeOff {
  id?: string;
  employeeId: string;
  date: string;
  type: TimeOffType;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export const useFirebaseSync = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timeOffRecords, setTimeOffRecords] = useState<Record<string, Record<string, TimeOffType>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const unsubscribeRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    // Subscribe to employees
    const employeesQuery = query(collection(db, 'employees'), orderBy('name'));
    const unsubscribeEmployees = onSnapshot(
      employeesQuery,
      (snapshot) => {
        const employeesData: Employee[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as FirebaseEmployee;
          employeesData.push({
            id: doc.id,
            name: data.name,
            department: data.department,
            email: data.email,
            phone: data.phone,
            startDate: data.startDate,
            vacationDays: data.vacationDays,
            sickDays: data.sickDays,
            personalDays: data.personalDays
          });
        });
        setEmployees(employeesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching employees:', error);
        setError('Failed to fetch employees');
        setLoading(false);
      }
    );

    // Subscribe to time off records
    const timeOffQuery = query(collection(db, 'timeOff'), orderBy('date'));
    const unsubscribeTimeOff = onSnapshot(
      timeOffQuery,
      (snapshot) => {
        const timeOffData: Record<string, Record<string, TimeOffType>> = {};
        
        snapshot.forEach((doc) => {
          const data = doc.data() as FirebaseTimeOff;
          if (!timeOffData[data.employeeId]) {
            timeOffData[data.employeeId] = {};
          }
          timeOffData[data.employeeId][data.date] = data.type;
        });
        
        setTimeOffRecords(timeOffData);
      },
      (error) => {
        console.error('Error fetching time off records:', error);
        setError('Failed to fetch time off records');
      }
    );

    unsubscribeRef.current = [unsubscribeEmployees, unsubscribeTimeOff];

    return () => {
      unsubscribeRef.current.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  const addEmployee = async (employee: Omit<Employee, 'id'>) => {
    try {
      await addDoc(collection(db, 'employees'), {
        ...employee,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error;
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      const employeeRef = doc(db, 'employees', id);
      await updateDoc(employeeRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'employees', id));
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  };

  const addTimeOff = async (employeeId: string, date: string, type: TimeOffType) => {
    try {
      await addDoc(collection(db, 'timeOff'), {
        employeeId,
        date,
        type,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding time off:', error);
      throw error;
    }
  };

  const removeTimeOff = async (employeeId: string, date: string) => {
    try {
      // Find the time off record to delete
      const timeOffQuery = query(
        collection(db, 'timeOff'),
        where('employeeId', '==', employeeId),
        where('date', '==', date)
      );
      
      const querySnapshot = await getDocs(timeOffQuery);
      
      // Delete all matching documents
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      console.log('Time off removed:', { employeeId, date });
    } catch (error) {
      console.error('Error removing time off:', error);
      throw error;
    }
  };

  return {
    employees,
    timeOffRecords,
    loading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addTimeOff,
    removeTimeOff
  };
};
