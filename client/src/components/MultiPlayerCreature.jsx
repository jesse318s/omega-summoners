import { useRef, useState } from "react";
import { updateUser } from "../services/userServices";
import { getLobby, updateLobby } from "../services/lobbyServices";
import { getPotionTimer } from "../services/potionTimerServices";
import { potionsList } from "../constants/items";
import { useSelector, useDispatch } from "react-redux";
import { disableBattleStatus } from "../store/actions/battleStatus.actions";
import {
  setSummonHPBonusAmount,
  setSummonMPBonusAmount,
} from "../store/actions/alchemy.actions";
import {
  enableLobbyTimer,
  disableLobbyTimer,
} from "../store/actions/lobbyTimer.actions";

function MultiPlayerCreature({
  enemyAttackStatus,
  setEnemyAttackStatus,
  setCombatText,
  enemyCombatText,
  setEnemyCombatText,
  setCritText,
  enemyCritText,
  setEnemyCritText,
  playerAttackStatus,
  setPlayerAttackStatus,
  player,
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
  connections,
  lobby,
  loadAsyncDataLobby,
  gameMenuStatus,
}) {
  // dispatch hook for redux
  const dispatch = useDispatch();

  // player creature state from redux store
  const playerCreature = useSelector((state) => state.summon.playerCreature);
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
  // lobby timer state from redux store
  const lobbyTimer = useSelector((state) => state.lobbyTimer.lobbyTimer);

  // reference hook
  const ref = useRef(null);

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
        setEnemyCritText("heal_combat_text");
        if (criticalMultiplier > 1) {
          setEnemyCritText("heal_crit_text");
        }
        setEnemyCombatText(playerCreatureSpecial * criticalMultiplier);
        setTimeout(() => {
          setEnemyCombatText("");
          setEnemyCritText("combat_text");
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
          setEnemyCritText("crit_text");
        }
        setEnemyCombatText(
          (enemyCreature.attack -
            enemyCreature.attack * playerCreatureDefense) *
            criticalMultiplier
        );
        setTimeout(() => {
          setEnemyCombatText("");
          setEnemyCritText("combat_text");
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
  const callEnemyCounterAttack = async (chancePlayer, moveName, moveType) => {
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
      // series of checks for enemy counter attack based on chance/speed, and for player creature mp regen
      if (!chanceEnemy && chancePlayer) {
        setTimeout(() => {
          setCombatAlert("Enemy was too slow!");
        }, 500);
      }
      if (!chanceEnemy && !chancePlayer) {
        // ends fight
        setIsFighting(false);
        attackEnemyOrHeal(moveName, moveType);
        return;
      }
      // updates lobby for player
      await loadAsyncDataLobby();
      await loadAsyncDataPlayer();
      // check for player creature mp regen
      if (moveName === playerCreature.attackName) {
        regenMP();
      }
      if (chanceEnemy && chancePlayer) {
        setTimeout(() => {
          setCombatAlert("Both abilities succeeded.");
        }, 600);
      }
      // checks for player chance/speed failure
      if (chanceEnemy && !chancePlayer) {
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
          setBattleUndecided(false);
          setPlayerCreatureHP(0);
          setCombatAlert("Defeat!");
          setTimeout(() => {
            // ends fight
            setIsFighting(false);
            dispatch(disableBattleStatus());
            setEnemyCreature({});
          }, 1100);
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
      dispatch(setSummonMPBonusAmount(playerMPBonus));
      dispatch(setSummonHPBonusAmount(playerHPBonus));
    }
    if (potionTimer.data.length === 0) {
      dispatch(setSummonMPBonusAmount(0));
      dispatch(setSummonHPBonusAmount(0));
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
  };

  // drops multiplayer rewards for player
  const dropMPRewards = async () => {
    dispatch(enableLobbyTimer());
    setTimeout(() => {
      setIsFighting(false);
      dispatch(disableBattleStatus());
    }, 1100);
    setTimeout(() => {
      Userfront.user.update({
        data: {
          userkey: Userfront.user.data.userkey,
        },
      });
      setTimeout(() => {
        updateUser(player._id, {
          userfrontId: Userfront.user.userId,
          experience: player.experience + enemyCreature.reward * 2,
          drachmas: player.drachmas + enemyCreature.reward,
        }).then(() => {
          loadAsyncDataPlayer();
          dispatch(disableLobbyTimer());
        });
      }, 2000);
    }, 2000);
  };

  // kills enemy
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
    const otherConnections = connections.filter(
      (connection) => connection.userId !== Userfront.user.userId
    );
    if (otherConnections.length === 1) {
      await updateLobby(lobby._id, {
        enemyHP: 0,
        victors: [otherConnections[0].userId],
      });
    } else if (otherConnections.length === 2) {
      await updateLobby(lobby._id, {
        enemyHP: 0,
        victors: [otherConnections[0].userId, otherConnections[1].userId],
      });
    } else {
      await updateLobby(lobby._id, {
        enemyHP: 0,
      });
    }
    setCombatAlert("Victory!");
    await loadAsyncDataLobby();
    await loadAsyncDataLobby();
    dropMPRewards();
  };

  // completes player lifesteal check and heal
  const completeLifesteal = async (
    playerCreatureSpecial,
    criticalMultiplier,
    chancePlayer,
    moveName,
    moveType
  ) => {
    if (moveType === "Lifesteal") {
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
    callEnemyCounterAttack(chancePlayer, moveName, moveType);
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
      callEnemyCounterAttack(chancePlayer, moveName, moveType);
    } else {
      ref.current = playerCreatureHP;
      callEnemyCounterAttack(chancePlayer, moveName, moveType);
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
        const otherConnections = connections.filter(
          (connection) => connection.userId !== Userfront.user.userId
        );
        if (otherConnections.length === 1) {
          await updateLobby(lobby._id, {
            enemyHP: 0,
            victors: [otherConnections[0].userId],
          });
        } else if (otherConnections.length === 2) {
          await updateLobby(lobby._id, {
            enemyHP: 0,
            victors: [otherConnections[0].userId, otherConnections[1].userId],
          });
        } else {
          await updateLobby(lobby._id, {
            enemyHP: 0,
          });
        }
        setCombatAlert("Victory!");
        await loadAsyncDataLobby();
        await loadAsyncDataLobby();
        dropMPRewards();
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

  // grants previous victory
  const grantVictory = async () => {
    setBattleUndecided(false);
    await Userfront.user.update({
      data: {
        userkey: Userfront.user.data.userkey,
      },
    });
    const newVictors = lobby.victors.filter(
      (victor) => victor !== Userfront.user.userId
    );
    await updateLobby(lobby._id, {
      victors: [newVictors[0]],
    });
    setCombatAlert("Victory!");
    dropMPRewards();
  };

  // initiates chance to attack enemy creature or heal player creature
  const attackEnemyOrHeal = async (moveName, moveType) => {
    try {
      // if the player and enemy aren't attacking, the battle is undecided, and the lobby timer is not running
      if (
        !playerAttackStatus &&
        !enemyAttackStatus &&
        battleUndecided &&
        !isFighting &&
        !lobbyTimer
      ) {
        const playerCreatureAttack =
          playerCreature.attack + chosenRelic.attackMod;
        const playerCreatureSpeed =
          (playerCreature.speed + chosenRelic.speedMod) / 100;
        const playerCreatureCritical =
          (playerCreature.critical + chosenRelic.criticalMod) / 100;
        let playerCreatureSpecial =
          playerCreature.special + chosenRelic.specialMod;
        let playerCreatureSpecialCost = playerCreature.specialCost;
        let enemyCreatureSpeed = enemyCreature.speed / 100;
        let enemyDefense = enemyCreature.defense / 100;
        let chancePlayer = false;
        let criticalMultiplier = 1;

        // begins fight
        setIsFighting(true);
        await loadAsyncDataLobby();
        checkPotionTimer();
        await loadAsyncDataPlayer();
        const newLobby = await getLobby(lobby._id);
        if (newLobby.data.victors.includes(Userfront.user.userId)) {
          grantVictory();
          return;
        }
        if (player.preferredSpecial === 2) {
          playerCreatureSpecial =
            playerCreature.special2 + chosenRelic.specialMod;
          playerCreatureSpecialCost = playerCreature.specialCost2;
        }
        if (moveType === "Magic") {
          enemyDefense = 0;
        }
        // checks player creature speed vs enemy creature speed and sets chance
        if (playerCreatureSpeed < enemyCreatureSpeed) {
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
      {Object.values(gameMenuStatus).every((value) => value === false) ? (
        <>
          {/* displays the player creature with combat text, special visual effect, and creature control/stat panel */}
          <div className="player_creature">
            {/* displays enemy combat text */}
            <div className="special_effect_container">
              <div className={enemyCritText}>{enemyCombatText}</div>
            </div>

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

            {/* toggle special button */}
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

            {/* panel controls */}
            <div className="creature_panel">
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

              {/* panel content */}
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

              {/* panel stats */}
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

export default MultiPlayerCreature;
