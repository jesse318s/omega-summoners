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
  const [enemyCreature, setEnemyCreature] = useState([{ _id: 0, name: "", imgPath: "", hp: 0, attack: 0 }]);
  // sets player and enemy creature attack state
  const [playerAttackStatus, setPlayerAttackStatus] = useState(false);
  const [enemyAttackStatus, setEnemyAttackStatus] = useState(false);
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
    // generates random creature and updates player creature in database
    const genAsyncPlayerCreature = async () => {
      try {
        if (player[0].creatureId === "") {
          const { data } = await getCreatures();
          const randomCreature = data[Math.floor(Math.random() * data.length)]._id;
          updateUser(player[0]._id, { creatureId: randomCreature });
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

          if (player[0]) {
            genAsyncPlayerCreature();
          }

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
      if (battleStatus === false) {
        setPlayerCreatureHP(playerCreature[0].hp);
        const { data } = await getCreatures();
        const enemyCreatureData = [data[Math.floor(Math.random() * data.length)]];
        setEnemyCreature(enemyCreatureData);
        setEnemyCreatureHP(enemyCreatureData[0].hp);
        setBattleStatus(true);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  // player attack animation
  const playerAttackAnimation = () => {
    try {
      setPlayerAttackStatus(true);
      setTimeout(() => {
        setPlayerAttackStatus(false);
      }, 500);
      clearTimeout();
    } catch (error) {
      console.log(error);
    }
  }

  // enemy attack animation
  const enemyAttackAnimation = () => {
    try {
      setEnemyAttackStatus(true);
      setTimeout(() => {
        setEnemyAttackStatus(false);
      }, 500);
    } catch (error) {
      console.log(error);
    }
  }

  // initiates chance of enemy counter attack
  const enemyCounterAttack = () => {
    try {
      if (battleStatus && (Math.random() > 0.2)) {
        setTimeout(() => {
          enemyAttackAnimation();
        }, 500);

        if (playerCreatureHP - enemyCreature[0].attack * 1.5 <= 0) {
          setTimeout(() => {
            setBattleStatus(false);
            setEnemyCreature([{ _id: 0, name: "", imgPath: "" }]);
            setEnemyCreatureHP(0);
          }, 750);
        } else {
          setTimeout(() => {
            setPlayerCreatureHP(playerCreatureHP - enemyCreature[0].attack * 1.5);
          }, 750);
        }

      }
    } catch (error) {
      console.log(error);
    }
  }

  // attacks enemy creature
  const attackEnemy = async () => {
    try {
      playerAttackAnimation();
      if (enemyCreatureHP - playerCreature[0].attack <= 0) {
        setTimeout(() => {
          setBattleStatus(false);
          setEnemyCreature([{ _id: 0, name: "", imgPath: "" }]);
          setEnemyCreatureHP(0);
        }, 500);
        await updateUser(player[0]._id, { experience: player[0].experience + 5 });
      } else {
        setTimeout(() => {
          setEnemyCreatureHP(enemyCreatureHP - playerCreature[0].attack)
        }, 250);
      }
      enemyCounterAttack();
    } catch (error) {
      console.log(error);
    }
  }

  // renders if a player creature is detected
  if (playerCreature) {
    return (
      <>
        <header>
          {/* Navbar */}
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top text-start">
            {/* Container wrapper */}
            <div className="container-fluid">
              {/* Toggle button */}
              <button
                className="navbar-toggler"
                type="button"
                data-mdb-toggle="collapse"
                data-mdb-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <i className="fas fa-bars"></i>
              </button>

              {/* Collapsible wrapper */}
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                {/* Navbar brand */}
                <a className="navbar-brand" href="app">
                  <img src="favicon.ico" alt="favicon" width="48px" height="48px" />
                </a>
                {/* Left links */}
                <ul className="navbar-nav me-auto">
                  <li className="nav-item font-weight-bold">
                    <button className="btn btn-warning my-1" onClick={() => Userfront.logout()}>Logout</button>
                  </li>
                </ul>
                {/* Left links */}
              </div>
              {/* Collapsible wrapper */}

              {/* Right elements */}
              <div className="d-flex align-items-center">
                <button className="btn btn-light my-1" onClick={() => setPlayerOptionsStatus(!playerOptionsStatus)}>Player Options</button>
              </div>
              {/* Right elements */}
            </div>
            {/* Container wrapper */}
          </nav>
          {/* Navbar */}
        </header>

        <main className="game_section">
          {/* player options */}
          {playerOptionsStatus ?
            <div className="player_options">
              <h3>Player Options</h3>
              <button className="btn btn-light my-2" onClick={() => { setAvatarOptionStatus(!avatarOptionStatus) }}>Change Avatar</button>
              {avatarOptionStatus ? <div>
                <div className="my-1" onClick={() => selectAvatar("img/avatar/f_mage_avatar.png")}>
                  <img className="player_avatar" src={"img/avatar/f_mage_avatar.png"} alt={"f_mage"} width="96" height="96" /> Avatar 1</div>
                <div className="my-1" onClick={() => selectAvatar("img/avatar/m_mage_avatar.png")}>
                  <img className="player_avatar" src={"img/avatar/m_mage_avatar.png"} alt={"m_mage"} width="96" height="96" /> Avatar 2</div>
                <div className="my-1" onClick={() => selectAvatar("img/avatar/f_rogue_avatar.png")}>
                  <img className="player_avatar" src={"img/avatar/f_rogue_avatar.png"} alt={"f_rogue"} width="96" height="96" /> Avatar 3</div>
                <div className="my-1" onClick={() => selectAvatar("img/avatar/m_rogue_avatar.png")}>
                  <img className="player_avatar" src={"img/avatar/m_rogue_avatar.png"} alt={"m_rogue"} width="96" height="96" /> Avatar 4</div>
                <div className="my-1" onClick={() => selectAvatar("img/avatar/f_warrior_avatar.png")}>
                  <img className="player_avatar" src={"img/avatar/f_warrior_avatar.png"} alt={"f_warrior"} width="96" height="96" /> Avatar 5</div>
                <div className="my-1" onClick={() => selectAvatar("img/avatar/m_warrior_avatar.png")}>
                  <img className="player_avatar" src={"img/avatar/m_warrior_avatar.png"} alt={"m_warrior"} width="96" height="96" /> Avatar 6</div></div>
                : <div></div>}
              <button className="btn btn-light my-2" onClick={() => { setNameOptionStatus(!nameOptionStatus) }}>Change Name</button>
              {nameOptionStatus ? <form>
                <label htmlFor="name">Player name:&nbsp;</label>
                <input type="text" name="name" placeholder={player[0].name} onChange={(e) => selectName(e.target.value)} />
              </form> : null}
            </div>
            : <div></div>}

          {/* player details */}
          <div className="player_details">
            {player.map((player) => (
              <div
                key={player._id}
              >
                <img src={player.avatarPath}
                  alt={player.name}
                  className="player_avatar"
                  width="96"
                  height="96" />
                <h2>{player.name}</h2>
                <h4>Experience: {player.experience}</h4>
              </div>
            ))}
            <button className="btn btn-light" onClick={loadAsyncDataBattle}>Battle Hellspawn</button>
          </div>

          {/* player creature */}
          <div className="player_creature">
            {playerCreature.map((creature) => (
              <div
                key={creature._id}
              >
                {playerAttackStatus ? <img src={creature.imgPath.slice(0, -4) + "_attack.png"} alt={creature.name} />
                  : enemyAttackStatus && (enemyCreatureHP !== 0) ? <img src={creature.imgPath.slice(0, -4) + "_hurt.png"} alt={creature.name} /> : <img src={creature.imgPath} alt={creature.name} />
                }
                {battleStatus ?
                  <h4>HP: {playerCreatureHP}</h4>
                  : null}
                {player.map((player) => (
                  <div
                    key={player._id}
                  >
                    <h4>{player.name}'s {creature.name}</h4></div>))}

                {battleStatus ?
                  <button className="btn btn-light" onClick={() => { attackEnemy(); }}>Attack</button>
                  : null}
              </div>
            ))}
          </div>

          {/* enemy creature */}
          {battleStatus ?
            <div className="enemy_creature">
              {enemyCreature.map((creature) => (
                <div
                  key={creature._id}
                >
                  {enemyAttackStatus ? <img className="enemy_creature_img" src={creature.imgPath.slice(0, -4) + "_attack.png"} alt={creature.name} />
                    : playerAttackStatus ? <img className="enemy_creature_img" src={creature.imgPath.slice(0, -4) + "_hurt.png"} alt={creature.name} />
                      : <img className="enemy_creature_img" src={creature.imgPath} alt={creature.name} />}
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