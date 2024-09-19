/**
 * @fileoverview Composant AverageBasket pour l'analyse des paniers moyens.
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
 * Composant AverageBasket pour l'analyse des paniers moyens.
 * 
 * @component
 * @returns {React.Element} Elément React contenant les graphiques et les contrôles pour l'analyse des paniers moyens.
 */
const AverageBasket = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDataCompare, setFilteredDataCompare] = useState([]);
  const [aggregatedData, setAggregatedData] = useState([]);
  const [aggregatedDataCompare, setAggregatedDataCompare] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyDataCompare, setMonthlyDataCompare] = useState([]);
  const [totalAverageData, setTotalAverageData] = useState([]);
  const [totalAverageDataCompare, setTotalAverageDataCompare] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateCompare, setStartDateCompare] = useState('');
  const [endDateCompare, setEndDateCompare] = useState('');

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
   * Gestion des filtres et mise à jour des données.
   * 
   * @param {Object} filters - Filtres définis par l'utilisateur.
   */
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
      const startDateTime = new Date(start_date);
      startDateTime.setHours(0, 0, 0, 0);
      filtered = filtered.filter(item => item.date_collecte && new Date(item.date_collecte) >= startDateTime);
    }

    if (end_date) {
      setEndDate(end_date);
      const endDateTime = new Date(end_date);
      endDateTime.setHours(23, 59, 59, 999);
      filtered = filtered.filter(item => item.date_collecte && new Date(item.date_collecte) <= endDateTime);
    }

    if (start_date_compare) {
      setStartDateCompare(start_date_compare);
      const startDateTimeCompare = new Date(start_date_compare);
      startDateTimeCompare.setHours(0, 0, 0, 0);
      filteredCompare = filteredCompare.filter(item => item.date_collecte && new Date(item.date_collecte) >= startDateTimeCompare);
    }

    if (end_date_compare) {
      setEndDateCompare(end_date_compare);
      const endDateTimeCompare = new Date(end_date_compare);
      endDateTimeCompare.setHours(23, 59, 59, 999);
      filteredCompare = filteredCompare.filter(item => item.date_collecte && new Date(item.date_collecte) <= endDateTimeCompare);
    }

    setFilteredData(filtered);
    setFilteredDataCompare(filteredCompare);
    aggregateData(filtered);
    aggregateData(filteredCompare, true);
    calculateMonthlyData(filtered);
    calculateMonthlyData(filteredCompare, true);
    calculateTotalAverageData(filtered);
    calculateTotalAverageData(filteredCompare, true);
    setSelectedRows(filtered.length);
  };

  /**
   * Agrégation des données par CSP et catégorie.
   * 
   * @param {Array} data - Les données à agréger.
   * @param {boolean} isCompare - Indique s'il s'agit des données de comparaison.
   */
  const aggregateData = (data, isCompare = false) => {
    const aggregated = data.reduce((acc, item) => {
      const csp = item.csp_lbl;
      const category = item.cat_achat;
      if (!acc[csp]) {
        acc[csp] = { csp_lbl: csp, montant_total: 0, qte_total: 0 };
      }
      if (!acc[csp][category]) {
        acc[csp][category] = { montant_total: 0, qte_total: 0 };
      }
      acc[csp][category].montant_total += parseFloat(item.montant_achat);
      acc[csp][category].qte_total += parseInt(item.qte_article, 10);
      acc[csp].montant_total += parseFloat(item.montant_achat);
      acc[csp].qte_total += parseInt(item.qte_article, 10);
      return acc;
    }, {});

    const aggregatedWithAverage = Object.values(aggregated).map(item => {
      const { csp_lbl, montant_total, qte_total, ...categories } = item;
      const categoriesWithAverage = Object.entries(categories).reduce((acc, [category, { montant_total, qte_total }]) => {
        acc[category] = montant_total / qte_total;
        return acc;
      }, {});
      return { csp_lbl, ...categoriesWithAverage };
    });

    if (isCompare) {
      setAggregatedDataCompare(aggregatedWithAverage);
    } else {
      setAggregatedData(aggregatedWithAverage);
    }
  };
  
  /**
   * Calcul des paniers moyens par mois.
   * 
   * @param {Array} data - Les données à traiter.
   * @param {boolean} isCompare - Indique s'il s'agit des données de comparaison.
   */
  const calculateMonthlyData = (data, isCompare = false) => {
    const monthly = data.reduce((acc, item) => {
      const month = new Date(item.date_collecte).getMonth() + 1;
      if (!acc[month]) {
        acc[month] = { month, montant_total: 0, qte_total: 0 };
      }
      acc[month].montant_total += parseFloat(item.montant_achat);
      acc[month].qte_total += parseInt(item.qte_article, 10);
      return acc;
    }, {});

    const monthlyWithAverage = Object.values(monthly).map(item => {
      const { month, montant_total, qte_total } = item;
      const averageBasket = montant_total / qte_total;
      return { month, averageBasket };
    });

    if (isCompare) {
      setMonthlyDataCompare(monthlyWithAverage);
    } else {
      setMonthlyData(monthlyWithAverage);
    }
  };

  /**
   * Calcul des paniers moyens par CSP.
   * 
   * @param {Array} data - Les données à traiter.
   * @param {boolean} isCompare - Indique s'il s'agit des données de comparaison.
   */
  const calculateTotalAverageData = (data, isCompare = false) => {
    const totalAverage = data.reduce((acc, item) => {
      const csp = item.csp_lbl;
      if (!acc[csp]) {
        acc[csp] = { csp_lbl: csp, montant_total: 0, qte_total: 0 };
      }
      acc[csp].montant_total += parseFloat(item.montant_achat);
      acc[csp].qte_total += parseInt(item.qte_article, 10);
      return acc;
    }, {});

    const totalAverageWithAverage = Object.values(totalAverage).map(item => {
      const { csp_lbl, montant_total, qte_total } = item;
      const averageBasket = montant_total / qte_total;
      return { csp_lbl, averageBasket };
    });

    if (isCompare) {
      setTotalAverageDataCompare(totalAverageWithAverage);
    } else {
      setTotalAverageData(totalAverageWithAverage);
    }
  };

  /**
   * Mise à jour automatique des données agrégées en fonction des filtres.
   */
  useEffect(() => {
    if (filteredData.length > 0) {
      aggregateData(filteredData);
      calculateMonthlyData(filteredData);
      calculateTotalAverageData(filteredData);
    }
  }, [filteredData]);

  useEffect(() => {
    if (filteredDataCompare.length > 0) {
      aggregateData(filteredDataCompare, true);
      calculateMonthlyData(filteredDataCompare, true);
      calculateTotalAverageData(filteredDataCompare, true);
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

  // Affichage des graphiques, données et bouton d'export
  return (
    <div>
      <Navbar />
      <FilterForm onFilterChange={handleFilterChange} />
      <h2>Somme des paniers moyens par catégorie</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <BarChart
          width={600}
          height={400}
          data={aggregatedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="csp_lbl" />
          <YAxis />
          <Tooltip />
          <Legend />
          {categoryOptions.map((category, index) => (
            <Bar
              key={index}
              dataKey={category.value}
              stackId="a"
              fill={`hsl(${index * 360 / categoryOptions.length}, 70%, 50%)`}
              name={category.label}
            />
          ))}
        </BarChart>
        {startDateCompare && endDateCompare && (
          <BarChart
            width={600}
            height={400}
            data={aggregatedDataCompare}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="csp_lbl" />
            <YAxis />
            <Tooltip />
            <Legend />
            {categoryOptions.map((category, index) => (
              <Bar
                key={index}
                dataKey={category.value}
                stackId="a"
                fill={`hsl(${index * 360 / categoryOptions.length}, 70%, 50%)`}
                name={category.label}
              />
            ))}
          </BarChart>
        )}
      </div>
      <h2>Panier moyen par mois</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <BarChart
          width={600}
          height={400}
          data={monthlyData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="averageBasket" fill="#82ca9d" name="Panier moyen" />
        </BarChart>
        {startDateCompare && endDateCompare && (
          <BarChart
            width={600}
            height={400}
            data={monthlyDataCompare}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="averageBasket" fill="#82ca9d" name="Panier moyen" />
          </BarChart>
        )}
      </div>
      <h2>Panier moyen par CSP</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <BarChart
          width={600}
          height={400}
          data={totalAverageData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="csp_lbl" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="averageBasket" fill="#82ca9d" name="Panier moyen" />
        </BarChart>
        {startDateCompare && endDateCompare && (
          <BarChart
            width={600}
            height={400}
            data={totalAverageDataCompare}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="csp_lbl" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="averageBasket" fill="#82ca9d" name="Panier moyen" />
          </BarChart>
        )}
      </div>
      <p>Nombre de lignes sélectionnées : {selectedRows}</p>
      <button onClick={() => exportToExcel(filteredData, 'average_basket')}>
        Exporter vers Excel
      </button>
    </div>
  );
};

export default AverageBasket;
