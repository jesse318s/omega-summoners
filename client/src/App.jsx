import React, { useEffect, useRef, useState } from "react";
import "./App.scss";
import Userfront from "@userfront/core";
import { useNavigate } from "react-router-dom";
import { getUser, addUser, updateUser } from "./services/userServices";
import GameNav from "./layouts/GameNav";
import OptionsMenu from "./layouts/OptionsMenu";
import GameMenu from "./layouts/GameMenu";
import AlchemyMenu from "./layouts/AlchemyMenu";
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
import { setEnemyCreatureValue } from "./store/actions/enemy.actions";
import {
  setIngredientsValue,
  setPotionsValue,
} from "./store/actions/alchemy.actions";
import {
  setPlayerRelicsValue,
  setChosenRelicValue,
} from "./store/actions/relics.actions";
import {
  enableCreatureStatsStatus,
  disableCreatureStatsStatus,
} from "./store/actions/creatureStatsStatus.actions";
import checkAuth from "./utils/checkAuth.js";

// initialize Userfront
Userfront.init("rbvqd5nd");

// main app component
function App() {
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
  // reference hook for tracking generated user data
  const ref = useRef(false);

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
    alchemyStatus: false,
  });
  // creature and combat state
  const [creatureData] = useState(creatures);
  const [enemyCreatureData] = useState(enemyCreaturesHome);
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
  const [enemyCreatureHP, setEnemyCreatureHP] = useState(0);
  const [spawnAnimation, setSpawnAnimation] = useState("");
  // relics state
  const [relicsData] = useState(relics);

  useEffect(() => {
    checkAuth(Userfront, navigate);
  });

  useEffect(() => {
    // checks for userkey and generates new player if needed
    const genAsyncDataPlayer = async () => {
      try {
        if (
          Userfront.user.data.userkey === undefined &&
          ref.current === false
        ) {
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
          ref.current = true;
          await addUser(newUser);
          alert(
            "Welcome to the game! You have been assigned a new account. Please log in again to continue."
          );
          await Userfront.logout();
        } else {
          const { data } = await getUser();
          setPlayer(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    genAsyncDataPlayer();
  }, []);

  useEffect(() => {
    // if there is a player
    if (player) {
      // if needed, generates random creature from first 4 and updates player in database
      const genAsyncPlayerCreature = async () => {
        try {
          if (player.creatureId === 0) {
            const randomCreature =
              creatureData[Math.floor(Math.random() * 4)].id;
            Userfront.user.update({
              data: {
                userkey: Userfront.user.data.userkey,
              },
            });
            await updateUser(player._id, {
              userfrontId: Userfront.user.userId,
              creatureId: randomCreature,
            });
            const { data } = await getUser();
            setPlayer(data);
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
    // loads alchemy data
    const loadAsyncDataAlchemy = async () => {
      try {
        const { data } = await getItems();
        const playerPotionsData = data.filter(
          (item) =>
            item.type === "Potion" && item.userId === Userfront.user.userId
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
            item.type === "Ingredient" && item.userId === Userfront.user.userId
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
    loadAsyncDataAlchemy();
  }, [gameMenuStatus.alchemyStatus, dispatch]);

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
          const enemyCreatureNew = [
            enemyCreatureData[
              Math.floor(Math.random() * enemyCreatureData.length)
            ],
          ];
          if (enemyCreatureNew !== enemyCreature) {
            dispatch(setEnemyCreatureValue(enemyCreatureNew[0]));
            setEnemyCreatureHP(enemyCreatureNew[0].hp);
          } else {
            setEnemyCreatureHP(enemyCreature[0].hp);
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
    enemyCreatureData,
    combatTextAndCombatStatus.combatAlert,
    battleStatus,
    dispatch,
  ]);

  // renders player details panel
  const getPlayer = () => {
    return (
      <>
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
            {player.experience.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
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
      </>
    );
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

        <main className="game_section">
          {getPlayer()}

          {/* displays other menus and creatures if options menu isnt being used */}
          {Object.values(optionsMenuStatus).every(
            (value) => value === false
          ) ? (
            <>
              <GameMenu
                player={player}
                gameMenuStatus={gameMenuStatus}
                setGameMenuStatus={setGameMenuStatus}
                loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
                setPlayerCreatureResources={setPlayerCreatureResources}
              />

              {/* displays alchemy menu if alchemy button is clicked */}
              {gameMenuStatus.alchemyStatus ? (
                <AlchemyMenu
                  player={player}
                  gameMenuStatus={gameMenuStatus}
                  setGameMenuStatus={setGameMenuStatus}
                  playerCreature={playerCreature}
                  setPlayerCreatureResources={setPlayerCreatureResources}
                />
              ) : null}

              {/* displays the combat alert if there is combat */}
              {battleStatus ? (
                <div>
                  <p className="combat_alert">
                    {combatTextAndCombatStatus.combatAlert}
                  </p>
                </div>
              ) : null}

              {/* displays player creature if game menu isn't being used */}
              {Object.values(gameMenuStatus).every(
                (value) => value === false
              ) ? (
                <PlayerCreature
                  combatTextAndCombatStatus={combatTextAndCombatStatus}
                  setCombatTextAndCombatStatus={setCombatTextAndCombatStatus}
                  player={player}
                  playerCreatureResources={playerCreatureResources}
                  setPlayerCreatureResources={setPlayerCreatureResources}
                  enemyCreatureHP={enemyCreatureHP}
                  setEnemyCreatureHP={setEnemyCreatureHP}
                  loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
                />
              ) : null}

              <EnemyCreature
                combatTextAndCombatStatus={combatTextAndCombatStatus}
                enemyCreatureHP={enemyCreatureHP}
                spawnAnimation={spawnAnimation}
              />
            </>
          ) : null}
        </main>
      </>
    );
  } else return null;
}

export default App;
