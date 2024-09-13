import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Initialisation des graphiques
Chart.register(...registerables);

const BarChartHomePage = ({ data, stacked = false }) => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const colors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
  ];

  const borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
  ];

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
