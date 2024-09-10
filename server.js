const express = require('express');
const path = require('path');
const app = express();

// Servir les fichiers statiques à partir du dossier 'build'
app.use(express.static(path.join(__dirname, 'build')));

// Route de fallback pour rediriger toutes les demandes vers le fichier 'index.html'
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Définir le port utilisé par l'application
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
