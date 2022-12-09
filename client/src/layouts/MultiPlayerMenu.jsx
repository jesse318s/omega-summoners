import { Link } from "react-router-dom";
import { updateUser } from "../services/userServices";
import { useState } from "react";
import { getPotionTimer } from "../services/potionTimerServices";
import creatures from "../constants/creatures";
import relics from "../constants/relics";
import { potionsList } from "../constants/items";
import { getConnections } from "../services/connectionServices";
import { useSelector, useDispatch } from "react-redux";
import { enableBattleStatus } from "../store/actions/battleStatus.actions";
import {
  setSummonHPBonusAmount,
  setSummonMPBonusAmount,
} from "../store/actions/alchemy.actions";

function MultiPlayerMenu({
  Userfront,
  player,
  gameMenuStatus,
  setGameMenuStatus,
  enemyCreatureData,
  combatAlert,
  setCombatAlert,
  loadAsyncDataPlayer,
  setPlayerCreatureHP,
  setPlayerCreatureMP,
  setEnemyCreature,
  setCombatTextAndStatus,
  setSpawnAnimation,
  connections,
  loadAsyncDataLobby,
}) {
  // dispatch hook for redux
  const dispatch = useDispatch();

  // player creature state from redux store
  const playerCreature = useSelector((state) => state.summon.playerCreature);
  // battle status combat state from redux store
  const battleStatus = useSelector((state) => state.battleStatus.battleStatus);
  // relics state from redux store
  const playerRelics = useSelector((state) => state.relics.playerRelics);
  const chosenRelic = useSelector((state) => state.relics.chosenRelic);
  // alchemy state from redux store
  const summonHPBonus = useSelector((state) => state.alchemy.summonHPBonus);
  const summonMPBonus = useSelector((state) => state.alchemy.summonMPBonus);
  // lobby timer state from redux store
  const lobbyTimer = useSelector((state) => state.lobbyTimer.lobbyTimer);

  // creature state
  const [creatureData] = useState(creatures);
  // relics state
  const [relicsData] = useState(relics);
  // numbered index state (summons pagination)
  const [index1, setIndex1] = useState(0);
  const [index2, setIndex2] = useState(5);
  // lettered index state (relics pagination)
  const [indexA, setIndexA] = useState(0);
  const [indexB, setIndexB] = useState(7);
  const [indexC, setIndexC] = useState(0);
  const [indexD, setIndexD] = useState(7);

  // paginates creatures for summons menu
  const paginateCreatures = async (index1, direction) => {
    try {
      if (direction === "next" && index1 < creatureData.length - 5) {
        setIndex1(index1 + 5);
        setIndex2(index2 + 5);
      } else if (direction === "previous" && index1 > 0) {
        setIndex1(index1 - 5);
        setIndex2(index2 - 5);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // paginates player relics for relics menu
  const paginatePlayerRelics = async (indexA, direction) => {
    try {
      if (direction === "next" && indexA < playerRelics.length - 7) {
        setIndexA(indexA + 7);
        setIndexB(indexB + 7);
      } else if (direction === "previous" && indexA > 0) {
        setIndexA(indexA - 7);
        setIndexB(indexB - 7);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // paginates relics for temple menu
  const paginateTempleRelics = async (indexC, direction) => {
    try {
      if (direction === "next" && indexC < relicsData.length - 7) {
        setIndexC(indexC + 7);
        setIndexD(indexD + 7);
      } else if (direction === "previous" && indexC > 0) {
        setIndexC(indexC - 7);
        setIndexD(indexD - 7);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // updates player chosen relic in database
  const selectRelic = async (relicId) => {
    try {
      if (
        window.confirm(
          "Are you sure you want to select this relic? You can change relics as many times as you wish."
        )
      ) {
        await Userfront.user.update({
          data: {
            userkey: Userfront.user.data.userkey,
          },
        });
        await updateUser(player._id, {
          userfrontId: Userfront.user.userId,
          chosenRelic: relicId,
        });
        await loadAsyncDataPlayer();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // updates player relics in database
  const buyRelic = async (relicId, relicPrice) => {
    try {
      // if the player can afford the relic and doesn't own it
      if (player.drachmas >= relicPrice && !player.relics.includes(relicId)) {
        if (
          window.confirm(
            `Are you sure you want to buy this relic? It will cost ${relicPrice} drachmas.`
          )
        ) {
          await Userfront.user.update({
            data: {
              userkey: Userfront.user.data.userkey,
            },
          });
          await updateUser(player._id, {
            userfrontId: Userfront.user.userId,
            drachmas: player.drachmas - relicPrice,
            relics: [...player.relics, relicId],
          });
          await loadAsyncDataPlayer();
        }
      } else {
        alert("You can't afford this relic or you already own it.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // swaps player creature in database
  const swapCreature = async (creatureId, creaturePrice) => {
    try {
      // if the player can afford the creature and isn't already using it
      if (
        player.experience >= creaturePrice &&
        player.creatureId !== creatureId
      ) {
        if (
          window.confirm(
            `Are you sure you want to swap your creature for this one? It will cost ${creaturePrice} experience.`
          )
        ) {
          await Userfront.user.update({
            data: {
              userkey: Userfront.user.data.userkey,
            },
          });
          await updateUser(player._id, {
            userfrontId: Userfront.user.userId,
            experience: player.experience - creaturePrice,
            creatureId: creatureId,
            preferredSpecial: 1,
          });
          await loadAsyncDataPlayer();
        }
      } else {
        alert("You can't afford this creature or you already have it.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // displays enemy spawn animation
  const displaySpawnAnimation = async () => {
    try {
      setSpawnAnimation("spawn_effect");
      setTimeout(() => {
        setSpawnAnimation("");
      }, 200);
    } catch (error) {
      console.log(error);
    }
  };

  // loads battle data
  const loadDataBattle = async () => {
    try {
      // refresh and set connections and load lobby data
      await getConnections();
      await loadAsyncDataLobby();
      // checks potion timer
      const potionTimer = await getPotionTimer();
      if (potionTimer.data.length > 0) {
        const playerPotion = potionsList.find(
          (potion) => potion.id === potionTimer.data[0].potionId
        );
        const playerMPBonus = playerPotion.mpMod;
        const playerHPBonus = playerPotion.hpMod;
        dispatch(setSummonMPBonusAmount(playerMPBonus));
        dispatch(setSummonHPBonusAmount(playerHPBonus));
      }
      if (potionTimer.data.length === 0) {
        dispatch(setSummonMPBonusAmount(0));
        dispatch(setSummonHPBonusAmount(0));
      }

      setPlayerCreatureMP(
        playerCreature.mp + chosenRelic.mpMod + summonMPBonus
      );
      setPlayerCreatureHP(
        playerCreature.hp + chosenRelic.hpMod + summonHPBonus
      );
      displaySpawnAnimation();
      const enemyCreature = [
        enemyCreatureData[Math.floor(Math.random() * enemyCreatureData.length)],
      ];
      setEnemyCreature(enemyCreature[0]);
      setCombatAlert("The battle has begun!");
      await loadAsyncDataLobby();
      dispatch(enableBattleStatus());
      setCombatTextAndStatus((combatTextAndStatus) => {
        return {
          ...combatTextAndStatus,
          battleUndecided: true,
        };
      });
      await loadAsyncDataPlayer();
    } catch (error) {
      console.log(error);
    }
  };

  if (connections) {
    return (
      <>
        <div className="color_white">
          {/* if there is no battle, displays buttons for selecting temple or relics from menu to display */}
          {!battleStatus ? (
            <div>
              <div className="inline_flex">
                <button
                  className="game_button margin_small"
                  onClick={() => {
                    setGameMenuStatus({
                      relicsStatus: !gameMenuStatus.relicsStatus,
                      summonsStatus: false,
                      templeStatus: false,
                      stagesStatus: false,
                    });
                  }}
                >
                  Relics
                </button>

                <button
                  className="game_button margin_small"
                  onClick={() => {
                    setGameMenuStatus({
                      templeStatus: !gameMenuStatus.templeStatus,
                      summonsStatus: false,
                      relicsStatus: false,
                      stagesStatus: false,
                    });
                  }}
                >
                  Temple
                </button>
              </div>
            </div>
          ) : null}

          {/* displays the combat alert if there is a battle */}
          {battleStatus ? (
            <div>
              <p className="combat_alert">{combatAlert}</p>
            </div>
          ) : null}

          {/* displays player relics if relics button is clicked */}
          {gameMenuStatus.relicsStatus ? (
            <div>
              <h4>Player Relics</h4>
              <button
                className="game_button_small margin_small"
                onClick={() => paginatePlayerRelics(indexA, "previous")}
              >
                Previous
              </button>
              <button
                className="game_button_small margin_small"
                onClick={() => paginatePlayerRelics(indexA, "next")}
              >
                Next
              </button>
              {playerRelics.slice(indexA, indexB).map((relic) => (
                <div className="relic_option" key={relic.id}>
                  <button
                    className="game_button_small"
                    onClick={() => selectRelic(relic.id)}
                  >
                    Use
                  </button>
                  <img
                    onClick={() => alert(relic.description)}
                    className="relic_option_img"
                    src={relic.imgPath}
                    alt={relic.name}
                    width="48px"
                    height="48px"
                  />
                  <span
                    className="relic_info"
                    onClick={() => alert(relic.description)}
                  >
                    ?
                  </span>
                  <br />
                  {relic.name}{" "}
                  {relic.id === player.chosenRelic ? <i>{"\u2713"}</i> : null}
                </div>
              ))}
            </div>
          ) : null}

          {/* displays temple relics if temple button is clicked */}
          {gameMenuStatus.templeStatus ? (
            <div>
              <h4>Temple Relics</h4>
              <button
                className="game_button_small margin_small"
                onClick={() => paginateTempleRelics(indexC, "previous")}
              >
                Previous
              </button>
              <button
                className="game_button_small margin_small"
                onClick={() => paginateTempleRelics(indexC, "next")}
              >
                Next
              </button>
              {relicsData.slice(indexC, indexD).map((relic) => (
                <div className="relic_option" key={relic.id}>
                  <button
                    className="game_button_small"
                    onClick={() => {
                      buyRelic(relic.id, relic.price);
                    }}
                  >
                    Buy
                  </button>
                  <img
                    onClick={() => alert(relic.description)}
                    className="relic_option_img"
                    src={relic.imgPath}
                    alt={relic.name}
                    width="48px"
                    height="48px"
                  />
                  <span
                    className="relic_info"
                    onClick={() => alert(relic.description)}
                  >
                    ?
                  </span>
                  {player.relics.includes(relic.id) ? <i>{"\u2713"}</i> : null}
                  <br />
                  {relic.name} - {relic.price} {"\u25C9"}
                </div>
              ))}
            </div>
          ) : null}

          {/* if there is no battle, displays buttons for selecting summons or stages from menu to display */}
          {!battleStatus ? (
            <>
              <button
                className="game_button margin_small"
                onClick={() => {
                  setGameMenuStatus({
                    summonsStatus: !gameMenuStatus.summonsStatus,
                    templeStatus: false,
                    relicsStatus: false,
                    stagesStatus: false,
                  });
                }}
              >
                Summons
              </button>

              <button
                className="game_button margin_small"
                onClick={() => {
                  setGameMenuStatus({
                    stagesStatus: !gameMenuStatus.stagesStatus,
                    summonsStatus: false,
                    templeStatus: false,
                    relicsStatus: false,
                  });
                }}
              >
                Stages
              </button>
              <br />
            </>
          ) : null}

          {/* displays player summons if summons button is clicked */}
          {gameMenuStatus.summonsStatus ? (
            <div>
              <h4>Available Summons</h4>
              <button
                className="game_button_small margin_small"
                onClick={() => paginateCreatures(index1, "previous")}
              >
                Previous
              </button>
              <button
                className="game_button_small margin_small"
                onClick={() => paginateCreatures(index1, "next")}
              >
                Next
              </button>
              {creatureData.slice(index1, index2).map((creature) => (
                <div className="summon_option" key={creature.id}>
                  <button
                    className="game_button_small"
                    onClick={() => {
                      swapCreature(creature.id, creature.price);
                    }}
                  >
                    Swap
                  </button>
                  <img
                    onClick={() =>
                      alert(
                        "HP: " +
                          creature.hp +
                          "\nAttack: " +
                          creature.attack +
                          " | Type: " +
                          creature.attackType +
                          "\nSpeed: " +
                          creature.speed +
                          "\nCritical: " +
                          creature.critical +
                          "%\nDefense: " +
                          creature.defense +
                          "%\nMP: " +
                          creature.mp +
                          " | MP Regen: " +
                          creature.mpRegen +
                          "\nSpecial: " +
                          creature.special +
                          " | Type: " +
                          creature.specialType +
                          " | Cost: " +
                          creature.specialCost +
                          "\nSpecial 2: " +
                          creature.special2 +
                          " | Type: " +
                          creature.specialType2 +
                          " | Cost: " +
                          creature.specialCost2 +
                          "\n\n(Poison always crits, Magic ignores armor, and " +
                          "Lifesteal restores 20% of damage as health)"
                      )
                    }
                    className="summon_option_img"
                    src={creature.imgPath}
                    alt={creature.name}
                    width="96px"
                    height="96px"
                  />
                  <span
                    className="summon_info"
                    onClick={() =>
                      alert(
                        "HP: " +
                          creature.hp +
                          "\nAttack: " +
                          creature.attack +
                          " | Type: " +
                          creature.attackType +
                          "\nSpeed: " +
                          creature.speed +
                          "\nCritical: " +
                          creature.critical +
                          "%\nDefense: " +
                          creature.defense +
                          "%\nMP: " +
                          creature.mp +
                          " | MP Regen: " +
                          creature.mpRegen +
                          "\nSpecial: " +
                          creature.special +
                          " | Special type: " +
                          creature.specialType +
                          " | Cost: " +
                          creature.specialCost +
                          "\nSpecial 2: " +
                          creature.special2 +
                          " | Type: " +
                          creature.specialType2 +
                          " | Cost: " +
                          creature.specialCost2 +
                          "\n\n(Poison always crits, Magic ignores armor, and " +
                          "Lifesteal restores 20% of damage as health)"
                      )
                    }
                  >
                    ?
                  </span>
                  <br />
                  {creature.name} - {creature.price} XP{" "}
                  {creature.id === player.creatureId ? <i>{"\u2713"}</i> : null}
                </div>
              ))}
            </div>
          ) : null}

          {/* displays stages if stages button is clicked */}
          {gameMenuStatus.stagesStatus ? (
            <>
              <h4>Battle Stages</h4>
              <div className="stage_options">
                <Link to="/app">
                  <button className="game_button_small margin_small">
                    Lvl. 0 | Home
                    <br /> The Bridge (Solo)
                  </button>
                  {window.location.pathname === "/app" ? (
                    <span className="color_white">X</span>
                  ) : null}
                </Link>
                <br />
                <Link to="/stage1">
                  <button className="game_button_small margin_small">
                    Lvl. 5 | Stage I<br /> Mount Olympus (Solo)
                  </button>
                  {window.location.pathname === "/stage1" ? (
                    <span className="color_white">X</span>
                  ) : null}
                </Link>
                <br />
                <Link to="/lobby1">
                  <button className="game_button_small margin_small">
                    Lvl. 8 | Stage I<br /> (Multiplayer)
                  </button>
                  {window.location.pathname === "/lobby1" ? (
                    <span className="color_white">X</span>
                  ) : null}
                </Link>
                <br />
              </div>
            </>
          ) : null}

          {/* if there is no battle, displays button for attempting to select alchemy from menu, but alerts user instead */}
          {!battleStatus ? (
            <>
              <button
                className="game_button margin_small"
                onClick={() => {
                  alert(
                    "Alchemy cannot be performed here. (Multiplayer stage)"
                  );
                }}
              >
                Alchemy
              </button>{" "}
            </>
          ) : null}

          {/* if there is no battle, displays a button to start a battle at the current stage */}
          {!battleStatus && !lobbyTimer ? (
            <>
              <button
                className="game_button margin_small"
                onClick={() => {
                  loadDataBattle();
                  setGameMenuStatus({
                    templeStatus: false,
                    relicsStatus: false,
                    summonsStatus: false,
                    stagesStatus: false,
                  });
                }}
              >
                Battle
              </button>{" "}
            </>
          ) : !battleStatus ? (
            <>
              <button
                className="game_button margin_small"
                onClick={() => {
                  alert(
                    "Multiplayer cooldown is active. Please try again in a few seconds."
                  );
                }}
              >
                Battle
              </button>{" "}
            </>
          ) : null}

          {/* displays allies that are online and fighting */}
          {Object.values(gameMenuStatus).every((value) => value === false) ? (
            <>
              <h4 className="margin_small">Allies online:</h4>
              {connections.length > 1 ? (
                <>
                  {connections.map((ally) => (
                    <div className="ally_option" key={ally.userId}>
                      <div>
                        {ally.userId !== player.userfrontId ? ally.name : null}
                      </div>
                    </div>
                  ))}
                </>
              ) : null}
            </>
          ) : null}
        </div>
      </>
    );
  } else return <></>;
}

export default MultiPlayerMenu;
