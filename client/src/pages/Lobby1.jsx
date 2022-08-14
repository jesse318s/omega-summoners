import React, { useState, useEffect } from "react";
import "../App.scss";
import "./Lobby1.css";
import Userfront from "@userfront/core";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/userServices";
import GameNav from "../components/GameNav";
import Options from "../components/Options";
import Player from "../components/Player";
import MultiPlayerMenu from "../components/MultiPlayerMenu";
import MultiPlayerCreature from "../components/MultiPlayerCreature";
import MultiPlayerEnemyCreature from "../components/MultiPlayerEnemyCreature";
import creatures from "../constants/creatures";
import relics from "../constants/relics";
import { bossEnemyCreatureStage1 } from "../constants/enemyCreatures";
import { lobby1 } from "../constants/lobbies";
import { getLobby } from "../services/lobbyServices";
import { getConnections, addConnection } from "../services/connectionServices";

// initialize Userfront
Userfront.init("rbvqd5nd");

// main app component
function Lobby1() {
  // navigation hook
  const navigate = useNavigate();

  // player option state
  const [player, setPlayer] = useState({});
  const [optionsStatus, setOptionsStatus] = useState(false);
  const [avatarOptionStatus, setAvatarOptionStatus] = useState(false);
  const [nameOptionStatus, setNameOptionStatus] = useState(false);
  // game menu state
  const [relicsStatus, setRelicsStatus] = useState(false);
  const [templeStatus, setTempleStatus] = useState(false);
  const [summonsStatus, setSummonsStatus] = useState(false);
  const [stagesStatus, setStagesStatus] = useState(false);
  // creature and combat state
  const [creatureData] = useState(creatures);
  const [enemyCreatureData] = useState(bossEnemyCreatureStage1);
  const [playerCreature, setPlayerCreature] = useState({});
  const [creatureStatsStatus, setCreatureStatsStatus] = useState(false);
  const [enemyCreature, setEnemyCreature] = useState({});
  const [playerAttackStatus, setPlayerAttackStatus] = useState(false);
  const [enemyAttackStatus, setEnemyAttackStatus] = useState(false);
  const [playerCreatureHP, setPlayerCreatureHP] = useState(0);
  const [playerCreatureMP, setPlayerCreatureMP] = useState(0);
  const [combatAlert, setCombatAlert] = useState("");
  const [battleUndecided, setBattleUndecided] = useState(false);
  const [combatText, setCombatText] = useState("");
  const [critText, setCritText] = useState("combat_text");
  const [spawnAnimation, setSpawnAnimation] = useState("");
  // relic state
  const [relicsData] = useState(relics);
  const [playerRelics, setPlayerRelics] = useState([{}]);
  const [chosenRelic, setChosenRelic] = useState(undefined);
  // lobby state
  const [lobby, setLobby] = useState({});
  const [lobbyTimer, setLobbyTimer] = useState(false);
  const [connections, setConnections] = useState([{}]);

  useEffect(() => {
    // checks for userfront authentication and redirects visitor if not authenticated
    const checkAuth = () => {
      try {
        if (!Userfront.accessToken()) {
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkAuth();
  });

  useEffect(() => {
    // checks for userkey and logs user out if none is found
    const checkDataPlayer = () => {
      try {
        // if there is no user key
        if (Userfront.user.data.userkey === undefined) {
          Userfront.logout();
        }
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
    // retreives lobby data and updates lobby state
    const loadAsyncDataLobby = async () => {
      try {
        const { data } = await getLobby(lobby1);
        setLobby(data);
      } catch (error) {
        console.log(error);
      }
    };
    checkDataPlayer();
    loadAsyncDataPlayer();
    loadAsyncDataLobby();
  }, []);

  useEffect(() => {
    // if there is a player
    if (player) {
      // checks player level for stage requirements
      const checkLevelPlayer = () => {
        try {
          if (Math.floor(Math.sqrt(player.experience) * 0.25) < 8) {
            alert("You must be level 8 to battle this boss.");
            navigate(-1);
          }
        } catch (error) {
          console.log(error);
        }
      };
      // loads player creature data and sets player creature state
      const loadDataPlayerCreature = () => {
        try {
          const playerCreatureData = creatureData.filter(
            (creature) => creature.id === player.creatureId
          );
          setPlayerCreature(playerCreatureData[0]);
          setCreatureStatsStatus(player.displayCreatureStats);
        } catch (error) {
          console.log(error);
        }
      };
      checkLevelPlayer();
      loadDataPlayerCreature();
      // if there are player relics
      if (player.relics) {
        // loads player relics data
        const loadDataPlayerRelics = () => {
          try {
            const playerRelicsData = relicsData.filter((relic) =>
              player.relics.includes(relic.id)
            );
            setPlayerRelics(playerRelicsData);
            const chosenRelicData = playerRelicsData.filter(
              (relic) => relic.id === player.chosenRelic
            );
            setChosenRelic(chosenRelicData[0]);
          } catch (error) {
            console.log(error);
          }
        };
        loadDataPlayerRelics();
      }
    }
  }, [player, relicsData, creatureData, navigate]);

  // retrieves user data and updates player state
  const loadAsyncDataPlayer = async () => {
    try {
      const { data } = await getUser();
      setPlayer(data);
    } catch (error) {
      console.log(error);
    }
  };

  // retrieves connection data and updates connections
  const loadAsyncDataConnection = async () => {
    try {
      const { data } = await getConnections();
      setConnections(data);
    } catch (error) {
      console.log(error);
    }
  };

  // retreives lobby data and updates lobby state, also generates new connection if needed and updates connections
  const loadAsyncDataLobby = async () => {
    try {
      // checks for connection and generates new connection if needed
      const genAsyncDataConnection = async () => {
        try {
          const newConnection = {
            userId: Userfront.user.userId,
            name: player.name,
          };
          await addConnection(newConnection);
        } catch (error) {
          console.log(error);
        }
      };
      // retrieves connection data and updates connections
      const loadAsyncDataConnection = async () => {
        try {
          const { data } = await getConnections();
          setConnections(data);
        } catch (error) {
          console.log(error);
        }
      };
      genAsyncDataConnection();
      loadAsyncDataConnection();
      const { data } = await getLobby(lobby1);
      setLobby(data);
    } catch (error) {
      console.log(error);
    }
  };

  // renders if a player creature and relic is bestowed
  if (playerCreature && chosenRelic) {
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
            creatureStatsStatus={creatureStatsStatus}
            loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
          />

          <Player player={player} />

          {/* menu and creatures wrapped in options status check */}
          {!optionsStatus ? (
            <>
              <MultiPlayerMenu
                Userfront={Userfront}
                player={player}
                setPlayer={setPlayer}
                relicsData={relicsData}
                relicsStatus={relicsStatus}
                setRelicsStatus={setRelicsStatus}
                playerRelics={playerRelics}
                templeStatus={templeStatus}
                setTempleStatus={setTempleStatus}
                creatureData={creatureData}
                enemyCreatureData={enemyCreatureData}
                summonsStatus={summonsStatus}
                setSummonsStatus={setSummonsStatus}
                stagesStatus={stagesStatus}
                setStagesStatus={setStagesStatus}
                combatAlert={combatAlert}
                loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
                setPlayerCreatureHP={setPlayerCreatureHP}
                setPlayerCreatureMP={setPlayerCreatureMP}
                playerCreature={playerCreature}
                chosenRelic={chosenRelic}
                setEnemyCreature={setEnemyCreature}
                setCombatAlert={setCombatAlert}
                setBattleUndecided={setBattleUndecided}
                setSpawnAnimation={setSpawnAnimation}
                loadAsyncDataLobby={() => loadAsyncDataLobby()}
                loadAsyncDataConnection={() => loadAsyncDataConnection()}
                connections={connections}
                setConnections={setConnections}
              />

              <MultiPlayerCreature
                summonsStatus={summonsStatus}
                playerCreature={playerCreature}
                enemyAttackStatus={enemyAttackStatus}
                setEnemyAttackStatus={setEnemyAttackStatus}
                critText={critText}
                setCritText={setCritText}
                combatText={combatText}
                playerAttackStatus={playerAttackStatus}
                setPlayerAttackStatus={setPlayerAttackStatus}
                chosenRelic={chosenRelic}
                player={player}
                creatureStatsStatus={creatureStatsStatus}
                playerCreatureHP={playerCreatureHP}
                setPlayerCreatureHP={setPlayerCreatureHP}
                playerCreatureMP={playerCreatureMP}
                setPlayerCreatureMP={setPlayerCreatureMP}
                setCombatText={setCombatText}
                enemyCreature={enemyCreature}
                setEnemyCreature={setEnemyCreature}
                battleUndecided={battleUndecided}
                setBattleUndecided={setBattleUndecided}
                Userfront={Userfront}
                loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
                setCombatAlert={setCombatAlert}
                lobby={lobby}
                loadAsyncDataLobby={() => loadAsyncDataLobby()}
                lobbyTimer={lobbyTimer}
                setLobbyTimer={setLobbyTimer}
                relicsStatus={relicsStatus}
                templeStatus={templeStatus}
                stagesStatus={stagesStatus}
              />

              <MultiPlayerEnemyCreature
                enemyCreature={enemyCreature}
                playerAttackStatus={playerAttackStatus}
                enemyAttackStatus={enemyAttackStatus}
                critText={critText}
                combatText={combatText}
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
