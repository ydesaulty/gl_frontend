import React, { useState, useEffect } from 'react';
import { Nav, Navbar } from 'react-bootstrap';

// Définition du composant de navigation
export function Navigation() {
  const [isAuth, setIsAuth] = useState(false);

  // Vérification de l'authentification
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
