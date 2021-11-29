import React, { useEffect, useState } from "react";
import './App.scss';
import Userfront from "@userfront/react";
import { useNavigate } from "react-router-dom";
import { getUsers, addUser, updateUser } from './services/userServices';
import { getCreatures } from './services/creatureServices';

// initialize Userfront
Userfront.init("rbvqd5nd");

// initialize logout button
const LogoutButton = Userfront.build({ toolId: "rodmkm" });

// main app component
function App() {
  // navigate hook
  const navigate = useNavigate();

  // sets user and userfront id state
  const [player, setPlayer] = useState([{ _id: 0, userfrontId: 0, name: "", avatarPath: "", experience: 0, creatureId: 0 }]);
  const [userfrontId] = useState(Userfront.user.userId);
  // sets player creature state
  const [playerCreature, setPlayerCreature] = useState([{ _id: 0, name: "", imgPath: "" }]);
  // sets battle state
  const [battleStatus, setBattleStatus] = useState(false);
  // sets enemy creature state
  const [enemyCreature, setEnemyCreature] = useState([{ _id: 0, name: "", imgPath: "" }]);

  // calls authentication on load
  useEffect(() => {
    // checks for userfront authentication and redirects user if not authenticated
    const checkAuth = () => {
      if (!Userfront.accessToken()) {
        navigate('/');
      }
    }
    checkAuth();
  });

  useEffect(() => {
    // retrieves user data, generates new user if needed, and updates user state on load
    const loadAsyncDataPlayer = async () => {
      try {
        const { data } = await getUsers();
        const userData = data.filter(user => user.userfrontId === userfrontId);

        try {
          if (userfrontId !== userData.userfrontId) {
            const newUser = {
              userfrontId: userfrontId,
              name: Userfront.user.name,
              avatarPath: "",
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
    loadAsyncDataPlayer();
    // generates random creature, updates player creature in database, and then updates player creature state
    const checkAsyncDataPlayerCreature = async () => {
      try {
        if (player[0].creatureId === null) {
          const { data } = await getCreatures();
          const randomCreature = data[Math.floor(Math.random() * data.length)]._id;
          updateUser(player[0]._id, { creatureId: randomCreature });
          setPlayerCreature(player[0].creatureId);
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    checkAsyncDataPlayerCreature();
    // loads player creature data
    const loadAsyncDataPlayerCreature = async () => {
      try {
        const { data } = await getCreatures();
        const playerCreatureData = data.filter(creature => creature._id === player[0].creatureId);
        setPlayerCreature(playerCreatureData);
      }
      catch (error) {
        console.log(error);
      }
    }
    loadAsyncDataPlayerCreature();
  }, [player, userfrontId]);

  // loads player creature data
  const loadAsyncDataEnemy = async () => {
    try {
      setBattleStatus(true);
      const { data } = await getCreatures();
      const enemyCreatureData = data.filter(creature => creature._id === "61a468eced68cee6f9504bc0");
      setEnemyCreature(enemyCreatureData);
    }
    catch (error) {
      console.log(error);
    }
  }

  // loads player options
  const displayPlayerOptions = async () => {
    try {

    }
    catch (error) {
      console.log(error);
    }
  }

  if (playerCreature) {
    return (
      <>
        <header>
          {/* title and nav */}
          <nav>
            <ul>
              <li><LogoutButton /></li>
              <li><button onClick={displayPlayerOptions}>Player Options</button></li>
              <li><button onClick={loadAsyncDataEnemy}>Battle Hellspawn</button></li>
            </ul>
          </nav>
        </header>

        <main>
          {/* player details */}
          <div>
            {player.map((user) => (
              <div
                key={user._id}
              >
                <h4>{user.name}</h4>
                <h4>Experience: {user.experience}</h4>
              </div>
            ))}
          </div>

          {/* player creature */}
          <div>
            {playerCreature.map((creature) => (
              <div
                key={creature._id}
              >
                <img src={creature.imgPath} alt={creature.name} /><br />
                <h4>{creature.name}</h4>
              </div>
            ))}
          </div>

          {/* enemy creature */}
          {battleStatus ?
            <div>
              {enemyCreature.map((creature) => (
                <div
                  key={creature._id}
                >
                  <img src={creature.imgPath} alt={creature.name} /><br />
                  <h4>{creature.name}</h4>
                </div>
              ))}
            </div>
            : <div></div>}
        </main>
      </>
    );
  }
  else return (<></>);
}

export default App;