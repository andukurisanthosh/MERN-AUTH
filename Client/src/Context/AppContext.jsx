import axios from 'axios';
import React from 'react';
import { data } from 'react-router-dom';
import { toast } from 'react-toastify';
export const AppContext = React.createContext();

export const AppContextProvider = (props) => {
    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userData, setUserData] = React.useState(null);

    const getUserData = async () => {
        try {
            if (!isLoggedIn) {
            const { data } = await axios.get(backendUrl + '/api/user/profile')
            console.log(data);
            data.success ? setUserData(data.userData) : toast.error(data.message);
            }else{
                setUserData(null);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const getAuthStatus = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth')
            if (data.success) {
                setIsLoggedIn(true);
                getUserData();
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    React.useEffect(() => {
        getAuthStatus();
    }, [])

    const value = {
        backendUrl
        , isLoggedIn, setIsLoggedIn
        , userData, setUserData
        , getUserData
    };
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}