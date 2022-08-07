import { useRef, useState } from "react";
import { updateUser } from "../services/userServices";
import { getPotionTimer } from "../services/potionTimerServices";
import { potionsList } from "../constants/items";
import { getItems, addItem } from "../services/itemServices";

function PlayerCreature({
  summonsStatus,
  playerCreature,
  enemyAttackStatus,
  setEnemyAttackStatus,
  critText,
  setCritText,
  combatText,
  setCombatText,
  playerAttackStatus,
  setPlayerAttackStatus,
  chosenRelic,
  specialStatus,
  setSpecialStatus,
  battleStatus,
  setBattleStatus,
  player,
  creatureStatsStatus,
  playerCreatureHP,
  setPlayerCreatureHP,
  playerCreatureMP,
  setPlayerCreatureMP,
  enemyCreature,
  setEnemyCreature,
  battleUndecided,
  setBattleUndecided,
  enemyCreatureHP,
  setEnemyCreatureHP,
  Userfront,
  loadAsyncDataPlayer,
  setCombatAlert,
  relicsStatus,
  templeStatus,
  stagesStatus,
  alchemyStatus,
  summonHPBonus,
  setSummonHPBonus,
  summonMPBonus,
  setSummonMPBonus,
}) {
  // reference hook
  const ref = useRef(null);

  // fighting battle state
  const [isFighting, setIsFighting] = useState(false);

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
        setPlayerAttackStatus(true);
        setTimeout(() => {
          setPlayerAttackStatus(false);
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
          setCritText("crit_text");
        }
        setCombatText(
          (playerCreatureAttack - playerCreatureAttack * enemyDefense) *
            criticalMultiplier
        );
        setTimeout(() => {
          setCombatText("");
          setCritText("combat_text");
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
          setCritText("crit_text");
        }
        setCombatText(
          (playerCreatureSpecial - playerCreatureSpecial * enemyDefense) *
            criticalMultiplier
        );
        setTimeout(() => {
          setCombatText("");
          setCritText("combat_text");
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
        setCritText("heal_combat_text");
        if (criticalMultiplier > 1) {
          setCritText("heal_crit_text");
        }
        setCombatText(playerCreatureSpecial * criticalMultiplier);
        setTimeout(() => {
          setCombatText("");
          setCritText("combat_text");
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
        setEnemyAttackStatus(true);
        setTimeout(() => {
          setEnemyAttackStatus(false);
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
          setCritText("crit_text");
        }
        setCombatText(
          (enemyCreature.attack -
            enemyCreature.attack * playerCreatureDefense) *
            criticalMultiplier
        );
        setTimeout(() => {
          setCombatText("");
          setCritText("combat_text");
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // initiates chance of enemy counter attack
  const callEnemyCounterAttack = async (chancePlayer, moveName, moveType) => {
    try {
      const playerCreatureSpeed = playerCreature.speed + chosenRelic.speedMod;
      let playerCreatureDefense =
        (playerCreature.defense + chosenRelic.defenseMod) / 100;
      let enemyCreatureCritical = enemyCreature.critical / 100;
      let criticalMultiplier = 1;
      let chanceEnemy = false;

      // checks for attack type
      if (enemyCreature.attackType === "Magic") {
        playerCreatureDefense = 0;
      }
      // checks enemy creature speeed vs player creature speed and sets chance
      if (enemyCreature.speed <= playerCreatureSpeed) {
        chanceEnemy = Math.random() >= 0.5;
      } else {
        chanceEnemy = Math.random() >= 0.8;
      }
      // series of checks for enemy counter attack based on speed
      if (!chanceEnemy && chancePlayer) {
        setTimeout(() => {
          setCombatAlert("Enemy was too slow!");
        }, 500);
      }
      if (!chanceEnemy && !chancePlayer) {
        attackEnemy(moveName, moveType);
      }
      if (chanceEnemy && chancePlayer) {
        setTimeout(() => {
          if (playerCreatureHP > 0) {
            setCombatAlert("The battle continues...");
          }
        }, 600);
      }
      // checks for player speed failure
      if (chanceEnemy && !chancePlayer) {
        setTimeout(() => {
          setCombatAlert("Your summon was too slow!");
        }, 600);
      }
      if (battleStatus && chanceEnemy) {
        setTimeout(() => {
          viewEnemyAttackAnimation();
          viewEnemyAttackCT(criticalMultiplier, playerCreatureDefense);
        }, 600);
        // checks enemy critical hit
        if (Math.random() <= enemyCreatureCritical) {
          criticalMultiplier = 1.5;
        }
        // checks for enemy poison move type and crit, then applies effect
        if (enemyCreature.attackType === "Poison" && criticalMultiplier === 1) {
          criticalMultiplier = 1.5;
        }
        // checks for player death, and damages player otherwise
        if (
          ref.current -
            (enemyCreature.attack -
              enemyCreature.attack * playerCreatureDefense) *
              criticalMultiplier <=
          0
        ) {
          setBattleUndecided(false);
          setPlayerCreatureHP(0);
          setCombatAlert("Defeat!");
          setTimeout(() => {
            // ends fight
            setIsFighting(false);
            setBattleStatus(false);
            setEnemyCreature({});
            setEnemyCreatureHP(0);
          }, 600);
        } else {
          setPlayerCreatureHP(
            ref.current -
              (enemyCreature.attack -
                enemyCreature.attack * playerCreatureDefense) *
                criticalMultiplier
          );
          // ends fight
          setIsFighting(false);
        }
      } else {
        // ends fight
        setIsFighting(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // checks potion timer
  const checkPotionTimer = async () => {
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
    if (potionTimer.data.length === 0) {
      setSummonMPBonus(0);
      setSummonHPBonus(0);
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
    callEnemyCounterAttack(chancePlayer, moveName, moveType);
    // regens mp
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
    if (playerItems !== undefined) {
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
    }
  };

  // kills enemy on successful attack with enough damage
  const killEnemy = async (
    playerCreatureAttack,
    criticalMultiplier,
    enemyDefense
  ) => {
    setBattleUndecided(false);
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
      // ends fight
      setIsFighting(false);
      setBattleStatus(false);
      setEnemyCreature({});
      loadAsyncDataPlayer();
    }, 1000);
  };

  // heals player creature with enough mana
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
      callEnemyCounterAttack(chancePlayer, moveName, moveType);
    } else {
      ref.current = playerCreatureHP;
      callEnemyCounterAttack(chancePlayer, moveName, moveType);
    }
  };

  // performs player special if mana is enough
  const performSpecial = async (
    chancePlayer,
    playerCreatureSpecial,
    playerCreatureSpecialCost,
    criticalMultiplier,
    enemyDefense,
    moveName,
    moveType
  ) => {
    // deducts MP
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
        setBattleUndecided(false);
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
          // ends fight
          setIsFighting(false);
          setBattleStatus(false);
          setEnemyCreature({});
          loadAsyncDataPlayer();
        }, 1000);
      } else {
        // damages enemy
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
        // life steal to player
        if (moveType === "Lifesteal") {
          if (
            playerCreatureHP +
              playerCreatureSpecial * criticalMultiplier * 0.2 >
            playerCreature.hp + chosenRelic.hpMod + summonHPBonus
          ) {
            setPlayerCreatureHP(
              playerCreature.hp + chosenRelic.hpMod + summonHPBonus
            );
            ref.current = playerCreature.hp + chosenRelic.hpMod + summonHPBonus;
          } else {
            setPlayerCreatureHP(
              playerCreatureHP +
                playerCreatureSpecial * criticalMultiplier * 0.2
            );
            ref.current =
              playerCreatureHP +
              playerCreatureSpecial * criticalMultiplier * 0.2;
          }
        }
        callEnemyCounterAttack(chancePlayer, moveName, moveType);
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

  // initiates chance to attack enemy creature
  const attackEnemy = async (moveName, moveType) => {
    try {
      // if the player and enemy aren't attacking and the battle is undecided
      if (
        !playerAttackStatus &&
        !enemyAttackStatus &&
        battleUndecided &&
        !isFighting
      ) {
        // begins fight
        setIsFighting(true);

        checkPotionTimer();

        await loadAsyncDataPlayer();

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

        // assigns preferred player special and cost
        if (player.preferredSpecial === 2) {
          playerCreatureSpecial =
            playerCreature.special2 + chosenRelic.specialMod;
          playerCreatureSpecialCost = playerCreature.specialCost2;
        }

        // checks for player magic move type and applies effect
        if (moveType === "Magic") {
          enemyDefense = 0;
        }

        // checks player creature speed vs enemy creature speed and sets chance
        if (playerCreatureSpeed <= enemyCreature.speed) {
          chancePlayer = Math.random() >= 0.5;
        } else {
          chancePlayer = Math.random() >= 0.8;
        }

        // checks for player critical hit
        if (Math.random() <= playerCreatureCritical) {
          criticalMultiplier = 1.5;
        }

        // checks for player poison move type and crit, then applies effect
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
          // checks to see if the player has enough mana to use special attack
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
            // ends fight
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
      {!summonsStatus &&
      !relicsStatus &&
      !templeStatus &&
      !stagesStatus &&
      !alchemyStatus ? (
        <>
          {/* displays the player creature with combat text, special visual effect, and creature control/stat panel */}
          <div className="player_creature">
            {/* displays combat text */}
            {enemyAttackStatus ||
            critText === "heal_crit_text" ||
            critText === "heal_combat_text" ? (
              <div className="special_effect_container">
                <div className={critText}>{combatText}</div>
              </div>
            ) : null}

            {/* displays creature based on attack state */}
            {playerAttackStatus ? (
              <img
                className={chosenRelic.effectClass}
                src={playerCreature.imgPath.slice(0, -4) + "_attack.png"}
                alt={playerCreature.name}
                width="128px"
                height="128px"
              />
            ) : enemyAttackStatus ? (
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

            {/* displays player creature controls based on battle status and selected special, and player creature stats based on user preference */}
            {!battleStatus ? (
              <button
                className="game_button_small margin_small"
                onClick={() => {
                  toggleSpecial();
                }}
              >
                {" "}
                Special: {player.preferredSpecial}{" "}
              </button>
            ) : null}
            <div className="creature_panel">
              {battleStatus ? (
                <div className="inline_flex">
                  <button
                    className="game_button attack_button"
                    onClick={() => {
                      attackEnemy(
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
                        attackEnemy(
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
                        attackEnemy(
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
                          (playerCreature.hp +
                            chosenRelic.hpMod +
                            summonHPBonus)) *
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

              {creatureStatsStatus ? (
                <div>
                  <h5>
                    Attack: {playerCreature.attack + chosenRelic.attackMod} |
                    Type: {playerCreature.attackType}
                  </h5>
                  {player.preferredSpecial === 1 ? (
                    <h5>
                      Special: {playerCreature.special + chosenRelic.specialMod}{" "}
                      | Type: {playerCreature.specialType} |{" "}
                      {playerCreature.specialCost}{" "}
                    </h5>
                  ) : (
                    <h5>
                      Special:{" "}
                      {playerCreature.special2 + chosenRelic.specialMod} | Type:{" "}
                      {playerCreature.specialType2} |{" "}
                      {playerCreature.specialCost2}{" "}
                    </h5>
                  )}
                  <h5>
                    MP Regen: {playerCreature.mpRegen + chosenRelic.mpRegenMod}{" "}
                    | Speed: {playerCreature.speed + chosenRelic.speedMod}
                  </h5>
                  <h5>
                    Critical:{" "}
                    {playerCreature.critical + chosenRelic.criticalMod}% |
                    Defense: {playerCreature.defense + chosenRelic.defenseMod}%
                  </h5>
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default PlayerCreature;
