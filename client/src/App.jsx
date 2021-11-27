import { useEffect, useState } from "react";
import './App.scss';
import Userfront from "@userfront/react";
import { Navigate } from "react-router-dom";
import { getUsers, addUser, updateUser } from './services/userServices';
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
  // sets player creature state
  const [playerCreature, setPlayerCreature] = useState([]);

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

  // retrieves user data, generates new user if needed, and updates user state on load
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
              avatarPath: null,
              experience: 0,
              creatureId: null,
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
    // loads player creature data
    const loadAsyncDataPlayer = async () => {
      try {
        const { data } = await getCreatures();
        const playerCreatureData = data.filter(creature => creature._id === player[0].creatureId);
        setPlayerCreature(playerCreatureData);
      }
      catch (error) {
        console.log(error);
      }
    }
    loadAsyncDataPlayer();
  }, [player, userfrontId]);

  // generates random creature, updates player creature in database, and then updates player creature state
  useEffect(() => {
    const checkAsyncDataCreature = async () => {
      try {
        if (player[0].creatureId === null) {
          const { data } = await getCreatures();
          const randomCreature = data[Math.floor(Math.random() * data.length)];
          updateUser(player[0]._id, { creatureId: randomCreature._id });
          setPlayerCreature(randomCreature);
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    checkAsyncDataCreature();
  }, [player]);

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

      {/* player details */}
      <div>
        {playerCreature.map((creature) => (
          <div
            key={creature._id}
          >
            <img src={creature.imgPath} alt={creature.name} />
            {creature.name}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
