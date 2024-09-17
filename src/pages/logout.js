/**
 * @fileoverview Composant Logout pour gérer la déconnection.
 * @requires react
 * @requires axios
 */
import { useEffect } from "react";
import axios from "axios";

/**
 * Composant Logout pour gérer le processus de déconnection.
 * Ce composant n'a pas de rendu visuel, il effectue seulement des opérations de nettoyage et de redirection.
 * 
 * @component
 * @returns {React.Element} Elément React vide.
 */
export const Logout = () => {
    /**
    * Effet pour gérer le processus de déconnection.
    * Rafraîchissement du token, puis nettoiyage du localStorage et des en-têtes axios,
    * puis redirection de l'utilisateur vers la page de connection.
    */
    useEffect(() => {
        /**
        * Fonction pour gérer le processus de déconnection.
        */
        (async () => {
            try {
                const { data } = await axios.post('https://gl-yrae-backend-24c518b70d2a.herokuapp.com/token/refresh/', {
                    refresh: localStorage.getItem('refresh_token')
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });

                // Nettoyage du localStorage
                localStorage.clear();

                // Suppression de l'en-tête d'autorisation dans axios
                axios.defaults.headers.common['Authorization'] = null;
                
                // Redirection vers la page de connection
                window.location.href = '/login';
            } catch (e) {
                console.log('logout not working', e);
            }
        })();
    }, []);

    return (
        <div></div>
    )
}
