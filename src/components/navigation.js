/**
 * @fileoverview Composant Navigation pour la barre de navigation principale avec gestion de l'authentification.
 * @requires react
 * @requires react-bootstrap
 */
import React, { useState, useEffect } from 'react';
import { Nav, Navbar } from 'react-bootstrap';

/**
 * Composant Navigation pour afficher la barre de navigation principale.
 * Gestion de l'affichage du lien de logout en fonction de l'état d'authentification.
 *
 * @component
 * @returns {React.Element} Elément React contenant la barre de navigation.
 */
export function Navigation() {
  /**
   * Vérification de l'authentification.
   * @type {[boolean, function]} Tuple contenant l'état d'authentification et la fonction pour le mettre à jour.
   */
  const [isAuth, setIsAuth] = useState(false);
  
  /**
   * Effet pour vérifier l'authentification au chargement du composant.
   */
  useEffect(() => {
    if (localStorage.getItem('access_token') !== null) {
      setIsAuth(true);
    }
  }, [isAuth]);

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">GoldenLine, la mode tout simplement !!!</Navbar.Brand>
        <Nav>
          {isAuth ? <Nav.Link href="/logout">Logout</Nav.Link> : null}
        </Nav>
      </Navbar>
    </div>
  );
}
