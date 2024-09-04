import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-around;
  background-color: #f5f5f5;
  padding: 10px;
`;

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

const Navbar = () => {
  return (
    <NavbarContainer>
      <NavButton to="/homepage">Accueil</NavButton>
      <NavButton to="/csp-by-category">CSP par Catégorie</NavButton>
      <NavButton to="/category-by-csp">Catégories d'achat par CSP</NavButton>
      <NavButton to="/average-basket">Panier Moyen</NavButton>
    </NavbarContainer>
  );
};

export default Navbar;
