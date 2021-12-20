import React, { useEffect, useState } from "react";
import './App.scss';
import Userfront from "@userfront/core";
import { useNavigate } from "react-router-dom";
import { getUser, addUser, updateUser } from './services/userServices';

// initialize Userfront
Userfront.init("rbvqd5nd");

// main app component
function App() {

  // creature objects
  const creatures = [
    {
      id: 1,
      name: "Demon",
      imgPath: "img/creature/demon_creature.png",
      hp: 60,
      attack: 50,
      speed: 60,
      defense: 20,
      critical: 50
    },
    {
      id: 2,
      name: "Medusa",
      imgPath: "img/creature/medusa_creature.png",
      hp: 110,
      attack: 30,
      speed: 30,
      defense: 15,
      critical: 20
    },
    {
      id: 3,
      name: "Baby Dragon",
      imgPath: "img/creature/small_dragon_creature.png",
      hp: 60,
      attack: 50,
      speed: 60,
      defense: 20,
      critical: 50
    },
    {
      id: 4,
      name: "Lizard",
      imgPath: "img/creature/lizard_creature.png",
      hp: 110,
      attack: 30,
      speed: 30,
      defense: 15,
      critical: 20
    }
  ];

  // relic objects
  const relics = [
    {
      id: 1,
      name: "Gust of Hermes",
      description: "Grants the user +5 speed.",
      imgPath: "img/relic/relic1.webp",
      effectClass: "relic1",
      hpMod: 0,
      attackMod: 0,
      speedMod: 5,
      defenseMod: 0,
      criticalMod: 0,
      price: 0,
    },
    {
      id: 2,
      name: "Spark of Zeus",
      description: "Grants the user +10 attack.",
      imgPath: "img/relic/relic2.webp",
      effectClass: "relic2",
      hpMod: 0,
      attackMod: 10,
      speedMod: 0,
      defenseMod: 0,
      criticalMod: 0,
      price: 500,
    },
    {
      id: 3,
      name: "Cup of Dionysus",
      description: "Grants the user +10 HP.",
      imgPath: "img/relic/relic3.webp",
      effectClass: "relic3",
      hpMod: 10,
      attackMod: 0,
      speedMod: 0,
      defenseMod: 0,
      criticalMod: 0,
      price: 500,
    }
  ];

  // navigation hook
  const navigate = useNavigate();

  // sets player and userfront id state
  const [player, setPlayer] = useState({
    _id: 0, userfrontId: 0, name: "", avatarPath: "", experience: 0, drachmas: 0, relics: [], chosenRelic: 0, creatureId: 0, displayCreatureStats: false
  });
  const [userfrontId] = useState(Userfront.user.userId);
  // sets player options states
  const [optionsStatus, setOptionsStatus] = useState(false);
  const [avatarOptionStatus, setAvatarOptionStatus] = useState(false);
  const [nameOptionStatus, setNameOptionStatus] = useState(false);
  // sets relics and temple state
  const [relicsStatus, setRelicsStatus] = useState(false);
  const [templeStatus, setTempleStatus] = useState(false);
  // sets creatures state
  const [creatureData] = useState(creatures);
  // sets player creature state
  const [playerCreature, setPlayerCreature] = useState([{ id: "", name: "", imgPath: "", hp: 0, attack: 0, speed: 0, defense: 0, critical: 0 }]);
  // sets creature stats state
  const [creatureStatsStatus, setCreatureStatsStatus] = useState(false);
  // sets battle and enemy creature state
  const [battleStatus, setBattleStatus] = useState(false);
  const [enemyCreature, setEnemyCreature] = useState([{ id: "", name: "", imgPath: "", hp: 0, attack: 0, speed: 0, defense: 0, critical: 0 }]);
  // sets player and enemy creature attack state
  const [playerAttackStatus, setPlayerAttackStatus] = useState(false);
  const [enemyAttackStatus, setEnemyAttackStatus] = useState(false);
  // sets player and enemy creature hp state
  const [playerCreatureHP, setPlayerCreatureHP] = useState(0);
  const [enemyCreatureHP, setEnemyCreatureHP] = useState(0);
  // sets critical modifier state
  const [criticalAttackMultiplier, setCriticalAttackMultiplier] = useState(1);
  // sets player speed chance state
  const [chancePlayer, setChancePlayer] = useState(false);
  // sets relics state
  const [relicsData] = useState(relics);
  // sets player relics state
  const [playerRelics, setPlayerRelics] = useState([{
    id: 0, name: "", description: "", imgPath: "", effectClass: "", hpMod: 0, attackMod: 0, speedMod: 0, defenseMod: 0, criticalMod: 0, price: 0
  }]);
  // sets chosen relic state
  const [chosenRelic, setChosenRelic] = useState({
    id: 0, name: "", description: "", imgPath: "", effectClass: "", hpMod: 0, attackMod: 0, speedMod: 0, defenseMod: 0, criticalMod: 0, price: 0
  });
  // sets combat alert state
  const [combatAlert, setCombatAlert] = useState("");
  // sets battle decision state
  const [battleUndecided, setBattleUndecided] = useState(false);

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
    // retrieves user data, generates new user if needed, and updates player state
    const loadAsyncDataPlayerNew = async () => {
      try {
        const { data } = await getUser();
        if (userfrontId !== data.userfrontId) {
          const newUser = {
            userfrontId: userfrontId,
            name: Userfront.user.username,
            avatarPath: "img/avatar/placeholder_avatar.png",
            experience: 0,
            drachmas: 0,
            relics: [1],
            chosenRelic: 1,
            creatureId: 0,
            displayCreatureStats: false
          }
          await addUser(newUser);
          setPlayer(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    // retrieves user data and updates player state
    const loadAsyncDataPlayer = async () => {
      try {
        const { data } = await getUser();
        setPlayer(data);
      } catch (error) {
        console.log(error);
      }
    }
    loadAsyncDataPlayerNew();
    loadAsyncDataPlayer();
  }, [userfrontId]);

  useEffect(() => {
    try {
      // if needed, generates random creature and updates player in database
      const genAsyncPlayerCreature = async () => {
        // retrieves user data and updates player state
        const loadAsyncDataPlayer = async () => {
          try {
            const { data } = await getUser();
            setPlayer(data);
          } catch (error) {
            console.log(error);
          }
        }
        try {
          if (player.creatureId === 0) {
            const randomCreature = creatureData[Math.floor(Math.random() * creatureData.length)].id;
            await updateUser(player._id, { creatureId: randomCreature });
            await loadAsyncDataPlayer();
          }
        }
        catch (error) {
          console.log(error);
        }
      }
      // loads player creature data and sets player creature state
      const loadDataPlayerCreature = () => {
        const playerCreatureData = creatureData.filter(creature => creature.id === player.creatureId);
        setPlayerCreature(playerCreatureData);
        setCreatureStatsStatus(player.displayCreatureStats);
      }
      // if there is a player
      if (player) {
        genAsyncPlayerCreature();
        loadDataPlayerCreature();
      }
    } catch (error) {
      console.log(error);
    }
    try {
      // if there is a player and player relics
      if (player && player.relics) {
        // loads player relics data
        const loadDataPlayerRelics = () => {
          const playerRelicsData = relicsData.filter(relic => player.relics.includes(relic.id));
          setPlayerRelics(playerRelicsData);
          const chosenRelicData = playerRelicsData.filter(relic => relic.id === player.chosenRelic);
          setChosenRelic(chosenRelicData);
        }
        loadDataPlayerRelics();
      }
    } catch (error) {
      console.log(error);
    }
  }, [player, relicsData, creatureData]);

  // retrieves user data and updates player state
  const loadAsyncDataPlayer = async () => {
    try {
      const { data } = await getUser();
      setPlayer(data);
    } catch (error) {
      console.log(error);
    }
  }

  // toggles display creature stats in database
  const toggleDisplayCreatureStats = async () => {
    try {
      await updateUser(player._id, { displayCreatureStats: !creatureStatsStatus });
      await loadAsyncDataPlayer();
    }
    catch (error) {
      console.log(error);
    }
  }

  // updates player avatar path in database
  const selectAvatar = async (avatarPath) => {
    try {
      await updateUser(player._id, { avatarPath: avatarPath });
      await loadAsyncDataPlayer();
    }
    catch (error) {
      console.log(error);
    }
  }

  // updates player name in database
  const selectName = async (e) => {
    try {
      await updateUser(player._id, { name: e });
      await loadAsyncDataPlayer();
    }
    catch (error) {
      console.log(error);
    }
  }

  // updates player chosen relic in database
  const selectRelic = async (relicId) => {
    try {
      await updateUser(player._id, { chosenRelic: relicId });
      await loadAsyncDataPlayer();
    }
    catch (error) {
      console.log(error);
    }
  }

  // updates player relics in database
  const buyRelic = async (relicId, relicPrice) => {
    try {
      // if the player can afford the relic and doesn't own it
      if (player.drachmas >= relicPrice && !player.relics.includes(relicId)) {
        await updateUser(player._id, { drachmas: player.drachmas - relicPrice, relics: [...player.relics, relicId] });
        await loadAsyncDataPlayer();
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  // loads battle data
  const loadDataBattle = () => {
    try {
      // if there is no battle
      if (!battleStatus) {
        setPlayerCreatureHP(playerCreature[0].hp + chosenRelic[0].hpMod);
        const enemyCreatureData = [creatureData[Math.floor(Math.random() * creatureData.length)]];
        setEnemyCreature(enemyCreatureData);
        setEnemyCreatureHP(enemyCreatureData[0].hp);
        setCombatAlert("The battle has begun!");
        setBattleStatus(true);
        setBattleUndecided(true);
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
      setCriticalAttackMultiplier(1);
      const playerCreatureSpeed = (playerCreature[0].speed + chosenRelic[0].speedMod) / 100;
      const playerCreatureDefense = (playerCreature[0].defense + chosenRelic[0].defenseMod) / 100;
      var chanceEnemy = false;
      // checks for equal player and enemy speed
      if (enemyCreature[0].speed / 100 === playerCreatureSpeed) {
        chanceEnemy = Math.random() >= 0.5;
      } else {
        chanceEnemy = Math.random() >= playerCreatureSpeed - enemyCreature[0].speed / 100;
      }
      // series of checks for enemy counter attack based on speed
      if (!chanceEnemy && chancePlayer) {
        setTimeout(() => {
          setCombatAlert("Enemy was too slow!");
        }, 750);
      }
      if (!chanceEnemy && !chancePlayer) {
        attackEnemy();
      }
      if (chanceEnemy && chancePlayer) {
        setTimeout(() => {
          setCombatAlert("The battle continues...");
        }, 750);
      }
      if (battleStatus && chanceEnemy) {
        setTimeout(() => {
          enemyAttackAnimation();
        }, 500);

        // checks enemy critical hit
        if (Math.random() <= enemyCreature[0].critical / 100) {
          setCriticalAttackMultiplier(1.5);
        }

        // checks for player death, and damages player otherwise
        if (playerCreatureHP - ((enemyCreature[0].attack - enemyCreature[0].attack * playerCreatureDefense) * criticalAttackMultiplier) <= 0) {
          setBattleUndecided(false);
          setTimeout(() => {
            setPlayerCreatureHP(0);
            setCombatAlert("Defeat!");
          }, 750);
          setTimeout(() => {
            setBattleStatus(false);
            setEnemyCreature([{
              id: 0,
              name: "",
              imgPath: "",
              hp: 0,
              attack: 0,
              speed: 0,
              defense: 0,
              critical: 0
            }]);
            setEnemyCreatureHP(0);
          }, 2750);
        } else {
          setTimeout(() => {
            setPlayerCreatureHP(playerCreatureHP - (enemyCreature[0].attack - enemyCreature[0].attack * playerCreatureDefense) * criticalAttackMultiplier);
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
      if (!playerAttackStatus && !enemyAttackStatus && battleUndecided) {
        setCriticalAttackMultiplier(1);
        const playerCreatureAttack = playerCreature[0].attack + chosenRelic[0].attackMod;
        const playerCreatureSpeed = (playerCreature[0].speed + chosenRelic[0].speedMod) / 100;
        const playerCreatureCritical = (playerCreature[0].critical + chosenRelic[0].criticalMod) / 100;

        // checks for equal player and enemy speed
        if (playerCreatureSpeed === enemyCreature[0].speed / 100) {
          setChancePlayer(Math.random() >= 0.5);
        } else {
          setChancePlayer(Math.random() >= enemyCreature[0].speed / 100 - playerCreatureSpeed);
        }

        // checks for player speed failure
        if (!chancePlayer) {
          setTimeout(() => {
            setCombatAlert("Your summon was too slow!");
          }, 750);
        }

        // checks for player critical hit
        if (Math.random() <= playerCreatureCritical) {
          setCriticalAttackMultiplier(1.5);
        }

        // checks for enemy death
        if (enemyCreatureHP - ((playerCreatureAttack - playerCreatureAttack * (enemyCreature[0].defense / 100)) * criticalAttackMultiplier) <= 0 && chancePlayer) {
          setBattleUndecided(false);
          playerAttackAnimation();
          await setTimeout(() => {
            setEnemyCreatureHP(0);
            setCombatAlert("Victory!");
            updateUser(player._id, { experience: player.experience + 5, drachmas: player.drachmas + 3 });
          }, 250);
          setTimeout(() => {
            setBattleStatus(false);
            setEnemyCreature([{ _id: 0, name: "", imgPath: "", hp: 0, attack: 0, speed: 0, defense: 0, critical: 0 }]);
            setPlayerCreatureHP(0);
          }, 2250);
          await setTimeout(() => {
            loadAsyncDataPlayer();
          }, 2250);
        } else {

          // damages enemy
          if (chancePlayer) {
            playerAttackAnimation();
            setTimeout(() => {
              setEnemyCreatureHP(enemyCreatureHP - (playerCreatureAttack - playerCreatureAttack * (enemyCreature[0].defense / 100)) * criticalAttackMultiplier);
            }, 250);
          }

          enemyCounterAttack();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // renders if a relic is bestowed
  if (chosenRelic[0]) {
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
                <i className="text-light">{"\u2630"}</i>
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
                    <button className="btn btn-warning my-1 text-dark" onClick={() => Userfront.logout()}>Logout</button>
                  </li>
                </ul>
                {/* Left links */}
              </div>
              {/* Collapsible wrapper */}

              {/* Right elements */}
              <div className="d-flex align-items-center">
                <button className="btn btn-light my-1"
                  onClick={() => { setOptionsStatus(!optionsStatus); setAvatarOptionStatus(false); setNameOptionStatus(false); }}>Options</button>
              </div>
              {/* Right elements */}
            </div>
            {/* Container wrapper */}
          </nav>
          {/* Navbar */}
        </header>

        <main className="game_section">
          {/* options */}
          {optionsStatus ?
            <div className="options">
              <h3>Game Options</h3>
              <button className="btn btn-light my-2" onClick={() => { toggleDisplayCreatureStats() }}>Toggle Creature Stats
                {player.displayCreatureStats ? " - ON" : " - OFF"}</button>
              <h3>Player Options</h3>
              <button className="btn btn-light my-2" onClick={() => { setAvatarOptionStatus(!avatarOptionStatus); setNameOptionStatus(false); }}> Change Avatar</button>
              <button className="btn btn-light my-2 ms-1" onClick={() => { setNameOptionStatus(!nameOptionStatus); setAvatarOptionStatus(false); }}>Change Name</button>
              {nameOptionStatus && !avatarOptionStatus ? <form>
                <label htmlFor="name">Player name:&nbsp;</label>
                <input className="my-1" type="text" name="name" placeholder={player.name} onChange={(e) => selectName(e.target.value)} />
              </form> : null}
              {avatarOptionStatus && !nameOptionStatus ? <div>
                <div className="d-flex justify-content-center">
                  <div className="my-1 mx-1" onClick={() => selectAvatar("img/avatar/f_mage_avatar.png")}>
                    <img className="player_avatar avatar_option" src={"img/avatar/f_mage_avatar.png"} alt={"f_mage"} width="96" height="96" />
                    <p className="avatar_option">Avatar 1</p></div>
                  <div className="my-1 mx-1" onClick={() => selectAvatar("img/avatar/m_mage_avatar.png")}>
                    <img className="player_avatar avatar_option" src={"img/avatar/m_mage_avatar.png"} alt={"m_mage"} width="96" height="96" />
                    <p className="avatar_option">Avatar 2</p></div>
                </div>
                <div className="d-flex justify-content-center">
                  <div className="my-1 mx-1" onClick={() => selectAvatar("img/avatar/f_rogue_avatar.png")}>
                    <img className="player_avatar avatar_option" src={"img/avatar/f_rogue_avatar.png"} alt={"f_rogue"} width="96" height="96" />
                    <p className="avatar_option">Avatar 3</p></div>
                  <div className="my-1 mx-1" onClick={() => selectAvatar("img/avatar/m_rogue_avatar.png")}>
                    <img className="player_avatar avatar_option" src={"img/avatar/m_rogue_avatar.png"} alt={"m_rogue"} width="96" height="96" />
                    <p className="avatar_option">Avatar 4</p></div>
                </div>
                <div className="d-flex justify-content-center">
                  <div className="my-1 mx-1" onClick={() => selectAvatar("img/avatar/f_warrior_avatar.png")}>
                    <img className="player_avatar avatar_option" src={"img/avatar/f_warrior_avatar.png"} alt={"f_warrior"} width="96" height="96" />
                    <p className="avatar_option">Avatar 5</p></div>
                  <div className="my-1 mx-1" onClick={() => selectAvatar("img/avatar/m_warrior_avatar.png")}>
                    <img className="player_avatar avatar_option" src={"img/avatar/m_warrior_avatar.png"} alt={"m_warrior"} width="96" height="96" />
                    <p className="avatar_option">Avatar 6</p></div>
                </div>
              </div>
                : null}
            </div>
            : null}

          {/* player */}
          {!optionsStatus ? <>
            <div className="player">
              <img src={player.avatarPath}
                alt={player.name}
                className="player_avatar"
                width="96"
                height="96" />
              <h4>{player.name}</h4>
              <h5>
                Level {Math.floor(Math.sqrt(player.experience) * 0.25)}
                <div className="progress_bar_container">
                  <div className="experience_progress_bar"
                    style={{ width: ((Math.sqrt(player.experience) * 0.25 - Math.floor(Math.sqrt(player.experience) * 0.25)).toFixed(2)).replace("0.", '') + "%" }} />
                </div>
              </h5>
              <h5>Drachmas: {player.drachmas} {"\u25C9"}</h5>

              {/* menu */}
              {!battleStatus ? <div><div className="item_options_container">
                <button className="game_button item_option" onClick={() => { setRelicsStatus(!relicsStatus); setTempleStatus(false) }}>Relics</button>
                <button className="game_button item_option" onClick={() => { setTempleStatus(!templeStatus); setRelicsStatus(false) }}>Temple</button>
              </div></div>
                : null}
              {battleStatus ? <div><p className="combat_alert">{combatAlert}</p></div>
                : null}
              {relicsStatus ? <div>
                <h4>Player Relics</h4>
                {playerRelics.map((relic) => (
                  <div
                    className="relic_option"
                    key={relic.id}
                  >
                    <button className="game_button_small" onClick={() => selectRelic(relic.id)}>Use</button>
                    <img onClick={() => alert(relic.description)}
                      className="relic_option_img"
                      src={relic.imgPath}
                      alt={relic.name}
                      width="48px"
                      height="48px" /><span className="relic_info" onClick={() => alert(relic.description)}>?</span><br />
                    {relic.name} {relic.id === player.chosenRelic ? <i>{"\u2713"}</i> : null}
                  </div>))}
              </div>
                : null
              }
              {templeStatus ? <div>
                <h4>Temple Relics</h4>
                {relicsData.map((relic) => (
                  <div
                    className="relic_option"
                    key={relic.id}
                  >
                    <button className="game_button_small" onClick={() => buyRelic(relic.id, relic.price)}>Buy</button>
                    <img onClick={() => alert(relic.description)}
                      className="relic_option_img"
                      src={relic.imgPath}
                      alt={relic.name}
                      width="48px"
                      height="48px" /><span className="relic_info" onClick={() => alert(relic.description)}>?</span><br />
                    {relic.name} - {relic.price} {"\u25C9"}
                  </div>))}
              </div>
                : null
              }
              {!battleStatus ?
                <button className="game_button battle_button" onClick={() => { loadDataBattle(); setTempleStatus(false); setRelicsStatus(false) }}>
                  Battle Hellspawn</button>
                : null}
            </div>

            {/* player creature */}
            {!relicsStatus && !templeStatus ? <>
              <div className="player_creature">
                {playerCreature.map((creature) => (
                  <div
                    key={creature.id}
                  >
                    {playerAttackStatus
                      ? <img className={chosenRelic[0].effectClass}
                        src={creature.imgPath.slice(0, -4) + "_attack.png"}
                        alt={creature.name}
                        width="128px"
                        height="128px" />
                      : enemyAttackStatus && (enemyCreatureHP !== 0)
                        ? <img className={chosenRelic[0].effectClass}
                          src={creature.imgPath.slice(0, -4) + "_hurt.png"}
                          alt={creature.name}
                          width="128px"
                          height="128px" />
                        : <img className={chosenRelic[0].effectClass}
                          src={creature.imgPath}
                          alt={creature.name}
                          width="128px"
                          height="128px" />
                    }
                    <div className="creature_panel">
                      {battleStatus ? <><button className="game_button attack_button" onClick={() => { attackEnemy() }}>Attack</button><br /></> : null}
                      <h4>{player.name}'s {creature.name}</h4>
                      {!battleStatus ? <h5>HP: {creature.hp + chosenRelic[0].hpMod}</h5>
                        : !creatureStatsStatus ? <h5>HP: {playerCreatureHP} / {creature.hp + chosenRelic[0].hpMod}</h5>
                          : null}
                      {creatureStatsStatus ?
                        <div>
                          {battleStatus ? <h5>HP: {playerCreatureHP} / {creature.hp + chosenRelic[0].hpMod}</h5>
                            : null}
                          <h5>Attack: {creature.attack + chosenRelic[0].attackMod}</h5>
                          <h5>Speed: {creature.speed + chosenRelic[0].speedMod}</h5>
                          <h5>Defense: {creature.defense + chosenRelic[0].defenseMod}</h5>
                          <h5>Critical: {creature.critical + chosenRelic[0].criticalMod}</h5>
                        </div>
                        : null}
                    </div>
                  </div>
                ))}
              </div>
            </> : null}

            {/* enemy creature */}
            {battleStatus ?
              <div className="enemy_creature">
                {enemyCreature.map((creature) => (
                  <div
                    key={creature.id}
                  >
                    {enemyAttackStatus ? <img className="enemy_creature_img"
                      src={creature.imgPath.slice(0, -4) + "_attack.png"}
                      alt={creature.name}
                      width="128px"
                      height="128px" />
                      : playerAttackStatus ? <img className="enemy_creature_img"
                        src={creature.imgPath.slice(0, -4) + "_hurt.png"}
                        alt={creature.name}
                        width="128px"
                        height="128px" />
                        : <img className="enemy_creature_img"
                          src={creature.imgPath}
                          alt={creature.name}
                          width="128px"
                          height="128px" />}
                    <div className="creature_panel">
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
                  </div>
                ))}
              </div>
              : null}
          </> :

            // player for options
            <div>
              <div className="player">

                <img src={player.avatarPath}
                  alt={player.name}
                  className="player_avatar"
                  width="96"
                  height="96" />
                <h4>{player.name}</h4>
                <h5>
                  Level {Math.floor(Math.sqrt(player.experience) * 0.25)}
                  <div className="progress_bar_container">
                    <div className="experience_progress_bar"
                      style={{ width: ((Math.sqrt(player.experience) * 0.25 - Math.floor(Math.sqrt(player.experience) * 0.25)).toFixed(2)).replace("0.", '') + "%" }} />
                  </div>
                </h5>
                <h5>Drachmas: {player.drachmas} {"\u25C9"}</h5>
              </div></div>}
        </main>
      </>
    );
  }
  else return (<></>);
}

export default App;