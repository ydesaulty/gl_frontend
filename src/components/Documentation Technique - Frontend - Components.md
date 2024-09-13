# Documentation Technique du Frontend React

## Aperçu
Ce document fournit la documentation technique pour le frontend d'une application React.js. L'application semble être un outil de visualisation de données pour des ventes ou des achats, avec des fonctionnalités de filtrage, de graphiques et d'exportation de données.

## Composants

### 1. BarChart (components/BarChart.js)

- Objectif : Rend un graphique à barres montrant les montants totaux d'achat par catégorie.

- Fonctionnalités clés :
  - Utilise react-chartjs-2 pour le rendu.
  - Agrège les données par catégorie d'achat.
  - Affiche un message d'erreur si aucune donnée n'est disponible.
  
- Props :
  - `data` : Tableau de données d'achat
  - `csp` : Profil Socio-Professionnel du Client
  - `catAchat` : Catégorie d'Achat
  - `period` : Période de temps

### 2. BarChartHomePage (components/BarChartHomePage.js)

- Objectif : Rend un graphique à barres pour la page d'accueil, avec option d'empilement.

- Fonctionnalités clés :
  - Prend en charge les graphiques à barres empilées et non empilées.
  - Utilise un ensemble prédéfini de couleurs pour différentes séries de données.
  
- Props :
  - `data` : Tableau de données pour le graphique
  - `stacked` : Booléen pour déterminer si le graphique doit être empilé

### 3. Chart (components/Chart.js)

- Objectif : Rend un graphique à barres simple du montant total d'achat par catégorie.

- Fonctionnalités clés :
  - Agrège les données par catégorie d'achat.
  - Affiche un message d'erreur si aucune donnée n'est disponible.
  
- Props :
  - `data` : Tableau de données d'achat

### 4. ComparisonCharts (components/ComparisonCharts.js)

- Objectif : Rend des graphiques à barres de comparaison pour différents ensembles de données.

- Fonctionnalités clés :
  - Crée plusieurs graphiques pour la comparaison.
  - Design responsive avec mise en page flexible.
  
- Props :
  - `data` : Tableau de données pour la comparaison
  - `csp` : Profil Socio-Professionnel du Client
  - `catAchat` : Catégorie d'Achat
  - `period` : Période de temps

### 5. FilterForm (components/FilterForm.js)

- Objectif : Fournit un formulaire pour filtrer les données.

- Fonctionnalités clés :
  - Utilise react-hook-form pour la gestion du formulaire.
  - Inclut des listes déroulantes pour la sélection de CSP et de catégorie.
  - Entrées de plage de dates pour le filtrage et la comparaison.
  
- Props :
  - `onFilterChange` : Fonction pour gérer les changements de filtres

### 6. Navbar (components/Navbar.js)

- Objectif : Composant de navigation pour l'application.

- Fonctionnalités clés :
  - Utilise styled-components pour le style.
  - Fournit des liens vers différentes pages/vues.

### 7. Navigation (components/navigation.js)

- Objectif : Barre de navigation principale avec statut d'authentification.

- Fonctionnalités clés :
  - Utilise react-bootstrap pour le style.
  - Affiche l'option de déconnexion lorsque l'utilisateur est authentifié.

### 8. Home (components/home.js)

- Objectif : Composant de la page d'accueil avec vérification d'authentification.

- Fonctionnalités clés :
  - Vérifie le jeton d'authentification.
  - Redirige vers la connexion si non authentifié.
  - Récupère et affiche un message de bienvenue pour les utilisateurs authentifiés.

## Utilitaires

### exportToExcel (components/exportToExcel.js)

- Objectif : Exporte les données vers un fichier Excel.

- Fonctionnalités clés :
  - Utilise la bibliothèque xlsx pour la création de fichiers Excel.
  - Utilise file-saver pour le téléchargement du fichier.

## Authentification

L'application implémente un système d'authentification simple basé sur des tokens :
- Vérifie la présence de 'access_token' dans localStorage pour déterminer le statut d'authentification.
- Redirige les utilisateurs non authentifiés vers la page de connexion.

## Style

- L'application utilise un mélange de styled-components et react-bootstrap pour le style.

- Des styles personnalisés sont appliqués pour créer une apparence cohérente à travers les composants.

## Visualisation de Données

- Les graphiques sont principalement créés à l'aide de react-chartjs-2.
- Divers types de graphiques sont implémentés, y compris des graphiques à barres avec options d'empilement.

## Gestion d'État

- L'application utilise principalement les hooks useState et useEffect de React pour la gestion d'état.
- Les props sont utilisés pour passer des données et des callbacks entre les composants.

## Routage

- React Router est utilisé pour la navigation entre différentes vues/pages.

## Intégration API

- Axios est utilisé pour effectuer des requêtes HTTP vers l'API backend.
- L'API backend est hébergée à 'https://gl-yrae-backend-24c518b70d2a.herokuapp.com/'.

## Améliorations Futures

1. Implémenter une gestion d'état plus robuste (par exemple, Redux ou Context API) pour un meilleur flux de données.
2. Améliorer la gestion des erreurs et les mécanismes de retour utilisateur.
3. Implémenter des tests unitaires et d'intégration pour les composants.
4. Envisager d'ajouter plus de fonctionnalités interactives aux graphiques.
5. Améliorer les fonctionnalités d'accessibilité dans toute l'application.
