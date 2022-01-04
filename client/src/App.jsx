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
      attackName: "Slash",
      attackType: "Normal",
      speed: 60,
      defense: 20,
      critical: 50,
      mp: 100,
      mpRegen: 25,
      special: 75,
      specialCost: 100,
      specialName: "Harvest",
      specialType: "Poison",
      specialEffect: "special_effect1"
    },
    {
      id: 2,
      name: "Medusa",
      imgPath: "img/creature/medusa_creature.png",
      price: 50,
      hp: 110,
      attack: 30,
      attackName: "Gaze",
      attackType: "Magic",
      speed: 30,
      defense: 15,
      critical: 20,
      mp: 100,
      mpRegen: 25,
      special: 75,
      specialCost: 100,
      specialName: "Petrify",
      specialType: "Magic",
      specialEffect: "special_effect2"
    },
    {
      id: 3,
      name: "Baby Dragon",
      imgPath: "img/creature/small_dragon_creature.png",
      price: 50,
      hp: 60,
      attack: 50,
      attackName: "Exhale",
      attackType: "Magic",
      speed: 60,
      defense: 20,
      critical: 50,
      mp: 100,
      mpRegen: 25,
      special: 75,
      specialCost: 100,
      specialName: "Fireball",
      specialType: "Magic",
      specialEffect: "special_effect3"
    },
    {
      id: 4,
      name: "Lizard",
      imgPath: "img/creature/lizard_creature.png",
      price: 50,
      hp: 110,
      attack: 30,
      attackName: "Impale",
      attackType: "Normal",
      speed: 30,
      defense: 15,
      critical: 20,
      mp: 100,
      mpRegen: 25,
      special: 75,
      specialCost: 100,
      specialName: "Poison",
      specialType: "Poison",
      specialEffect: "special_effect4"
    }
  ];

  // relic objects
  const relics = [
    {
      id: 1,
      name: "Gust of Hermes",
      description: "Grants the user's summon +5 speed.",
      imgPath: "img/relic/relic1.webp",
      effectClass: "relic_effect1",
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
      description: "Grants the user's summon +10 attack.",
      imgPath: "img/relic/relic2.webp",
      effectClass: "relic_effect2",
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
      description: "Grants the user's summon +10 HP.",
      imgPath: "img/relic/relic3.webp",
      effectClass: "relic_effect3",
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
  const [playerCreature, setPlayerCreature] = useState({});
  // sets creature stats state
  const [creatureStatsStatus, setCreatureStatsStatus] = useState(false);
  // sets battle and enemy creature state
  const [battleStatus, setBattleStatus] = useState(false);
  const [enemyCreature, setEnemyCreature] = useState({});
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
  // sets combat text state
  const [combatText, setCombatText] = useState("");
  // sets crit text state
  const [critText, setCritText] = useState("combat_text");

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
        // if there is no user key
        if (Userfront.user.data.userkey === undefined) {
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
        if (window.confirm(`Are you sure you want to buy this relic? It will cost ${relicPrice} drachmas.`)) {
          Userfront.user.update({
            data: {
              userkey: Userfront.user.data.userkey,
            },
          });
          await updateUser(player._id, { userfrontId: Userfront.user.userId, drachmas: player.drachmas - relicPrice, relics: [...player.relics, relicId] });
          await loadAsyncDataPlayer();
        }
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
        if (window.confirm(`Are you sure you want to swap your creature for this one? It will cost ${creaturePrice} experience.`)) {
          Userfront.user.update({
            data: {
              userkey: Userfront.user.data.userkey,
            },
          });
          await updateUser(player._id, { userfrontId: Userfront.user.userId, experience: player.experience - creaturePrice, creatureId: creatureId });
          await loadAsyncDataPlayer();
        }
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  // loads battle data
  const loadDataBattle = () => {
    try {
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

  // player attack Combat Text animation
  const playerAttackCT = (playerCreatureAttack, criticalMultiplier, enemyDefense) => {
    try {
      if (criticalMultiplier > 1) {
        setCritText("crit_text");
      }
      setCombatText((playerCreatureAttack - playerCreatureAttack * enemyDefense) * criticalMultiplier)
      setTimeout(() => {
        setCombatText("");
        setCritText("combat_text");
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

  // player special Combat Text animation
  const playerSpecialCT = (playerCreatureSpecial, criticalMultiplier, enemyDefense) => {
    try {
      if (criticalMultiplier > 1) {
        setCritText("crit_text");
      }
      setCombatText((playerCreatureSpecial - playerCreatureSpecial * enemyDefense) * criticalMultiplier)
      setTimeout(() => {
        setCombatText("");
        setCritText("combat_text");
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

  // enemy attack Combat Text animation
  const enemyAttackCT = (criticalMultiplier, playerCreatureDefense) => {
    try {
      if (criticalMultiplier > 1) {
        setCritText("crit_text");
      }
      setCombatText((enemyCreature[0].attack - enemyCreature[0].attack * playerCreatureDefense) * criticalMultiplier)
      setTimeout(() => {
        setCombatText("");
        setCritText("combat_text");
      }, 500);
    } catch (error) {
      console.log(error);
    }
  }

  // initiates chance of enemy counter attack
  const enemyCounterAttack = (chancePlayer, moveName) => {
    try {
      const playerCreatureSpeed = (playerCreature[0].speed + chosenRelic[0].speedMod) / 100;
      var playerCreatureDefense = (playerCreature[0].defense + chosenRelic[0].defenseMod) / 100;
      var criticalMultiplier = 1;
      var chanceEnemy = false;

      // checks for attack type
      if (enemyCreature[0].attackType === "Magic") {
        playerCreatureDefense = 0;
      }
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
        }, 250);
      }
      if (!chanceEnemy && !chancePlayer) {
        attackEnemy(moveName);
      }
      if (chanceEnemy && chancePlayer) {
        setTimeout(() => {
          setCombatAlert("The battle continues...");
        }, 500);
      }
      // checks for player speed failure
      if (chanceEnemy && !chancePlayer) {
        setTimeout(() => {
          setCombatAlert("Your summon was too slow!");
        }, 250);
      }
      if (battleStatus && chanceEnemy) {
        setTimeout(() => {
          enemyAttackAnimation();
        }, 500);

        // checks enemy critical hit
        if (Math.random() <= enemyCreature[0].critical / 100) {
          criticalMultiplier = 1.5;
        }

        //checks for player poison move type and crit, then applies effect
        if (enemyCreature[0].attackType === "Poison" && criticalMultiplier === 1) {
          criticalMultiplier = 1.5;
        }

        // checks for player death, and damages player otherwise
        if (playerCreatureHP - ((enemyCreature[0].attack - enemyCreature[0].attack * playerCreatureDefense) * criticalMultiplier) <= 0) {
          setBattleUndecided(false);
          setTimeout(() => {
            enemyAttackCT(criticalMultiplier, playerCreatureDefense);
            setPlayerCreatureHP(0);
            setCombatAlert("Defeat!");
          }, 750);
          setTimeout(() => {
            setBattleStatus(false);
            setEnemyCreature({});
            setEnemyCreatureHP(0);
          }, 2750);
        } else {
          setTimeout(() => {
            enemyAttackCT(criticalMultiplier, playerCreatureDefense);
            setPlayerCreatureHP(playerCreatureHP - (enemyCreature[0].attack - enemyCreature[0].attack * playerCreatureDefense) * criticalMultiplier);
          }, 750);
        }

      }
    } catch (error) {
      console.log(error);
    }
  }

  // initiates chance to attack enemy creature
  const attackEnemy = async (moveName, moveType) => {
    try {
      // if the player and enemy aren't attacking and the battle is undecided
      if (!playerAttackStatus && !enemyAttackStatus && battleUndecided) {
        const playerCreatureAttack = playerCreature[0].attack + chosenRelic[0].attackMod;
        const playerCreatureSpeed = (playerCreature[0].speed + chosenRelic[0].speedMod) / 100;
        const playerCreatureCritical = (playerCreature[0].critical + chosenRelic[0].criticalMod) / 100;
        const playerCreatureSpecial = playerCreature[0].special + chosenRelic[0].specialMod;
        var enemyDefense = enemyCreature[0].defense / 100;
        var chancePlayer = false;
        var criticalMultiplier = 1;

        //checks for player magic move type and applies effect
        if (moveType === "Magic") {
          enemyDefense = 0;
        }

        // checks for equal player and enemy speed
        if (playerCreatureSpeed === enemyCreature[0].speed / 100) {
          chancePlayer = Math.random() >= 0.5;
        } else {
          chancePlayer = Math.random() >= enemyCreature[0].speed / 100 - playerCreatureSpeed;
        }

        // checks for player critical hit
        if (Math.random() <= playerCreatureCritical) {
          criticalMultiplier = 1.5;
        }

        //checks for player poison move type and crit, then applies effect
        if (moveType === "Poison" && criticalMultiplier === 1) {
          criticalMultiplier = 1.5;
        }

        // if the player's attack is regular
        if (moveName === playerCreature[0].attackName) {

          // checks for enemy death
          if (enemyCreatureHP - ((playerCreatureAttack - playerCreatureAttack * enemyDefense) * criticalMultiplier) <= 0 && chancePlayer) {
            setBattleUndecided(false);
            playerAttackAnimation();
            playerAttackCT(playerCreatureAttack, criticalMultiplier, enemyDefense);
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
              setEnemyCreature({});
              setPlayerCreatureHP(0);
            }, 2250);
            await setTimeout(() => {
              loadAsyncDataPlayer();
            }, 2250);
          } else {

            // damages enemy
            if (chancePlayer) {
              playerAttackAnimation();
              playerAttackCT(playerCreatureAttack, criticalMultiplier, enemyDefense);
              setTimeout(() => {
                setEnemyCreatureHP(enemyCreatureHP - (playerCreatureAttack - playerCreatureAttack * enemyDefense) * criticalMultiplier);
              }, 250);
            }

            enemyCounterAttack(chancePlayer, moveName);
          }

          setTimeout(() => {
            if (playerCreatureMP !== (playerCreature[0].mp + chosenRelic[0].mpMod) && (playerCreatureMP + playerCreature[0].mpRegen + chosenRelic[0].mpRegenMod)
              <= (playerCreature[0].mp + chosenRelic[0].mpMod)) {
              setPlayerCreatureMP(playerCreatureMP + playerCreature[0].mpRegen + chosenRelic[0].mpRegenMod);
            }

            if ((playerCreatureMP + playerCreature[0].mpRegen) > playerCreature[0].mp) {
              setPlayerCreatureMP(playerCreature[0].mp + chosenRelic[0].mpMod);
            }
          }, 500);
        } else {

          // checks to see if the player has enough mana to use special attack
          if (playerCreatureMP >= playerCreature[0].specialCost) {
            //deducts MP
            setPlayerCreatureMP(playerCreatureMP - playerCreature[0].specialCost);

            // checks for enemy death
            if (enemyCreatureHP - ((playerCreatureSpecial - playerCreatureSpecial * enemyDefense) * criticalMultiplier) <= 0 && chancePlayer) {
              setBattleUndecided(false);
              playerAttackAnimation();
              specialAnimation();
              playerSpecialCT(playerCreatureSpecial, criticalMultiplier, enemyDefense);
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
                setEnemyCreature({});
                setPlayerCreatureHP(0);
              }, 2250);
              await setTimeout(() => {
                loadAsyncDataPlayer();
              }, 2250);
            } else {

              // damages enemy
              if (chancePlayer) {
                playerAttackAnimation();
                playerSpecialCT(playerCreatureSpecial, criticalMultiplier, enemyDefense);
                specialAnimation();
                setTimeout(() => {
                  setEnemyCreatureHP(enemyCreatureHP - (playerCreatureSpecial - playerCreatureSpecial * enemyDefense) * criticalMultiplier);
                }, 250);
              }

              enemyCounterAttack(chancePlayer, moveName);
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
          {/* game navigation */}
          <nav className="game_nav">
            <a className="game_nav_brand" href="app">
              <img src="favicon.ico" alt="favicon" width="48px" height="48px" />
            </a>
            <button className="button_logout" onClick={() => Userfront.logout()}>Logout</button>
            <button className="game_button_small button_options"
              onClick={() => { setOptionsStatus(!optionsStatus); setAvatarOptionStatus(false); setNameOptionStatus(false); }}>Options</button>
          </nav>
        </header>

        <main className="game_section">
          {/* options */}
          {optionsStatus ?
            <div className="color_white">
              <h3>Game Options</h3>
              <button className="game_button margin_small" onClick={() => { toggleDisplayCreatureStats() }}>Display Summon Stats
                {player.displayCreatureStats ? " - ON" : " - OFF"}</button>
              <h3>Player Options</h3>
              <button className="game_button margin_small" onClick={() => { setAvatarOptionStatus(!avatarOptionStatus); setNameOptionStatus(false); }}> Change Avatar</button>
              <button className="game_button margin_small" onClick={() => { setNameOptionStatus(!nameOptionStatus); setAvatarOptionStatus(false); }}>Change Name</button>
              {nameOptionStatus && !avatarOptionStatus ? <div>
                <label htmlFor="name">Player name:&nbsp;</label>
                <input className="margin_small" type="text" name="name" placeholder={player.name} /><br />
                <button className="game_button_small margin_small" onClick={() => selectName(document.querySelector("input[name='name']").value)}>Submit Name</button>
              </div>
                : null}
              {avatarOptionStatus && !nameOptionStatus ? <div>
                <div className="inline_flex">
                  <div className="margin_small" onClick={() => selectAvatar("img/avatar/f_mage_avatar.png")}>
                    <img className="player_avatar avatar_option" src={"img/avatar/f_mage_avatar.png"} alt={"f_mage"} width="96" height="96" />
                    <p className="avatar_option">Avatar 1</p></div>
                  <div className="margin_small" onClick={() => selectAvatar("img/avatar/m_mage_avatar.png")}>
                    <img className="player_avatar avatar_option" src={"img/avatar/m_mage_avatar.png"} alt={"m_mage"} width="96" height="96" />
                    <p className="avatar_option">Avatar 2</p></div>
                </div><br />
                <div className="inline_flex">
                  <div className="margin_small" onClick={() => selectAvatar("img/avatar/f_rogue_avatar.png")}>
                    <img className="player_avatar avatar_option" src={"img/avatar/f_rogue_avatar.png"} alt={"f_rogue"} width="96" height="96" />
                    <p className="avatar_option">Avatar 3</p></div>
                  <div className="margin_small" onClick={() => selectAvatar("img/avatar/m_rogue_avatar.png")}>
                    <img className="player_avatar avatar_option" src={"img/avatar/m_rogue_avatar.png"} alt={"m_rogue"} width="96" height="96" />
                    <p className="avatar_option">Avatar 4</p></div>
                </div><br />
                <div className="inline_flex">
                  <div className="margin_small" onClick={() => selectAvatar("img/avatar/f_warrior_avatar.png")}>
                    <img className="player_avatar avatar_option" src={"img/avatar/f_warrior_avatar.png"} alt={"f_warrior"} width="96" height="96" />
                    <p className="avatar_option">Avatar 5</p></div>
                  <div className="margin_small" onClick={() => selectAvatar("img/avatar/m_warrior_avatar.png")}>
                    <img className="player_avatar avatar_option" src={"img/avatar/m_warrior_avatar.png"} alt={"m_warrior"} width="96" height="96" />
                    <p className="avatar_option">Avatar 6</p></div>
                </div>
              </div>
                : null}
            </div>
            : null}

          {/* player */}
          {!optionsStatus ? <>
            <div className="color_white">
              <img src={player.avatarPath}
                alt={player.name}
                className="player_avatar"
                width="96"
                height="96" />
              <h4>{player.name}</h4>
              <h5>
                Lvl. {Math.floor(Math.sqrt(player.experience) * 0.25)} | {player.experience.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} XP
                <div className="progress_bar_container">
                  <div className="progress_bar"
                    style={{ width: ((Math.sqrt(player.experience) * 0.25 - Math.floor(Math.sqrt(player.experience) * 0.25)).toFixed(2)).replace("0.", '') + "%" }} />
                </div>
              </h5>
              <h5>Drachmas: {player.drachmas.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {"\u25C9"}</h5>

              {/* menu */}
              {!battleStatus ? <div><div className="inline_flex">
                <button className="game_button margin_small" onClick={() => { setRelicsStatus(!relicsStatus); setTempleStatus(false); setSummonsStatus(false); }}>Relics</button>
                <button className="game_button margin_small" onClick={() => { setTempleStatus(!templeStatus); setRelicsStatus(false); setSummonsStatus(false); }}>Temple</button>
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
                <button className="game_button margin_small" onClick={() => { setSummonsStatus(!summonsStatus); setTempleStatus(false); setRelicsStatus(false) }}>
                  Summons</button>
                <button className="game_button margin_small" onClick={() => { loadDataBattle(); setTempleStatus(false); setRelicsStatus(false); setSummonsStatus(false); }}>
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
                    <img onClick={() => alert("HP: " + creature.hp + "\nAttack: " + creature.attack + " - Attack type: " +
                      creature.attackType + "\nSpeed: " + creature.speed + "\nCritical: " + creature.critical + "\nDefense: " + creature.defense + "\nMP: " + creature.mp
                      + "\nMP Regen: " + creature.mpRegen + "\nSpecial: " + creature.special + " - Special type: " + creature.specialType + "\nSpecial cost: " +
                      creature.specialCost)}
                      className="summon_option_img"
                      src={creature.imgPath}
                      alt={creature.name}
                      width="96px"
                      height="96px" /><span className="summon_info" onClick={() => alert("HP: " + creature.hp + "\nAttack: " + creature.attack + " - Attack type: " +
                        creature.attackType + "\nSpeed: " + creature.speed + "\nCritical: " + creature.critical + "\nDefense: " + creature.defense + "\nMP: " + creature.mp
                        + "\nMP Regen: " + creature.mpRegen + "\nSpecial: " + creature.special + " - Special type: " + creature.specialType + "\nSpecial cost: " +
                        creature.specialCost)}>?</span><br />
                    {creature.name} - {creature.price} XP {creature.id === player.creatureId ? <i>{"\u2713"}</i> : null}
                  </div>))}
              </div>
                : null
              }
            </div>

            {/* player creature */}
            {!summonsStatus ? <>
              <div className="player_creature">
                {playerCreature.map((creature) => (
                  <div
                    key={creature.id}
                  >
                    {enemyAttackStatus ? <div className="special_effect_container"><div className={critText}>{combatText}</div></div> : null}
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
                    {specialStatus ? <div className="special_effect_container"><div className={creature.specialEffect} /></div> : null}
                    <div className="creature_panel">
                      {battleStatus ? <div className="inline_flex">
                        <button className="game_button attack_button" onClick={() => { attackEnemy(creature.attackName, creature.attackType) }}>{creature.attackName}</button>
                        <button className="game_button special_button" onClick={() => { attackEnemy(creature.specialName, creature.specialType) }}>{creature.specialName}<br />
                          Cost: {creature.specialCost} MP</button></div> : null}
                      <h4>{player.name}'s {creature.name}</h4>
                      {battleStatus ? <div className="progress_bar_container">
                        <div className="progress_bar"
                          style={{ width: ((playerCreatureHP / playerCreature[0].hp)) * 100 + "%" }} />
                      </div>
                        : null}
                      {!battleStatus ?
                        <div className="inline_flex"><h5>HP: {creature.hp + chosenRelic[0].hpMod}</h5>&nbsp;|&nbsp;<h5>MP: {creature.mp + chosenRelic[0].mpMod}</h5></div>
                        : <div className="inline_flex">
                          <h5>HP: {playerCreatureHP} / {creature.hp + chosenRelic[0].hpMod}</h5>&nbsp;|&nbsp;
                          <h5>MP: {playerCreatureMP} / {creature.mp + chosenRelic[0].mpMod}</h5></div>}
                      {creatureStatsStatus ?
                        <div>
                          <h5>Attack: {creature.attack + chosenRelic[0].attackMod} | Type: {creature.attackType}</h5>
                          <h5>Sp. Attack: {creature.special + chosenRelic[0].specialMod} | Type: {creature.specialType}</h5>
                          <h5>MP Regen: {creature.mpRegen + chosenRelic[0].mpRegenMod} | Speed: {creature.speed + chosenRelic[0].speedMod}</h5>
                          <h5>Critical: {creature.critical + chosenRelic[0].criticalMod}% | Defense: {creature.defense + chosenRelic[0].defenseMod}%</h5>
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
                    {playerAttackStatus ? <div className="special_effect_container"><div className={critText}>{combatText}</div></div> : null}
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
                      <div className="progress_bar_container">
                        <div className="progress_bar"
                          style={{ width: ((enemyCreatureHP / enemyCreature[0].hp)) * 100 + "%" }} />
                      </div>
                      <h5>HP: {enemyCreatureHP} / {creature.hp}</h5>
                    </div>
                  </div>
                ))}
              </div>
              : null}
          </> :

            // player for options
            <div className="color_white">
              <img src={player.avatarPath}
                alt={player.name}
                className="player_avatar"
                width="96"
                height="96" />
              <h4>{player.name}</h4>
              <h5>
                Lvl. {Math.floor(Math.sqrt(player.experience) * 0.25)} | {player.experience.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} XP
                <div className="progress_bar_container">
                  <div className="progress_bar"
                    style={{ width: ((Math.sqrt(player.experience) * 0.25 - Math.floor(Math.sqrt(player.experience) * 0.25)).toFixed(2)).replace("0.", '') + "%" }} />
                </div>
              </h5>
              <h5>Drachmas: {player.drachmas.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {"\u25C9"}</h5>
            </div>}
        </main>
      </>
    );
  }
  else return (<></>);
}

export default App;