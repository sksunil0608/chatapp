import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';

export default function useAuthorization() {
    const [isAutorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Your backend API call for authorization goes here
        const checkAuthorization = async () => {
            try {
                // Assuming your backend API returns a boolean indicating authorization
                const response = await fetch("/api/checkAuthorization");
                const data = await response.json();
                setIsAuthorized(data.isAuthorized);
            } catch (error) {
                console.error("Error checking authorization:", error);
            }
        };

        checkAuthorization();
    }, []);


    useEffect(()=>{
        if(!isAutorized){
            navigate("/unauthorized")
        }
    },[isAutorized,navigate])

  return isAutorized;
}
