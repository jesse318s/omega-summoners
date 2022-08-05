import { useRef, useState } from "react";
import { updateUser } from "../services/userServices";
import { updateLobby } from "../services/lobbyServices";
import { getPotionTimer } from "../services/potionTimerServices";
import { potionsList } from "../constants/items";

function MultiPlayerCreature({
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
  Userfront,
  loadAsyncDataPlayer,
  setCombatAlert,
  lobby,
  loadAsyncDataLobby,
  lobbyTimer,
  setLobbyTimer,
  relicsStatus,
  templeStatus,
  stagesStatus,
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
          (enemyCreature[0].attack -
            enemyCreature[0].attack * playerCreatureDefense) *
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
      const playerCreatureSpeed =
        (playerCreature[0].speed + chosenRelic[0].speedMod) / 100;
      let playerCreatureDefense =
        (playerCreature[0].defense + chosenRelic[0].defenseMod) / 100;
      let criticalMultiplier = 1;
      let chanceEnemy = false;

      // checks for attack type
      if (enemyCreature[0].attackType === "Magic") {
        playerCreatureDefense = 0;
      }
      // checks for equal player and enemy speed
      if (enemyCreature[0].speed / 100 === playerCreatureSpeed) {
        chanceEnemy = Math.random() >= 0.5;
      } else {
        chanceEnemy =
          Math.random() >= playerCreatureSpeed - enemyCreature[0].speed / 100;
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
          setCombatAlert("The battle continues...");
        }, 600);
      }
      // checks for player speed failure
      if (chanceEnemy && !chancePlayer) {
        setTimeout(() => {
          setCombatAlert("Your summon was too slow!");
        }, 500);
      }
      if (battleStatus && chanceEnemy) {
        setTimeout(() => {
          viewEnemyAttackAnimation();
          viewEnemyAttackCT(criticalMultiplier, playerCreatureDefense);
        }, 600);

        // checks enemy critical hit
        if (Math.random() <= enemyCreature[0].critical / 100) {
          criticalMultiplier = 1.5;
        }

        // checks for enemy poison move type and crit, then applies effect
        if (
          enemyCreature[0].attackType === "Poison" &&
          criticalMultiplier === 1
        ) {
          criticalMultiplier = 1.5;
        }

        // checks for player death, and damages player otherwise
        if (
          ref.current -
            (enemyCreature[0].attack -
              enemyCreature[0].attack * playerCreatureDefense) *
              criticalMultiplier <=
          0
        ) {
          setBattleUndecided(false);
          setPlayerCreatureHP(0);
          setCombatAlert("Defeat!");
          // ends fight
          setIsFighting(false);
          setTimeout(() => {
            setBattleStatus(false);
            setEnemyCreature({});
          }, 600);
        } else {
          setPlayerCreatureHP(
            ref.current -
              (enemyCreature[0].attack -
                enemyCreature[0].attack * playerCreatureDefense) *
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
      await Userfront.user.update({
        data: {
          userkey: Userfront.user.data.userkey,
        },
      });
      await updateLobby(lobby._id, {
        enemyHP:
          lobby.enemyHP -
          (playerCreatureAttack - playerCreatureAttack * enemyDefense) *
            criticalMultiplier,
      });
    }

    ref.current = playerCreatureHP;
    callEnemyCounterAttack(chancePlayer, moveName, moveType);

    // regens mp
    if (
      playerCreatureMP !==
        playerCreature[0].mp + chosenRelic[0].mpMod + summonMPBonus &&
      playerCreatureMP +
        playerCreature[0].mpRegen +
        chosenRelic[0].mpRegenMod <=
        playerCreature[0].mp + chosenRelic[0].mpMod + summonMPBonus
    ) {
      setPlayerCreatureMP(
        playerCreatureMP + playerCreature[0].mpRegen + chosenRelic[0].mpRegenMod
      );
    }
    if (
      playerCreatureMP + playerCreature[0].mpRegen + chosenRelic[0].mpRegenMod >
      playerCreature[0].mp + chosenRelic.mpMod + summonMPBonus
    ) {
      setPlayerCreatureMP(
        playerCreature[0].mp + chosenRelic[0].mpMod + summonMPBonus
      );
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
    await Userfront.user.update({
      data: {
        userkey: Userfront.user.data.userkey,
      },
    });
    await updateLobby(lobby._id, { enemyHP: 0 });
    setCombatAlert("Victory!");
    await Userfront.user.update({
      data: {
        userkey: Userfront.user.data.userkey,
      },
    });
    await updateUser(player._id, {
      userfrontId: Userfront.user.userId,
      experience: player.experience + enemyCreature[0].reward * 2,
      drachmas: player.drachmas + enemyCreature[0].reward,
    });

    // ends fight
    setIsFighting(false);

    setTimeout(() => {
      setBattleStatus(false);
      setEnemyCreature({});
      setPlayerCreatureHP(0);
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
        playerCreature[0].hp + chosenRelic[0].hpMod + summonHPBonus
      ) {
        setPlayerCreatureHP(
          playerCreature[0].hp + chosenRelic[0].hpMod + summonHPBonus
        );
        ref.current =
          playerCreature[0].hp + chosenRelic[0].hpMod + summonHPBonus;
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
        lobby.enemyHP -
          (playerCreatureSpecial - playerCreatureSpecial * enemyDefense) *
            criticalMultiplier <=
        0
      ) {
        setBattleUndecided(false);
        displayPlayerAttackAnimation();
        displayPlayerSpecialAnimation();
        displayPlayerSpecialCT(
          playerCreatureSpecial,
          criticalMultiplier,
          enemyDefense
        );
        await Userfront.user.update({
          data: {
            userkey: Userfront.user.data.userkey,
          },
        });
        await updateLobby(lobby._id, { enemyHP: 0 });
        setCombatAlert("Victory!");
        await Userfront.user.update({
          data: {
            userkey: Userfront.user.data.userkey,
          },
        });
        await updateUser(player._id, {
          userfrontId: Userfront.user.userId,
          experience: player.experience + enemyCreature[0].reward * 2,
          drachmas: player.drachmas + enemyCreature[0].reward,
        });

        // ends fight
        setIsFighting(false);

        setTimeout(() => {
          setBattleStatus(false);
          setEnemyCreature({});
          setPlayerCreatureHP(0);
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
          await Userfront.user.update({
            data: {
              userkey: Userfront.user.data.userkey,
            },
          });
          await updateLobby(lobby._id, {
            enemyHP:
              lobby.enemyHP -
              (playerCreatureSpecial - playerCreatureSpecial * enemyDefense) *
                criticalMultiplier,
          });
        }

        ref.current = playerCreatureHP;

        // life steal to player
        if (moveType === "Lifesteal") {
          if (
            playerCreatureHP +
              playerCreatureSpecial * criticalMultiplier * 0.2 >
            playerCreature[0].hp + chosenRelic[0].hpMod + summonHPBonus
          ) {
            setPlayerCreatureHP(
              playerCreature[0].hp + chosenRelic[0].hpMod + summonHPBonus
            );
            ref.current =
              playerCreature[0].hp + chosenRelic[0].hpMod + summonHPBonus;
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
        !lobbyTimer &&
        !isFighting
      ) {
        // begins fight
        setIsFighting(true);

        setLobbyTimer(true);

        await loadAsyncDataLobby();

        checkPotionTimer();

        await loadAsyncDataPlayer();

        // timeout for lobby timer
        setTimeout(() => {
          setLobbyTimer(false);
          loadAsyncDataLobby();
          loadAsyncDataPlayer();
        }, 1100);

        const playerCreatureAttack =
          playerCreature[0].attack + chosenRelic[0].attackMod;
        const playerCreatureSpeed =
          (playerCreature[0].speed + chosenRelic[0].speedMod) / 100;
        const playerCreatureCritical =
          (playerCreature[0].critical + chosenRelic[0].criticalMod) / 100;
        let playerCreatureSpecial =
          playerCreature[0].special + chosenRelic[0].specialMod;
        let playerCreatureSpecialCost = playerCreature[0].specialCost;
        let enemyDefense = enemyCreature[0].defense / 100;
        let chancePlayer = false;
        let criticalMultiplier = 1;

        // assigns preferred player special and cost
        if (player.preferredSpecial === 2) {
          playerCreatureSpecial =
            playerCreature[0].special2 + chosenRelic[0].specialMod;
          playerCreatureSpecialCost = playerCreature[0].specialCost2;
        }

        // checks for player magic move type and applies effect
        if (moveType === "Magic") {
          enemyDefense = 0;
        }

        // checks for equal player and enemy speed
        if (playerCreatureSpeed === enemyCreature[0].speed / 100) {
          chancePlayer = Math.random() >= 0.5;
        } else {
          chancePlayer =
            Math.random() >= enemyCreature[0].speed / 100 - playerCreatureSpeed;
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
        if (moveName === playerCreature[0].attackName) {
          // checks for enemy death
          if (
            lobby.enemyHP -
              (playerCreatureAttack - playerCreatureAttack * enemyDefense) *
                criticalMultiplier <=
            0
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
      {!summonsStatus && !relicsStatus && !templeStatus && !stagesStatus ? (
        <>
          <div className="player_creature">
            {/* maps the player creature with combat text, special visual effect, and creature control/stat panel */}
            {playerCreature.map((creature) => (
              <div key={creature.id}>
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
                    className={chosenRelic[0].effectClass}
                    src={creature.imgPath.slice(0, -4) + "_attack.png"}
                    alt={creature.name}
                    width="128px"
                    height="128px"
                  />
                ) : enemyAttackStatus ? (
                  <img
                    className={chosenRelic[0].effectClass}
                    src={creature.imgPath.slice(0, -4) + "_hurt.png"}
                    alt={creature.name}
                    width="128px"
                    height="128px"
                  />
                ) : (
                  <img
                    className={chosenRelic[0].effectClass}
                    src={creature.imgPath}
                    alt={creature.name}
                    width="128px"
                    height="128px"
                  />
                )}

                {/* displays the player creature special when special is used */}
                {specialStatus ? (
                  <div className="special_effect_container">
                    {player.preferredSpecial === 1 ? (
                      <div className={creature.specialEffect} />
                    ) : (
                      <div className={creature.specialEffect2} />
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
                          attackEnemy(creature.attackName, creature.attackType);
                        }}
                      >
                        {creature.attackName}
                      </button>
                      {player.preferredSpecial === 1 ? (
                        <button
                          className="game_button special_button"
                          onClick={() => {
                            attackEnemy(
                              creature.specialName,
                              creature.specialType
                            );
                          }}
                        >
                          {creature.specialName}
                          <br />
                          Cost: {creature.specialCost} MP
                        </button>
                      ) : (
                        <button
                          className="game_button special_button"
                          onClick={() => {
                            attackEnemy(
                              creature.specialName2,
                              creature.specialType2
                            );
                          }}
                        >
                          {creature.specialName2}
                          <br />
                          Cost: {creature.specialCost2} MP
                        </button>
                      )}
                    </div>
                  ) : null}

                  <h4>
                    {player.name}'s {creature.name}
                  </h4>

                  {battleStatus ? (
                    <div className="progress_bar_container">
                      <div
                        className="progress_bar"
                        style={{
                          width:
                            (playerCreatureHP /
                              (playerCreature[0].hp +
                                chosenRelic[0].hpMod +
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
                        HP: {creature.hp + chosenRelic[0].hpMod + summonHPBonus}
                      </h5>
                      &nbsp;|&nbsp;
                      <h5>
                        MP: {creature.mp + chosenRelic[0].mpMod + summonMPBonus}
                      </h5>
                    </div>
                  ) : (
                    <div className="inline_flex">
                      <h5>
                        HP: {playerCreatureHP} /{" "}
                        {creature.hp + chosenRelic[0].hpMod + summonHPBonus}
                      </h5>
                      &nbsp;|&nbsp;
                      <h5>
                        MP: {playerCreatureMP} /{" "}
                        {creature.mp + chosenRelic[0].mpMod + summonMPBonus}
                      </h5>
                    </div>
                  )}

                  {creatureStatsStatus ? (
                    <div>
                      <h5>
                        Attack: {creature.attack + chosenRelic[0].attackMod} |
                        Type: {creature.attackType}
                      </h5>
                      {player.preferredSpecial === 1 ? (
                        <h5>
                          Special:{" "}
                          {creature.special + chosenRelic[0].specialMod} | Type:{" "}
                          {creature.specialType} | {creature.specialCost}{" "}
                        </h5>
                      ) : (
                        <h5>
                          Special:{" "}
                          {creature.special2 + chosenRelic[0].specialMod} |
                          Type: {creature.specialType2} |{" "}
                          {creature.specialCost2}{" "}
                        </h5>
                      )}
                      <h5>
                        MP Regen: {creature.mpRegen + chosenRelic[0].mpRegenMod}{" "}
                        | Speed: {creature.speed + chosenRelic[0].speedMod}
                      </h5>
                      <h5>
                        Critical:{" "}
                        {creature.critical + chosenRelic[0].criticalMod}% |
                        Defense: {creature.defense + chosenRelic[0].defenseMod}%
                      </h5>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
}

export default MultiPlayerCreature;
