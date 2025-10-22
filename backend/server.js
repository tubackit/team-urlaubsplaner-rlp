import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Database } from './database.js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Initialize database
const db = new Database();

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/employees', async (req, res) => {
  try {
    const employees = await db.getEmployees();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const { name, department } = req.body;
    const employee = {
      id: uuidv4(),
      name,
      department,
      timeOff: [],
      createdAt: new Date().toISOString()
    };
    
    await db.addEmployee(employee);
    
    // Broadcast to all connected clients
    io.emit('employee_added', employee);
    
    res.status(201).json(employee);
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Failed to add employee' });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedEmployee = await db.updateEmployee(id, updates);
    
    // Broadcast to all connected clients
    io.emit('employee_updated', updatedEmployee);
    
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.deleteEmployee(id);
    
    // Broadcast to all connected clients
    io.emit('employee_deleted', { id });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

app.post('/api/employees/:id/timeoff', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, type } = req.body;
    
    const updatedEmployee = await db.addTimeOff(id, date, type);
    
    // Broadcast to all connected clients
    io.emit('timeoff_updated', { employeeId: id, date, type });
    
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error adding time off:', error);
    res.status(500).json({ error: 'Failed to add time off' });
  }
});

app.delete('/api/employees/:id/timeoff/:date', async (req, res) => {
  try {
    const { id, date } = req.params;
    
    const updatedEmployee = await db.removeTimeOff(id, date);
    
    // Broadcast to all connected clients
    io.emit('timeoff_removed', { employeeId: id, date });
    
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error removing time off:', error);
    res.status(500).json({ error: 'Failed to remove time off' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Join a room for real-time updates
  socket.join('vacation-planner');
  
  // Handle user activity
  socket.on('user_activity', (data) => {
    // Broadcast to other users that someone is active
    socket.broadcast.to('vacation-planner').emit('user_active', {
      userId: socket.id,
      activity: data.activity,
      timestamp: new Date().toISOString()
    });
  });
  
  // Handle collaborative editing
  socket.on('cell_edit', (data) => {
    // Broadcast to other users
    socket.broadcast.to('vacation-planner').emit('cell_edited', data);
  });
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    // Notify other users
    socket.broadcast.to('vacation-planner').emit('user_disconnected', {
      userId: socket.id
    });
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database initialized`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
