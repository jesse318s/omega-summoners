import React, { useState, useEffect } from "react";
import "../App.scss";
import "./Stage1.css";
import Userfront from "@userfront/core";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/userServices";
import GameNav from "../layouts/GameNav";
import Options from "../layouts/Options";
import GameMenu from "../layouts/GameMenu";
import AlchemyMenu from "../layouts/AlchemyMenu";
import PlayerCreature from "../components/PlayerCreature";
import EnemyCreature from "../components/EnemyCreature";
import creatures from "../constants/creatures";
import relics from "../constants/relics";
import { potionsList } from "../constants/items";
import { ingredientsList } from "../constants/items";
import { getItems } from "../services/itemServices";
import { enemyCreaturesStage1 } from "../constants/enemyCreatures";
import { useSelector, useDispatch } from "react-redux";
import { setPlayerCreatureValue } from "../store/actions/summon.actions";
import {
  setIngredientsValue,
  setPotionsValue,
} from "../store/actions/alchemy.actions";
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
function Stage1() {
  // dispatch hook for redux
  const dispatch = useDispatch();

  // player creature state from redux store
  const playerCreature = useSelector((state) => state.summon.playerCreature);
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
    alchemyStatus: false,
  });
  // creature and combat state
  const [creatureData] = useState(creatures);
  const [enemyCreatureData] = useState(enemyCreaturesStage1);
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
  const [enemyCreatureHP, setEnemyCreatureHP] = useState(0);
  const [playerCreatureMP, setPlayerCreatureMP] = useState(0);
  const [combatAlert, setCombatAlert] = useState("");
  const [spawnAnimation, setSpawnAnimation] = useState("");
  // relics state
  const [relicsData] = useState(relics);

  useEffect(() => {
    checkAuth(Userfront, navigate);
    checkLevelPlayer(player, 5, navigate);
  });

  useEffect(() => {
    // retrieves user data and updates player state
    const loadAsyncDataPlayer = async () => {
      try {
        const { data } = await getUser();
        setPlayer(data);
      } catch (error) {
        console.log(error);
      }
    };
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
          setCombatAlert("");
          const enemyCreature = [
            enemyCreatureData[
              Math.floor(Math.random() * enemyCreatureData.length)
            ],
          ];
          setEnemyCreature(enemyCreature[0]);
          setEnemyCreatureHP(enemyCreature[0].hp);
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
  }, [enemyCreatureData, combatAlert, battleStatus]);

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
  const loadAsyncDataAlchemy = async () => {
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
            optionsStatus={optionsStatus}
            setOptionsStatus={setOptionsStatus}
            setNameOptionStatus={setNameOptionStatus}
            setAvatarOptionStatus={setAvatarOptionStatus}
          />
        </header>

        <main className="stage1_game_section">
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

          {/* menus and creatures wrapped in options status check */}
          {!optionsStatus ? (
            <>
              <GameMenu
                player={player}
                gameMenuStatus={gameMenuStatus}
                setGameMenuStatus={setGameMenuStatus}
                loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
                setPlayerCreatureHP={setPlayerCreatureHP}
                setPlayerCreatureMP={setPlayerCreatureMP}
              />

              <AlchemyMenu
                gameMenuStatus={gameMenuStatus}
                setGameMenuStatus={setGameMenuStatus}
                loadAsyncDataAlchemy={() => loadAsyncDataAlchemy()}
                playerCreature={playerCreature}
                setPlayerCreatureHP={setPlayerCreatureHP}
                setPlayerCreatureMP={setPlayerCreatureMP}
              />

              {/* displays the combat alert if there is combat */}
              {battleStatus ? (
                <div>
                  <p className="combat_alert">{combatAlert}</p>
                </div>
              ) : null}

              <PlayerCreature
                combatTextAndStatus={combatTextAndStatus}
                setCombatTextAndStatus={setCombatTextAndStatus}
                player={player}
                playerCreatureHP={playerCreatureHP}
                setPlayerCreatureHP={setPlayerCreatureHP}
                playerCreatureMP={playerCreatureMP}
                setPlayerCreatureMP={setPlayerCreatureMP}
                enemyCreature={enemyCreature}
                setEnemyCreature={setEnemyCreature}
                enemyCreatureHP={enemyCreatureHP}
                setEnemyCreatureHP={setEnemyCreatureHP}
                loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
                setCombatAlert={setCombatAlert}
                gameMenuStatus={gameMenuStatus}
              />

              <EnemyCreature
                enemyCreature={enemyCreature}
                combatTextAndStatus={combatTextAndStatus}
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
