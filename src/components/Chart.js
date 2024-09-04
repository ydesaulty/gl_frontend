import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Définition du graphique
const Chart = ({ data }) => {
  
  // Message d'erreur en l'absence de données
  if (!data || data.length === 0) {
    return <div>Aucune donnée disponible.</div>;
  }

  // Agréger les données par catégorie d'achat
  const montantParCat = data.reduce((acc, item) => {
    const catAchat = item.cat_achat;
    const montantAchat = parseFloat(item.montant_achat);
    if (!acc[catAchat]) {
      acc[catAchat] = 0;
    }
    acc[catAchat] += montantAchat;
    return acc;
  }, {});

  // Formatage des données pour le graphique
  const chartData = {
    labels: Object.keys(montantParCat),
    datasets: [
      {
        label: 'Montant total d\'achat',
        data: Object.values(montantParCat),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Affichage du graphique
  return <Bar data={chartData} />;
};

export default Chart;
