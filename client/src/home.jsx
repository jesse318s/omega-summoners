import React, { useEffect, useState } from "react";
import Userfront from "@userfront/react";
import { Navigate } from "react-router-dom";
import { getUsers } from './services/userServices';

Userfront.init("rbvqd5nd");

const LogoutButton = Userfront.build({ toolId: "rodmkm" });

function Home() {

    const [users, setUsers] = useState([]);

    const [userid, setUserid] = useState(0);

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

    const loadAsyncData = async () => {
        try {
            const { data } = await getUsers();
            setUsers(data);
            setUserid(Userfront.user.userId);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        checkAuth();
        loadAsyncData();

    }, []);

    return (
        <>
            <div>
                Home<br />
                <LogoutButton />
            </div>

            <div>
                {users.map((user) => (
                    <div
                        key={user._id}
                    >
                        {userid}<br />
                        {user.name}<br />
                        {user.creature}
                        <img src={user.img_path} alt={user.name} />
                    </div>
                ))}
            </div>
        </>
    );
}

export default Home;