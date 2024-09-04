import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Définition du graphique
const BarChart = ({ data, csp, catAchat, period }) => {
  
  // Message d'erreur en l'absence de données 
  if (!data || data.length === 0) {
    return <div>Aucune donnée disponible.</div>;
  }

  // Agréger les données par catégorie d'achat
  const montantParCat = data.reduce((acc, item) => {
    const cat = item.cat_achat;
    const montant = parseFloat(item.montant_achat);
    acc[cat] = (acc[cat] || 0) + montant;
    return acc;
  }, {});

  // Extraction des catégories et montants
  const categories = Object.keys(montantParCat);
  const montants = Object.values(montantParCat);

  // Formatage des données pour le graphique
  const chartData = {
    labels: categories,
    datasets: [
      {
        label: `Montant total d'achat (CSP: ${csp}, Catégorie: ${catAchat}, Période: ${period})`,
        data: montants,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // Options du graphique
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

  // Affichage du graphique
  return (
    <div style={{ width: '300px', margin: '20px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
