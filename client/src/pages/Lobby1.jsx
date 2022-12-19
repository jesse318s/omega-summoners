import React, { useState, useEffect } from "react";
import "../App.scss";
import "./Lobby1.css";
import Userfront from "@userfront/core";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/userServices";
import GameNav from "../layouts/GameNav";
import Options from "../layouts/Options";
import MultiPlayerGameMenu from "../layouts/MultiPlayerGameMenu";
import MultiPlayerCreature from "../components/MultiPlayerCreature";
import MultiPlayerEnemyCreature from "../components/MultiPlayerEnemyCreature";
import creatures from "../constants/creatures";
import relics from "../constants/relics";
import { bossEnemyCreatureStage1 } from "../constants/enemyCreatures";
import { lobby1 } from "../constants/lobbies";
import { getLobby } from "../services/lobbyServices";
import { getConnections, addConnection } from "../services/connectionServices";
import { useSelector, useDispatch } from "react-redux";
import { setPlayerCreatureValue } from "../store/actions/summon.actions";
import { setEnemyCreatureValue } from "../store/actions/enemy.actions";
import {
  setPlayerRelicsValue,
  setChosenRelicValue,
} from "../store/actions/relics.actions";
import {
  enableCreatureStatsStatus,
  disableCreatureStatsStatus,
} from "../store/actions/creatureStatsStatus.actions";
import checkAuth from "../utils/checkAuth.js";
import checkLevelPlayer from "../utils/checkLevelPlayer.js";

// initialize Userfront
Userfront.init("rbvqd5nd");

