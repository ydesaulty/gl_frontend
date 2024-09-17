/**
 * @fileoverview Composant Login pour la gestion de l'authentification.
 * @requires axios
 * @requires react
 * @requires react-router-dom
 */
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Composant Login pour l'affichage du formulaire de connection et la gestion de l'authentification.
 * 
 * @component
 * @returns {React.Element} Elément React contenant le formulaire de connection.
 */
export const Login = () => {
    /**
   * Stockage du nom d'utilisateur.
   * @type {[string, function]} Tuple contenant le nom d'utilisateur et la fonction de mise à jour.
   */
    const [username, setUsername] = useState('');
    /**
   * Stockage du mot de passe.
   * @type {[string, function]} Tuple contenant le mot de passe et la fonction de mise à jour.
   */
    const [password, setPassword] = useState('');
    /**
   * Hook de navigation pour la redirection après connection.
   * @type {function} Fonction de navigation de react-router-dom.
   */
    const navigate = useNavigate();

    /**
   * Gestion du formulaire de connection.
   * Envoi de la requête POST pour obtenir les tokens d'authentification,
   * puis stockage des tokens dans le localStorage avant redirection vers la page d'accueil.
   * 
   * @async
   * @param {Event} e - Soumission du formulaire.
   */
    const submit = async e => {
        e.preventDefault();
        const user = {
            username: username,
            password: password
        };

        // Création de la requete POST pour récupération du token
        const { data } = await axios.post('https://gl-yrae-backend-24c518b70d2a.herokuapp.com/token/', user, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });

        // Initialisation des token d'acces & refresh (localstorage)
        localStorage.clear();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        
        // Configuration du header d'autorisation par défaut pour les futures requêtes
        axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;
        navigate('/homepage');
    }

    return (
        <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={submit}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign In</h3>
                    <div className="form-group mt-3">
                        <label>Username</label>
                        <input
                            className="form-control mt-1"
                            placeholder="Enter Username"
                            name='username'
                            type='text'
                            value={username}
                            required
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            name='password'
                            type="password"
                            className="form-control mt-1"
                            placeholder="Enter password"
                            value={password}
                            required
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <br></br>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    )
}
