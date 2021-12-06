import React, { useEffect, useState } from "react";
import './App.scss';
import Userfront from "@userfront/core";
import { useNavigate } from "react-router-dom";
import { getUsers, addUser, updateUser } from './services/userServices';
import { getCreatures } from './services/creatureServices';

// initialize Userfront
Userfront.init("rbvqd5nd");

// main app component
function App() {
  // navigation hook
  const navigate = useNavigate();

  // sets player and userfront id state
  const [player, setPlayer] = useState([{ _id: 0, userfrontId: 0, name: "", avatarPath: "", experience: 0, creatureId: "" }]);
  const [userfrontId] = useState(Userfront.user.userId);
  // sets player options states
  const [playerOptionsStatus, setPlayerOptionsStatus] = useState(false);
  const [avatarOptionStatus, setAvatarOptionStatus] = useState(false);
  const [nameOptionStatus, setNameOptionStatus] = useState(false);
  // sets player creature state
  const [playerCreature, setPlayerCreature] = useState([{ _id: 0, name: "", imgPath: "", hp: 0, attack: 0 }]);
  // sets battle and enemy creature state
  const [battleStatus, setBattleStatus] = useState(false);
  const [enemyCreature, setEnemyCreature] = useState([{ _id: 0, name: "", imgPath: "" }]);
  // sets player and enemy creature hp state
  const [playerCreatureHP, setPlayerCreatureHP] = useState(0);
  const [enemyCreatureHP, setEnemyCreatureHP] = useState(0);

  useEffect(() => {
    // checks for userfront authentication and redirects visitor if not authenticated
    const checkAuth = () => {
      if (!Userfront.accessToken()) {
        navigate('/');
      }
    }
    checkAuth();
  });

  useEffect(() => {
    // generates random creature, updates player creature in database, and then updates player creature state
    const genAsyncPlayerCreature = async () => {
      try {
        if (player[0].creatureId === "") {
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
    // retrieves user data, generates new user if needed, and updates player state
    const loadAsyncDataPlayer = async () => {
      try {
        const { data } = await getUsers();
        const userData = data.filter(user => user.userfrontId === userfrontId);
        if (userfrontId !== userData.userfrontId) {
          const newUser = {
            userfrontId: userfrontId,
            name: Userfront.user.email,
            avatarPath: "img/avatar/m_mage_avatar.png",
            experience: 0,
            creatureId: "",
          }
          await addUser(newUser);
          const newUserData = data.filter(user => user.userfrontId === userfrontId);
          setPlayer(newUserData)

          if (player[0]) { genAsyncPlayerCreature(); }

        } else {
          setPlayer(userData);
        }
      } catch (error) {
        console.log(error);
      }
    }
    loadAsyncDataPlayer();
    if (player[0]) {
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
    }
  }, [player, userfrontId]);

  // updates player avatar path in database
  const selectAvatar = async (avatarPath) => {
    try {
      await updateUser(player[0]._id, { avatarPath: avatarPath });
    }
    catch (error) {
      console.log(error);
    }
  }

  // updates player name in database
  const selectName = async (name) => {
    try {
      await updateUser(player[0]._id, { name: name });
    }
    catch (error) {
      console.log(error);
    }
  }

  // loads battle data
  const loadAsyncDataBattle = async () => {
    try {
      setBattleStatus(true);
      setPlayerCreatureHP(playerCreature[0].hp);
      const { data } = await getCreatures();
      const enemyCreatureData = [data[Math.floor(Math.random() * data.length)]];
      setEnemyCreature(enemyCreatureData);
      setEnemyCreatureHP(enemyCreatureData[0].hp);
    }
    catch (error) {
      console.log(error);
    }
  }

  const attackEnemy = async () => {
    try {
      setEnemyCreatureHP(enemyCreatureHP - playerCreature[0].attack);
      if (enemyCreatureHP - playerCreature[0].attack <= 0) {
        setBattleStatus(false);
        setEnemyCreatureHP(enemyCreature[0].hp);
        await updateUser(player[0]._id, { experience: player[0].experience + 5 });
      } else if (Math.random() > 0.2) {
        setPlayerCreatureHP(playerCreatureHP - enemyCreature[0].attack * 1.5);
        if (playerCreatureHP - enemyCreature[0].attack * 1.5 <= 0) {
          setBattleStatus(false);
          setPlayerCreatureHP(playerCreature[0].hp);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (playerCreature) {
    return (
      <>
        <header>
          {/* title and nav */}
          <nav className="text-light">
            <ul>
              <li><button onClick={() => Userfront.logout()}>Logout</button></li>
              <li><button onClick={() => setPlayerOptionsStatus(!playerOptionsStatus)}>Player Options</button></li>
            </ul>
          </nav>
        </header>

        <main>
          {/* player options */}
          {playerOptionsStatus ?
            <div className="text-light">
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
                  <label htmlFor="name">Player name:</label>
                  <input type="text" name="name" placeholder={player[0].name} onChange={(e) => selectName(e.target.value)} />
                </form> : null}
              </ul>
            </div>
            : <div></div>}

          {/* player details */}
          <div className="text-light">
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
          <button onClick={loadAsyncDataBattle}>Battle Hellspawn</button>
          <div className="text-light">
            {playerCreature.map((creature) => (
              <div
                key={creature._id}
              >
                <img src={creature.imgPath} alt={creature.name} />
                {battleStatus ?
                  <h4>HP: {playerCreatureHP}</h4>
                  : null}
                {player.map((player) => (
                  <div
                    key={player._id}
                  >
                    <h4>{player.name}'s {creature.name}</h4></div>))}

                {battleStatus ?
                  <button onClick={() => { attackEnemy() }}>Attack</button>
                  : null}
              </div>
            ))}
          </div>

          {/* enemy creature */}
          {battleStatus ?
            <div className="text-light">
              {enemyCreature.map((creature) => (
                <div
                  key={creature._id}
                >
                  <img src={creature.imgPath} alt={creature.name} />
                  <h4>HP: {enemyCreatureHP}</h4>
                  <h4>Enemy {creature.name}</h4>
                </div>
              ))}
            </div>
            : null}
        </main>
      </>
    );
  }
  else return (<></>);
}

export default App;