// main app component
function Lobby1() {
  // dispatch hook for redux
  const dispatch = useDispatch();

  // player creature state from redux store
  const playerCreature = useSelector((state) => state.summon.playerCreature);
  // enemy creature state from redux store
  const enemyCreature = useSelector((state) => state.enemy.enemyCreature);
  // battle status combat state from redux store
  const battleStatus = useSelector((state) => state.battleStatus.battleStatus);

  // navigation hook
  const navigate = useNavigate();

  // player option state
  const [player, setPlayer] = useState({});
  const [optionsStatus, setOptionsStatus] = useState(false);
  const [avatarOptionStatus, setAvatarOptionStatus] = useState(false);
  const [nameOptionStatus, setNameOptionStatus] = useState(false);
  // game menu state
  const [gameMenuStatus, setGameMenuStatus] = useState({
    relicsStatus: false,
    templeStatus: false,
    summonsStatus: false,
    stagesStatus: false,
  });
  // creature and combat state
  const [creatureData] = useState(creatures);
  const [enemyCreatureData] = useState(bossEnemyCreatureStage1);
  const [combatTextAndStatus, setCombatTextAndStatus] = useState({
    playerAttackStatus: false,
    enemyAttackStatus: false,
    battleUndecided: false,
    combatText: "",
    critText: "combat_text",
    enemyCombatText: "",
    enemyCritText: "combat_text",
  });
  const [playerCreatureHP, setPlayerCreatureHP] = useState(0);
  const [playerCreatureMP, setPlayerCreatureMP] = useState(0);
  const [combatAlert, setCombatAlert] = useState("");
  const [spawnAnimation, setSpawnAnimation] = useState("");
  // relics state
  const [relicsData] = useState(relics);
  // lobby state
  const [lobby, setLobby] = useState({});
  const [connections, setConnections] = useState([{}]);

  useEffect(() => {
    checkAuth(Userfront, navigate);
    checkLevelPlayer(player, 8, navigate);
  });

  useEffect(() => {
    // retrieves lobby data and updates lobby state, also updates connections
    const initAsyncDataLobby = async () => {
      // retrieves connection data and updates connections
      const loadAsyncDataConnections = async () => {
        try {
          const { data } = await getConnections();
          setConnections(data);
        } catch (error) {
          console.log(error);
        }
      };
      loadAsyncDataConnections();
      try {
        const { data } = await getLobby(lobby1);
        setLobby(data);
      } catch (error) {
        console.log(error);
      }
    };
    // retrieves user data and updates player state
    const loadAsyncDataPlayer = async () => {
      try {
        const { data } = await getUser();
        setPlayer(data);
      } catch (error) {
        console.log(error);
      }
    };
    initAsyncDataLobby();
    loadAsyncDataPlayer();
  }, []);

  useEffect(() => {
    // if there is a player
    if (player) {
      // loads player creature data and sets player creature state
      const loadAsyncDataPlayerCreature = async () => {
        try {
          const playerCreatureData = creatureData.filter(
            (creature) => creature.id === player.creatureId
          );
          dispatch(setPlayerCreatureValue(playerCreatureData[0]));
          if (player.displayCreatureStats === true) {
            dispatch(enableCreatureStatsStatus());
          } else {
            dispatch(disableCreatureStatsStatus());
          }
        } catch (error) {
          console.log(error);
        }
      };
      loadAsyncDataPlayerCreature();
      // if there are player relics
      if (player.relics) {
        // loads player relics data
        const loadDataPlayerRelics = () => {
          try {
            const playerRelicsData = relicsData.filter((relic) =>
              player.relics.includes(relic.id)
            );
            dispatch(setPlayerRelicsValue(playerRelicsData));
            const chosenRelicData = playerRelicsData.filter(
              (relic) => relic.id === player.chosenRelic
            );
            dispatch(setChosenRelicValue(chosenRelicData[0]));
          } catch (error) {
            console.log(error);
          }
        };
        loadDataPlayerRelics();
      }
    }
  }, [player, relicsData, creatureData, dispatch]);

  useEffect(() => {
    // detects combat changes
    const checkCombat = () => {
      try {
        if (!battleStatus) {
          setCombatAlert("");
          const enemyCreatureNew = enemyCreatureData[0];
          if (enemyCreatureNew !== enemyCreature) {
            dispatch(setEnemyCreatureValue(enemyCreatureNew));
          }
        }
        if (combatAlert === "" && battleStatus) {
          setSpawnAnimation("spawn_effect");
          setTimeout(() => {
            setSpawnAnimation("");
          }, 200);
          setCombatTextAndStatus((combatTextAndStatus) => {
            return {
              ...combatTextAndStatus,
              battleUndecided: true,
            };
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkCombat();
  }, [enemyCreature, enemyCreatureData, combatAlert, battleStatus, dispatch]);

  // retrieves user data and updates player state
  const loadAsyncDataPlayer = async () => {
    try {
      const { data } = await getUser();
      setPlayer(data);
    } catch (error) {
      console.log(error);
    }
  };

  // retrieves lobby data and updates lobby state, also updates connections, and generates new connection if needed
  const loadAsyncDataLobby = async () => {
    // retrieves connection data and updates connections
    const loadAsyncDataConnections = async () => {
      try {
        const { data } = await getConnections();
        setConnections(data);
      } catch (error) {
        console.log(error);
      }
    };
    // checks connections and generates new connection if needed
    const genAsyncDataConnection = async () => {
      try {
        if (connections.length < 3) {
          const newConnection = {
            userId: Userfront.user.userId,
            name: player.name,
          };
          await addConnection(newConnection);
        } else if (
          connections.filter(
            (connection) => connection.userId === Userfront.user.userId
          ).length === 0
        ) {
          alert(
            "There cannot be more than 3 summoners in this battle. Please try again later."
          );
          window.location.reload(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    await loadAsyncDataConnections();
    genAsyncDataConnection();
    try {
      const { data } = await getLobby(lobby1);
      setLobby(data);
    } catch (error) {
      console.log(error);
    }
  };

  // renders if a player creature and relic is bestowed
  if (playerCreature && player.chosenRelic) {
    return (
      <>
        <header>
          <GameNav
            optionsStatus={optionsStatus}
            setOptionsStatus={setOptionsStatus}
            setNameOptionStatus={setNameOptionStatus}
            setAvatarOptionStatus={setAvatarOptionStatus}
          />
        </header>

        <main className="lobby1_game_section">
          <Options
            player={player}
            optionsStatus={optionsStatus}
            nameOptionStatus={nameOptionStatus}
            setNameOptionStatus={setNameOptionStatus}
            avatarOptionStatus={avatarOptionStatus}
            setAvatarOptionStatus={setAvatarOptionStatus}
            loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
          />

          {/* player with player details panel */}
          <div className="color_white">
            <img
              src={player.avatarPath}
              alt={player.name}
              className="player_avatar"
              width="96"
              height="96"
            />
            <h4>{player.name}</h4>
            <h5>
              Lvl. {Math.floor(Math.sqrt(player.experience) * 0.25)} |{" "}
              {player.experience
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              XP
              <div className="progress_bar_container">
                <div
                  className="progress_bar"
                  style={{
                    width:
                      (
                        Math.sqrt(player.experience) * 0.25 -
                        Math.floor(Math.sqrt(player.experience) * 0.25)
                      )
                        .toFixed(2)
                        .replace("0.", "") + "%",
                  }}
                />
              </div>
            </h5>
            <h5>
              Drachmas:{" "}
              {player.drachmas.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              {"\u25C9"}
            </h5>
          </div>

          {/* game menu and creatures wrapped in options status check */}
          {!optionsStatus ? (
            <>
              <MultiPlayerGameMenu
                player={player}
                gameMenuStatus={gameMenuStatus}
                setGameMenuStatus={setGameMenuStatus}
                loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
                setPlayerCreatureHP={setPlayerCreatureHP}
                setPlayerCreatureMP={setPlayerCreatureMP}
                connections={connections}
                loadAsyncDataLobby={() => loadAsyncDataLobby()}
              />

              {/* displays the combat alert if there is combat */}
              {battleStatus ? (
                <div>
                  <p className="combat_alert">{combatAlert}</p>
                </div>
              ) : null}

              {/* displays player creature if game menu isn't being used */}
              {Object.values(gameMenuStatus).every(
                (value) => value === false
              ) ? (
                <MultiPlayerCreature
                  combatTextAndStatus={combatTextAndStatus}
                  setCombatTextAndStatus={setCombatTextAndStatus}
                  player={player}
                  playerCreatureHP={playerCreatureHP}
                  setPlayerCreatureHP={setPlayerCreatureHP}
                  playerCreatureMP={playerCreatureMP}
                  setPlayerCreatureMP={setPlayerCreatureMP}
                  loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
                  setCombatAlert={setCombatAlert}
                  connections={connections}
                  lobby={lobby}
                  loadAsyncDataLobby={() => loadAsyncDataLobby()}
                />
              ) : null}

              <MultiPlayerEnemyCreature
                combatTextAndStatus={combatTextAndStatus}
                spawnAnimation={spawnAnimation}
                lobby={lobby}
              />
            </>
          ) : null}
        </main>
      </>
    );
  } else return <></>;
}

export default Lobby1;
