/**
 * @fileoverview Composant CSPByCategory pour l'analyse et la visualisation des CSP par catégorie d'achat.
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Navbar from '../components/Navbar';
import FilterForm from '../components/FilterForm';
import { exportToExcel } from '../components/exportToExcel';

/**
 * Composant CSPByCategory pour l'analyse des CSP par catégorie d'achat.
 * 
 * @component
 * @returns {React.Element} Un élément React contenant les graphiques et les contrôles pour l'analyse des CSP par catégorie.
 */
const CSPByCategory = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDataCompare, setFilteredDataCompare] = useState([]);
  const [aggregatedData, setAggregatedData] = useState([]);
  const [aggregatedDataCompare, setAggregatedDataCompare] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateCompare, setStartDateCompare] = useState('');
  const [endDateCompare, setEndDateCompare] = useState('');

  /**
   * Options de graphique pour le filtrage des CSP.
   * @type {Array<{value: string, label: string}>}
   */
  const cspOptions = [
    { value: 'Employes', label: 'Employes' },
    { value: 'Commercants', label: 'Commercants' },
    { value: 'Etudiants', label: 'Etudiants' },
    { value: 'Agriculteurs', label: 'Agriculteurs' },
    { value: 'Retraites', label: 'Retraites' },
    { value: 'Autres', label: 'Autres' },
  ];

  /**
   * Options de graphique pour le filtrage des catégories d'achat .
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
        const initialAggregatedData = aggregateData(response.data);
        setAggregatedData(initialAggregatedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Agrégation des données par catégorie et CSP.
   * 
   * @param {Array} data - Les données à agréger.
   * @returns {Array} Un tableau d'objets représentant les données agrégées.
   */
  const aggregateData = (data) => {
    const aggregated = categoryOptions.map(category => {
      const categoryData = {
        category: category.label,
        total: 0,
        qte_total: 0,
      };
      cspOptions.forEach(csp => {
        categoryData[csp.value] = 0;
        categoryData[`${csp.value}_qte`] = 0;
      });
      return categoryData;
    });

    data.forEach(item => {
      const categoryIndex = parseInt(item.cat_achat) - 1;
      const montant = parseFloat(item.montant_achat);
      const qte = parseInt(item.qte_article);
      aggregated[categoryIndex].total += montant;
      aggregated[categoryIndex].qte_total += qte;
      aggregated[categoryIndex][item.csp_lbl] += montant;
      aggregated[categoryIndex][`${item.csp_lbl}_qte`] += qte;
    });

    return aggregated;
  };

  /**
   * Gestion des filtres et mise à jour des données.
   * 
   * @param {Object} filters - Les filtres appliqués par l'utilisateur.
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
    const newAggregatedData = aggregateData(filtered);
    setAggregatedData(newAggregatedData);
    if (start_date_compare && end_date_compare) {
      const newAggregatedDataCompare = aggregateData(filteredCompare);
      setAggregatedDataCompare(newAggregatedDataCompare);
    }
    setSelectedRows(filtered.length);
  };

  /**
   * Calcul des totaux par CSP.
   * 
   * @param {Array} data - Données agrégées.
   * @returns {Object} Objet contenant les totaux par CSP.
   */
  const calculateTotalsByCSP = (data) => {
    return cspOptions.reduce((acc, csp) => {
      acc[csp.value] = {
        montant_total: data.reduce((sum, category) => sum + (category[csp.value] || 0), 0),
        qte_total: data.reduce((sum, category) => sum + (category[`${csp.value}_qte`] || 0), 0)
      };
      return acc;
    }, {});
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  const totalsByCSP = calculateTotalsByCSP(aggregatedData);
  const totalsByCSPCompare = startDateCompare && endDateCompare ? calculateTotalsByCSP(aggregatedDataCompare) : {};

  // Affichage des graphiques, données et bouton d'export
  return (
    <div>
      <Navbar />
      <FilterForm onFilterChange={handleFilterChange} />
      <h2>Montants d'achat par Catégorie (décomposition par CSP)</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <BarChart
          width={800}
          height={400}
          data={aggregatedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          {cspOptions.map((csp, index) => (
            <Bar 
              key={csp.value} 
              dataKey={csp.value} 
              stackId="a" 
              fill={`hsl(${index * 360 / cspOptions.length}, 70%, 50%)`} 
              name={csp.label}
              yAxisId="left"
            />
          ))}
          <Bar dataKey="qte_total" fill="#82ca9d" name="Quantité Totale" yAxisId="right" />
        </BarChart>
        {startDateCompare && endDateCompare && (
          <BarChart
            width={800}
            height={400}
            data={aggregatedDataCompare}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            {cspOptions.map((csp, index) => (
              <Bar 
                key={csp.value} 
                dataKey={csp.value} 
                stackId="a" 
                fill={`hsl(${index * 360 / cspOptions.length}, 70%, 50%)`} 
                name={csp.label}
                yAxisId="left"
              />
            ))}
            <Bar dataKey="qte_total" fill="#82ca9d" name="Quantité Totale" yAxisId="right" />
          </BarChart>
        )}
      </div>
      <h3>Totaux par CSP</h3>
      <table>
        <thead>
          <tr>
            <th>CSP</th>
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
          {cspOptions.map(csp => (
            <tr key={csp.value}>
              <td>{csp.label}</td>
              <td>{totalsByCSP[csp.value].montant_total.toFixed(2)}</td>
              <td>{totalsByCSP[csp.value].qte_total}</td>
              {startDateCompare && endDateCompare && (
                <>
                  <td>{totalsByCSPCompare[csp.value]?.montant_total.toFixed(2) || '0.00'}</td>
                  <td>{totalsByCSPCompare[csp.value]?.qte_total || '0'}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <p>Nombre de lignes sélectionnées : {selectedRows}</p>
      <button onClick={() => exportToExcel(filteredData, 'csp_by_category')}>
        Exporter vers Excel
      </button>
    </div>
  );
};

export default CSPByCategory;