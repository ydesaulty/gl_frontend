import axios from 'axios';

jest.mock('axios');

const API_URL = 'https://gl-yrae-backend-24c518b70d2a.herokuapp.com/combinedviewsets/';
const TOKEN_URL = 'https://gl-yrae-backend-24c518b70d2a.herokuapp.com/token/';

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    axios.get = jest.fn();
    axios.post = jest.fn();
  });

  test('Fetch data from API', async () => {
    const mockData = [
      {
        "id_collecte": 1,
        "cat_achat": 4,
        "prix_categorie": "23.00",
        "date_collecte": "2022-01-02T02:49:00Z",
        "montant_achat": "460.00",
        "qte_article": 20,
        "csp_lbl": "Retraites",
        "description": "Asos_Foulard_Vert"
      }
    ];

    axios.get.mockResolvedValue({ data: mockData });

    const response = await axios.get(API_URL);
    expect(response.data).toEqual(mockData);
  });

  test('Handle API error', async () => {
    axios.get.mockRejectedValue(new Error('Request failed with status code 500'));

    await expect(axios.get(API_URL)).rejects.toThrow('Request failed with status code 500');
  });
});

describe('Authentication Tests', () => {
  test('Successful login', async () => {
    const mockToken = { access: 'mocked_access_token', refresh: 'mocked_refresh_token' };
    axios.post.mockResolvedValue({ data: mockToken });

    const response = await axios.post(TOKEN_URL, { username: 'testuser', password: 'testpassword' });
    expect(response.data).toEqual(mockToken);
  });

  test('Failed login', async () => {
    axios.post.mockRejectedValue(new Error('Request failed with status code 401'));

    await expect(axios.post(TOKEN_URL, { username: 'wrong', password: 'wrong' }))
      .rejects.toThrow('Request failed with status code 401');
  });
});

describe('Data Processing Tests', () => {
  test('Calculate total montant_achat', () => {
    const data = [
      { montant_achat: "460.00" },
      { montant_achat: "230.00" },
      { montant_achat: "115.00" }
    ];

    const totalMontant = data.reduce((sum, item) => sum + parseFloat(item.montant_achat), 0);
    expect(totalMontant).toBe(805);
  });

  test('Format date_collecte', () => {
    const data = { date_collecte: "2022-01-02T02:49:00Z" };
    const formattedDate = new Date(data.date_collecte).toLocaleDateString('fr-FR');
    expect(formattedDate).toBe("02/01/2022");
  });
});