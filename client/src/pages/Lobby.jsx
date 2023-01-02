import { useState, useEffect } from "react";
import "../App.scss";
import "./Lobby.css";
import Userfront from "@userfront/core";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/userServices";
import GameNav from "../layouts/GameNav";
import OptionsMenu from "../layouts/OptionsMenu";
import PlayerPanel from "../components/PlayerPanel";
import MultiPlayerGameMenu from "../layouts/MultiPlayerGameMenu";
import MultiPlayerCreature from "../components/MultiPlayerCreature";
import MultiPlayerEnemyCreature from "../components/MultiPlayerEnemyCreature";
import creatures from "../constants/creatures";
import relics from "../constants/relics";
import { enemyCreatureLobby1 } from "../constants/enemyCreatures";
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
function Lobby() {
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
  const [optionsMenuStatus, setOptionsMenuStatus] = useState({
    optionsStatus: false,
    avatarOptionStatus: false,
    nameOptionStatus: false,
  });
  // game menu state
  const [gameMenuStatus, setGameMenuStatus] = useState({
    relicsStatus: false,
    templeStatus: false,
    summonsStatus: false,
    stagesStatus: false,
  });
  // creature and combat state
  const [creatureData] = useState(creatures);
  const [enemyCreatureDataLobby] = useState(enemyCreatureLobby1);
  const [combatTextAndCombatStatus, setCombatTextAndCombatStatus] = useState({
    playerAttackStatus: false,
    enemyAttackStatus: false,
    battleUndecided: false,
    combatAlert: "",
    combatText: "",
    critText: "combat_text",
    enemyCombatText: "",
    enemyCritText: "combat_text",
  });
  const [playerCreatureResources, setPlayerCreatureResources] = useState({
    playerCreatureHP: 0,
    playerCreatureMP: 0,
  });
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
    const initAsyncDataPlayer = async () => {
      try {
        const { data } = await getUser();
        setPlayer(data);
      } catch (error) {
        console.log(error);
      }
    };
    initAsyncDataLobby();
    initAsyncDataPlayer();
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
          setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
            return {
              ...combatTextAndCombatStatus,
              combatAlert: "",
            };
          });
          const enemyCreatureNew = enemyCreatureDataLobby[0];
          if (enemyCreatureNew !== enemyCreature) {
            dispatch(setEnemyCreatureValue(enemyCreatureNew));
          }
        }
        if (combatTextAndCombatStatus.combatAlert === "" && battleStatus) {
          setSpawnAnimation("spawn_effect");
          setTimeout(() => {
            setSpawnAnimation("");
          }, 200);
          setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
            return {
              ...combatTextAndCombatStatus,
              battleUndecided: true,
            };
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkCombat();
  }, [
    enemyCreature,
    enemyCreatureDataLobby,
    combatTextAndCombatStatus.combatAlert,
    battleStatus,
    dispatch,
  ]);

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
    loadAsyncDataConnections();
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
            optionsMenuStatus={optionsMenuStatus}
            setOptionsMenuStatus={setOptionsMenuStatus}
          />

          <OptionsMenu
            player={player}
            optionsMenuStatus={optionsMenuStatus}
            setOptionsMenuStatus={setOptionsMenuStatus}
            loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
          />
        </header>

        <main className="lobby1_game_section">
          <PlayerPanel player={player} />

          {/* displays other menus and creatures if options menu isnt being used */}
          {Object.values(optionsMenuStatus).every(
            (value) => value === false
          ) ? (
            <>
              <MultiPlayerGameMenu
                player={player}
                gameMenuStatus={gameMenuStatus}
                setGameMenuStatus={setGameMenuStatus}
                loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
                setPlayerCreatureResources={setPlayerCreatureResources}
                connections={connections}
                loadAsyncDataLobby={() => loadAsyncDataLobby()}
              />

              {/* if game menu isn't being used */}
              {Object.values(gameMenuStatus).every(
                (value) => value === false
              ) ? (
                <>
                  {/* displays allies that are online and fighting */}
                  <h4 className="margin_small color_white">Allies online:</h4>
                  {connections.length > 0 &&
                  connections[0].userId &&
                  connections.length < 4 ? (
                    <>
                      {connections.map((ally) => (
                        <div className="color_white" key={ally.userId}>
                          {ally.userId !== player.userfrontId
                            ? ally.name
                            : null}
                        </div>
                      ))}
                    </>
                  ) : null}

                  {/* displays the combat alert if there is combat */}
                  {battleStatus ? (
                    <div>
                      <p className="combat_alert">
                        {combatTextAndCombatStatus.combatAlert}
                      </p>
                    </div>
                  ) : null}

                  {/* displays player creature */}
                  <MultiPlayerCreature
                    combatTextAndCombatStatus={combatTextAndCombatStatus}
                    setCombatTextAndCombatStatus={setCombatTextAndCombatStatus}
                    player={player}
                    playerCreatureResources={playerCreatureResources}
                    setPlayerCreatureResources={setPlayerCreatureResources}
                    loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
                    connections={connections}
                    lobby={lobby}
                    loadAsyncDataLobby={() => loadAsyncDataLobby()}
                  />
                </>
              ) : null}

              <MultiPlayerEnemyCreature
                combatTextAndCombatStatus={combatTextAndCombatStatus}
                spawnAnimation={spawnAnimation}
                lobby={lobby}
              />
            </>
          ) : null}
        </main>
      </>
    );
  } else return null;
}

export default Lobby;
