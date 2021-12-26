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
      price: 50,
      hp: 60,
      attack: 50,
      attack_name: "Slash",
      speed: 60,
      defense: 20,
      critical: 50,
      mp: 100,
      mp_regen: 25,
      special: 75,
      special_cost: 100,
      special_name: "Harvest"
    },
    {
      id: 2,
      name: "Medusa",
      imgPath: "img/creature/medusa_creature.png",
      price: 50,
      hp: 110,
      attack: 30,
      attack_name: "Gaze",
      speed: 30,
      defense: 15,
      critical: 20,
      mp: 100,
      mp_regen: 25,
      special: 75,
      special_cost: 100,
      special_name: "Petrify"
    },
    {
      id: 3,
      name: "Baby Dragon",
      imgPath: "img/creature/small_dragon_creature.png",
      price: 50,
      hp: 60,
      attack: 50,
      attack_name: "Exhale",
      speed: 60,
      defense: 20,
      critical: 50,
      mp: 100,
      mp_regen: 25,
      special: 75,
      special_cost: 100,
      special_name: "Fireball"
    },
    {
      id: 4,
      name: "Lizard",
      imgPath: "img/creature/lizard_creature.png",
      price: 50,
      hp: 110,
      attack: 30,
      attack_name: "Impale",
      speed: 30,
      defense: 15,
      critical: 20,
      mp: 100,
      mp_regen: 25,
      special: 75,
      special_cost: 100,
      special_name: "Poison"
    }
  ];

  // relic objects
  const relics = [
    {
      id: 1,
      name: "Gust of Hermes",
      description: "Grants the user's summons +5 speed.",
      imgPath: "img/relic/relic1.webp",
      effectClass: "relic1",
      hpMod: 0,
      attackMod: 0,
      speedMod: 5,
      defenseMod: 0,
      criticalMod: 0,
      mpMod: 0,
      mpRegenMod: 0,
      specialMod: 0,
      price: 0,
    },
    {
      id: 2,
      name: "Spark of Zeus",
      description: "Grants the user's summons +10 attack.",
      imgPath: "img/relic/relic2.webp",
      effectClass: "relic2",
      hpMod: 0,
      attackMod: 10,
      speedMod: 0,
      defenseMod: 0,
      criticalMod: 0,
      mpMod: 0,
      mpRegenMod: 0,
      specialMod: 0,
      price: 500,
    },
    {
      id: 3,
      name: "Cup of Dionysus",
      description: "Grants the user's summons +10 HP.",
      imgPath: "img/relic/relic3.webp",
      effectClass: "relic3",
      hpMod: 10,
      attackMod: 0,
      speedMod: 0,
      defenseMod: 0,
      criticalMod: 0,
      mpMod: 0,
      mpRegenMod: 0,
      specialMod: 0,
      price: 500,
    }
  ];

  // navigation hook
  const navigate = useNavigate();

  // sets player state
  const [player, setPlayer] = useState({});
  // sets player options states
  const [optionsStatus, setOptionsStatus] = useState(false);
  const [avatarOptionStatus, setAvatarOptionStatus] = useState(false);
  const [nameOptionStatus, setNameOptionStatus] = useState(false);
  // sets relics, temple, and summons state
  const [relicsStatus, setRelicsStatus] = useState(false);
  const [templeStatus, setTempleStatus] = useState(false);
  const [summonsStatus, setSummonsStatus] = useState(false);
  // sets creatures state
  const [creatureData] = useState(creatures);
  // sets player creature state
  const [playerCreature, setPlayerCreature] = useState([{}]);
  // sets creature stats state
  const [creatureStatsStatus, setCreatureStatsStatus] = useState(false);
  // sets battle and enemy creature state
  const [battleStatus, setBattleStatus] = useState(false);
  const [enemyCreature, setEnemyCreature] = useState([{}]);
  // sets player and enemy creature attack state
  const [playerAttackStatus, setPlayerAttackStatus] = useState(false);
  const [enemyAttackStatus, setEnemyAttackStatus] = useState(false);
  // sets special status state
  const [specialStatus, setSpecialStatus] = useState(false);
  // sets player and enemy creature hp state
  const [playerCreatureHP, setPlayerCreatureHP] = useState(0);
  const [enemyCreatureHP, setEnemyCreatureHP] = useState(0);
  // sets player creature MP state
  const [playerCreatureMP, setPlayerCreatureMP] = useState(0);
  // sets critical modifier state
  const [criticalAttackMultiplier, setCriticalAttackMultiplier] = useState(1);
  // sets player speed chance state
  const [chancePlayer, setChancePlayer] = useState(false);
  // sets relics state
  const [relicsData] = useState(relics);
  // sets player relics state
  const [playerRelics, setPlayerRelics] = useState([{}]);
  // sets chosen relic state
  const [chosenRelic, setChosenRelic] = useState({});
  // sets combat alert state
  const [combatAlert, setCombatAlert] = useState("");
  // sets battle decision state
  const [battleUndecided, setBattleUndecided] = useState(false);

  useEffect(() => {
    // checks for userfront authentication and redirects visitor if not authenticated
    const checkAuth = () => {
      try {
        if (!Userfront.accessToken()) {
          navigate('/');
        }
      } catch (error) {
        console.log(error);
      }
    }
    checkAuth();
  });

  useEffect(() => {
    // checks for userkey and generates new user if needed
    const genDataPlayer = () => {
      try {
        // if there is no userkey
        if (!Userfront.user.data.userkey) {
          const newUser = {
            userfrontId: Userfront.user.userId,
            name: Userfront.user.username,
            avatarPath: "img/avatar/placeholder_avatar.png",
            experience: 0,
            drachmas: 0,
            relics: [1],
            chosenRelic: 1,
            creatureId: 0,
            displayCreatureStats: false
          }
          addUser(newUser);
          alert("Welcome to the game! You have been assigned a new account. Please log in again to continue.");
          Userfront.logout();
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
    genDataPlayer();
    loadAsyncDataPlayer();
  }, []);

  useEffect(() => {
    // if there is a player
    if (player) {
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
            // if there is no player creature data
            if (player.creatureId === 0) {
              const randomCreature = creatureData[Math.floor(Math.random() * creatureData.length)].id;
              Userfront.user.update({
                data: {
                  userkey: Userfront.user.data.userkey,
                },
              });
              await updateUser(player._id, { userfrontId: Userfront.user.userId, creatureId: randomCreature });
              loadAsyncDataPlayer();
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
        genAsyncPlayerCreature();
        loadDataPlayerCreature();
      } catch (error) {
        console.log(error);
      }
      try {
        // if there are player relics
        if (player.relics) {
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
      Userfront.user.update({
        data: {
          userkey: Userfront.user.data.userkey,
        },
      });
      await updateUser(player._id, { userfrontId: Userfront.user.userId, displayCreatureStats: !creatureStatsStatus });
      await loadAsyncDataPlayer();
    }
    catch (error) {
      console.log(error);
    }
  }

  // updates player avatar path in database
  const selectAvatar = async (avatarPath) => {
    try {
      Userfront.user.update({
        data: {
          userkey: Userfront.user.data.userkey,
        },
      });
      await updateUser(player._id, { userfrontId: Userfront.user.userId, avatarPath: avatarPath });
      await loadAsyncDataPlayer();
    }
    catch (error) {
      console.log(error);
    }
  }

  // updates player name in database
  const selectName = async (e) => {
    try {
      Userfront.user.update({
        data: {
          userkey: Userfront.user.data.userkey,
        },
      });
      await updateUser(player._id, { userfrontId: Userfront.user.userId, name: e });
      await loadAsyncDataPlayer();
    }
    catch (error) {
      console.log(error);
    }
  }

  // updates player chosen relic in database
  const selectRelic = async (relicId) => {
    try {
      Userfront.user.update({
        data: {
          userkey: Userfront.user.data.userkey,
        },
      });
      await updateUser(player._id, { userfrontId: Userfront.user.userId, chosenRelic: relicId });
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
        Userfront.user.update({
          data: {
            userkey: Userfront.user.data.userkey,
          },
        });
        await updateUser(player._id, { userfrontId: Userfront.user.userId, drachmas: player.drachmas - relicPrice, relics: [...player.relics, relicId] });
        await loadAsyncDataPlayer();
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  // swaps player creature in database
  const swapCreature = async (creatureId, creaturePrice) => {
    try {
      // if the player can afford the creature and isn't already using it
      if (player.experience >= creaturePrice && player.creatureId !== creatureId) {
        Userfront.user.update({
          data: {
            userkey: Userfront.user.data.userkey,
          },
        });
        await updateUser(player._id, { userfrontId: Userfront.user.userId, experience: player.experience - creaturePrice, creatureId: creatureId });
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
      setCriticalAttackMultiplier(1);
      setPlayerCreatureHP(playerCreature[0].hp + chosenRelic[0].hpMod);
      setPlayerCreatureMP(playerCreature[0].mp + chosenRelic[0].mpMod);
      const enemyCreatureData = [creatureData[Math.floor(Math.random() * creatureData.length)]];
      setEnemyCreature(enemyCreatureData);
      setEnemyCreatureHP(enemyCreatureData[0].hp);
      setCombatAlert("The battle has begun!");
      setBattleStatus(true);
      setBattleUndecided(true);
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

  // special animation
  const specialAnimation = () => {
    try {
      setSpecialStatus(true);
      setTimeout(() => {
        setSpecialStatus(false);
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
            setEnemyCreature([{}]);
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
  const attackEnemy = async (movename) => {
    try {
      // if the player and enemy aren't attacking and the battle is undecided
      if (!playerAttackStatus && !enemyAttackStatus && battleUndecided) {
        const playerCreatureAttack = playerCreature[0].attack + chosenRelic[0].attackMod;
        const playerCreatureSpeed = (playerCreature[0].speed + chosenRelic[0].speedMod) / 100;
        const playerCreatureCritical = (playerCreature[0].critical + chosenRelic[0].criticalMod) / 100;
        const playerCreatureSpecial = playerCreature[0].special + chosenRelic[0].specialMod;

        // checks for equal player and enemy speed
        if (playerCreatureSpeed === enemyCreature[0].speed / 100) {
          setChancePlayer(Math.random() >= 0.5);

          // checks for player critical hit
          if (Math.random() <= playerCreatureCritical) {
            setCriticalAttackMultiplier(1.5);
          }

        } else {
          setChancePlayer(Math.random() >= enemyCreature[0].speed / 100 - playerCreatureSpeed);

          // checks for player critical hit
          if (Math.random() <= playerCreatureCritical) {
            setCriticalAttackMultiplier(1.5);
          }

        }

        // checks for player speed failure
        if (!chancePlayer) {
          setTimeout(() => {
            setCombatAlert("Your summon was too slow!");
          }, 750);
        }

        // if the player's attack is regular
        if (movename === playerCreature[0].attack_name) {

          // checks for enemy death
          if (enemyCreatureHP - ((playerCreatureAttack - playerCreatureAttack * (enemyCreature[0].defense / 100)) * criticalAttackMultiplier) <= 0 && chancePlayer) {
            setBattleUndecided(false);
            playerAttackAnimation();
            await setTimeout(() => {
              setEnemyCreatureHP(0);
              setCombatAlert("Victory!");
              Userfront.user.update({
                data: {
                  userkey: Userfront.user.data.userkey,
                },
              });
              updateUser(player._id, { userfrontId: Userfront.user.userId, experience: player.experience + 5, drachmas: player.drachmas + 3 });
            }, 250);
            setTimeout(() => {
              setBattleStatus(false);
              setEnemyCreature([{}]);
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

          setTimeout(() => {
            if (playerCreatureMP !== playerCreature[0].mp_regen + chosenRelic[0].mpRegenMod) {
              setPlayerCreatureMP(playerCreatureMP + (playerCreature[0].mp_regen + chosenRelic[0].mpRegenMod));
            }
          }, 500);
        } else {

          // checks to see if the player has enough mana to use special attack
          if (playerCreatureMP >= playerCreature[0].special_cost) {

            if (playerCreatureMP - playerCreature[0].special_cost === 0) {
              setPlayerCreatureMP(0);
            } else {
              setPlayerCreatureMP(playerCreatureMP - playerCreature[0].special_cost);
            }

            // checks for enemy death
            if (enemyCreatureHP - ((playerCreatureSpecial - playerCreatureSpecial * (enemyCreature[0].defense / 100)) * criticalAttackMultiplier) <= 0 && chancePlayer) {
              setBattleUndecided(false);
              playerAttackAnimation();
              specialAnimation();
              await setTimeout(() => {
                setEnemyCreatureHP(0);
                setCombatAlert("Victory!");
                Userfront.user.update({
                  data: {
                    userkey: Userfront.user.data.userkey,
                  },
                });
                updateUser(player._id, { userfrontId: Userfront.user.userId, experience: player.experience + 5, drachmas: player.drachmas + 3 });
              }, 250);
              setTimeout(() => {
                setBattleStatus(false);
                setEnemyCreature([{}]);
                setPlayerCreatureHP(0);
              }, 2250);
              await setTimeout(() => {
                loadAsyncDataPlayer();
              }, 2250);
            } else {

              // damages enemy
              if (chancePlayer) {
                playerAttackAnimation();
                specialAnimation();
                setTimeout(() => {
                  setEnemyCreatureHP(enemyCreatureHP - (playerCreatureSpecial - playerCreatureSpecial * (enemyCreature[0].defense / 100)) * criticalAttackMultiplier);
                }, 250);
              }

              enemyCounterAttack();
            }

          } else {
            setCombatAlert("Not enough MP!");
          }

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
              {nameOptionStatus && !avatarOptionStatus ? <div>
                <label htmlFor="name">Player name:&nbsp;</label>
                <input className="my-1 text-light bg-dark" type="text" name="name" placeholder={player.name} /><br />
                <button className="btn btn-light my-1" onClick={() => selectName(document.querySelector("input[name='name']").value)}>Submit Name</button>
              </div>
                : null}
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
                Lvl. {Math.floor(Math.sqrt(player.experience) * 0.25)} | {player.experience} XP
                <div className="progress_bar_container">
                  <div className="experience_progress_bar"
                    style={{ width: ((Math.sqrt(player.experience) * 0.25 - Math.floor(Math.sqrt(player.experience) * 0.25)).toFixed(2)).replace("0.", '') + "%" }} />
                </div>
              </h5>
              <h5>Drachmas: {player.drachmas} {"\u25C9"}</h5>

              {/* menu */}
              {!battleStatus ? <div><div className="item_options_container">
                <button className="game_button item_option" onClick={() => { setRelicsStatus(!relicsStatus); setTempleStatus(false); setSummonsStatus(false); }}>Relics</button>
                <button className="game_button item_option" onClick={() => { setTempleStatus(!templeStatus); setRelicsStatus(false); setSummonsStatus(false); }}>Temple</button>
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
              {!battleStatus ? <>
                <button className="game_button creature_option" onClick={() => { setSummonsStatus(!summonsStatus); setTempleStatus(false); setRelicsStatus(false) }}>
                  Summons</button>
                <button className="game_button creature_option" onClick={() => { loadDataBattle(); setTempleStatus(false); setRelicsStatus(false); setSummonsStatus(false); }}>
                  Battle</button>
              </>
                : null}
              {summonsStatus ? <div>
                <h4>Available Summons</h4>
                {creatureData.map((creature) => (
                  <div
                    className="summon_option"
                    key={creature.id}
                  >
                    <button className="game_button_small" onClick={() => swapCreature(creature.id, creature.price)}>Swap</button>
                    <img onClick={() => alert("HP: " + creature.hp + "\nAttack: " + creature.attack + "\nSpeed: " + creature.speed + "\nDefense: " + creature.defense +
                      "\nCritical: " + creature.critical + "\nMP: " + creature.mp + "\nMP Regen: " + creature.mp_regen + "\nSpecial: " + creature.special
                      + "\nSpecial cost: " + creature.special_cost)}
                      className="summon_option_img"
                      src={creature.imgPath}
                      alt={creature.name}
                      width="96px"
                      height="96px" /><span className="summon_info" onClick={() => alert("HP: " + creature.hp + "\nAttack: " + creature.attack + "\nSpeed: " +
                        creature.speed + "\nDefense: " + creature.defense + "\nCritical: " + creature.critical + "\nMP: " + creature.mp + "\nMP Regen: " +
                        creature.mp_regen + "\nSpecial: " + creature.special + "\nSpecial cost: " + creature.special_cost)}>?</span><br />
                    {creature.name} - {creature.price} XP {creature.id === player.creatureId ? <i>{"\u2713"}</i> : null}
                  </div>))}
              </div>
                : null
              }
            </div>

            {/* player creature */}
            {!relicsStatus && !templeStatus && !summonsStatus ? <>
              <div className="player_creature">
                {playerCreature.map((creature) => (
                  <div
                    key={creature.id}
                  >
                    {criticalAttackMultiplier > 1 && playerAttackStatus ? <div className="critical_effect">!</div> : null}
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
                    {specialStatus ? <div className="special_effect">{"\u2620"}</div> : null}
                    <div className="creature_panel">
                      {battleStatus ? <div className="inline_flex"><button className="game_button attack_button" onClick={() => { attackEnemy(creature.attack_name) }}>{creature.attack_name}</button>
                        <button className="game_button special_button" onClick={() => { attackEnemy(creature.special_name) }}>{creature.special_name}<br />
                          Cost: {creature.special_cost} MP</button></div> : null}
                      <h4>{player.name}'s {creature.name}</h4>
                      {!battleStatus ? <div className="inline_flex"><h5>HP: {creature.hp + chosenRelic[0].hpMod}</h5>&nbsp;|&nbsp;<h5>MP: {creature.mp}</h5></div>
                        : <div className="inline_flex">
                          <h5>HP: {playerCreatureHP} / {creature.hp + chosenRelic[0].hpMod}</h5>&nbsp;|&nbsp;<h5>MP: {playerCreatureMP} / {creature.mp}</h5></div>}
                      {creatureStatsStatus ?
                        <div>
                          <h5>Attack: {creature.attack + chosenRelic[0].attackMod} | Sp. Attack: {creature.special}</h5>
                          <h5>Speed: {creature.speed + chosenRelic[0].speedMod} | MP Regen: {creature.mp_regen}</h5>
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
                    {criticalAttackMultiplier > 1 && enemyAttackStatus ? <div className="critical_effect">!</div>
                      : null}
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