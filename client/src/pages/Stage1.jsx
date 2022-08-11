import React, { useState, useEffect } from "react";
import "../App.scss";
import "./Stage1.css";
import Userfront from "@userfront/core";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/userServices";
import GameNav from "../components/GameNav";
import Options from "../components/Options";
import Player from "../components/Player";
import Menu from "../components/Menu";
import PlayerCreature from "../components/PlayerCreature";
import EnemyCreature from "../components/EnemyCreature";
import creatures from "../constants/creatures";
import relics from "../constants/relics";
import { potionsList } from "../constants/items";
import { ingredientsList } from "../constants/items";
import recipeList from "../constants/recipes";
import { getItems, addItem } from "../services/itemServices";
import {
  getPotionTimer,
  addPotionTimer,
} from "../services/potionTimerServices";
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
  const [chosenRelic, setChosenRelic] = useState(undefined);
  // alchemy state
  const [potions, setPotions] = useState([{}]);
  const [ingredients, setIngredients] = useState([{}]);
  const [playerItems, setPlayerItems] = useState([{}]);
  const [summonHPBonus, setSummonHPBonus] = useState(0);
  const [summonMPBonus, setSummonMPBonus] = useState(0);
  const [potionCooldown, setPotionCooldown] = useState(false);

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

  // loads alchemy data
  const loadDataAlchemy = async () => {
    try {
      setPotions([]);
      setIngredients([]);
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
      setPotions(playerPotions);
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
      setIngredients(playerIngredients);
    } catch (error) {
      console.log(error);
    }
  };

  // creates a new potion
  const createPotion = async (potionId) => {
    try {
      if (!potionCooldown) {
        setPotionCooldown(true);
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
              setPotionCooldown(false);
            }, 1000);
          } else {
            setTimeout(() => {
              setPotionCooldown(false);
            }, 1000);
          }
        } else {
          alert("You don't have enough ingredients for this potion.");
          setTimeout(() => {
            setPotionCooldown(false);
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
        setPotionCooldown(true);
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
            setPotionCooldown(false);
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
              setSummonMPBonus(playerMPBonus);
              setSummonHPBonus(playerHPBonus);
            }

            setPlayerCreatureMP(
              playerCreature.mp + chosenRelic.mpMod + summonMPBonus
            );
            setPlayerCreatureHP(
              playerCreature.hp + chosenRelic.hpMod + summonHPBonus
            );
            setTimeout(() => {
              setPotionCooldown(false);
            }, 1000);
          } else {
            setTimeout(() => {
              setPotionCooldown(false);
            }, 1000);
          }
        } else {
          alert("You don't have enough potions.");
          setTimeout(() => {
            setPotionCooldown(false);
          }, 1000);
        }
      }
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
                loadDataAlchemy={loadDataAlchemy}
                createPotion={createPotion}
                consumePotion={consumePotion}
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
