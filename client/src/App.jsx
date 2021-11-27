import { useEffect, useState } from "react";
import './App.scss';
import Userfront from "@userfront/react";
import { Navigate } from "react-router-dom";
import { getUsers, addUser } from './services/userServices';
import { getCreatures } from './services/creatureServices';

// initialize Userfront
Userfront.init("rbvqd5nd");

// initialize logout button
const LogoutButton = Userfront.build({ toolId: "rodmkm" });

// main app component
function App() {
  // sets user and userfront id state
  const [player, setPlayer] = useState([]);
  const [userfrontId, setUserfrontId] = useState(0);
  // sets creatures state
  const [creatures, setCreatures] = useState([]);

  // checks for userfront authentication and redirects user if not authenticated
  const checkAuth = () => {
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

  // calls authentication on load
  useEffect(() => {
    checkAuth();
  }, []);

  // retrieves user data, generates new user if needed, and updates user state
  useEffect(() => {
    const loadAsyncDataUser = async () => {
      try {
        const { data } = await getUsers();
        setUserfrontId(Userfront.user.userId);
        const userData = data.filter(user => user.userfrontId === userfrontId);

        try {
          if (userfrontId !== userData && userfrontId !== 0) {
            const newUser = {
              userfrontId: userfrontId,
              name: Userfront.user.name,
            }
            await addUser(newUser);
          }
        } catch (error) {
          console.log(error);
        }

        const newUserData = data.filter(user => user.userfrontId === userfrontId);
        setPlayer(newUserData);
      } catch (error) {
        console.log(error);
      }
    }
    loadAsyncDataUser();
  }, [player, userfrontId]);

  // retrieves creature data and updates creatures state
  useEffect(() => {
    const loadAsyncDataCreatures = async () => {
      try {
        const { data } = await getCreatures();
        setCreatures(data);
      }
      catch (error) {
        console.log(error);
      }
    }
    loadAsyncDataCreatures();
  }, [creatures]);

  return (
    <>
      {/* nav */}
      <div>
        <LogoutButton />
      </div>

      {/* user details */}
      <div>
        {player.map((user) => (
          <div
            key={user._id}
          >
            {user.name}
          </div>
        ))}
      </div>

      {/* creatures */}
      <div>
        {creatures.map((creature) => (
          <div
            key={creature._id}
          >
            {creature.name}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
