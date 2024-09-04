import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ComparisonCharts = ({ data, csp, catAchat, period }) => {
  if (!data || data.length === 0) {
    return <div>Aucune donnée disponible.</div>;
  }

  const createChartData = (data, csp, catAchat, period) => {
    const montantParCat = data.reduce((acc, item) => {
      const cat = item.cat_achat;
      const montant = parseFloat(item.montant_achat);
      acc[cat] = (acc[cat] || 0) + montant;
      return acc;
    }, {});

    const categories = Object.keys(montantParCat);
    const montants = Object.values(montantParCat);

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

  const chartData = createChartData(data, csp, catAchat, period);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Montant Total d\'Achat par Catégorie',
      },
    },
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      <div style={{ width: '400px', margin: '20px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ComparisonCharts;
