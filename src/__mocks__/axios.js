const mockJwtToken = 'fake_jwt_token';

const axiosMock = {
  get: jest.fn((url, config) => {
    if (config && config.headers && config.headers['Authorization'] === `Bearer ${mockJwtToken}`) {
      return Promise.resolve({
        data: [
          { csp_lbl: 'CSP1', cat_achat: 'Cat1', montant_achat: '100', qte_article: '2', date_collecte: '2023-01-01' },
          { csp_lbl: 'CSP2', cat_achat: 'Cat2', montant_achat: '200', qte_article: '3', date_collecte: '2023-02-01' },
        ]
      });
    } else {
      return Promise.reject(new Error('Authentication failed'));
    }
  }),
};

module.exports = axiosMock;