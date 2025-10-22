import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Mock Firebase
vi.mock('../src/hooks/useFirebaseSync', () => ({
  useFirebaseSync: () => ({
    employees: [
      {
        id: '1',
        name: 'Max Mustermann',
        department: 'OFFICE',
        timeOff: [],
      },
    ],
    timeOffRecords: {},
    loading: false,
    addEmployee: vi.fn(),
    updateEmployee: vi.fn(),
    deleteEmployee: vi.fn(),
    addTimeOff: vi.fn(),
    removeTimeOff: vi.fn(),
  }),
}));

// Mock the constants
vi.mock('../constants', () => ({
  GERMAN_MONTH_NAMES: ['Januar', 'Februar', 'März'],
  GERMAN_DAY_NAMES_SHORT: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  TIME_OFF_TYPE_DETAILS: {
    VACATION: { label: 'Urlaub', color: 'bg-blue-500' },
    OVERTIME: { label: 'Überstundenfrei', color: 'bg-green-500' },
    SICK: { label: 'Krank', color: 'bg-orange-500' },
  },
  HOLIDAY_DATA: {
    2025: {
      publicHolidays: [{ date: '2025-01-01', name: 'Neujahr' }],
      schoolHolidays: [],
    },
  },
}));

describe('App', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders the main heading', () => {
    render(<App />);
    expect(screen.getByText('Team Urlaubsplaner')).toBeInTheDocument();
  });

  it('shows current month and year', () => {
    render(<App />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`${currentYear}`)).toBeInTheDocument();
  });

  it('allows adding a new employee', async () => {
    render(<App />);

    const nameInput = screen.getByPlaceholderText('Neuer Mitarbeiter');
    const addButton = screen
      .getAllByRole('button')
      .find(button => button.getAttribute('type') === 'submit');

    fireEvent.change(nameInput, { target: { value: 'Test Mitarbeiter' } });
    fireEvent.click(addButton!);

    await waitFor(() => {
      expect(screen.getByText('Test Mitarbeiter')).toBeInTheDocument();
    });
  });

  it('navigates between months', () => {
    render(<App />);

    const prevButton = screen.getByLabelText('Vorheriger Monat');
    const nextButton = screen
      .getAllByRole('button')
      .find(
        button =>
          !button.getAttribute('aria-label') &&
          !button.getAttribute('type') &&
          button.querySelector('svg')
      );

    fireEvent.click(prevButton);
    fireEvent.click(nextButton!);

    // Should not throw any errors
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('shows legend with time off types', () => {
    render(<App />);

    expect(screen.getByText('Legende:')).toBeInTheDocument();
    expect(screen.getByText('Urlaub')).toBeInTheDocument();
    expect(screen.getByText('Überstundenfrei')).toBeInTheDocument();
    expect(screen.getByText('Krank')).toBeInTheDocument();
  });
});
