import { Employee } from '../../types';

// TypeScript RequestInit type
interface RequestInit {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getEmployees(): Promise<Employee[]> {
    return this.request<Employee[]>('/api/employees');
  }

  async addEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
    return this.request<Employee>('/api/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  }

  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
    return this.request<Employee>(`/api/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteEmployee(id: string): Promise<void> {
    return this.request<void>(`/api/employees/${id}`, {
      method: 'DELETE',
    });
  }

  async addTimeOff(employeeId: string, date: string, type: string): Promise<Employee> {
    return this.request<Employee>(`/api/employees/${employeeId}/timeoff`, {
      method: 'POST',
      body: JSON.stringify({ date, type }),
    });
  }

  async removeTimeOff(employeeId: string, date: string): Promise<Employee> {
    return this.request<Employee>(`/api/employees/${employeeId}/timeoff/${date}`, {
      method: 'DELETE',
    });
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/api/health');
  }
}

export const apiService = new ApiService();
