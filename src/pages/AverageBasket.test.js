import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import AverageBasket from './AverageBasket';

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
jest.mock('recharts', () => ({
  BarChart: () => <div data-testid="bar-chart" />,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

describe('AverageBasket Component', () => {
  const mockData = [
    { csp_lbl: 'Employes', cat_achat: 1, montant_achat: '100', qte_article: '2', date_collecte: '2023-01-01' },
    { csp_lbl: 'Commercants', cat_achat: 2, montant_achat: '200', qte_article: '3', date_collecte: '2023-02-01' },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockData });
  });

  test('renders without crashing', async () => {
    await render(
      <MemoryRouter>
        <AverageBasket />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByText(/Somme des paniers moyens par catégorie/i)).toBeInTheDocument();
    });
  });

  test('displays loading state', async () => {
    axios.get.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({ data: mockData }), 100)));
    render(
      <MemoryRouter>
        <AverageBasket />
      </MemoryRouter>
    );
    expect(screen.getByText(/Chargement.../i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/Chargement.../i)).not.toBeInTheDocument();
    });
  });

  test('displays charts after data loads', async () => {
    await render(
      <MemoryRouter>
        <AverageBasket />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getAllByTestId('bar-chart')).toHaveLength(3);
      expect(screen.getByText(/Panier moyen par mois/i)).toBeInTheDocument();
      expect(screen.getByText(/Panier moyen par CSP/i)).toBeInTheDocument();
    });
  });

  test('displays filter form', async () => {
    await render(
      <MemoryRouter>
        <AverageBasket />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('filter-form')).toBeInTheDocument();
    });
  });

  test('displays number of selected rows', async () => {
    await render(
      <MemoryRouter>
        <AverageBasket />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Nombre de lignes sélectionnées : 2/i)).toBeInTheDocument();
    });
  });

  test('displays export to Excel button', async () => {
    await render(
      <MemoryRouter>
        <AverageBasket />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Exporter vers Excel/i)).toBeInTheDocument();
    });
  });
});