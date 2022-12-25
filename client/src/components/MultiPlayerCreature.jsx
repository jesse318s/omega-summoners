import { useRef, useState } from "react";
import Userfront from "@userfront/core";
import { updateUser } from "../services/userServices";
import { getLobby, updateLobby } from "../services/lobbyServices";
import { getConnections } from "../services/connectionServices";
import CommonPlayerCreaturePanel from "./CommonPlayerCreaturePanel";
import { useSelector, useDispatch } from "react-redux";
import { disableBattleStatus } from "../store/actions/battleStatus.actions";
import {
  enableLobbyTimer,
  disableLobbyTimer,
} from "../store/actions/lobbyTimer.actions";
import checkPotionTimer from "../utils/checkPotionTimer";

Userfront.init("rbvqd5nd");

function MultiPlayerCreature({
  combatTextAndCombatStatus,
  setCombatTextAndCombatStatus,
  player,
  playerCreatureResources,
  setPlayerCreatureResources,
  loadAsyncDataPlayer,
  connections,
  lobby,
  loadAsyncDataLobby,
}) {
  // dispatch hook for redux
  const dispatch = useDispatch();

  // player creature state from redux store
  const playerCreature = useSelector((state) => state.summon.playerCreature);
  // enemy creature state from redux store
  const enemyCreature = useSelector((state) => state.enemy.enemyCreature);
  // battle status combat state from redux store
  const battleStatus = useSelector((state) => state.battleStatus.battleStatus);
  // relics state from redux store
  const chosenRelic = useSelector((state) => state.relics.chosenRelic);
  // alchemy state from redux store
  const summonHPBonus = useSelector((state) => state.alchemy.summonHPBonus);
  const summonMPBonus = useSelector((state) => state.alchemy.summonMPBonus);

  // reference hook for player creature hp
  const ref = useRef(0);
  // counter reference hook for recursive player creature ability called within enemy counter attack
  const counterRef = useRef(0);

  // fighting battle state
  const [isFighting, setIsFighting] = useState(false);
  // player creature special status state
  const [specialStatus, setSpecialStatus] = useState(false);

  // player attack animation
  const displayPlayerAttackAnimation = async () => {
    try {
      if (battleStatus) {
        setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
          return {
            ...combatTextAndCombatStatus,
            playerAttackStatus: true,
          };
        });
        setTimeout(() => {
          setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
            return {
              ...combatTextAndCombatStatus,
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
          setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
            return {
              ...combatTextAndCombatStatus,
              critText: "crit_text",
            };
          });
        }
        setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
          return {
            ...combatTextAndCombatStatus,
            combatText:
              (playerCreatureAttack - playerCreatureAttack * enemyDefense) *
              criticalMultiplier,
          };
        });
        setTimeout(() => {
          setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
            return {
              ...combatTextAndCombatStatus,
              combatText: "",
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
          setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
            return {
              ...combatTextAndCombatStatus,
              critText: "crit_text",
            };
          });
        }
        setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
          return {
            ...combatTextAndCombatStatus,
            combatText:
              (playerCreatureSpecial - playerCreatureSpecial * enemyDefense) *
              criticalMultiplier,
          };
        });
        setTimeout(() => {
          setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
            return {
              ...combatTextAndCombatStatus,
              combatText: "",
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
        setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
          return {
            ...combatTextAndCombatStatus,
            enemyCritText: "heal_combat_text",
          };
        });
        if (criticalMultiplier > 1) {
          setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
            return {
              ...combatTextAndCombatStatus,
              enemyCritText: "heal_crit_text",
            };
          });
        }
        setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
          return {
            ...combatTextAndCombatStatus,
            enemyCombatText: playerCreatureSpecial * criticalMultiplier,
          };
        });
        setTimeout(() => {
          setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
            return {
              ...combatTextAndCombatStatus,
              enemyCombatText: "",
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
        setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
          return {
            ...combatTextAndCombatStatus,
            enemyAttackStatus: true,
          };
        });
        setTimeout(() => {
          setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
            return {
              ...combatTextAndCombatStatus,
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
          setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
            return {
              ...combatTextAndCombatStatus,
              enemyCritText: "crit_text",
            };
          });
        }
        setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
          return {
            ...combatTextAndCombatStatus,
            enemyCombatText:
              (enemyCreature.attack -
                enemyCreature.attack * playerCreatureDefense) *
              criticalMultiplier,
          };
        });
        setTimeout(() => {
          setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
            return {
              ...combatTextAndCombatStatus,
              enemyCombatText: "",
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
      playerCreatureResources.playerCreatureMP !==
        playerCreature.mp + chosenRelic.mpMod + summonMPBonus &&
      playerCreatureResources.playerCreatureMP +
        playerCreature.mpRegen +
        chosenRelic.mpRegenMod <=
        playerCreature.mp + chosenRelic.mpMod + summonMPBonus
    ) {
      setPlayerCreatureResources((playerCreatureResources) => {
        return {
          ...playerCreatureResources,
          playerCreatureMP:
            playerCreatureResources.playerCreatureMP +
            playerCreature.mpRegen +
            chosenRelic.mpRegenMod,
        };
      });
    }
    if (
      playerCreatureResources.playerCreatureMP +
        playerCreature.mpRegen +
        chosenRelic.mpRegenMod >
      playerCreature.mp + chosenRelic.mpMod + summonMPBonus
    ) {
      setPlayerCreatureResources((playerCreatureResources) => {
        return {
          ...playerCreatureResources,
          playerCreatureMP:
            playerCreature.mp + chosenRelic.mpMod + summonMPBonus,
        };
      });
    }
  };

  // checks for player death, and damages player otherwise
  const dieOrTakeDamage = (playerCreatureDefense, criticalMultiplier) => {
    if (
      ref.current -
        (enemyCreature.attack - enemyCreature.attack * playerCreatureDefense) *
          criticalMultiplier <=
      0
    ) {
      setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
        return {
          ...combatTextAndCombatStatus,
          battleUndecided: false,
          combatAlert: "Defeat!",
        };
      });
      setPlayerCreatureResources((playerCreatureResources) => {
        return {
          ...playerCreatureResources,
          playerCreatureHP: 0,
        };
      });
      setTimeout(() => {
        setIsFighting(false);
        dispatch(disableBattleStatus());
      }, 1100);
    } else {
      setPlayerCreatureResources((playerCreatureResources) => {
        return {
          ...playerCreatureResources,
          playerCreatureHP:
            ref.current -
            (enemyCreature.attack -
              enemyCreature.attack * playerCreatureDefense) *
              criticalMultiplier,
        };
      });
      setIsFighting(false);
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
          setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
            return {
              ...combatTextAndCombatStatus,
              combatAlert: "Enemy was too slow!",
            };
          });
        }, 500);
      }
      if (!chanceEnemy && !chancePlayer) {
        setIsFighting(false);
        counterRef.current = counterRef.current + 1;
        attackEnemyOrHeal(moveName, moveType);
        return;
      }
      // updates lobby for player
      await loadAsyncDataLobby();
      await loadAsyncDataPlayer();
      if (moveName === playerCreature.attackName) {
        regenMP();
      }
      if (chanceEnemy && chancePlayer) {
        counterRef.current = 0;
        setTimeout(() => {
          setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
            return {
              ...combatTextAndCombatStatus,
              combatAlert: "Both abilities succeeded.",
            };
          });
        }, 600);
      }
      // checks for player chance/speed failure
      if (chanceEnemy && !chancePlayer) {
        counterRef.current = 0;
        setTimeout(() => {
          setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
            return {
              ...combatTextAndCombatStatus,
              combatAlert: "Your summon was too slow!",
            };
          });
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
        dieOrTakeDamage(playerCreatureDefense, criticalMultiplier);
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
    moveType,
    newLobby
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
          newLobby.data.enemyHP -
          (playerCreatureAttack - playerCreatureAttack * enemyDefense) *
            criticalMultiplier,
      });
    }
    ref.current = playerCreatureResources.playerCreatureHP;
    receiveEnemyCounterAttack(chancePlayer, moveName, moveType);
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
    counterRef.current = 0;
    setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
      return {
        ...combatTextAndCombatStatus,
        battleUndecided: false,
      };
    });
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
    setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
      return {
        ...combatTextAndCombatStatus,
        combatAlert: "Victory!",
      };
    });
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
    if (moveType === "Lifesteal" && chancePlayer) {
      if (
        playerCreatureResources.playerCreatureHP +
          playerCreatureSpecial * criticalMultiplier * 0.2 >
        playerCreature.hp + chosenRelic.hpMod + summonHPBonus
      ) {
        setPlayerCreatureResources((playerCreatureResources) => {
          return {
            ...playerCreatureResources,
            playerCreatureHP:
              playerCreature.hp + chosenRelic.hpMod + summonHPBonus,
          };
        });
        ref.current = playerCreature.hp + chosenRelic.hpMod + summonHPBonus;
      } else {
        setPlayerCreatureResources((playerCreatureResources) => {
          return {
            ...playerCreatureResources,
            playerCreatureHP:
              playerCreatureResources.playerCreatureHP +
              playerCreatureSpecial * criticalMultiplier * 0.2,
          };
        });
        ref.current =
          playerCreatureResources.playerCreatureHP +
          playerCreatureSpecial * criticalMultiplier * 0.2;
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
        playerCreatureResources.playerCreatureHP +
          playerCreatureSpecial * criticalMultiplier >
        playerCreature.hp + chosenRelic.hpMod + summonHPBonus
      ) {
        setPlayerCreatureResources((playerCreatureResources) => {
          return {
            ...playerCreatureResources,
            playerCreatureHP:
              playerCreature.hp + chosenRelic.hpMod + summonHPBonus,
          };
        });
        ref.current = playerCreature.hp + chosenRelic.hpMod + summonHPBonus;
      } else {
        setPlayerCreatureResources((playerCreatureResources) => {
          return {
            ...playerCreatureResources,
            playerCreatureHP:
              playerCreatureResources.playerCreatureHP +
              playerCreatureSpecial * criticalMultiplier,
          };
        });
        ref.current =
          playerCreatureResources.playerCreatureHP +
          playerCreatureSpecial * criticalMultiplier;
      }
      receiveEnemyCounterAttack(chancePlayer, moveName, moveType);
    } else {
      ref.current = playerCreatureResources.playerCreatureHP;
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
    moveType,
    newLobby
  ) => {
    setPlayerCreatureResources({
      ...playerCreatureResources,
      playerCreatureMP:
        playerCreatureResources.playerCreatureMP - playerCreatureSpecialCost,
    });
    if (
      moveType === "Poison" ||
      moveType === "Magic" ||
      moveType === "Lifesteal"
    ) {
      // checks for enemy death
      if (
        newLobby.data.enemyHP -
          (playerCreatureSpecial - playerCreatureSpecial * enemyDefense) *
            criticalMultiplier <=
        0
      ) {
        counterRef.current = 0;
        setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
          return {
            ...combatTextAndCombatStatus,
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
        setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
          return {
            ...combatTextAndCombatStatus,
            combatAlert: "Victory!",
          };
        });
        await loadAsyncDataLobby();
        dropMPRewards();
      } else {
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
              newLobby.data.enemyHP -
              (playerCreatureSpecial - playerCreatureSpecial * enemyDefense) *
                criticalMultiplier,
          });
        }
        ref.current = playerCreatureResources.playerCreatureHP;
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
  const grantVictory = async (newLobby) => {
    setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
      return {
        ...combatTextAndCombatStatus,
        battleUndecided: false,
      };
    });
    await Userfront.user.update({
      data: {
        userkey: Userfront.user.data.userkey,
      },
    });
    const newVictors = newLobby.data.victors.filter(
      (victor) => victor !== Userfront.user.userId
    );
    await updateLobby(lobby._id, {
      victors: [newVictors[0]],
    });
    setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
      return {
        ...combatTextAndCombatStatus,
        combatAlert: "Victory!",
      };
    });
    dropMPRewards();
  };

  // checks for previous ally victory and verifies player connection is active
  const checkVictoryAndConnection = (newLobby, newConnections) => {
    if (newLobby.data.victors.includes(Userfront.user.userId)) {
      alert("Ally victory!");
      grantVictory(newLobby);
      return true;
    }
    if (
      newConnections.data.filter(
        (newConnection) => newConnection.userId === Userfront.user.userId
      ).length === 0
    ) {
      alert("Your connection expired in a full battle.");
      dispatch(enableLobbyTimer());
      setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
        return {
          ...combatTextAndCombatStatus,
          battleUndecided: false,
        };
      });
      setIsFighting(false);
      dispatch(disableBattleStatus());
      setTimeout(() => {
        dispatch(disableLobbyTimer());
      }, 3000);
      return true;
    }
    return false;
  };

  // initiates chance to attack enemy creature or heal player creature
  const attackEnemyOrHeal = async (moveName, moveType) => {
    try {
      // if the player and enemy aren't attacking, the battle is undecided
      if (
        !combatTextAndCombatStatus.playerAttackStatus &&
        !combatTextAndCombatStatus.enemyAttackStatus &&
        combatTextAndCombatStatus.battleUndecided &&
        !isFighting
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
        checkPotionTimer(dispatch);
        await loadAsyncDataPlayer();
        const newLobby = await getLobby(lobby._id);
        const newConnections = await getConnections();
        if (checkVictoryAndConnection(newLobby, newConnections)) {
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
            newLobby.data.enemyHP -
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
              moveType,
              newLobby
            );
          }
        } else {
          // checks to see if the player has enough mana to use special
          if (
            playerCreatureResources.playerCreatureMP >=
            playerCreatureSpecialCost
          ) {
            performSpecial(
              chancePlayer,
              playerCreatureSpecial,
              playerCreatureSpecialCost,
              criticalMultiplier,
              enemyDefense,
              moveName,
              moveType,
              newLobby
            );
          } else {
            setCombatTextAndCombatStatus((combatTextAndCombatStatus) => {
              return {
                ...combatTextAndCombatStatus,
                combatAlert: "Not enough MP!",
              };
            });
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
          <div className={combatTextAndCombatStatus.enemyCritText}>
            {combatTextAndCombatStatus.enemyCombatText}
          </div>
        </div>

        {/* displays creature based on attack state */}
        {combatTextAndCombatStatus.playerAttackStatus ? (
          <img
            className={chosenRelic.effectClass}
            src={playerCreature.imgPath.slice(0, -4) + "_attack.png"}
            alt={playerCreature.name}
            width="128px"
            height="128px"
          />
        ) : combatTextAndCombatStatus.enemyAttackStatus ? (
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

        {/* creature control/info panel */}
        <CommonPlayerCreaturePanel
          player={player}
          playerCreatureResources={playerCreatureResources}
          attackEnemy={() =>
            attackEnemyOrHeal(
              playerCreature.attackName,
              playerCreature.attackType
            )
          }
          performSpecial1={() =>
            attackEnemyOrHeal(
              playerCreature.specialName,
              playerCreature.specialType
            )
          }
          performSpecial2={() =>
            attackEnemyOrHeal(
              playerCreature.specialName2,
              playerCreature.specialType2
            )
          }
          loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
        />
      </div>
    </>
  );
}

export default MultiPlayerCreature;
