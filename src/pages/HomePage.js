import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Initialisation des états
const HomePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyCA, setMonthlyCA] = useState([]);
  const [monthlyCAByCSP, setMonthlyCAByCSP] = useState([]);
  const [monthlyCAByCategory, setMonthlyCAByCategory] = useState([]);
  const [monthlyAverageBasket, setMonthlyAverageBasket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cspOptions = [
    { value: 'Employes', label: 'Employes' },
    { value: 'Commercants', label: 'Commercants' },
    { value: 'Etudiants', label: 'Etudiants' },
    { value: 'Agriculteurs', label: 'Agriculteurs' },
    { value: 'Retraites', label: 'Retraites' },
    { value: 'Autres', label: 'Autres' },
  ];

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
        filterDataByYear(response.data, year);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    filterDataByYear(data, year);
  }, [year, data]);

  const filterDataByYear = (data, year) => {
    const caByMonth = Array(12).fill(0);
    const caByCSP = Array(12).fill(null).map(() => ({
      Employes: 0,
      Commercants: 0,
      Etudiants: 0,
      Agriculteurs: 0,
      Retraites: 0,
      Autres: 0,
      montant_total: 0,
      qte_total: 0,
    }));
    const caByCategory = Array(12).fill(null).map(() => ({
      'Cat 1': 0,
      'Cat 2': 0,
      'Cat 3': 0,
      'Cat 4': 0,
      'Cat 5': 0,
      montant_total: 0,
      qte_total: 0,
    }));
    const averageBasket = Array(12).fill(null).map(() => ({
      total: 0,
      count: 0,
      average: 0,
    }));

  // Calcul des indicateurs par mois
    data.forEach(item => {
      const date = new Date(item.date_collecte);
      if (date.getFullYear() === year) {
        const month = date.getMonth();
        const montantAchat = parseFloat(item.montant_achat);
        const cspLbl = item.csp_lbl;
        const catAchat = `Cat ${item.cat_achat}`;
        const qteArticle = parseInt(item.qte_article, 10);

        // CA par mois
        caByMonth[month] += montantAchat;

        // CA par CSP
        if (cspLbl && caByCSP[month][cspLbl] !== undefined) {
          caByCSP[month][cspLbl] += montantAchat;
        }
        caByCSP[month].montant_total += montantAchat;
        caByCSP[month].qte_total += qteArticle;

        // CA par catégorie
        if (caByCategory[month][catAchat] !== undefined) {
          caByCategory[month][catAchat] += montantAchat;
        }
        caByCategory[month].montant_total += montantAchat;
        caByCategory[month].qte_total += qteArticle;

        // Panier moyen
        averageBasket[month].total += montantAchat;
        averageBasket[month].count += qteArticle;
        averageBasket[month].average = averageBasket[month].count ? averageBasket[month].total / averageBasket[month].count : 0;
      }
    });

    // Mise à jour des données des indicateurs
    setMonthlyCA(caByMonth.map((value, index) => ({ month: index + 1, montant_total: value })));
    setMonthlyCAByCSP(caByCSP.map((csp, index) => ({ month: index + 1, ...csp })));
    setMonthlyCAByCategory(caByCategory.map((category, index) => ({ month: index + 1, ...category })));
    setMonthlyAverageBasket(averageBasket.map((basket, index) => ({ month: index + 1, average: basket.average })));
  };

  // Gestion du changement d'année
  const handleYearChange = (event) => {
    setYear(parseInt(event.target.value));
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

// Affichage des graphiques
  return (
    <div>
      <Navbar />
      <label>
        Période:
        <input type="number" value={year} onChange={handleYearChange} />
      </label>

      <div>
        <h2>Chiffre d'Affaires par Mois</h2>
        <BarChart
          width={800}
          height={400}
          data={monthlyCA}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <Tooltip />
          <Legend />
          <Bar dataKey="montant_total" fill="#82ca9d" name="Montant Total" yAxisId="left" />
        </BarChart>
      </div>

      <div>
        <h2>Chiffre d'Affaires par CSP</h2>
        <BarChart
          width={800}
          height={400}
          data={monthlyCAByCSP}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          {cspOptions.map((csp, index) => (
            <Bar
              key={index}
              dataKey={csp.value}
              stackId="a"
              fill={`hsl(${index * 360 / cspOptions.length}, 70%, 50%)`}
              name={csp.label}
              yAxisId="left"
            />
          ))}
          <Bar dataKey="qte_total" stackId="b" fill="#ffc658" name="Quantité Totale" yAxisId="right" />
        </BarChart>
      </div>

      <div>
        <h2>Chiffre d'Affaires par Catégorie</h2>
        <BarChart
          width={800}
          height={400}
          data={monthlyCAByCategory}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Cat 1" stackId="a" fill="#8884d8" name="Cat 1" yAxisId="left" />
          <Bar dataKey="Cat 2" stackId="a" fill="#82ca9d" name="Cat 2" yAxisId="left" />
          <Bar dataKey="Cat 3" stackId="a" fill="#ffc658" name="Cat 3" yAxisId="left" />
          <Bar dataKey="Cat 4" stackId="a" fill="#ff8042" name="Cat 4" yAxisId="left" />
          <Bar dataKey="Cat 5" stackId="a" fill="#808080" name="Cat 5" yAxisId="left" />
          <Bar dataKey="qte_total" stackId="b" fill="#ffc658" name="Quantité Totale" yAxisId="right" />
        </BarChart>
      </div>

      <div>
        <h2>Panier Moyen par Mois</h2>
        <BarChart
          width={800}
          height={400}
          data={monthlyAverageBasket}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="average" fill="#82ca9d" name="Panier Moyen" />
        </BarChart>
      </div>
    </div>
  );
};

export default HomePage;
