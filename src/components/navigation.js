import { Nav } from 'react-bootstrap';
import {Navbar} from 'react-bootstrap';
import React, { useState, useEffect} from 'react';export function Navigation() {   const [isAuth, setIsAuth] = useState(false);   useEffect(() => {     if (localStorage.getItem('access_token') !== null) {        setIsAuth(true); 
      }    }, [isAuth]);     return ( 
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">GoldenLine, la mode tout simplement !!!</Navbar.Brand>            
          <Nav>
          {isAuth ? <Nav.Link href="/logout">Logout</Nav.Link> :  
                    null}
          </Nav>
        </Navbar>
       </div>
     );
}   