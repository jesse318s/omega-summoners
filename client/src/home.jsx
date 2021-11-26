import React, { useEffect, useState } from "react";
import Userfront from "@userfront/react";
import { Navigate } from "react-router-dom";
import { getUsers, addUser } from './services/userServices';

Userfront.init("rbvqd5nd");

const LogoutButton = Userfront.build({ toolId: "rodmkm" });

function Home() {

    const [users, setUsers] = useState([]);

    const [userfrontId, setUserfrontId] = useState(0);

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
            setUserfrontId(Userfront.user.userId);
            const userData = data.filter(user => user.userfrontId === userfrontId);
            if (userfrontId !== userData && userfrontId !== 0) {

                const pathArray = [
                    "img/creature/dragon_creature.png",
                    "img/creature/gryphon_creature.png"
                ];

                const randomPath = pathArray[Math.floor(Math.random() * pathArray.length)];

                const newUser = {
                    userfrontId: userfrontId,
                    name: Userfront.user.name,
                    img_path: randomPath,
                }

                addUser(newUser);
                setUsers(userData);

            }
            const newUserData = data.filter(user => user.userfrontId === userfrontId);
            setUsers(newUserData);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        checkAuth();
        loadAsyncData();

    });

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
                        {user.name}<br />
                        <img src={user.img_path} alt={user.name} />
                    </div>
                ))}
            </div>
        </>
    );
}

export default Home;