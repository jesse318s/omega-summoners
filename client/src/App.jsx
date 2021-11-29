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
  // sets player options states
  const [playerOptionsStatus, setPlayerOptionsStatus] = useState(false);
  const [avatarOptionStatus, setAvatarOptionStatus] = useState(false);
  const [nameOptionStatus, setNameOptionStatus] = useState(false);
  // sets player creature state
  const [playerCreature, setPlayerCreature] = useState([{ _id: 0, name: "", imgPath: "" }]);
  // sets battle and enemy creature state
  const [battleStatus, setBattleStatus] = useState(false);
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
              avatarPath: "img/avatar/m_warrior_avatar.png",
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

  const selectAvatar = async (avatarPath) => {
    try {
      await updateUser(player[0]._id, { avatarPath: avatarPath });
    }
    catch (error) {
      console.log(error);
    }
  }

  const selectName = async (name) => {
    try {
      await updateUser(player[0]._id, { name: name });
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
              <li><button onClick={() => setPlayerOptionsStatus(!playerOptionsStatus)}>Player Options</button></li>
            </ul>
          </nav>
        </header>

        <main>
          {/* player options */}
          {playerOptionsStatus ?
            <div>
              <h3>Player Options</h3>
              <ul>
                <li><button onClick={() => { setAvatarOptionStatus(!avatarOptionStatus) }}>Change Avatar</button></li>
                {avatarOptionStatus ? <div>
                  <div onClick={() => selectAvatar("img/avatar/f_mage_avatar.png")}>
                    <img src={"img/avatar/f_mage_avatar.png"} alt={"f_mage"} width="100" height="100" />Avatar 1</div>
                  <div onClick={() => selectAvatar("img/avatar/m_mage_avatar.png")}>
                    <img src={"img/avatar/m_mage_avatar.png"} alt={"m_mage"} width="100" height="100" />Avatar 2</div>
                  <div onClick={() => selectAvatar("img/avatar/f_rogue_avatar.png")}>
                    <img src={"img/avatar/f_rogue_avatar.png"} alt={"f_rogue"} width="100" height="100" />Avatar 3</div>
                  <div onClick={() => selectAvatar("img/avatar/m_rogue_avatar.png")}>
                    <img src={"img/avatar/m_rogue_avatar.png"} alt={"m_rogue"} width="100" height="100" />Avatar 4</div>
                  <div onClick={() => selectAvatar("img/avatar/f_warrior_avatar.png")}>
                    <img src={"img/avatar/f_warrior_avatar.png"} alt={"f_warrior"} width="100" height="100" />Avatar 5</div>
                  <div onClick={() => selectAvatar("img/avatar/m_warrior_avatar.png")}>
                    <img src={"img/avatar/m_warrior_avatar.png"} alt={"m_warrior"} width="100" height="100" />Avatar 6</div></div>
                  : <div></div>}
                <li><button onClick={() => { setNameOptionStatus(!nameOptionStatus) }}>Change Name</button></li>
                {nameOptionStatus ? <form>
                  <label for="name">Player name:</label>
                  <input type="text" name="name" placeholder={player[0].name} onChange={(e) => selectName(e.target.value)} />
                </form> : <div></div>}
              </ul>
            </div>
            : <div></div>}

          {/* player details */}
          <div>
            {player.map((player) => (
              <div
                key={player._id}
              >
                <img src={player.avatarPath} alt={player.name} width="100" height="100" />
                <h2>{player.name}</h2>
                <h4>Experience: {player.experience}</h4>
              </div>
            ))}
          </div>

          {/* player creature */}
          <button onClick={loadAsyncDataEnemy}>Battle Hellspawn</button>
          <div>
            {playerCreature.map((creature) => (
              <div
                key={creature._id}
              >
                <img src={creature.imgPath} alt={creature.name} /><br />
                <h4>{Userfront.user.name}'s {creature.name}</h4>
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
                  <h4>Enemy {creature.name}</h4>
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