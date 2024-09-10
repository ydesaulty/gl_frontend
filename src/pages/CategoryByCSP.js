import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import FilterForm from '../components/FilterForm';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { exportToExcel } from '../components/exportToExcel';

// Initialisation des états
const CategoryByCSP = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDataCompare, setFilteredDataCompare] = useState([]);
  const [aggregatedData, setAggregatedData] = useState([]);
  const [aggregatedDataCompare, setAggregatedDataCompare] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({});
  const [selectedRows, setSelectedRows] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalsCompare, setTotalsCompare] = useState(null);
  const [startDateCompare, setStartDateCompare] = useState('');
  const [endDateCompare, setEndDateCompare] = useState('');


  //Vérification de l'authentification
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await axios.get('https://gl-yrae-backend-24c518b70d2a.herokuapp.com/home/');
      } catch (error) {
        navigate('/login');
      }
    };

    checkAuthentication();
  }, [navigate]);
  // Récupération des données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://gl-yrae-backend-24c518b70d2a.herokuapp.com/combinedviewsets');
        setData(response.data);
        setFilteredData(response.data);
        setSelectedRows(response.data.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Gestion des filtres
  const handleFilterChange = (filters) => {
    const { csp, category, start_date, end_date, start_date_compare, end_date_compare } = filters;
    let filtered = data;
    let filteredCompare = data;

    if (csp && csp.length > 0) {
      filtered = filtered.filter(item => item.csp_lbl && csp.some(cspItem => cspItem.value === item.csp_lbl));
      filteredCompare = filteredCompare.filter(item => item.csp_lbl && csp.some(cspItem => cspItem.value === item.csp_lbl));
    }

    if (category && category.length > 0) {
      filtered = filtered.filter(item => item.cat_achat && category.some(catItem => catItem.value === item.cat_achat));
      filteredCompare = filteredCompare.filter(item => item.cat_achat && category.some(catItem => catItem.value === item.cat_achat));
    }

    if (start_date) {
      setStartDate(start_date);
      filtered = filtered.filter(item => item.date_collecte && item.date_collecte >= start_date);
    }

    if (end_date) {
      setEndDate(end_date);
      filtered = filtered.filter(item => item.date_collecte && item.date_collecte <= end_date);
    }

    if (start_date_compare) {
      setStartDateCompare(start_date_compare);
      filteredCompare = filteredCompare.filter(item => item.date_collecte && item.date_collecte >= start_date_compare);
    }

    if (end_date_compare) {
      setEndDateCompare(end_date_compare);
      filteredCompare = filteredCompare.filter(item => item.date_collecte && item.date_collecte <= end_date_compare);
    }

    setFilteredData(filtered);
    setFilteredDataCompare(filteredCompare);
    aggregateData(filtered);
    aggregateData(filteredCompare, true);
    calculateTotals(filtered);
    calculateTotals(filteredCompare, true);
    setSelectedRows(filtered.length);
  };

  // Agrégation des données par CSP et catégorie
  const aggregateData = (data, isCompare = false) => {
    const aggregated = data.reduce((acc, item) => {
      const csp = item.csp_lbl;
      const category = item.cat_achat;
      if (!acc[csp]) {
        acc[csp] = { csp_lbl: csp, montant_total: 0, qte_total: 0 };
      }
      if (!acc[csp][category]) {
        acc[csp][category] = 0;
      }
      acc[csp][category] += parseFloat(item.montant_achat);
      acc[csp].montant_total += parseFloat(item.montant_achat);
      acc[csp].qte_total += parseInt(item.qte_article, 10);
      return acc;
    }, {});

    if (isCompare) {
      setAggregatedDataCompare(Object.values(aggregated));
    } else {
      setAggregatedData(Object.values(aggregated));
    }
  };

  // Calcul des totaux par catégorie d'achat
  const calculateTotals = (data, isCompare = false) => {
    const totals = data.reduce((acc, item) => {
      const category = item.cat_achat;
      if (!acc[category]) {
        acc[category] = { montant_total: 0, qte_total: 0 };
      }
      acc[category].montant_total += parseFloat(item.montant_achat);
      acc[category].qte_total += parseInt(item.qte_article, 10);
      return acc;
    }, {});

    if (isCompare) {
      setTotalsCompare(totals);
    } else {
      setTotals(totals);
    }
  };

  // Mise à jour automatique des données en fonction des filtres
  useEffect(() => {
    if (filteredData.length > 0) {
      aggregateData(filteredData);
      calculateTotals(filteredData);
    }
  }, [filteredData]);

  useEffect(() => {
    if (filteredDataCompare.length > 0) {
      aggregateData(filteredDataCompare, true);
      calculateTotals(filteredDataCompare, true);
    }
  }, [filteredDataCompare]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  if (aggregatedData.length === 0) {
    return <div>Aucune donnée disponible.</div>;
  }

  const categoryOptions = [
    { value: 1, label: 'Catégorie 1' },
    { value: 2, label: 'Catégorie 2' },
    { value: 3, label: 'Catégorie 3' },
    { value: 4, label: 'Catégorie 4' },
    { value: 5, label: 'Catégorie 5' },
  ];

  // Affichage des graphiques, données et bouton d'export
  return (
    <div>
      <Navbar />
      <FilterForm onFilterChange={handleFilterChange} />
      <h2>Montants d'achat par CSP</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <BarChart
          width={800}
          height={400}
          data={aggregatedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="csp_lbl" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          {categoryOptions.map((category, index) => (
            <Bar
              key={index}
              dataKey={category.value}
              stackId="a"
              fill={`hsl(${index * 360 / categoryOptions.length}, 70%, 50%)`}
              name={category.label}
              yAxisId="left"
            />
          ))}
          <Bar dataKey="qte_total" stackId="b" fill="#ffc658" name="Quantité Totale" yAxisId="right" />
        </BarChart>
        {startDateCompare && endDateCompare && (
          <BarChart
            width={800}
            height={400}
            data={aggregatedDataCompare}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="csp_lbl" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            {categoryOptions.map((category, index) => (
              <Bar
                key={index}
                dataKey={category.value}
                stackId="a"
                fill={`hsl(${index * 360 / categoryOptions.length}, 70%, 50%)`}
                name={category.label}
                yAxisId="left"
              />
            ))}
            <Bar dataKey="qte_total" stackId="b" fill="#ffc658" name="Quantité Totale" yAxisId="right" />
          </BarChart>
        )}
      </div>
      <h3>Totaux par Catégorie d'achat</h3>
      <table>
        <thead>
          <tr>
            <th>Catégorie d'achat</th>
            <th>Montant Total</th>
            <th>Quantité Totale</th>
          </tr>
        </thead>
        <tbody>
          {categoryOptions.map((category, index) => (
            <tr key={index}>
              <td>{category.label}</td>
              <td>{totals[category.value]?.montant_total || 0}</td>
              <td>{totals[category.value]?.qte_total || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Nombre de lignes sélectionnées : {selectedRows}</p>
      <button onClick={() => exportToExcel(filteredData, 'category_by_csp')}>
        Exporter vers Excel
      </button>
    </div>
  );
};

export default CategoryByCSP;
