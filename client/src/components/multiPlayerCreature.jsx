import { useRef } from "react";
import { updateUser } from "../services/userServices";
import { updateLobby } from "../services/lobbyServices";

function MultiPlayerCreature({ summonsStatus, playerCreature, enemyAttackStatus, setEnemyAttackStatus, critText, setCritText, combatText, setCombatText, playerAttackStatus,
    setPlayerAttackStatus, chosenRelic, specialStatus, setSpecialStatus, battleStatus, setBattleStatus, player, creatureStatsStatus, playerCreatureHP, setPlayerCreatureHP,
    playerCreatureMP, setPlayerCreatureMP, enemyCreature, setEnemyCreature, battleUndecided, setBattleUndecided, Userfront, loadAsyncDataPlayer, setCombatAlert, lobby,
    loadAsyncDataLobby }) {

    // reference hook
    const ref = useRef(null);

    // player attack animation
    const playerAttackAnimation = () => {
        try {
            setPlayerAttackStatus(true);
            setTimeout(() => {
                setPlayerAttackStatus(false);
            }, 500);
        } catch (error) {
            console.log(error);
        }
    }

    // player attack Combat Text animation
    const playerAttackCT = (playerCreatureAttack, criticalMultiplier, enemyDefense) => {
        try {
            if (criticalMultiplier > 1) {
                setCritText("crit_text");
            }
            setCombatText((playerCreatureAttack - playerCreatureAttack * enemyDefense) * criticalMultiplier)
            setTimeout(() => {
                setCombatText("");
                setCritText("combat_text");
            }, 500);
        } catch (error) {
            console.log(error);
        }
    }

    // special animation
    const specialAnimation = () => {
        try {
            setSpecialStatus(true);
            setTimeout(() => {
                setSpecialStatus(false);
            }, 500);
        } catch (error) {
            console.log(error);
        }
    }

    // player special Combat Text animation
    const playerSpecialCT = (playerCreatureSpecial, criticalMultiplier, enemyDefense) => {
        try {
            if (criticalMultiplier > 1) {
                setCritText("crit_text");
            }
            setCombatText((playerCreatureSpecial - playerCreatureSpecial * enemyDefense) * criticalMultiplier)
            setTimeout(() => {
                setCombatText("");
                setCritText("combat_text");
            }, 500);
        } catch (error) {
            console.log(error);
        }
    }

    // player healing Combat Text animation
    const playerHealCT = (playerCreatureSpecial, criticalMultiplier) => {
        try {
            setCritText("heal_combat_text");
            if (criticalMultiplier > 1) {
                setCritText("heal_crit_text");
            }
            setCombatText((playerCreatureSpecial * criticalMultiplier));
            setTimeout(() => {
                setCombatText("");
                setCritText("combat_text");
            }, 500);
        } catch (error) {
            console.log(error);
        }
    }

    // enemy attack animation
    const enemyAttackAnimation = () => {
        try {
            setEnemyAttackStatus(true);
            setTimeout(() => {
                setEnemyAttackStatus(false);
            }, 500);
        } catch (error) {
            console.log(error);
        }
    }

    // enemy attack Combat Text animation
    const enemyAttackCT = (criticalMultiplier, playerCreatureDefense) => {
        try {
            if (criticalMultiplier > 1) {
                setCritText("crit_text");
            }
            setCombatText((enemyCreature[0].attack - enemyCreature[0].attack * playerCreatureDefense) * criticalMultiplier)
            setTimeout(() => {
                setCombatText("");
                setCritText("combat_text");
            }, 500);
        } catch (error) {
            console.log(error);
        }
    }

    // initiates chance of enemy counter attack
    const enemyCounterAttack = (chancePlayer, moveName, moveType) => {
        try {
            const playerCreatureSpeed = (playerCreature[0].speed + chosenRelic[0].speedMod) / 100;
            var playerCreatureDefense = (playerCreature[0].defense + chosenRelic[0].defenseMod) / 100;
            var criticalMultiplier = 1;
            var chanceEnemy = false;

            // checks for attack type
            if (enemyCreature[0].attackType === "Magic") {
                playerCreatureDefense = 0;
            }
            // checks for equal player and enemy speed
            if (enemyCreature[0].speed / 100 === playerCreatureSpeed) {
                chanceEnemy = Math.random() >= 0.5;
            } else {
                chanceEnemy = Math.random() >= playerCreatureSpeed - enemyCreature[0].speed / 100;
            }
            // series of checks for enemy counter attack based on speed
            if (!chanceEnemy && chancePlayer) {
                setTimeout(() => {
                    setCombatAlert("Enemy was too slow!");
                }, 250);
            }
            if (!chanceEnemy && !chancePlayer) {
                attackEnemy(moveName, moveType);
            }
            if (chanceEnemy && chancePlayer) {
                setTimeout(() => {
                    setCombatAlert("The battle continues...");
                }, 500);
            }
            // checks for player speed failure
            if (chanceEnemy && !chancePlayer) {
                setTimeout(() => {
                    setCombatAlert("Your summon was too slow!");
                }, 250);
            }
            if (battleStatus && chanceEnemy) {
                setTimeout(() => {
                    enemyAttackAnimation();
                }, 500);

                // checks enemy critical hit
                if (Math.random() <= enemyCreature[0].critical / 100) {
                    criticalMultiplier = 1.5;
                }

                //checks for player poison move type and crit, then applies effect
                if (enemyCreature[0].attackType === "Poison" && criticalMultiplier === 1) {
                    criticalMultiplier = 1.5;
                }

                // checks for player death, and damages player otherwise
                if (ref.current - ((enemyCreature[0].attack - enemyCreature[0].attack * playerCreatureDefense) * criticalMultiplier) <= 0) {
                    setBattleUndecided(false);
                    setTimeout(() => {
                        enemyAttackCT(criticalMultiplier, playerCreatureDefense);
                        setPlayerCreatureHP(0);
                        setCombatAlert("Defeat!");
                    }, 750);
                    setTimeout(() => {
                        setBattleStatus(false);
                        setEnemyCreature({});

                    }, 2750);
                } else {
                    setTimeout(() => {
                        enemyAttackCT(criticalMultiplier, playerCreatureDefense);
                        setPlayerCreatureHP(ref.current - (enemyCreature[0].attack - enemyCreature[0].attack * playerCreatureDefense) * criticalMultiplier);
                    }, 750);
                }

            }
        } catch (error) {
            console.log(error);
        }
    }

    // initiates chance to attack enemy creature
    const attackEnemy = (moveName, moveType) => {
        try {
            // if the player and enemy aren't attacking and the battle is undecided
            if (!playerAttackStatus && !enemyAttackStatus && battleUndecided) {

                // update userkey and lobby
                Userfront.user.update({
                    data: {
                        userkey: Userfront.user.data.userkey,
                    },
                });

                loadAsyncDataLobby();

                const playerCreatureAttack = playerCreature[0].attack + chosenRelic[0].attackMod;
                const playerCreatureSpeed = (playerCreature[0].speed + chosenRelic[0].speedMod) / 100;
                const playerCreatureCritical = (playerCreature[0].critical + chosenRelic[0].criticalMod) / 100;
                const playerCreatureSpecial = playerCreature[0].special + chosenRelic[0].specialMod;
                var enemyDefense = enemyCreature[0].defense / 100;
                var chancePlayer = false;
                var criticalMultiplier = 1;

                //checks for player magic move type and applies effect
                if (moveType === "Magic") {
                    enemyDefense = 0;
                }

                // checks for equal player and enemy speed
                if (playerCreatureSpeed === enemyCreature[0].speed / 100) {
                    chancePlayer = Math.random() >= 0.5;
                } else {
                    chancePlayer = Math.random() >= enemyCreature[0].speed / 100 - playerCreatureSpeed;
                }

                // checks for player critical hit
                if (Math.random() <= playerCreatureCritical) {
                    criticalMultiplier = 1.5;
                }

                //checks for player poison move type and crit, then applies effect
                if (moveType === "Poison" && criticalMultiplier === 1) {
                    criticalMultiplier = 1.5;
                }

                // if the player's attack is regular
                if (moveName === playerCreature[0].attackName) {

                    // checks for enemy death
                    if (lobby.enemyHP - ((playerCreatureAttack - playerCreatureAttack * enemyDefense) * criticalMultiplier) <= 0) {
                        setBattleUndecided(false);
                        playerAttackAnimation();
                        playerAttackCT(playerCreatureAttack, criticalMultiplier, enemyDefense);
                        setTimeout(() => {
                            Userfront.user.update({
                                data: {
                                    userkey: Userfront.user.data.userkey,
                                },
                            });
                            updateLobby("622d65844b65e9ce035febad", { enemyHP: 0 });
                            setCombatAlert("Victory!");
                            Userfront.user.update({
                                data: {
                                    userkey: Userfront.user.data.userkey,
                                },
                            });
                            updateUser(player._id, {
                                userfrontId: Userfront.user.userId, experience: player.experience + enemyCreature[0].reward * 2,
                                drachmas: player.drachmas + enemyCreature[0].reward
                            });
                        }, 250);
                        setTimeout(() => {
                            setBattleStatus(false);
                            setEnemyCreature({});
                            setPlayerCreatureHP(0);
                        }, 2250);
                        setTimeout(() => {
                            loadAsyncDataLobby();
                            loadAsyncDataPlayer();
                        }, 2250);
                    } else {

                        // damages enemy
                        if (chancePlayer) {
                            playerAttackAnimation();
                            playerAttackCT(playerCreatureAttack, criticalMultiplier, enemyDefense);
                            setTimeout(() => {
                                Userfront.user.update({
                                    data: {
                                        userkey: Userfront.user.data.userkey,
                                    },
                                });
                                updateLobby("622d65844b65e9ce035febad", { enemyHP: lobby.enemyHP - (playerCreatureAttack - playerCreatureAttack * enemyDefense) * criticalMultiplier });
                                loadAsyncDataLobby();
                            }, 250);
                        }

                        ref.current = playerCreatureHP;
                        enemyCounterAttack(chancePlayer, moveName, moveType);
                    }

                    setTimeout(() => {
                        if (playerCreatureMP !== (playerCreature[0].mp + chosenRelic[0].mpMod) && (playerCreatureMP + playerCreature[0].mpRegen + chosenRelic[0].mpRegenMod)
                            <= (playerCreature[0].mp + chosenRelic[0].mpMod)) {
                            setPlayerCreatureMP(playerCreatureMP + playerCreature[0].mpRegen + chosenRelic[0].mpRegenMod);
                        }

                        if ((playerCreatureMP + playerCreature[0].mpRegen) > playerCreature[0].mp) {
                            setPlayerCreatureMP(playerCreature[0].mp + chosenRelic[0].mpMod);
                        }
                    }, 500);
                } else {

                    // checks to see if the player has enough mana to use special attack
                    if (playerCreatureMP >= playerCreature[0].specialCost) {
                        //deducts MP
                        setPlayerCreatureMP(playerCreatureMP - playerCreature[0].specialCost);

                        if (moveType !== "Heal") {

                            // checks for enemy death
                            if (lobby.enemyHP - ((playerCreatureSpecial - playerCreatureSpecial * enemyDefense) * criticalMultiplier) <= 0) {
                                setBattleUndecided(false);
                                playerAttackAnimation();
                                specialAnimation();
                                playerSpecialCT(playerCreatureSpecial, criticalMultiplier, enemyDefense);
                                setTimeout(() => {
                                    Userfront.user.update({
                                        data: {
                                            userkey: Userfront.user.data.userkey,
                                        },
                                    });
                                    updateLobby("622d65844b65e9ce035febad", { enemyHP: 0 });
                                    setCombatAlert("Victory!");
                                    Userfront.user.update({
                                        data: {
                                            userkey: Userfront.user.data.userkey,
                                        },
                                    });
                                    updateUser(player._id, {
                                        userfrontId: Userfront.user.userId, experience: player.experience + enemyCreature[0].reward * 2,
                                        drachmas: player.drachmas + enemyCreature[0].reward
                                    });
                                }, 250);
                                setTimeout(() => {
                                    setBattleStatus(false);
                                    setEnemyCreature({});
                                    setPlayerCreatureHP(0);
                                }, 2250);
                                setTimeout(() => {
                                    loadAsyncDataLobby();
                                    loadAsyncDataPlayer();
                                }, 2250);
                            } else {

                                // damages enemy
                                if (chancePlayer) {
                                    playerAttackAnimation();
                                    playerSpecialCT(playerCreatureSpecial, criticalMultiplier, enemyDefense);
                                    specialAnimation();
                                    setTimeout(() => {
                                        Userfront.user.update({
                                            data: {
                                                userkey: Userfront.user.data.userkey,
                                            },
                                        });
                                        updateLobby("622d65844b65e9ce035febad", {
                                            enemyHP:
                                                lobby.enemyHP - (playerCreatureSpecial - playerCreatureSpecial * enemyDefense) * criticalMultiplier
                                        });
                                        loadAsyncDataLobby();
                                    }, 250);
                                }

                                ref.current = playerCreatureHP;
                                enemyCounterAttack(chancePlayer, moveName, moveType);
                            }

                        } else {

                            // heals player
                            if (chancePlayer) {
                                playerHealCT(playerCreatureSpecial, criticalMultiplier);
                                specialAnimation();
                                setTimeout(() => {

                                    if (playerCreatureHP + playerCreatureSpecial * criticalMultiplier > playerCreature[0].hp + chosenRelic[0].hpMod) {
                                        setPlayerCreatureHP(playerCreature[0].hp + chosenRelic[0].hpMod);
                                        ref.current = playerCreature[0].hp + chosenRelic[0].hpMod;
                                    } else {
                                        setPlayerCreatureHP(playerCreatureHP + playerCreatureSpecial * criticalMultiplier);
                                        ref.current = playerCreatureHP + playerCreatureSpecial * criticalMultiplier;
                                    }

                                    enemyCounterAttack(chancePlayer, moveName, moveType);

                                }, 250)
                            } else {
                                ref.current = playerCreatureHP;

                                enemyCounterAttack(chancePlayer, moveName, moveType);

                            }

                        }

                    } else {
                        setCombatAlert("Not enough MP!");
                    }

                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (<>
        {!summonsStatus ? <>
            <div className="player_creature">
                {playerCreature.map((creature) => (
                    <div
                        key={creature.id}
                    >
                        {enemyAttackStatus || critText === "heal_crit_text" || critText === "heal_combat_text" ? <div className="special_effect_container">
                            <div className={critText}>{combatText}</div></div> : null}
                        {playerAttackStatus
                            ? <img className={chosenRelic[0].effectClass}
                                src={creature.imgPath.slice(0, -4) + "_attack.png"}
                                alt={creature.name}
                                width="128px"
                                height="128px" />
                            : enemyAttackStatus
                                ? <img className={chosenRelic[0].effectClass}
                                    src={creature.imgPath.slice(0, -4) + "_hurt.png"}
                                    alt={creature.name}
                                    width="128px"
                                    height="128px" />
                                : <img className={chosenRelic[0].effectClass}
                                    src={creature.imgPath}
                                    alt={creature.name}
                                    width="128px"
                                    height="128px" />
                        }
                        {specialStatus ? <div className="special_effect_container"><div className={creature.specialEffect} /></div> : null}
                        <div className="creature_panel">
                            {battleStatus ? <div className="inline_flex">
                                <button className="game_button attack_button" onClick={() => { attackEnemy(creature.attackName, creature.attackType) }}>{creature.attackName}</button>
                                <button className="game_button special_button" onClick={() => { attackEnemy(creature.specialName, creature.specialType) }}>{creature.specialName}<br />
                                    Cost: {creature.specialCost} MP</button></div> : null}
                            <h4>{player.name}'s {creature.name}</h4>
                            {battleStatus ? <div className="progress_bar_container">
                                <div className="progress_bar"
                                    style={{ width: ((playerCreatureHP / (playerCreature[0].hp + chosenRelic[0].hpMod))) * 100 + "%" }} />
                            </div>
                                : null}
                            {!battleStatus ?
                                <div className="inline_flex"><h5>HP: {creature.hp + chosenRelic[0].hpMod}</h5>&nbsp;|&nbsp;<h5>MP: {creature.mp + chosenRelic[0].mpMod}</h5></div>
                                : <div className="inline_flex">
                                    <h5>HP: {playerCreatureHP} / {creature.hp + chosenRelic[0].hpMod}</h5>&nbsp;|&nbsp;
                                    <h5>MP: {playerCreatureMP} / {creature.mp + chosenRelic[0].mpMod}</h5></div>}
                            {creatureStatsStatus ?
                                <div>
                                    <h5>Attack: {creature.attack + chosenRelic[0].attackMod} | Type: {creature.attackType}</h5>
                                    <h5>Special: {creature.special + chosenRelic[0].specialMod} | Type: {creature.specialType}</h5>
                                    <h5>MP Regen: {creature.mpRegen + chosenRelic[0].mpRegenMod} | Speed: {creature.speed + chosenRelic[0].speedMod}</h5>
                                    <h5>Critical: {creature.critical + chosenRelic[0].criticalMod}% | Defense: {creature.defense + chosenRelic[0].defenseMod}%</h5>
                                </div>
                                : null}
                        </div>
                    </div>
                ))}
            </div>
        </> : null}
    </>
    );
}

export default MultiPlayerCreature;