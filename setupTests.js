import '@testing-library/jest-dom';
import 'jest-styled-components';

jest.mock('styled-components', () => {
  return {
    default: jest.fn((strings, ...args) => (...props) => ({
      className: strings[0].trim(),
    })),
    createGlobalStyle: jest.fn(),
    css: jest.fn(),
  };
});