/**
 * @fileoverview Page d'accueil avec vérification d'authentification.
 * @requires react
 * @requires axios
 * @requires react-router-dom
 */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * Définition de la page d'accueil et gestion de l'authentification.
 *
 * @component
 * @returns {React.Element} Un élément React contenant le message de bienvenue ou redirigeant vers la page de connexion.
 */
export const Home = () => {
   
    /**
   * Stockage du Tuple contenant le message et la fonction pour la mise à jour.
   * @type {Array<string|function>}
   */
    const [message, setMessage] = useState('');

    /**
   * Hook de navigation pour la redirection.
   * Fonction de navigation de react-router-dom.
   * @type {function}
   */
    const navigate = useNavigate();

    /**
   * Effet pour vérifier l'authentification et charger les données de l'utilisateur.
   */
    useEffect(() => {
        if(localStorage.getItem('access_token') === null){
            
            // Redirection vers la page de connexion si aucun token n'est présent
            navigate('/login');
        }
        else{
            (async () => {
                try {
                    const { data } = await axios.get(
                        'https://gl-yrae-backend-24c518b70d2a.herokuapp.com/home/', {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    setMessage(data.message);
                    navigate('/homepage'); // Redirection vers la page d'accueil
                } catch (e) {
                    console.log('not auth');
                }
            })();
        }
    }, [navigate]);

    return (
        <div className="form-signin mt-5 text-center">
            <h3>Hi {message}</h3>
        </div>
    )
}
