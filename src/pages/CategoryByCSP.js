/**
 * @fileoverview Composant CategoryByCSP pour l'analyse et la visualisation des catégories d'achat par CSP.
 * @requires react
 * @requires react-router-dom
 * @requires axios
 * @requires recharts
 * @requires ../components/Navbar
 * @requires ../components/FilterForm
 * @requires ../components/exportToExcel
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import FilterForm from '../components/FilterForm';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { exportToExcel } from '../components/exportToExcel';

/**
 * Composant CategoryByCSP pour l'analyse des catégories d'achat par CSP.
 * 
 * @component
 * @returns {React.Element} Elément React contenant les graphiques pour l'analyse des catégories par CSP.
 */
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
  const [totalsCompare, setTotalsCompare] = useState({});
  const [selectedRows, setSelectedRows] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateCompare, setStartDateCompare] = useState('');
  const [endDateCompare, setEndDateCompare] = useState('');

  /**
   * Options de graphique pour le filtrage des CSP.
   * @type {Array<{value: string, label: string}>}
   */
  // 
  const cspOptions = [
    { value: 'Employes', label: 'Employes' },
    { value: 'Commercants', label: 'Commercants' },
    { value: 'Etudiants', label: 'Etudiants' },
    { value: 'Agriculteurs', label: 'Agriculteurs' },
    { value: 'Retraites', label: 'Retraites' },
    { value: 'Autres', label: 'Autres' },
  ];

  /**
   * Options de graphique pour le filtrage des catégories d'achat.
   * @type {Array<{value: number, label: string}>}
   */
  const categoryOptions = [
    { value: 1, label: 'Catégorie 1' },
    { value: 2, label: 'Catégorie 2' },
    { value: 3, label: 'Catégorie 3' },
    { value: 4, label: 'Catégorie 4' },
    { value: 5, label: 'Catégorie 5' },
  ];

  /**
   * Vérification de l'authentification.
   */
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

  /**
   * Récupération des données depuis l'API.
   */
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

  /**
   * Agrégation des données par CSP et catégorie.
   * 
   * @param {Array} data - Les données à agréger.
   * @param {boolean} isCompare - Indique s'il s'agit des données de comparaison.
   */
  const aggregateData = (data, isCompare = false) => {
    const aggregated = data.reduce((acc, item) => {
      const csp = item.csp_lbl;
      const category = parseInt(item.cat_achat);
      if (!acc[csp]) {
        acc[csp] = { csp_lbl: csp, montant_total: 0, qte_total: 0 };
        categoryOptions.forEach(cat => {
          acc[csp][cat.value] = 0;
        });
      }
      acc[csp][category] += parseFloat(item.montant_achat);
      acc[csp].montant_total += parseFloat(item.montant_achat);
      acc[csp].qte_total += parseInt(item.qte_article, 10);
      return acc;
    }, {});

    const result = Object.values(aggregated);
    if (isCompare) {
      setAggregatedDataCompare(result);
    } else {
      setAggregatedData(result);
    }
  };

  /**
   * Calcul des totaux par catégorie d'achat.
   * 
   * @param {Array} data - Les données à traiter.
   * @returns {Object} Un objet contenant les totaux par catégorie.
   */
  const calculateTotals = (data) => {
    return data.reduce((acc, item) => {
      const category = parseInt(item.cat_achat);
      if (!acc[category]) {
        acc[category] = { montant_total: 0, qte_total: 0 };
      }
      acc[category].montant_total += parseFloat(item.montant_achat);
      acc[category].qte_total += parseInt(item.qte_article, 10);
      return acc;
    }, {});
  };

  /**
   * Gestion des filtres et mise à jour des données.
   * 
   * @param {Object} filters - Filtres appliqués par l'utilisateur.
   */
  const handleFilterChange = (filters) => {
    const { csp, category, start_date, end_date, start_date_compare, end_date_compare } = filters;
    let filtered = data;
    let filteredCompare = data;

    if (csp && csp.length > 0) {
      filtered = filtered.filter(item => csp.some(cspItem => cspItem.value === item.csp_lbl));
      filteredCompare = filteredCompare.filter(item => csp.some(cspItem => cspItem.value === item.csp_lbl));
    }

    if (category && category.length > 0) {
      filtered = filtered.filter(item => category.some(catItem => catItem.value === parseInt(item.cat_achat)));
      filteredCompare = filteredCompare.filter(item => category.some(catItem => catItem.value === parseInt(item.cat_achat)));
    }

    if (start_date) {
      setStartDate(start_date);
      const startDateTime = new Date(start_date);
      startDateTime.setHours(0, 0, 0, 0);
      filtered = filtered.filter(item => new Date(item.date_collecte) >= startDateTime);
    }

    if (end_date) {
      setEndDate(end_date);
      const endDateTime = new Date(end_date);
      endDateTime.setHours(23, 59, 59, 999);
      filtered = filtered.filter(item => new Date(item.date_collecte) <= endDateTime);
    }

    if (start_date_compare) {
      setStartDateCompare(start_date_compare);
      const startDateTimeCompare = new Date(start_date_compare);
      startDateTimeCompare.setHours(0, 0, 0, 0);
      filteredCompare = filteredCompare.filter(item => new Date(item.date_collecte) >= startDateTimeCompare);
    }

    if (end_date_compare) {
      setEndDateCompare(end_date_compare);
      const endDateTimeCompare = new Date(end_date_compare);
      endDateTimeCompare.setHours(23, 59, 59, 999);
      filteredCompare = filteredCompare.filter(item => new Date(item.date_collecte) <= endDateTimeCompare);
    }

    setFilteredData(filtered);
    setFilteredDataCompare(filteredCompare);
    aggregateData(filtered);
    aggregateData(filteredCompare, true);
    setTotals(calculateTotals(filtered));
    setTotalsCompare(calculateTotals(filteredCompare));
    setSelectedRows(filtered.length);
  };

  /**
   * Mise à jour automatique des données agrégéesen fonction des filtres.
   */
  useEffect(() => {
    if (filteredData.length > 0) {
      aggregateData(filteredData);
      setTotals(calculateTotals(filteredData));
    }
  }, [filteredData]);

  /**
   * Affichage et mise à jour les données de comparaison agrégées si renseignement des données filtrées de comparaison.
   */
  useEffect(() => {
    if (filteredDataCompare.length > 0) {
      aggregateData(filteredDataCompare, true);
      setTotalsCompare(calculateTotals(filteredDataCompare));
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

  // Affichage des graphiques, données et bouton d'export
  return (
    <div>
      <Navbar />
      <FilterForm onFilterChange={handleFilterChange} />
      <h2>Montants d'achat par CSP (décomposition par Catégorie)</h2>
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
          <Bar dataKey="qte_total" stackId="b" fill="#82ca9d" name="Quantité Totale" yAxisId="right" />
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
            <Bar dataKey="qte_total" stackId="b" fill="#82ca9d" name="Quantité Totale" yAxisId="right" />
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
            {startDateCompare && endDateCompare && (
              <>
                <th>Montant Total (Comparaison)</th>
                <th>Quantité Totale (Comparaison)</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {categoryOptions.map((category, index) => (
            <tr key={index}>
              <td>{category.label}</td>
              <td>{totals[category.value]?.montant_total.toFixed(2) || 0}</td>
              <td>{totals[category.value]?.qte_total || 0}</td>
              {startDateCompare && endDateCompare && (
                <>
                  <td>{totalsCompare[category.value]?.montant_total.toFixed(2) || 0}</td>
                  <td>{totalsCompare[category.value]?.qte_total || 0}</td>
                </>
              )}
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