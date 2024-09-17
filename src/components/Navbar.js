/**
 * @fileoverview Composant Navbar pour la navigation principale de l'application.
 * @requires react
 * @requires react-router-dom
 * @requires styled-components
 */
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

/**
 * Conteneur stylisé pour la barre de navigation.
 * @component
 */
const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-around;
  background-color: #f5f5f5;
  padding: 10px;
`;

/**
 * Bouton stylisé de navigation.
 * @component
 */
const NavButton = styled(Link)`
  padding: 10px 20px;
  margin: 5px;
  background-color: #b2d8b2;
  color: #fff;
  text-decoration: none;
  border-radius: 15px;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #a1cfa1;
  }
`;

/**
 * Composant Navbar pour afficher la barre de navigation principale.
 *
 * @component
 * @returns {React.Element} Un élément React contenant la barre de navigation avec des liens vers différentes pages.
 */
const Navbar = () => {
  return (
    <NavbarContainer>
      <NavButton to="/homepage">Accueil</NavButton>
      <NavButton to="/csp-by-category">CSP par Catégorie</NavButton>
      <NavButton to="/category-by-csp">Catégories d'achat par CSP</NavButton>
      <NavButton to="/average-basket">Panier Moyen</NavButton>
      <NavButton to="/average-basket">Documentation</NavButton>
    </NavbarContainer>
  );
};

export default Navbar;
