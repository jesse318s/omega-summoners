import { useState, useEffect } from 'react';
import Userfront from "@userfront/react";
import { getCreatures } from './services/creatureServices';

// initialize Userfront
Userfront.init("rbvqd5nd");

// initialize signup and login form
const SignupForm = Userfront.build({ toolId: "odnabd" });
const LoginForm = Userfront.build({ toolId: "knblro" });

// landing page component
function Home() {
    //sets creatures state
    const [creatures, setCreatures] = useState([]);

    //retrieves creatures on load
    const loadAsyncData = async () => {
        try {
            const { data } = await getCreatures();
            setCreatures(data);
        } catch (error) {
            console.log(error);
        }
    }

    //calls data retrieval on load
    useEffect(() => {
        loadAsyncData();
    }, []);

    return (
        <>
            {/* title */}
            <div>
                <h1>Creatures</h1>
            </div>

            {/* creatures */}
            <div>
                {creatures.map((creature) => (
                    <div
                        key={creature._id}
                    >
                        {creature.name}<br />
                        <img src={creature.img_path} alt={creature.name} />
                    </div>
                ))}
            </div>

            <SignupForm />
            <LoginForm />
        </>
    );
}

export default Home;