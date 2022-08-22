import React, { useEffect, useState } from "react";
import "./App.scss";
import Userfront from "@userfront/core";
import { useNavigate } from "react-router-dom";
import { getUser, addUser, updateUser } from "./services/userServices";
import GameNav from "./components/GameNav";
import Options from "./components/Options";
import Player from "./components/Player";
import Menu from "./components/Menu";
import AlchemyMenu from "./components/AlchemyMenu";
import PlayerCreature from "./components/PlayerCreature";
import EnemyCreature from "./components/EnemyCreature";
import creatures from "./constants/creatures";
import relics from "./constants/relics";
import { potionsList } from "./constants/items";
import { ingredientsList } from "./constants/items";
import { getItems } from "./services/itemServices";
import { enemyCreaturesHome } from "./constants/enemyCreatures";
import { useSelector, useDispatch } from "react-redux";
import { setPlayerCreatureValue } from "./store/actions/summon.actions";
import {
  setIngredientsValue,
  setPotionsValue,
} from "./store/actions/alchemy.actions";
import {
  setPlayerRelicsValue,
  setChosenRelicValue,
} from "./store/actions/relics.actions";
import { disableBattleStatus } from "./store/actions/battleStatus.actions";
import {
  enableCreatureStatsStatus,
  disableCreatureStatsStatus,
} from "./store/actions/creatureStatsStatus.actions";

// initialize Userfront
Userfront.init("rbvqd5nd");

