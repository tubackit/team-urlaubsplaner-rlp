import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
// import { promisify } from 'util'; // Currently unused

export class Database {
  constructor() {
    this.db = null;
    this.init();
  }

  async init() {
    try {
      this.db = await open({
        filename: './vacation_planner.db',
        driver: sqlite3.Database
      });

      // Create tables
      await this.createTables();
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  async createTables() {
    // Employees table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS employees (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        timeOff TEXT DEFAULT '[]',
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

    // Time off entries table (for better querying)
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS timeoff_entries (
        id TEXT PRIMARY KEY,
        employeeId TEXT NOT NULL,
        date TEXT NOT NULL,
        type TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (employeeId) REFERENCES employees (id) ON DELETE CASCADE
      )
    `);

    // User sessions for real-time collaboration
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        lastActivity TEXT NOT NULL,
        isActive INTEGER DEFAULT 1
      )
    `);

    // Create indexes for better performance
    await this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_timeoff_employee_date 
      ON timeoff_entries(employeeId, date)
    `);

    await this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_employees_department 
      ON employees(department)
    `);
  }

  async getEmployees() {
    const employees = await this.db.all(`
      SELECT 
        e.id,
        e.name,
        e.department,
        e.createdAt,
        e.updatedAt,
        json_group_array(
          json_object('date', t.date, 'type', t.type)
        ) as timeOff
      FROM employees e
      LEFT JOIN timeoff_entries t ON e.id = t.employeeId
      GROUP BY e.id, e.name, e.department, e.createdAt, e.updatedAt
      ORDER BY e.department, e.name
    `);

    return employees.map(emp => ({
      ...emp,
      timeOff: emp.timeOff[0] ? JSON.parse(emp.timeOff) : []
    }));
  }

  async addEmployee(employee) {
    const now = new Date().toISOString();
    
    await this.db.run(`
      INSERT INTO employees (id, name, department, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?)
    `, [employee.id, employee.name, employee.department, now, now]);

    return { ...employee, createdAt: now, updatedAt: now };
  }

  async updateEmployee(id, updates) {
    const now = new Date().toISOString();
    const setClause = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = [...Object.values(updates), now, id];
    
    await this.db.run(`
      UPDATE employees 
      SET ${setClause}, updatedAt = ?
      WHERE id = ?
    `, values);

    const updated = await this.db.get(
      'SELECT * FROM employees WHERE id = ?',
      [id]
    );

    return updated;
  }

  async deleteEmployee(id) {
    await this.db.run('DELETE FROM employees WHERE id = ?', [id]);
  }

  async addTimeOff(employeeId, date, type) {
    const timeOffId = require('uuid').v4();
    const now = new Date().toISOString();

    await this.db.run(`
      INSERT INTO timeoff_entries (id, employeeId, date, type, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `, [timeOffId, employeeId, date, type, now]);

    // Update employee's updatedAt timestamp
    await this.db.run(`
      UPDATE employees SET updatedAt = ? WHERE id = ?
    `, [now, employeeId]);

    return await this.getEmployee(employeeId);
  }

  async removeTimeOff(employeeId, date) {
    await this.db.run(`
      DELETE FROM timeoff_entries 
      WHERE employeeId = ? AND date = ?
    `, [employeeId, date]);

    // Update employee's updatedAt timestamp
    const now = new Date().toISOString();
    await this.db.run(`
      UPDATE employees SET updatedAt = ? WHERE id = ?
    `, [now, employeeId]);

    return await this.getEmployee(employeeId);
  }

  async getEmployee(id) {
    const employee = await this.db.get(`
      SELECT 
        e.id,
        e.name,
        e.department,
        e.createdAt,
        e.updatedAt,
        json_group_array(
          json_object('date', t.date, 'type', t.type)
        ) as timeOff
      FROM employees e
      LEFT JOIN timeoff_entries t ON e.id = t.employeeId
      WHERE e.id = ?
      GROUP BY e.id, e.name, e.department, e.createdAt, e.updatedAt
    `, [id]);

    if (!employee) return null;

    return {
      ...employee,
      timeOff: employee.timeOff[0] ? JSON.parse(employee.timeOff) : []
    };
  }

  async getActiveUsers() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    return await this.db.all(`
      SELECT * FROM user_sessions 
      WHERE lastActivity > ? AND isActive = 1
      ORDER BY lastActivity DESC
    `, [fiveMinutesAgo]);
  }

  async updateUserActivity(userId) {
    const now = new Date().toISOString();
    
    await this.db.run(`
      INSERT OR REPLACE INTO user_sessions (id, userId, lastActivity, isActive)
      VALUES (?, ?, ?, 1)
    `, [userId, userId, now]);
  }

  async setUserInactive(userId) {
    await this.db.run(`
      UPDATE user_sessions 
      SET isActive = 0 
      WHERE userId = ?
    `, [userId]);
  }

  // Cleanup old sessions (run periodically)
  async cleanupOldSessions() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    await this.db.run(`
      DELETE FROM user_sessions 
      WHERE lastActivity < ?
    `, [oneHourAgo]);
  }
}
