import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Définition de la page d'accueil
export const Home = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Vérification de l'authentification
    useEffect(() => {
        if(localStorage.getItem('access_token') === null){
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
