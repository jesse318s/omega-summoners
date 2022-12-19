import { useRef, useState } from "react";
import Userfront from "@userfront/core";
import { updateUser } from "../services/userServices";
import { getItems, addItem } from "../services/itemServices";
import { useSelector, useDispatch } from "react-redux";
import { disableBattleStatus } from "../store/actions/battleStatus.actions";
import checkPotionTimer from "../utils/checkPotionTimer";

Userfront.init("rbvqd5nd");

function PlayerCreature({
  combatTextAndStatus,
  setCombatTextAndStatus,
  player,
  playerCreatureHP,
  setPlayerCreatureHP,
  playerCreatureMP,
  setPlayerCreatureMP,
  enemyCreatureHP,
  setEnemyCreatureHP,
  loadAsyncDataPlayer,
  setCombatAlert,
}) {
  // dispatch hook for redux
  const dispatch = useDispatch();

  // player creature state from redux store
  const playerCreature = useSelector((state) => state.summon.playerCreature);
  // enemy creature state from redux store
  const enemyCreature = useSelector((state) => state.enemy.enemyCreature);
  // display creature stats status state from redux store
  const creatureStatsStatus = useSelector(
    (state) => state.creatureStatsStatus.creatureStatsStatus
  );
  // battle status combat state from redux store
  const battleStatus = useSelector((state) => state.battleStatus.battleStatus);
  // relics state from redux store
  const chosenRelic = useSelector((state) => state.relics.chosenRelic);
  // alchemy state from redux store
  const summonHPBonus = useSelector((state) => state.alchemy.summonHPBonus);
  const summonMPBonus = useSelector((state) => state.alchemy.summonMPBonus);

  // reference hook for player creature hp
  const ref = useRef(null);
  // counter reference hook for recursive player creature ability called within enemy counter attack
  const counterRef = useRef(0);

  // fighting battle state
  const [isFighting, setIsFighting] = useState(false);
  // player creature special status state
  const [specialStatus, setSpecialStatus] = useState(false);

  // toggles special choice
  const toggleSpecial = async () => {
    try {
      let newSpecial = 1;
      if (player.preferredSpecial === 1) {
        newSpecial = 2;
      }
      await Userfront.user.update({
        data: {
          userkey: Userfront.user.data.userkey,
        },
      });
      await updateUser(player._id, {
        userfrontId: Userfront.user.userId,
        preferredSpecial: newSpecial,
      });
      await loadAsyncDataPlayer();
    } catch (error) {
      console.log(error);
    }
  };

  // player attack animation
  const displayPlayerAttackAnimation = async () => {
    try {
      if (battleStatus) {
        setCombatTextAndStatus((combatTextAndStatus) => {
          return {
            ...combatTextAndStatus,
            playerAttackStatus: true,
          };
        });
        setTimeout(() => {
          setCombatTextAndStatus((combatTextAndStatus) => {
            return {
              ...combatTextAndStatus,
              playerAttackStatus: false,
            };
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // player attack Combat Text animation
  const displayPlayerAttackCT = async (
    playerCreatureAttack,
    criticalMultiplier,
    enemyDefense
  ) => {
    try {
      if (battleStatus) {
        if (criticalMultiplier > 1) {
          setCombatTextAndStatus((combatTextAndStatus) => {
            return {
              ...combatTextAndStatus,
              critText: "crit_text",
            };
          });
        }
        setCombatTextAndStatus((combatTextAndStatus) => {
          return {
            ...combatTextAndStatus,
            combatText:
              (playerCreatureAttack - playerCreatureAttack * enemyDefense) *
              criticalMultiplier,
          };
        });
        setTimeout(() => {
          setCombatTextAndStatus((combatTextAndStatus) => {
            return {
              ...combatTextAndStatus,
              combatText: "",
            };
          });
          setCombatTextAndStatus((combatTextAndStatus) => {
            return {
              ...combatTextAndStatus,
              critText: "combat_text",
            };
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // special animation
  const displayPlayerSpecialAnimation = async () => {
    try {
      if (battleStatus) {
        setSpecialStatus(true);
        setTimeout(() => {
          setSpecialStatus(false);
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // player special Combat Text animation
  const displayPlayerSpecialCT = async (
    playerCreatureSpecial,
    criticalMultiplier,
    enemyDefense
  ) => {
    try {
      if (battleStatus) {
        if (criticalMultiplier > 1) {
          setCombatTextAndStatus((combatTextAndStatus) => {
            return {
              ...combatTextAndStatus,
              critText: "crit_text",
            };
          });
        }
        setCombatTextAndStatus((combatTextAndStatus) => {
          return {
            ...combatTextAndStatus,
            combatText:
              (playerCreatureSpecial - playerCreatureSpecial * enemyDefense) *
              criticalMultiplier,
          };
        });
        setTimeout(() => {
          setCombatTextAndStatus((combatTextAndStatus) => {
            return {
              ...combatTextAndStatus,
              combatText: "",
            };
          });
          setCombatTextAndStatus((combatTextAndStatus) => {
            return {
              ...combatTextAndStatus,
              critText: "combat_text",
            };
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // player healing Combat Text animation
  const displayPlayerHealCT = async (
    playerCreatureSpecial,
    criticalMultiplier
  ) => {
    try {
      if (battleStatus) {
        setCombatTextAndStatus((combatTextAndStatus) => {
          return {
            ...combatTextAndStatus,
            enemyCritText: "heal_combat_text",
          };
        });
        if (criticalMultiplier > 1) {
          setCombatTextAndStatus((combatTextAndStatus) => {
            return {
              ...combatTextAndStatus,
              enemyCritText: "heal_crit_text",
            };
          });
        }
        setCombatTextAndStatus((combatTextAndStatus) => {
          return {
            ...combatTextAndStatus,
            enemyCombatText: playerCreatureSpecial * criticalMultiplier,
          };
        });
        setTimeout(() => {
          setCombatTextAndStatus((combatTextAndStatus) => {
            return {
              ...combatTextAndStatus,
              enemyCombatText: "",
            };
          });
          setCombatTextAndStatus((combatTextAndStatus) => {
            return {
              ...combatTextAndStatus,
              enemyCritText: "combat_text",
            };
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // enemy attack animation
  const viewEnemyAttackAnimation = async () => {
    try {
      if (battleStatus) {
        setCombatTextAndStatus((combatTextAndStatus) => {
          return {
            ...combatTextAndStatus,
            enemyAttackStatus: true,
          };
        });
        setTimeout(() => {
          setCombatTextAndStatus((combatTextAndStatus) => {
            return {
              ...combatTextAndStatus,
              enemyAttackStatus: false,
            };
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // enemy attack Combat Text animation
  const viewEnemyAttackCT = async (
    criticalMultiplier,
    playerCreatureDefense
  ) => {
    try {
      if (battleStatus) {
        if (criticalMultiplier > 1) {
          setCombatTextAndStatus((combatTextAndStatus) => {
            return {
              ...combatTextAndStatus,
              enemyCritText: "crit_text",
            };
          });
        }
        setCombatTextAndStatus((combatTextAndStatus) => {
          return {
            ...combatTextAndStatus,
            enemyCombatText:
              (enemyCreature.attack -
                enemyCreature.attack * playerCreatureDefense) *
              criticalMultiplier,
          };
        });
        setTimeout(() => {
          setCombatTextAndStatus((combatTextAndStatus) => {
            return {
              ...combatTextAndStatus,
              enemyCombatText: "",
            };
          });
          setCombatTextAndStatus((combatTextAndStatus) => {
            return {
              ...combatTextAndStatus,
              enemyCritText: "combat_text",
            };
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // regens player creature mp
  const regenMP = async () => {
    if (
      playerCreatureMP !==
        playerCreature.mp + chosenRelic.mpMod + summonMPBonus &&
      playerCreatureMP + playerCreature.mpRegen + chosenRelic.mpRegenMod <=
        playerCreature.mp + chosenRelic.mpMod + summonMPBonus
    ) {
      setPlayerCreatureMP(
        playerCreatureMP + playerCreature.mpRegen + chosenRelic.mpRegenMod
      );
    }
    if (
      playerCreatureMP + playerCreature.mpRegen + chosenRelic.mpRegenMod >
      playerCreature.mp + chosenRelic.mpMod + summonMPBonus
    ) {
      setPlayerCreatureMP(
        playerCreature.mp + chosenRelic.mpMod + summonMPBonus
      );
    }
  };

  // initiates chance of enemy counter attack
  const receiveEnemyCounterAttack = async (
    chancePlayer,
    moveName,
    moveType
  ) => {
    try {
      const playerCreatureSpeed = playerCreature.speed + chosenRelic.speedMod;
      let playerCreatureDefense =
        (playerCreature.defense + chosenRelic.defenseMod) / 100;
      let enemyCreatureCritical = enemyCreature.critical / 100;
      let criticalMultiplier = 1;
      let chanceEnemy = false;

      if (enemyCreature.attackType === "Magic") {
        playerCreatureDefense = 0;
      }
      // checks enemy creature speed vs player creature speed and sets chance
      if (enemyCreature.speed < playerCreatureSpeed) {
        chanceEnemy = Math.random() >= 0.5;
      } else {
        chanceEnemy = Math.random() >= 0.8;
      }
      if (counterRef.current > 1 && !chanceEnemy && !chancePlayer) {
        counterRef.current = 0;
        chanceEnemy = true;
      }
      // series of checks for enemy counter attack based on chance/speed, and for player creature mp regen
      if (!chanceEnemy && chancePlayer) {
        counterRef.current = 0;
        setTimeout(() => {
          setCombatAlert("Enemy was too slow!");
        }, 500);
      }
      if (!chanceEnemy && !chancePlayer) {
        setIsFighting(false);
        counterRef.current = counterRef.current + 1;
        attackEnemyOrHeal(moveName, moveType);
        return;
      }
      if (moveName === playerCreature.attackName) {
        regenMP();
      }
      if (chanceEnemy && chancePlayer) {
        counterRef.current = 0;
        setTimeout(() => {
          setCombatAlert("Both abilities succeeded.");
        }, 600);
      }
      // checks for player chance/speed failure
      if (chanceEnemy && !chancePlayer) {
        counterRef.current = 0;
        setTimeout(() => {
          setCombatAlert("Your summon was too slow!");
        }, 600);
      }
      if (battleStatus && chanceEnemy) {
        // checks for enemy critical hit
        if (Math.random() <= enemyCreatureCritical) {
          criticalMultiplier = 1.5;
        }
        if (enemyCreature.attackType === "Poison" && criticalMultiplier === 1) {
          criticalMultiplier = 1.5;
        }
        setTimeout(() => {
          viewEnemyAttackAnimation();
          viewEnemyAttackCT(criticalMultiplier, playerCreatureDefense);
        }, 600);
        // checks for player death, and damages player otherwise
        if (
          ref.current -
            (enemyCreature.attack -
              enemyCreature.attack * playerCreatureDefense) *
              criticalMultiplier <=
          0
        ) {
          setCombatTextAndStatus((combatTextAndStatus) => {
            return {
              ...combatTextAndStatus,
              battleUndecided: false,
            };
          });
          setPlayerCreatureHP(0);
          setCombatAlert("Defeat!");
          setTimeout(() => {
            setIsFighting(false);
            dispatch(disableBattleStatus());
          }, 1100);
        } else {
          setPlayerCreatureHP(
            ref.current -
              (enemyCreature.attack -
                enemyCreature.attack * playerCreatureDefense) *
                criticalMultiplier
          );
          setIsFighting(false);
        }
      } else {
        setIsFighting(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // damages enemy
  const damageEnemy = async (
    chancePlayer,
    playerCreatureAttack,
    criticalMultiplier,
    enemyDefense,
    moveName,
    moveType
  ) => {
    if (chancePlayer) {
      displayPlayerAttackAnimation();
      displayPlayerAttackCT(
        playerCreatureAttack,
        criticalMultiplier,
        enemyDefense
      );
      setEnemyCreatureHP(
        enemyCreatureHP -
          (playerCreatureAttack - playerCreatureAttack * enemyDefense) *
            criticalMultiplier
      );
    }
    ref.current = playerCreatureHP;
    receiveEnemyCounterAttack(chancePlayer, moveName, moveType);
  };

  // chance to drop ingredients for player
  const dropIngredientsOnChance = async () => {
    // retrieves items
    const playerItemsData = await getItems();
    const playerItems = playerItemsData.data;
    // filter for ingredients
    const greenMushroomsPlayer = playerItems.filter(
      (item) => item.itemId === 1 && item.type === "Ingredient"
    );
    const redMushroomsPlayer = playerItems.filter(
      (item) => item.itemId === 2 && item.type === "Ingredient"
    );
    const blueMushroomsPlayer = playerItems.filter(
      (item) => item.itemId === 3 && item.type === "Ingredient"
    );
    // drops ingredients on chance
    const newGreenMushrooms = greenMushroomsPlayer[0];
    const newRedMushrooms = redMushroomsPlayer[0];
    const newBlueMushrooms = blueMushroomsPlayer[0];

    if (Math.random() <= 0.15) {
      await Userfront.user.update({
        data: {
          userkey: Userfront.user.data.userkey,
        },
      });
      await addItem({
        itemId: 1,
        type: "Ingredient",
        itemQuantity:
          newGreenMushrooms === undefined
            ? 1
            : newGreenMushrooms.itemQuantity + 1,
        userId: Userfront.user.userId,
      });
    } else if (Math.random() <= 0.1) {
      if (Math.random() <= 0.5) {
        await Userfront.user.update({
          data: {
            userkey: Userfront.user.data.userkey,
          },
        });
        await addItem({
          itemId: 2,
          type: "Ingredient",
          itemQuantity:
            newRedMushrooms === undefined
              ? 1
              : newRedMushrooms.itemQuantity + 1,
          userId: Userfront.user.userId,
        });
      } else {
        await Userfront.user.update({
          data: {
            userkey: Userfront.user.data.userkey,
          },
        });
        await addItem({
          itemId: 3,
          type: "Ingredient",
          itemQuantity:
            newBlueMushrooms === undefined
              ? 1
              : newBlueMushrooms.itemQuantity + 1,
          userId: Userfront.user.userId,
        });
      }
    }
  };

  // kills enemy
  const killEnemy = async (
    playerCreatureAttack,
    criticalMultiplier,
    enemyDefense
  ) => {
    counterRef.current = 0;
    setCombatTextAndStatus((combatTextAndStatus) => {
      return {
        ...combatTextAndStatus,
        battleUndecided: false,
      };
    });
    displayPlayerAttackAnimation();
    displayPlayerAttackCT(
      playerCreatureAttack,
      criticalMultiplier,
      enemyDefense
    );
    setEnemyCreatureHP(0);
    setCombatAlert("Victory!");
    await Userfront.user.update({
      data: {
        userkey: Userfront.user.data.userkey,
      },
    });
    await updateUser(player._id, {
      userfrontId: Userfront.user.userId,
      experience: player.experience + enemyCreature.reward * 2,
      drachmas: player.drachmas + enemyCreature.reward,
    });
    dropIngredientsOnChance();
    setTimeout(() => {
      setIsFighting(false);
      dispatch(disableBattleStatus());
      loadAsyncDataPlayer();
    }, 1000);
  };

  // completes player lifesteal check and heal
  const completeLifesteal = async (
    playerCreatureSpecial,
    criticalMultiplier,
    chancePlayer,
    moveName,
    moveType
  ) => {
    if (moveType === "Lifesteal" && chancePlayer) {
      if (
        playerCreatureHP + playerCreatureSpecial * criticalMultiplier * 0.2 >
        playerCreature.hp + chosenRelic.hpMod + summonHPBonus
      ) {
        setPlayerCreatureHP(
          playerCreature.hp + chosenRelic.hpMod + summonHPBonus
        );
        ref.current = playerCreature.hp + chosenRelic.hpMod + summonHPBonus;
      } else {
        setPlayerCreatureHP(
          playerCreatureHP + playerCreatureSpecial * criticalMultiplier * 0.2
        );
        ref.current =
          playerCreatureHP + playerCreatureSpecial * criticalMultiplier * 0.2;
      }
    }
    receiveEnemyCounterAttack(chancePlayer, moveName, moveType);
  };

  // heals player creature
  const healPlayerCreature = async (
    chancePlayer,
    playerCreatureSpecial,
    criticalMultiplier,
    moveName,
    moveType
  ) => {
    if (chancePlayer) {
      displayPlayerHealCT(playerCreatureSpecial, criticalMultiplier);
      displayPlayerSpecialAnimation();
      if (
        playerCreatureHP + playerCreatureSpecial * criticalMultiplier >
        playerCreature.hp + chosenRelic.hpMod + summonHPBonus
      ) {
        setPlayerCreatureHP(
          playerCreature.hp + chosenRelic.hpMod + summonHPBonus
        );
        ref.current = playerCreature.hp + chosenRelic.hpMod + summonHPBonus;
      } else {
        setPlayerCreatureHP(
          playerCreatureHP + playerCreatureSpecial * criticalMultiplier
        );
        ref.current =
          playerCreatureHP + playerCreatureSpecial * criticalMultiplier;
      }
      receiveEnemyCounterAttack(chancePlayer, moveName, moveType);
    } else {
      ref.current = playerCreatureHP;
      receiveEnemyCounterAttack(chancePlayer, moveName, moveType);
    }
  };

  // performs creature special
  const performSpecial = async (
    chancePlayer,
    playerCreatureSpecial,
    playerCreatureSpecialCost,
    criticalMultiplier,
    enemyDefense,
    moveName,
    moveType
  ) => {
    setPlayerCreatureMP(playerCreatureMP - playerCreatureSpecialCost);
    if (
      moveType === "Poison" ||
      moveType === "Magic" ||
      moveType === "Lifesteal"
    ) {
      // checks for enemy death
      if (
        enemyCreatureHP -
          (playerCreatureSpecial - playerCreatureSpecial * enemyDefense) *
            criticalMultiplier <=
          0 &&
        chancePlayer
      ) {
        counterRef.current = 0;
        setCombatTextAndStatus((combatTextAndStatus) => {
          return {
            ...combatTextAndStatus,
            battleUndecided: false,
          };
        });
        displayPlayerAttackAnimation();
        displayPlayerSpecialAnimation();
        displayPlayerSpecialCT(
          playerCreatureSpecial,
          criticalMultiplier,
          enemyDefense
        );
        setEnemyCreatureHP(0);
        setCombatAlert("Victory!");
        await Userfront.user.update({
          data: {
            userkey: Userfront.user.data.userkey,
          },
        });
        await updateUser(player._id, {
          userfrontId: Userfront.user.userId,
          experience: player.experience + enemyCreature.reward * 2,
          drachmas: player.drachmas + enemyCreature.reward,
        });
        dropIngredientsOnChance();
        setTimeout(() => {
          setIsFighting(false);
          dispatch(disableBattleStatus());
          loadAsyncDataPlayer();
        }, 1000);
      } else {
        if (chancePlayer) {
          displayPlayerAttackAnimation();
          displayPlayerSpecialCT(
            playerCreatureSpecial,
            criticalMultiplier,
            enemyDefense
          );
          displayPlayerSpecialAnimation();
          setEnemyCreatureHP(
            enemyCreatureHP -
              (playerCreatureSpecial - playerCreatureSpecial * enemyDefense) *
                criticalMultiplier
          );
        }
        ref.current = playerCreatureHP;
        completeLifesteal(
          playerCreatureSpecial,
          criticalMultiplier,
          chancePlayer,
          moveName,
          moveType
        );
      }
    } else {
      healPlayerCreature(
        chancePlayer,
        playerCreatureSpecial,
        criticalMultiplier,
        moveName,
        moveType
      );
    }
  };

  // initiates chance to attack enemy creature or heal player creature
  const attackEnemyOrHeal = async (moveName, moveType) => {
    try {
      // if the player and enemy aren't attacking and the battle is undecided
      if (
        !combatTextAndStatus.playerAttackStatus &&
        !combatTextAndStatus.enemyAttackStatus &&
        combatTextAndStatus.battleUndecided &&
        !isFighting
      ) {
        const playerCreatureAttack =
          playerCreature.attack + chosenRelic.attackMod;
        const playerCreatureSpeed = playerCreature.speed + chosenRelic.speedMod;
        const playerCreatureCritical =
          (playerCreature.critical + chosenRelic.criticalMod) / 100;
        let playerCreatureSpecial =
          playerCreature.special + chosenRelic.specialMod;
        let playerCreatureSpecialCost = playerCreature.specialCost;
        let enemyDefense = enemyCreature.defense / 100;
        let chancePlayer = false;
        let criticalMultiplier = 1;

        // begins fight
        setIsFighting(true);
        checkPotionTimer(dispatch);
        await loadAsyncDataPlayer();
        if (player.preferredSpecial === 2) {
          playerCreatureSpecial =
            playerCreature.special2 + chosenRelic.specialMod;
          playerCreatureSpecialCost = playerCreature.specialCost2;
        }
        if (moveType === "Magic") {
          enemyDefense = 0;
        }
        // checks player creature speed vs enemy creature speed and sets chance
        if (playerCreatureSpeed < enemyCreature.speed) {
          chancePlayer = Math.random() >= 0.5;
        } else {
          chancePlayer = Math.random() >= 0.8;
        }
        // checks for player critical hit
        if (Math.random() <= playerCreatureCritical) {
          criticalMultiplier = 1.5;
        }
        if (moveType === "Poison" && criticalMultiplier === 1) {
          criticalMultiplier = 1.5;
        }
        // if the player's attack is regular
        if (moveName === playerCreature.attackName) {
          // checks for enemy death
          if (
            enemyCreatureHP -
              (playerCreatureAttack - playerCreatureAttack * enemyDefense) *
                criticalMultiplier <=
              0 &&
            chancePlayer
          ) {
            killEnemy(playerCreatureAttack, criticalMultiplier, enemyDefense);
          } else {
            damageEnemy(
              chancePlayer,
              playerCreatureAttack,
              criticalMultiplier,
              enemyDefense,
              moveName,
              moveType
            );
          }
        } else {
          // checks to see if the player has enough mana to use special
          if (playerCreatureMP >= playerCreatureSpecialCost) {
            performSpecial(
              chancePlayer,
              playerCreatureSpecial,
              playerCreatureSpecialCost,
              criticalMultiplier,
              enemyDefense,
              moveName,
              moveType
            );
          } else {
            setCombatAlert("Not enough MP!");
            setIsFighting(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* displays the player creature with combat text, special visual effect, and creature control/info panel */}
      <div className="player_creature">
        {/* displays enemy combat text */}
        <div className="special_effect_container">
          <div className={combatTextAndStatus.enemyCritText}>
            {combatTextAndStatus.enemyCombatText}
          </div>
        </div>

        {/* displays creature based on attack state */}
        {combatTextAndStatus.playerAttackStatus ? (
          <img
            className={chosenRelic.effectClass}
            src={playerCreature.imgPath.slice(0, -4) + "_attack.png"}
            alt={playerCreature.name}
            width="128px"
            height="128px"
          />
        ) : combatTextAndStatus.enemyAttackStatus ? (
          <img
            className={chosenRelic.effectClass}
            src={playerCreature.imgPath.slice(0, -4) + "_hurt.png"}
            alt={playerCreature.name}
            width="128px"
            height="128px"
          />
        ) : (
          <img
            className={chosenRelic.effectClass}
            src={playerCreature.imgPath}
            alt={playerCreature.name}
            width="128px"
            height="128px"
          />
        )}

        {/* displays the player creature special when special is used */}
        {specialStatus ? (
          <div className="special_effect_container">
            {player.preferredSpecial === 1 ? (
              <div className={playerCreature.specialEffect} />
            ) : (
              <div className={playerCreature.specialEffect2} />
            )}{" "}
          </div>
        ) : null}

        {/* creature panel */}
        <div className="creature_panel">
          {/* panel controls */}
          {!battleStatus ? (
            <button
              className="game_button_small"
              onClick={() => {
                toggleSpecial();
              }}
            >
              {" "}
              Special: {player.preferredSpecial}{" "}
            </button>
          ) : null}
          {battleStatus ? (
            <div className="inline_flex">
              <button
                className="game_button attack_button"
                onClick={() => {
                  attackEnemyOrHeal(
                    playerCreature.attackName,
                    playerCreature.attackType
                  );
                }}
              >
                {playerCreature.attackName}
              </button>
              {player.preferredSpecial === 1 ? (
                <button
                  className="game_button special_button"
                  onClick={() => {
                    attackEnemyOrHeal(
                      playerCreature.specialName,
                      playerCreature.specialType
                    );
                  }}
                >
                  {playerCreature.specialName}
                  <br />
                  Cost: {playerCreature.specialCost} MP
                </button>
              ) : (
                <button
                  className="game_button special_button"
                  onClick={() => {
                    attackEnemyOrHeal(
                      playerCreature.specialName2,
                      playerCreature.specialType2
                    );
                  }}
                >
                  {playerCreature.specialName2}
                  <br />
                  Cost: {playerCreature.specialCost2} MP
                </button>
              )}
            </div>
          ) : null}

          {/* panel name and resources */}
          <h4>
            {player.name}'s {playerCreature.name}
          </h4>
          {battleStatus ? (
            <div className="progress_bar_container">
              <div
                className="progress_bar"
                style={{
                  width:
                    (playerCreatureHP /
                      (playerCreature.hp + chosenRelic.hpMod + summonHPBonus)) *
                      100 +
                    "%",
                }}
              />
            </div>
          ) : null}
          {!battleStatus ? (
            <div className="inline_flex">
              <h5>
                HP: {playerCreature.hp + chosenRelic.hpMod + summonHPBonus}
              </h5>
              &nbsp;|&nbsp;
              <h5>
                MP: {playerCreature.mp + chosenRelic.mpMod + summonMPBonus}
              </h5>
            </div>
          ) : (
            <div className="inline_flex">
              <h5>
                HP: {playerCreatureHP} /{" "}
                {playerCreature.hp + chosenRelic.hpMod + summonHPBonus}
              </h5>
              &nbsp;|&nbsp;
              <h5>
                MP: {playerCreatureMP} /{" "}
                {playerCreature.mp + chosenRelic.mpMod + summonMPBonus}
              </h5>
            </div>
          )}

          {/* panel stats */}
          {creatureStatsStatus ? (
            <div>
              <h5>
                Attack: {playerCreature.attack + chosenRelic.attackMod} | Type:{" "}
                {playerCreature.attackType}
              </h5>
              {player.preferredSpecial === 1 ? (
                <h5>
                  Special: {playerCreature.special + chosenRelic.specialMod} |
                  Type: {playerCreature.specialType} |{" "}
                  {playerCreature.specialCost}{" "}
                </h5>
              ) : (
                <h5>
                  Special: {playerCreature.special2 + chosenRelic.specialMod} |
                  Type: {playerCreature.specialType2} |{" "}
                  {playerCreature.specialCost2}{" "}
                </h5>
              )}
              <h5>
                MP Regen: {playerCreature.mpRegen + chosenRelic.mpRegenMod} |
                Speed: {playerCreature.speed + chosenRelic.speedMod}
              </h5>
              <h5>
                Critical: {playerCreature.critical + chosenRelic.criticalMod}% |
                Defense: {playerCreature.defense + chosenRelic.defenseMod}%
              </h5>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default PlayerCreature;
