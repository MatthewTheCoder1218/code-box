import React, { useState, useEffect } from "react";
import supabase from "../helper/supabaseClient";
import { Navigate, useLocation } from "react-router-dom";

function Wrapper({children}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const getSession = async () => {

            const {
                data: { session },
            } = await supabase.auth.getSession();

            setIsAuthenticated(!!session);
            setLoading(false);
        }

        getSession();
    }, []);
    
    if (loading) {
        return <div className="flex align-middle justify-center mt-[200px] font-bold text-[20px]">Loading...</div>
    } else {
        if (isAuthenticated) {
            return <>{children}</>;
        }
        return <Navigate to="/login" />;
    }
}

export default Wrapper;