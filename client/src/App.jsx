import React, { useEffect, useState } from "react";
import "./App.scss";
import Userfront from "@userfront/core";
import { useNavigate } from "react-router-dom";
import { getUser, addUser, updateUser } from "./services/userServices";
import GameNav from "./components/GameNav";
import Options from "./components/Options";
import Player from "./components/Player";
import Menu from "./components/Menu";
import PlayerCreature from "./components/PlayerCreature";
import EnemyCreature from "./components/EnemyCreature";
import creatures from "./constants/creatures";
import relics from "./constants/relics";
import { potionsList } from "./constants/items";
import { ingredientsList } from "./constants/items";
import recipeList from "./constants/recipes";
import { getItems, addItem } from "./services/itemServices";
import { getPotionTimer, addPotionTimer } from "./services/potionTimerServices";
import { enemyCreaturesHome } from "./constants/enemyCreatures";
import { useSelector, useDispatch } from "react-redux";
import { setPlayerCreatureValue } from "./store/actions/summon.actions";
import {
  enablePotionCooldown,
  disablePotionCooldown,
  setSummonHPBonusAmount,
  setSummonMPBonusAmount,
  setIngredientsValue,
  setPotionsValue,
} from "./store/actions/alchemy.actions";
import {
  setPlayerRelicsValue,
  setChosenRelicValue,
} from "./store/actions/relics.actions";
import { disableBattleStatus } from "./store/actions/battleStatus.actions";

// initialize Userfront
Userfront.init("rbvqd5nd");

// main app component
function App() {
  // dispatch hook for redux
  const dispatch = useDispatch();

  // player creature state from redux store
  const playerCreature = useSelector((state) => state.summon.playerCreature);
  // relics state from redux store
  const chosenRelic = useSelector((state) => state.relics.chosenRelic);
  // alchemy state from redux store
  const summonHPBonus = useSelector((state) => state.alchemy.summonHPBonus);
  const summonMPBonus = useSelector((state) => state.alchemy.summonMPBonus);
  const potionCooldown = useSelector((state) => state.alchemy.potionCooldown);

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
  const [creatureStatsStatus, setCreatureStatsStatus] = useState(false);
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
          setCreatureStatsStatus(player.displayCreatureStats);
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

  // creates a new potion
  const createPotion = async (potionId) => {
    try {
      if (!potionCooldown) {
        dispatch(enablePotionCooldown());
        const { data } = await getItems();
        const playerPotionData = data.filter(
          (item) => item.type === "Potion" && item.itemId === potionId
        );
        const potion = potionsList.find((item) => item.id === potionId);
        const newPotionData = {
          itemId: potion.id,
          type: "Potion",
          itemQuantity: playerPotionData[0]
            ? playerPotionData[0].itemQuantity + 1
            : 1,
          userId: Userfront.user.userId,
        };
        const playerIngredientData = data.filter(
          (item) => item.type === "Ingredient"
        );
        const currentRecipe = recipeList.filter(
          (item) => item.potionProductId === potion.id
        )[0];
        // check if player has enough ingredients for recipe
        const ingredient1Check = playerIngredientData.find(
          (item) => item.itemId === currentRecipe.ingredient1
        );
        const ingredient2Check = playerIngredientData.find(
          (item) => item.itemId === currentRecipe.ingredient2
        );
        if (
          ingredient1Check &&
          ingredient1Check.itemQuantity > 0 &&
          ingredient2Check &&
          ingredient2Check.itemQuantity > 0
        ) {
          // confirm potion creation
          if (window.confirm(`Are you sure you want to create this potion?`)) {
            const currentIngredient1 = playerIngredientData.find(
              (ingredient) => ingredient.itemId === currentRecipe.ingredient1
            );
            const currentIngredient2 = playerIngredientData.find(
              (ingredient) => ingredient.itemId === currentRecipe.ingredient2
            );
            // delete the ingredients from the player's inventory
            currentIngredient1.itemQuantity -= 1;
            currentIngredient2.itemQuantity -= 1;
            await Userfront.user.update({
              data: {
                userkey: Userfront.user.data.userkey,
              },
            });
            await addItem(currentIngredient1);
            await loadDataAlchemy();
            await Userfront.user.update({
              data: {
                userkey: Userfront.user.data.userkey,
              },
            });
            await addItem(currentIngredient2);
            await loadDataAlchemy();
            // add the potion to the player's inventory
            await Userfront.user.update({
              data: {
                userkey: Userfront.user.data.userkey,
              },
            });
            await addItem(newPotionData);
            await loadDataAlchemy();
            setTimeout(() => {
              dispatch(disablePotionCooldown());
            }, 1000);
          } else {
            setTimeout(() => {
              dispatch(disablePotionCooldown());
            }, 1000);
          }
        } else {
          alert("You don't have enough ingredients for this potion.");
          setTimeout(() => {
            dispatch(disablePotionCooldown());
          }, 1000);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // uses clicked potion
  const consumePotion = async (potionId) => {
    try {
      if (!potionCooldown) {
        await getPotionTimer();
        const timerData = await getPotionTimer();
        dispatch(enablePotionCooldown());
        const { data } = await getItems();
        const playerPotionData = data.filter(
          (item) => item.type === "Potion" && item.itemId === potionId
        );
        const potion = potionsList.find((item) => item.id === potionId);
        const currentPotionData = playerPotionData.filter(
          (item) => item.itemId === potionId
        );
        // prevent over use
        if (timerData.data.length !== 0) {
          alert(
            "You already have an active potion. Please wait for it to expire."
          );
          setTimeout(() => {
            dispatch(disablePotionCooldown());
          }, 1000);
          return;
        }
        // check if player has enough potions
        if (currentPotionData[0].itemQuantity > 0) {
          // confirm potion use
          if (
            window.confirm(`Are you sure you want to use this potion?`) === true
          ) {
            // use potion
            currentPotionData[0].itemQuantity -= 1;
            await Userfront.user.update({
              data: {
                userkey: Userfront.user.data.userkey,
              },
            });
            await addItem(currentPotionData[0]);
            await loadDataAlchemy();
            await Userfront.user.update({
              data: {
                userkey: Userfront.user.data.userkey,
              },
            });
            await addPotionTimer({
              userId: Userfront.user.userId,
              potionId: potion.id,
              potionDuration: potion.duration,
            });
            await loadDataAlchemy();
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

            setPlayerCreatureMP(
              playerCreature.mp + chosenRelic.mpMod + summonMPBonus
            );
            setPlayerCreatureHP(
              playerCreature.hp + chosenRelic.hpMod + summonHPBonus
            );
            setTimeout(() => {
              dispatch(disablePotionCooldown());
            }, 1000);
          } else {
            setTimeout(() => {
              dispatch(disablePotionCooldown());
            }, 1000);
          }
        } else {
          alert("You don't have enough potions.");
          setTimeout(() => {
            dispatch(disablePotionCooldown());
          }, 1000);
        }
      }
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
            creatureStatsStatus={creatureStatsStatus}
            loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
          />

          <Player player={player} />

          {/* menu and creatures wrapped in options status check */}
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
                createPotion={createPotion}
                consumePotion={consumePotion}
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
                creatureStatsStatus={creatureStatsStatus}
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
