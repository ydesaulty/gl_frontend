# Documentation technique de l'application React

## 1. Vue d'ensemble

La société GoldenLine, enseigne spécialisée dans la vente de vêtements en grande surface implantée partout en France, souhaite disposer d’un indicateur sur le panier moyen journalier par CSP dans une application web (donc consultable de partout, à distance). Cet indicateur serait à destination de l’équipe Marketing, et permettrait de faire le point sur les évènements passés et d’orienter les campagnes futures de promotion marketing. A cette fin, elle fait appel à la société DataPro.

La solution présentée comprend 3 éléments :
- une base de données relationnelle Postgresql
- un backend en langage Python, sous forme d'API Restful via le framework Django Rest
- un frontend en langage Javascript via le framework React.js

Cette application React.js a pour objectif de permettre aux utilisateurs de visualiser et d'analyser les données issues des ventes selon les catégories d'achat et les CSP (Catégorie Socio-Professionnelle). L'application React comprend plusieurs pages pour différentes vues de données (CA par catégories d'achat avec la composition selon les CSP, CA par CSP avec la composition selon les catégories d'achats, et le panier moyen (global, par CSP et par mois). Cette application utilise des graphiques pour une représentation visuelle des données.

## 2. Structure de l'application

L'application est structurée comme suit :

- `App.js` : Point d'entrée principal de l'application
- `index.js` : Fichier de démarrage React

- Pages :
- `HomePage.js`
- `CSPByCategory.js`
- `CategoryByCSP.js`
- `AverageBasket.js`
- `Login.js`
- `Logout.js`

- Composants :
- `Navbar.js`
- `FilterForm.js`

- Utilitaires :
- `exportToExcel.js`

## 3. Fonctionnalités principales

### 3.1 Authentification

L'application gère l'authentification des utilisateurs. Chaque page vérifie l'authentification de l'utilisateur et redirige vers la page de connexion si nécessaire.

### 3.2 Visualisation des données

L'application utilise la bibliothèque Recharts pour créer des graphiques interactifs, notamment des graphiques à barres pour visualiser :
- Chiffre d'affaires par mois
- Chiffre d'affaires par CSP
- Chiffre d'affaires par catégorie
- Panier moyen par mois

### 3.3 Filtrage des données

Un composant `FilterForm` permet aux utilisateurs de filtrer les données selon différents critères :
- CSP
- Catégorie d'achat
- Plage de dates
- Plage de dates de comparaison

### 3.4 Exportation des données

L'application permet l'exportation des données filtrées vers Excel.

## 4. Composants clés

### 4.1 HomePage (pages/HomePage.js)

Ce composant affiche une vue d'ensemble des données, y compris :
- Chiffre d'affaires avec évolution mensuelle sur l'année filtrée
- Chiffre d'affaires par CSP avec évolution mensuelle sur l'année filtrée
- Chiffre d'affaires par catégorie avec évolution mensuelle sur l'année filtrée
- Panier moyen avec évolution mensuelle sur l'année filtrée

Il permet également à l'utilisateur de sélectionner une année spécifique pour l'analyse.

### 4.2 CSPByCategory (pages/CSPByCategory.js)

Ce composant permet d'analyser les données par catégorie de produits, montrant la répartition des ventes pour chaque CSP. Pour la période filtrée, approche transversale du CA par CSP avec composition par catégorie d'achat. Possibilité de comparer avec une autre période, par confrontation des graphiques et du tableau d'ensemble. Export possible des données de la période source d'analyse vers excel.

Une comparaison est également possible sur la période, avec filtre possible sur les CSP et les catégories d'achat.

### 4.3 CategoryByCSP (pages/CategoryByCSP.js)

Ce composant permet d'analyser les données par CSP, montrant la répartition des ventes pour chaque catégorie de produits. Pour la période filtrée, approche transversale du CA par Catégorie d'achat avec composition par csp. Possibilité de comparer avec une autre période, par confrontation des graphiques et du tableau d'ensemble. Export possible des données de la période source d'analyse vers excel.

Une comparaison est également possible sur la période, avec filtre possible sur les CSP et les catégories d'achat.

### 4.4 AverageBasket (pages/AverageBasket.js)

Ce composant analyse le panier moyen des clients :
- globalement, toutes CSP et toutes catégories d'achats confondues sur la période filtrée
- globalement, avec évolution mensuelle sur l'année
- par CP, avec empilement des catégories d'achat

Une comparaison est également possible sur la période, avec filtre possible sur les CSP et les catégories d'achat.

## 5. Gestion des états

L'application utilise largement les hooks React, notamment `useState` et `useEffect`, pour gérer l'état local des composants et les effets secondaires comme le chargement des données.

## 6. Gestion des données

### 6.1 Chargement des données

Les données sont chargées à partir d'une API externe en Python (Django Rest Framework) via Axios. L'URL de base de l'API est : `https://gl-yrae-backend-24c518b70d2a.herokuapp.com/`

### 6.2 Traitement et sécurité des données

Les données des ventes sont consultables par l'intermédiaires du backend (API), dont l'accés est sécurisé par :
- 'django-cors-header' : seuls les domaines autorisés peuvent envoyer des requêtes et recevoir des réponses
- 'JWT-authentication' : Json Web Token. Chaque connection via login et mot de passe se voit attribuer un couple de token d'accés et refresh de façon temporaire. En cas de déconnection de l'application ou de mise à jour de la page, l'utilisateur est déconnecté, et le couple de token est blacklisté.
- 'django-admin' : l'attribution des couples de login et mot de passe se fait via une interface gérée par l'administrateur. L'accés est protégé par mot de passe
- l'accès aux pages de l'application React est protégé par la présence des token d'accés et refresh.

Les données reçues après requête sont anonymes (pas de mentions permettant de tracer les personnes à l'origine des données, conformément à la RGPD). Elles sont ensuite traitées et agrégées dans chaque composant pour correspondre aux besoins spécifiques de visualisation. Des fonctions d'agrégation sont utilisées pour calculer les totaux et les moyennes.

## 7. Routing

L'application utilise React Router pour la navigation entre les différentes pages. Les routes sont définies dans `App.js`.
- Route "/login" : element pour se logguer
- Route "/homepage" : element HomePage, page d'accueil et de synthèse 
- Route "/csp-by-category" : element CSPByCategory pour analyse du CA par Catégorie d'achat
- Route "/category-by-csp" : element CategoryByCSP pour analyse du CA par CSP
- Route "/average-basket" : element AverageBasket pour analyse du Panier Moyen
- Route "/logout" : element de déconnection

## 8. Styles

Les styles sont gérés via des fichiers CSS externes (`App.css` et `index.css`).

## 9. Dépendances principales

- React
- React Router
- Axios pour les requêtes HTTP
- Recharts pour la visualisation des données

## 10. Points d'amélioration potentiels et évolutivité

1. Approfondissement de la logique Controle de Gestion : enrichissement d'indicateurs clés (Ecart Total, de composition, de volume et de prix) 
2. Optimisation des performances pour de grands ensembles de données.
3. Ajout de fonctionnalités d'exportation de graphiques.
4. Migration de la base de données vers du NoSQL : fonctionnement plus souple en cas de carence dans le renseignement des données
5. Implémentation d'un système de cache pour réduire les appels API.

## 11. Conclusion

Cette application React fournit une interface utilisateur intuitive pour l'analyse de données de vente. Elle offre diverses vues et options de filtrage pour permettre une analyse approfondie des tendances de vente par CSP et catégorie de produits.
