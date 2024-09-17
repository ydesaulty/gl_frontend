/**
 * @fileoverview Composant ComparisonCharts pour afficher un 2e Barchart des montants d'achat par catégorie pour comparaison.
 * @requires react
 * @requires react-chartjs-2
 * @requires chart.js
 */
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Initialisation des graphiques
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Composant ComparisonCharts pour afficher un Barchart comparatif.
 *
 * @component
 * @param {Object} props - Propriétés du composant.
 * @param {Array} props.data - Données d'achat à afficher dans le graphique.
 * @param {string} props.csp - CSP.
 * @param {string} props.catAchat - Catégorie d'achats.
 * @param {string} props.period - Périodes concernées.
 * @returns {React.Element} Elément React renvoyant soit le Barchart comparatif soit un message d'erreur.
 */
const ComparisonCharts = ({ data, csp, catAchat, period }) => {
  // Vérification de la présence de données
  if (!data || data.length === 0) {
    return <div>Aucune donnée disponible.</div>;
  }

  /**
   * Crée les données formatées pour le graphique à partir des données brutes.
   *
   * @function
   * @param {Array} data - Les données d'achat brutes.
   * @param {string} csp - La catégorie socio-professionnelle.
   * @param {string} catAchat - La catégorie d'achat.
   * @param {string} period - La période concernée.
   * @returns {Object} Les données formatées pour le graphique.
   */
  const createChartData = (data, csp, catAchat, period) => {
    // Calcul des montants par catégorie
    const montantParCat = data.reduce((acc, item) => {
      const cat = item.cat_achat;
      const montant = parseFloat(item.montant_achat);
      acc[cat] = (acc[cat] || 0) + montant;
      return acc;
    }, {});

    // Extraction des catégories et montants
    const categories = Object.keys(montantParCat);
    const montants = Object.values(montantParCat);

    // Format des données pour le graphique
    return {
      labels: categories,
      datasets: [
        {
          label: `Montant total d'achat (CSP: ${csp}, Catégorie: ${catAchat}, Période: ${period})`,
          data: montants,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  };

  // Gestion des données pour le graphique
  const chartData = createChartData(data, csp, catAchat, period);
  /**
   * Options du graphique.
   * @type {Object}
   */
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Montant Total d\'Achat par Catégorie23',
      },
    },
  };

  // Affichage du graphique
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      <div style={{ width: '400px', margin: '20px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ComparisonCharts;
