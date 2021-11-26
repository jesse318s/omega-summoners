import React, { useEffect } from "react";
import Userfront from "@userfront/react";
import { Navigate } from "react-router-dom";
import { getUsers } from './services/userServices';

Userfront.init("rbvqd5nd");

const LogoutButton = Userfront.build({ toolId: "rodmkm" });

function Home() {

    const checkAuth = async () => {
        if (!Userfront.accessToken()) {
            return (
                <Navigate
                    to={{
                        pathname: "/",
                        state: { from: window.location },
                    }}
                />
            );
        }
    }


    //calls data retrieval on load
    useEffect(() => {

        checkAuth();

    }, []);

    return (
        <>
            <div>
                Home<br />
                <LogoutButton />
            </div>
        </>
    );
}

export default Home;