// main app component
function App() {
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
    alchemyStatus: false,
  });
  // creature and combat state
  const [creatureData] = useState(creatures);
  const [enemyCreatureData] = useState(enemyCreaturesHome);
  const [enemyCreature, setEnemyCreature] = useState({});
  const [playerAttackStatus, setPlayerAttackStatus] = useState(false);
  const [enemyAttackStatus, setEnemyAttackStatus] = useState(false);
  const [playerCreatureHP, setPlayerCreatureHP] = useState(0);
  const [enemyCreatureHP, setEnemyCreatureHP] = useState(0);
  const [playerCreatureMP, setPlayerCreatureMP] = useState(0);
  const [combatAlert, setCombatAlert] = useState("");
  const [battleUndecided, setBattleUndecided] = useState(false);
  const [combatText, setCombatText] = useState("");
  const [critText, setCritText] = useState("combat_text");
  const [enemyCombatText, setEnemyCombatText] = useState("");
  const [enemyCritText, setEnemyCritText] = useState("combat_text");
  const [spawnAnimation, setSpawnAnimation] = useState("");
  // relics state
  const [relicsData] = useState(relics);

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
    // checks for userkey and generates new player if needed
    const genAsyncDataPlayer = async () => {
      try {
        // if there is no user key
        if (Userfront.user.data.userkey === undefined) {
          const newUser = {
            userfrontId: Userfront.user.userId,
            name: "New Player",
            avatarPath: "img/avatar/placeholder_avatar.png",
            experience: 0,
            drachmas: 0,
            relics: [1],
            chosenRelic: 1,
            creatureId: 0,
            displayCreatureStats: false,
            preferredSpecial: 1,
          };
          await addUser(newUser);
          alert(
            "Welcome to the game! You have been assigned a new account. Please log in again to continue."
          );
          await Userfront.logout();
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
    genAsyncDataPlayer();
    loadAsyncDataPlayer();
  }, []);

  useEffect(() => {
    // if there is a player
    if (player) {
      // if needed, generates random creature and updates player in database
      const genAsyncPlayerCreature = async () => {
        try {
          // retrieves user data and updates player state
          const loadAsyncDataPlayer = async () => {
            try {
              const { data } = await getUser();
              setPlayer(data);
            } catch (error) {
              console.log(error);
            }
          };
          // if there is no player creature data
          if (player.creatureId === 0) {
            const randomCreature =
              creatureData[Math.floor(Math.random() * creatureData.length)].id;
            Userfront.user.update({
              data: {
                userkey: Userfront.user.data.userkey,
              },
            });
            await updateUser(player._id, {
              userfrontId: Userfront.user.userId,
              creatureId: randomCreature,
            });
            await loadAsyncDataPlayer();
          }
        } catch (error) {
          console.log(error);
        }
      };
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
      genAsyncPlayerCreature();
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
  }, [player, relicsData, creatureData, combatAlert, dispatch]);

  // retrieves user data and updates player state
  const loadAsyncDataPlayer = async () => {
    try {
      const { data } = await getUser();
      setPlayer(data);
    } catch (error) {
      console.log(error);
    }
  };

  // loads alchemy data
  const loadDataAlchemy = async () => {
    try {
      const { data } = await getItems();
      const playerPotionsData = data.filter(
        (item) => item.type === "Potion" && item.userId === player.userfrontId
      );
      const playerPotions = potionsList.filter((potion) =>
        playerPotionsData.some((item) => item.itemId === potion.id)
      );

      for (let i = 0; i < playerPotions.length; i++) {
        playerPotions[i].itemQuantity = playerPotionsData.find(
          (item) => item.itemId === playerPotions[i].id
        ).itemQuantity;
      }
      dispatch(setPotionsValue(playerPotions));
      const playerIngredientsData = data.filter(
        (item) =>
          item.type === "Ingredient" && item.userId === player.userfrontId
      );
      const playerIngredients = ingredientsList.filter((ingredient) =>
        playerIngredientsData.some((item) => item.itemId === ingredient.id)
      );
      for (let i = 0; i < playerIngredients.length; i++) {
        playerIngredients[i].itemQuantity = playerIngredientsData.find(
          (item) => item.itemId === playerIngredients[i].id
        ).itemQuantity;
      }
      dispatch(setIngredientsValue(playerIngredients));
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

        <main className="game_section">
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

          {/* menus and creatures wrapped in options status check */}
          {!optionsStatus ? (
            <>
              <Menu
                Userfront={Userfront}
                player={player}
                gameMenuStatus={gameMenuStatus}
                setGameMenuStatus={setGameMenuStatus}
                enemyCreatureData={enemyCreatureData}
                combatAlert={combatAlert}
                loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
                setPlayerCreatureHP={setPlayerCreatureHP}
                setPlayerCreatureMP={setPlayerCreatureMP}
                playerCreature={playerCreature}
                setEnemyCreature={setEnemyCreature}
                setEnemyCreatureHP={setEnemyCreatureHP}
                setCombatAlert={setCombatAlert}
                setBattleUndecided={setBattleUndecided}
                setSpawnAnimation={setSpawnAnimation}
                loadDataAlchemy={loadDataAlchemy}
              />

              <AlchemyMenu
                Userfront={Userfront}
                gameMenuStatus={gameMenuStatus}
                setGameMenuStatus={setGameMenuStatus}
                loadDataAlchemy={() => loadDataAlchemy()}
                playerCreature={playerCreature}
                setPlayerCreatureHP={setPlayerCreatureHP}
                setPlayerCreatureMP={setPlayerCreatureMP}
              />

              <PlayerCreature
                enemyAttackStatus={enemyAttackStatus}
                setEnemyAttackStatus={setEnemyAttackStatus}
                setCombatText={setCombatText}
                enemyCombatText={enemyCombatText}
                setEnemyCombatText={setEnemyCombatText}
                critText={critText}
                setCritText={setCritText}
                enemyCritText={enemyCritText}
                setEnemyCritText={setEnemyCritText}
                playerAttackStatus={playerAttackStatus}
                setPlayerAttackStatus={setPlayerAttackStatus}
                player={player}
                playerCreatureHP={playerCreatureHP}
                setPlayerCreatureHP={setPlayerCreatureHP}
                playerCreatureMP={playerCreatureMP}
                setPlayerCreatureMP={setPlayerCreatureMP}
                enemyCreature={enemyCreature}
                setEnemyCreature={setEnemyCreatureHP}
                battleUndecided={battleUndecided}
                setBattleUndecided={setBattleUndecided}
                enemyCreatureHP={enemyCreatureHP}
                setEnemyCreatureHP={setEnemyCreatureHP}
                Userfront={Userfront}
                loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
                setCombatAlert={setCombatAlert}
                gameMenuStatus={gameMenuStatus}
              />

              <EnemyCreature
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

export default App;
