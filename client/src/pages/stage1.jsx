import React, { useState, useEffect } from "react";
import "../App.scss";
import "./stage1.css";
import Userfront from "@userfront/core";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/userServices";
import GameNav from "../components/gameNav";
import Options from "../components/options";
import Player from "../components/player";
import Menu from "../components/menu";
import PlayerCreature from "../components/playerCreature";
import EnemyCreature from "../components/enemyCreature";
import creatures from "../constants/creatures";
import relics from "../constants/relics";
import { enemyCreaturesStage1 } from "../constants/enemyCreatures";

// initialize Userfront
Userfront.init("rbvqd5nd");

// main app component
function Stage1() {
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
  const [alchemyStatus, setAlchemyStatus] = useState(false);
  // creature and combat state
  const [creatureData] = useState(creatures);
  const [enemyCreatureData] = useState(enemyCreaturesStage1);
  const [playerCreature, setPlayerCreature] = useState({});
  const [creatureStatsStatus, setCreatureStatsStatus] = useState(false);
  const [battleStatus, setBattleStatus] = useState(false);
  const [enemyCreature, setEnemyCreature] = useState({});
  const [playerAttackStatus, setPlayerAttackStatus] = useState(false);
  const [enemyAttackStatus, setEnemyAttackStatus] = useState(false);
  const [specialStatus, setSpecialStatus] = useState(false);
  const [playerCreatureHP, setPlayerCreatureHP] = useState(0);
  const [enemyCreatureHP, setEnemyCreatureHP] = useState(0);
  const [playerCreatureMP, setPlayerCreatureMP] = useState(0);
  const [combatAlert, setCombatAlert] = useState("");
  const [battleUndecided, setBattleUndecided] = useState(false);
  const [combatText, setCombatText] = useState("");
  const [critText, setCritText] = useState("combat_text");
  const [spawnAnimation, setSpawnAnimation] = useState("");
  // relic state
  const [relicsData] = useState(relics);
  const [playerRelics, setPlayerRelics] = useState([{}]);
  const [chosenRelic, setChosenRelic] = useState({});
  // alchemy state
  const [potions, setPotions] = useState([{}]);
  const [ingredients, setIngredients] = useState([{}]);
  const [playerItems, setPlayerItems] = useState([{}]);
  const [summonHPBonus, setSummonHPBonus] = useState(0);
  const [summonMPBonus, setSummonMPBonus] = useState(0);

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
    checkDataPlayer();
    loadAsyncDataPlayer();
  }, []);

  useEffect(() => {
    // if there is a player
    if (player) {
      // checks player level for stage requirements
      const checkLevelPlayer = () => {
        try {
          if (Math.floor(Math.sqrt(player.experience) * 0.25) < 5) {
            alert("You must be level 5 to battle at this stage.");
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
            setChosenRelic(chosenRelicData);
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

  // renders if a relic is bestowed
  if (chosenRelic[0]) {
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

        <main className="stage1_game_section">
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
              <Menu
                Userfront={Userfront}
                battleStatus={battleStatus}
                setBattleStatus={setBattleStatus}
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
                setEnemyCreatureHP={setEnemyCreatureHP}
                setCombatAlert={setCombatAlert}
                setBattleUndecided={setBattleUndecided}
                setSpawnAnimation={setSpawnAnimation}
                alchemyStatus={alchemyStatus}
                setAlchemyStatus={setAlchemyStatus}
                potions={potions}
                setPotions={setPotions}
                ingredients={ingredients}
                setIngredients={setIngredients}
                summonHPBonus={summonHPBonus}
                setSummonHPBonus={setSummonHPBonus}
                summonMPBonus={summonMPBonus}
                setSummonMPBonus={setSummonMPBonus}
              />

              <PlayerCreature
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
                specialStatus={specialStatus}
                setSpecialStatus={setSpecialStatus}
                battleStatus={battleStatus}
                setBattleStatus={setBattleStatus}
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
                enemyCreatureHP={enemyCreatureHP}
                setEnemyCreatureHP={setEnemyCreatureHP}
                Userfront={Userfront}
                loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
                setCombatAlert={setCombatAlert}
                relicsStatus={relicsStatus}
                templeStatus={templeStatus}
                stagesStatus={stagesStatus}
                alchemyStatus={alchemyStatus}
                playerItems={playerItems}
                setPlayerItems={setPlayerItems}
                summonHPBonus={summonHPBonus}
                setSummonHPBonus={setSummonHPBonus}
                summonMPBonus={summonMPBonus}
                setSummonMPBonus={setSummonMPBonus}
              />

              <EnemyCreature
                battleStatus={battleStatus}
                enemyCreature={enemyCreature}
                playerAttackStatus={playerAttackStatus}
                enemyAttackStatus={enemyAttackStatus}
                critText={critText}
                combatText={combatText}
                enemyCreatureHP={enemyCreatureHP}
                spawnAnimation={spawnAnimation}
              />
            </>
          ) : null}
        </main>
      </>
    );
  } else return <></>;
}

export default Stage1;
