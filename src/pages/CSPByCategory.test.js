import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import CSPByCategory from './CSPByCategory';

// Mock des modules externes
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));
jest.mock('../components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('../components/FilterForm', () => ({ onFilterChange }) => (
  <div data-testid="filter-form">Filter Form</div>
));
jest.mock('../components/exportToExcel', () => ({ exportToExcel: jest.fn() }));

// Mock de recharts
jest.mock('recharts', () => ({
  BarChart: () => <div data-testid="bar-chart" />,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

describe('CSPByCategory Component', () => {
  const mockData = [
    { csp_lbl: 'Employes', cat_achat: '1', montant_achat: '100', qte_article: '2', date_collecte: '2023-01-01' },
    { csp_lbl: 'Commercants', cat_achat: '2', montant_achat: '200', qte_article: '3', date_collecte: '2023-02-01' },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockData });
  });

  test('renders without crashing', async () => {
    await render(
      <MemoryRouter>
        <CSPByCategory />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByText(/Montants d'achat par Catégorie/i)).toBeInTheDocument();
    });
  });

  test('displays chart and table after data loads', async () => {
    await render(
      <MemoryRouter>
        <CSPByCategory />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  test('displays filter form', async () => {
    await render(
      <MemoryRouter>
        <CSPByCategory />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('filter-form')).toBeInTheDocument();
    });
  });

  test('displays number of selected rows', async () => {
    await render(
      <MemoryRouter>
        <CSPByCategory />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Nombre de lignes sélectionnées : 2/i)).toBeInTheDocument();
    });
  });

  test('displays export to Excel button', async () => {
    await render(
      <MemoryRouter>
        <CSPByCategory />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Exporter vers Excel/i)).toBeInTheDocument();
    });
  });

  test('shows loading state', async () => {
    let resolvePromise;
    axios.get.mockReturnValueOnce(new Promise(resolve => {
      resolvePromise = resolve;
    }));

    render(
      <MemoryRouter>
        <CSPByCategory />
      </MemoryRouter>
    );

    expect(screen.getByText(/Chargement.../i)).toBeInTheDocument();

    resolvePromise({ data: mockData });

    await waitFor(() => {
      expect(screen.queryByText(/Chargement.../i)).not.toBeInTheDocument();
    });
  });
});