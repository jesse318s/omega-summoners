import React, { useState, useEffect } from "react";
import "../App.scss";
import "./Lobby1.css";
import Userfront from "@userfront/core";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/userServices";
import GameNav from "../layouts/GameNav";
import Options from "../layouts/Options";
import Player from "../components/Player";
import MultiPlayerMenu from "../layouts/MultiPlayerMenu";
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
import {
  setPlayerRelicsValue,
  setChosenRelicValue,
} from "../store/actions/relics.actions";
import { disableBattleStatus } from "../store/actions/battleStatus.actions";
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
  const [enemyCreature, setEnemyCreature] = useState({});
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
            if (combatAlert === "") {
              dispatch(disableBattleStatus());
            }
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
  }, [player, relicsData, creatureData, combatAlert, navigate, dispatch]);

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
            Userfront={Userfront}
            optionsStatus={optionsStatus}
            setOptionsStatus={setOptionsStatus}
            setNameOptionStatus={setNameOptionStatus}
            setAvatarOptionStatus={setAvatarOptionStatus}
          />
        </header>

        <main className="lobby1_game_section">
          <Options
            Userfront={Userfront}
            player={player}
            optionsStatus={optionsStatus}
            nameOptionStatus={nameOptionStatus}
            setNameOptionStatus={setNameOptionStatus}
            avatarOptionStatus={avatarOptionStatus}
            setAvatarOptionStatus={setAvatarOptionStatus}
            loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
          />

          <Player player={player} />

          {/* menu and creatures wrapped in options status check */}
          {!optionsStatus ? (
            <>
              <MultiPlayerMenu
                Userfront={Userfront}
                player={player}
                gameMenuStatus={gameMenuStatus}
                setGameMenuStatus={setGameMenuStatus}
                enemyCreatureData={enemyCreatureData}
                combatAlert={combatAlert}
                setCombatAlert={setCombatAlert}
                loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
                setPlayerCreatureHP={setPlayerCreatureHP}
                setPlayerCreatureMP={setPlayerCreatureMP}
                setEnemyCreature={setEnemyCreature}
                combatTextAndStatus={combatTextAndStatus}
                setCombatTextAndStatus={setCombatTextAndStatus}
                setSpawnAnimation={setSpawnAnimation}
                connections={connections}
                loadAsyncDataLobby={() => loadAsyncDataLobby()}
              />

              <MultiPlayerCreature
                combatTextAndStatus={combatTextAndStatus}
                setCombatTextAndStatus={setCombatTextAndStatus}
                player={player}
                playerCreatureHP={playerCreatureHP}
                setPlayerCreatureHP={setPlayerCreatureHP}
                playerCreatureMP={playerCreatureMP}
                setPlayerCreatureMP={setPlayerCreatureMP}
                enemyCreature={enemyCreature}
                setEnemyCreature={setEnemyCreature}
                Userfront={Userfront}
                loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
                setCombatAlert={setCombatAlert}
                connections={connections}
                lobby={lobby}
                loadAsyncDataLobby={() => loadAsyncDataLobby()}
                gameMenuStatus={gameMenuStatus}
              />

              <MultiPlayerEnemyCreature
                enemyCreature={enemyCreature}
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
