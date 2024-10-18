import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import FilterForm from '../components/FilterForm';
import { exportToExcel } from '../components/exportToExcel';

const Peaktimes = () => {
  // Déclaration des états
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [crossTableData, setCrossTableData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cspList, setCspList] = useState([]);
  const [selectedRows, setSelectedRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [isAverageMode, setIsAverageMode] = useState(false);

  // Effet pour vérifier l'authentification et charger les données initiales
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await axios.get('https://gl-yrae-backend-24c518b70d2a.herokuapp.com/home/');
      } catch (error) {
        navigate('/login');
      }
    };

    checkAuthentication();
    fetchData();
  }, [navigate]);

  // Fonction pour récupérer les données depuis l'API
  const fetchData = async (appliedFilters = {}) => {
    setLoading(true);
    try {
      let url = 'https://gl-yrae-backend-24c518b70d2a.herokuapp.com/combinedviewsets/';
      const params = new URLSearchParams();

      // Application des filtres à l'URL
      if (appliedFilters.csp && appliedFilters.csp.length > 0) {
        params.append('id_client__id_csp__csp_lbl', appliedFilters.csp.map(c => c.value).join(','));
      }
      if (appliedFilters.category && appliedFilters.category.length > 0) {
        params.append('id_article__categorie_achat', appliedFilters.category.map(c => c.value).join(','));
      }
      if (appliedFilters.start_date) params.append('date_collecte__gte', appliedFilters.start_date);
      if (appliedFilters.end_date) params.append('date_collecte__lte', appliedFilters.end_date);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log("Fetching data with URL:", url);
      const response = await axios.get(url);
      setData(response.data);
      processData(response.data, appliedFilters);
      setSelectedRows(response.data.length);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour traiter les données récupérées
  const processData = (rawData, appliedFilters) => {
    console.log("Processing data:", rawData);
    const hourlyStats = Array(25).fill().map((_, index) => ({
      hour: index,
      revenue: 0
    }));

    const cspCategoryStats = {};
    const categorySet = new Set();
    const cspSet = new Set();

    // Tracking des transactions par heure et par CSP
    const hourlyTransactions = Array(25).fill().map(() => ({}));

    // Calcul du nombre de jours dans la période filtrée
    const startDate = appliedFilters.start_date ? new Date(appliedFilters.start_date) : null;
    const endDate = appliedFilters.end_date ? new Date(appliedFilters.end_date) : null;
    const numberOfDays = startDate && endDate ? 
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1 : 1;

    setIsAverageMode(numberOfDays > 1);

    // Traitement de chaque élément des données brutes
    rawData.forEach(item => {
      const hour = new Date(item.date_collecte).getHours();
      const csp = item.csp_lbl;

      if (!hourlyTransactions[hour][csp]) {
        hourlyTransactions[hour][csp] = new Set();
      }
      hourlyTransactions[hour][csp].add(item.id_collecte);

      hourlyStats[hour].revenue = (hourlyStats[hour].revenue || 0) + parseFloat(item.montant_achat);

      if (!cspCategoryStats[csp]) {
        cspCategoryStats[csp] = { total: 0 };
      }
      if (!cspCategoryStats[csp][item.cat_achat]) {
        cspCategoryStats[csp][item.cat_achat] = 0;
      }
      cspCategoryStats[csp][item.cat_achat] += parseFloat(item.montant_achat);
      cspCategoryStats[csp].total += parseFloat(item.montant_achat);

      categorySet.add(item.cat_achat);
      cspSet.add(csp);
    });

    // Calcul du nombre de passages par heure et par CSP (moyenne si nécessaire)
    hourlyStats.forEach((stat, hour) => {
      cspSet.forEach(csp => {
        const value = hourlyTransactions[hour][csp] ? hourlyTransactions[hour][csp].size : 0;
        stat[csp] = isAverageMode ? value / numberOfDays : value;
      });
      stat.revenue = isAverageMode ? stat.revenue / numberOfDays : stat.revenue;
    });

    console.log("Processed hourly stats:", hourlyStats);
    setHourlyData(hourlyStats);
    setCategories(Array.from(categorySet).sort((a, b) => a - b));
    setCspList(Array.from(cspSet));

    // Préparation des données pour le tableau croisé (toujours en somme)
    const crossTableRows = Object.keys(cspCategoryStats).map(csp => {
      const row = { csp };
      Array.from(categorySet).forEach(cat => {
        row[`cat_${cat}`] = cspCategoryStats[csp][cat] || 0;
      });
      row.total = cspCategoryStats[csp].total;
      return row;
    });

    setCrossTableData(crossTableRows);
  };

  // Gestion du changement de filtre
  const handleFilterChange = (newFilters) => {
    console.log("New filters applied:", newFilters);
    setFilters(newFilters);
    fetchData(newFilters);
  };

  // Affichage du chargement
  if (loading) {
    return <div>Chargement...</div>;
  }

  // Affichage des erreurs
  if (error) {
    return <div>Erreur : {error}</div>;
  }

  // Rendu du composant
  return (
    <div>
      <Navbar />
      <FilterForm onFilterChange={handleFilterChange} initialFilters={filters} />
      
      {/* Graphique de l'affluence par CSP et CA par heure */}
      <h2>{isAverageMode ? "Moyenne de l'" : ""}Affluence par CSP et par heure</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={hourlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="hour" 
            tickFormatter={(hour) => `${hour}h`}
            ticks={[0, 6, 12, 18, 24]}
          />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          {cspList.map((csp, index) => (
            <Bar
              key={csp}
              yAxisId="left"
              dataKey={csp}
              stackId="a"
              fill={`hsl(${index * 360 / cspList.length}, 70%, 50%)`}
              name={`${csp}`}
            />
          ))}
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="revenue" 
            stroke="#82ca9d" 
            name="CA" 
            dot={false}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Tableau du CA par CSP et catégorie d'achat (toujours en somme) */}
      <h2>CA total par CSP et catégorie d'achat</h2>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>CSP</th>
              {categories.map(cat => (
                <th key={cat}>Catégorie {cat}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {crossTableData.map((row, index) => (
              <tr key={index}>
                <td>{row.csp}</td>
                {categories.map(cat => (
                  <td key={cat}>{row[`cat_${cat}`].toFixed(2)}</td>
                ))}
                <td><strong>{row.total.toFixed(2)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Informations supplémentaires et bouton d'export */}
      <p>Nombre de lignes sélectionnées : {selectedRows}</p>
      <button onClick={() => exportToExcel(data, 'peaktimes_data')}>
        Exporter vers Excel
      </button>
    </div>
  );
};

export default Peaktimes;