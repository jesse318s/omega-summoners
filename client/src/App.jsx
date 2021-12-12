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
  const [player, setPlayer] = useState([{ _id: 0, userfrontId: 0, name: "", avatarPath: "", experience: 0, drachmas: 0, creatureId: "", displayCreatureStats: false }]);
  const [userfrontId] = useState(Userfront.user.userId);
  // sets player options states
  const [optionsStatus, setOptionsStatus] = useState(false);
  const [avatarOptionStatus, setAvatarOptionStatus] = useState(false);
  const [nameOptionStatus, setNameOptionStatus] = useState(false);
  // sets player creature state
  const [playerCreature, setPlayerCreature] = useState([{ _id: 0, name: "", imgPath: "", hp: 0, attack: 0, speed: 0, defense: 0, critical: 0 }]);
  // sets creature stats state
  const [creatureStatsStatus, setCreatureStatsStatus] = useState(false);
  // sets battle and enemy creature state
  const [battleStatus, setBattleStatus] = useState(false);
  const [enemyCreature, setEnemyCreature] = useState([{ _id: 0, name: "", imgPath: "", hp: 0, attack: 0, speed: 0, defense: 0, critical: 0 }]);
  // sets player and enemy creature attack state
  const [playerAttackStatus, setPlayerAttackStatus] = useState(false);
  const [enemyAttackStatus, setEnemyAttackStatus] = useState(false);
  // sets player and enemy creature hp state
  const [playerCreatureHP, setPlayerCreatureHP] = useState(0);
  const [enemyCreatureHP, setEnemyCreatureHP] = useState(0);
  // sets crit modifier state
  const [criticalAttackMultiplier, setCriticalAttackMultiplier] = useState(1);

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
            avatarPath: "img/avatar/placeholder_avatar.png",
            experience: 0,
            drachmas: 0,
            creatureId: "",
            displayCreatureStats: false
          }
          await addUser(newUser);
          const newUserData = data.filter(user => user.userfrontId === userfrontId);
          setPlayer(newUserData);

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
    // if a player exists
    if (player[0]) {
      // loads player creature data
      const loadAsyncDataPlayerCreature = async () => {
        try {
          const { data } = await getCreatures();
          const playerCreatureData = data.filter(creature => creature._id === player[0].creatureId);
          setPlayerCreature(playerCreatureData);
          setCreatureStatsStatus(player[0].displayCreatureStats);
        }
        catch (error) {
          console.log(error);
        }
      }
      loadAsyncDataPlayerCreature();
    }
  }, [player, userfrontId]);

  // toggles display creature stats in database
  const toggleDisplayCreatureStats = async () => {
    try {
      await updateUser(player[0]._id, { displayCreatureStats: !creatureStatsStatus });
    }
    catch (error) {
      console.log(error);
    }
  }

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
      if (!battleStatus) {
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
      var chanceEnemy = false;
      if (enemyCreature[0].speed === playerCreature[0].speed) {
        chanceEnemy = Math.random() >= 0.5;
      } else {
        chanceEnemy = Math.random() >= playerCreature[0].speed / 100 - enemyCreature[0].speed / 100;
      }
      if (battleStatus && chanceEnemy) {
        setTimeout(() => {
          enemyAttackAnimation();
        }, 500);
        if (Math.random() <= enemyCreature[0].critical / 100) {
          setCriticalAttackMultiplier(1.5);
        }

        if (playerCreatureHP - (enemyCreature[0].attack - enemyCreature[0].attack * (playerCreature[0].defense / 100)) * criticalAttackMultiplier <= 0) {
          setTimeout(() => {
            setBattleStatus(false);
            setEnemyCreature([{
              _id: 0,
              name: "",
              imgPath: "",
              hp: 0,
              attack: 0,
              speed: 0,
              defense: 0,
              critical: 0
            }]);
            setEnemyCreatureHP(0);
          }, 750);
        } else {
          setTimeout(() => {
            setPlayerCreatureHP(playerCreatureHP - (enemyCreature[0].attack - enemyCreature[0].attack * (playerCreature[0].defense / 100)));
          }, 750);
        }

      }
    } catch (error) {
      console.log(error);
    }
  }

  // initiates chance to attack enemy creature
  const attackEnemy = async () => {
    try {
      var chancePlayer = false;
      if (playerCreature[0].speed === enemyCreature[0].speed) {
        chancePlayer = Math.random() >= 0.5;
      } else {
        chancePlayer = Math.random() >= enemyCreature[0].speed / 100 - playerCreature[0].speed / 100;
      }
      if (Math.random() <= playerCreature[0].critical / 100) {
        setCriticalAttackMultiplier(1.5);
      }
      if (enemyCreatureHP - (playerCreature[0].attack - playerCreature[0].attack * (enemyCreature[0].defense / 100)) * criticalAttackMultiplier <= 0 && chancePlayer) {
        playerAttackAnimation();
        setTimeout(() => {
          setBattleStatus(false);
          setEnemyCreature([{ _id: 0, name: "", imgPath: "", hp: 0, attack: 0, speed: 0, defense: 0, critical: 0 }]);
          setEnemyCreatureHP(0);
        }, 500);
        await updateUser(player[0]._id, { experience: player[0].experience + 5, drachmas: player[0].drachmas + 3 });
      } else if (chancePlayer) {
        playerAttackAnimation();
        setTimeout(() => {
          setEnemyCreatureHP(enemyCreatureHP - (playerCreature[0].attack - playerCreature[0].attack * (enemyCreature[0].defense / 100)) * criticalAttackMultiplier);
        }, 250);
      }
      setCriticalAttackMultiplier(1);
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
                <button className="btn btn-light my-1" onClick={() => setOptionsStatus(!optionsStatus)}>Options</button>
              </div>
              {/* Right elements */}
            </div>
            {/* Container wrapper */}
          </nav>
          {/* Navbar */}
        </header>

        <main>
          {/* options */}
          {optionsStatus ?
            <div className="options">
              <h3>Game Options</h3>
              <button className="btn btn-light my-2" onClick={() => { toggleDisplayCreatureStats() }}>Toggle Creature Stats</button>
              <h3>Player Options</h3>
              <button className="btn btn-light my-2" onClick={() => { setAvatarOptionStatus(!avatarOptionStatus) }}>Change Avatar</button>
              {avatarOptionStatus ? <div>
                <div className="my-1" onClick={() => selectAvatar("img/avatar/f_mage_avatar.png")}>
                  <img className="player_avatar avatar_option" src={"img/avatar/f_mage_avatar.png"} alt={"f_mage"} width="96" height="96" /> Avatar 1</div>
                <div className="my-1" onClick={() => selectAvatar("img/avatar/m_mage_avatar.png")}>
                  <img className="player_avatar avatar_option" src={"img/avatar/m_mage_avatar.png"} alt={"m_mage"} width="96" height="96" /> Avatar 2</div>
                <div className="my-1" onClick={() => selectAvatar("img/avatar/f_rogue_avatar.png")}>
                  <img className="player_avatar avatar_option" src={"img/avatar/f_rogue_avatar.png"} alt={"f_rogue"} width="96" height="96" /> Avatar 3</div>
                <div className="my-1" onClick={() => selectAvatar("img/avatar/m_rogue_avatar.png")}>
                  <img className="player_avatar avatar_option" src={"img/avatar/m_rogue_avatar.png"} alt={"m_rogue"} width="96" height="96" /> Avatar 4</div>
                <div className="my-1" onClick={() => selectAvatar("img/avatar/f_warrior_avatar.png")}>
                  <img className="player_avatar avatar_option" src={"img/avatar/f_warrior_avatar.png"} alt={"f_warrior"} width="96" height="96" /> Avatar 5</div>
                <div className="my-1" onClick={() => selectAvatar("img/avatar/m_warrior_avatar.png")}>
                  <img className="player_avatar avatar_option" src={"img/avatar/m_warrior_avatar.png"} alt={"m_warrior"} width="96" height="96" /> Avatar 6</div>
              </div>
                : null}
              <button className="btn btn-light my-2 ms-1" onClick={() => { setNameOptionStatus(!nameOptionStatus) }}>Change Name</button>
              {nameOptionStatus ? <form>
                <label htmlFor="name">Player name:&nbsp;</label>
                <input type="text" name="name" placeholder={player[0].name} onChange={(e) => selectName(e.target.value)} />
              </form> : null}
            </div>
            : null}

          {/* player */}
          <div className="player">
            {player.map((player) => (
              <div
                key={player._id}
              >
                <img src={player.avatarPath}
                  alt={player.name}
                  className="player_avatar"
                  width="96"
                  height="96" />
                <h4>{player.name}</h4>
                <h5>
                  Level {Math.floor(player.experience / 100 / 2.5)}
                  <div className="progress_bar_container">
                    <div className="experience_progress_bar"
                      style={{ width: ((player.experience / 100 / 2.5 - Math.floor(player.experience / 100 / 2.5)).toFixed(2)).replace("0.", '') + "%" }} />
                  </div>
                </h5>
                <h5>Drachmas: {player.drachmas} <i className="fas fa-coins" /></h5>
              </div>
            ))}
            <button className="game_button" onClick={loadAsyncDataBattle}>Battle Hellspawn</button>
          </div>

          {/* player creature */}
          <div className="player_creature">
            {playerCreature.map((creature) => (
              <div
                key={creature._id}
              >
                {battleStatus ?
                  <button className="game_button" onClick={() => { attackEnemy() }}>Attack</button>
                  : null}
                {playerAttackStatus ? <img src={creature.imgPath.slice(0, -4) + "_attack.png"} alt={creature.name} width="128px" height="128px" />
                  : enemyAttackStatus && (enemyCreatureHP !== 0) ? <img src={creature.imgPath.slice(0, -4) + "_hurt.png"} alt={creature.name} width="128px" height="128px" />
                    : <img src={creature.imgPath} alt={creature.name} width="128px" height="128px" />
                }
                {player.map((player) => (
                  <div
                    key={player._id}
                  >
                    <h4>{player.name}'s {creature.name}</h4>
                    {!battleStatus ? <h5>HP: {creature.hp}</h5>
                      : !creatureStatsStatus ? <h5>HP: {playerCreatureHP} / {creature.hp}</h5>
                        : null}
                    {creatureStatsStatus ?
                      <div>
                        {battleStatus ? <h5>HP: {playerCreatureHP} / {creature.hp}</h5>
                          : null}
                        <h5>Attack: {creature.attack}</h5>
                        <h5>Speed: {creature.speed}</h5>
                        <h5>Defense: {creature.defense}</h5>
                        <h5>Critical: {creature.critical}</h5>
                      </div>
                      : null}
                  </div>))}
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
                  {enemyAttackStatus ? <img className="enemy_creature_img" src={creature.imgPath.slice(0, -4) + "_attack.png"} alt={creature.name} width="128px" height="128px" />
                    : playerAttackStatus ? <img className="enemy_creature_img" src={creature.imgPath.slice(0, -4) + "_hurt.png"} alt={creature.name} width="128px" height="128px" />
                      : <img className="enemy_creature_img" src={creature.imgPath} alt={creature.name} width="128px" height="128px" />}
                  <h4>Enemy {creature.name}</h4>
                  <h5>HP: {enemyCreatureHP} / {creature.hp}</h5>
                  {creatureStatsStatus ?
                    <div>
                      <h5>Attack: {creature.attack}</h5>
                      <h5>Speed: {creature.speed}</h5>
                      <h5>Defense: {creature.defense}</h5>
                      <h5>Critical: {creature.critical}</h5>
                    </div>
                    : null}
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