import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock des composants de routage
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}));

// Mock des composants enfants
jest.mock('./components/home', () => ({
  Home: () => <div>Home Component</div>
}));
jest.mock('./components/navigation', () => ({
  Navigation: () => <div>Navigation Component</div>
}));

test('renders app with navigation', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Navigation Component/i)).toBeInTheDocument();
});

test('renders home page by default', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Home Component/i)).toBeInTheDocument();
});