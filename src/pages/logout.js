import { useEffect } from "react";
import axios from "axios";

export const Logout = () => {
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.post('https://gl-yrae-backend-24c518b70d2a.herokuapp.com/token/refresh/', {
                    refresh: localStorage.getItem('refresh_token')
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });

                localStorage.clear();
                axios.defaults.headers.common['Authorization'] = null;
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
