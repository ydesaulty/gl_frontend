/**
 * @fileoverview Composant BarChartHomePage pour afficher des Barcharts sur la page d'accueil.
 * @requires react
 * @requires react-chartjs-2
 * @requires chart.js
 */
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Initialisation des graphiques
Chart.register(...registerables);

/**
 * Composant BarChartHomePage pour afficher un Barchart.
 * Empilement possible selon le paramètre stacked.
 *
 * @component
 * @param {Object} props - Propriétés du composant.
 * @param {Array|Object} props.data - Données à afficher dans le graphique.
 *                                    Si stacked est false, c'est un tableau simple.
 *                                    Si stacked est true, c'est un tableau d'objets.
 * @param {boolean} [props.stacked=false] - Indique si le Barchart doit être empilé.
 * @returns {React.Element} Un élément React contenant le Barchart.
 */
const BarChartHomePage = ({ data, stacked = false }) => {
  /**
   * Labels pour l'axe X (mois de l'année).
   * @type {string[]}
   */
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /**
   * Couleurs de fond pour les barres du graphique.
   * @type {string[]}
   */
  const colors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
  ];

  /**
   * Couleurs de bordure pour les barres du graphique.
   * @type {string[]}
   */
  const borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
  ];

  /**
   * Prépare les data pour le graphique.
   * Si stacked est true, un dataset est créé pour chaque clé dans les objets data.
   * Sinon, un seul dataset est créé avec toutes les données.
   * @type {Object[]}
   */
  const datasets = stacked
    ? Object.keys(data[0]).map((key, index) => ({
        label: key,
        data: data.map(monthData => monthData[key] || 0),
        backgroundColor: colors[index],
        borderColor: borderColor[index],
        borderWidth: 1,
      }))
    : [{
        label: 'Dataset',
        data: data,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      }];

  // Affichage du graphique
  return (
    <Bar
      data={{
        labels: labels,
        datasets: datasets,
      }}
      options={{
        scales: {
          x: {
            stacked: stacked,
          },
          y: {
            stacked: stacked,
          },
        },
      }}
    />
  );
};

export default BarChartHomePage;
