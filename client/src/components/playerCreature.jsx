import { useRef } from "react";
import { updateUser } from "../services/userServices";
import { getPotionTimer } from "../services/potionTimerServices";
import { potionsList } from "../constants/items";
import { getItem, addItem } from "../services/itemServices";

function PlayerCreature({ summonsStatus, playerCreature, enemyAttackStatus, setEnemyAttackStatus, critText, setCritText, combatText, setCombatText, playerAttackStatus,
    setPlayerAttackStatus, chosenRelic, specialStatus, setSpecialStatus, battleStatus, setBattleStatus, player, creatureStatsStatus, playerCreatureHP, setPlayerCreatureHP,
    playerCreatureMP, setPlayerCreatureMP, enemyCreature, setEnemyCreature, battleUndecided, setBattleUndecided, enemyCreatureHP, setEnemyCreatureHP, Userfront,
    loadAsyncDataPlayer, setCombatAlert, relicsStatus, templeStatus, stagesStatus, alchemyStatus, summonHPBonus, setSummonHPBonus, summonMPBonus, setSummonMPBonus }) {

    // reference hook
    const ref = useRef(null);

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
            await updateUser(player._id, { userfrontId: Userfront.user.userId, preferredSpecial: newSpecial });
            await loadAsyncDataPlayer();
        }
        catch (error) {
            console.log(error);
        }
    }

    // player attack animation
    const playerAttackAnimation = async () => {
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
    const playerAttackCT = async (playerCreatureAttack, criticalMultiplier, enemyDefense) => {
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
    const specialAnimation = async () => {
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
    const playerSpecialCT = async (playerCreatureSpecial, criticalMultiplier, enemyDefense) => {
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
    const playerHealCT = async (playerCreatureSpecial, criticalMultiplier) => {
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
    const enemyAttackAnimation = async () => {
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
    const enemyAttackCT = async (criticalMultiplier, playerCreatureDefense) => {
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
    const enemyCounterAttack = async (chancePlayer, moveName, moveType) => {
        try {
            const playerCreatureSpeed = (playerCreature[0].speed + chosenRelic[0].speedMod) / 100;
            let playerCreatureDefense = (playerCreature[0].defense + chosenRelic[0].defenseMod) / 100;
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
                chanceEnemy = Math.random() >= playerCreatureSpeed - (enemyCreature[0].speed / 100);
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
                    };
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
                    enemyAttackAnimation();
                    enemyAttackCT(criticalMultiplier, playerCreatureDefense);
                }, 600);

                // checks enemy critical hit
                if (Math.random() <= enemyCreature[0].critical / 100) {
                    criticalMultiplier = 1.5;
                }

                //checks for enemy poison move type and crit, then applies effect
                if (enemyCreature[0].attackType === "Poison" && criticalMultiplier === 1) {
                    criticalMultiplier = 1.5;
                }

                // checks for player death, and damages player otherwise
                if (ref.current - ((enemyCreature[0].attack - enemyCreature[0].attack * playerCreatureDefense) * criticalMultiplier) <= 0) {
                    setBattleUndecided(false);
                    setPlayerCreatureHP(0);
                    setCombatAlert("Defeat!");
                    setTimeout(() => {
                        setBattleStatus(false);
                        setEnemyCreature({});
                        setEnemyCreatureHP(0);
                    }, 600);
                } else {
                    setPlayerCreatureHP(ref.current - (enemyCreature[0].attack - enemyCreature[0].attack * playerCreatureDefense) * criticalMultiplier);
                }

            }
        } catch (error) {
            console.log(error);
        }
    }

    // initiates chance to attack enemy creature
    const attackEnemy = async (moveName, moveType) => {
        try {
            // if the player and enemy aren't attacking and the battle is undecided
            if (!playerAttackStatus && !enemyAttackStatus && battleUndecided) {

                // checks and sets potion timer/stats
                const potionTimer = await getPotionTimer()
                // set to potion with same id
                if (potionTimer.data.length > 0) {
                    const playerPotion = potionsList.find(potion => potion.id === potionTimer.data[0].potionId);
                    const playerMPBonus = playerPotion.mpMod;
                    const playerHPBonus = playerPotion.hpMod;
                    setSummonMPBonus(playerMPBonus);
                    setSummonHPBonus(playerHPBonus);
                }
                if (potionTimer.data.length === 0) {
                    setSummonMPBonus(0);
                    setSummonHPBonus(0);
                }

                await loadAsyncDataPlayer();

                const playerCreatureAttack = playerCreature[0].attack + chosenRelic[0].attackMod;
                const playerCreatureSpeed = (playerCreature[0].speed + chosenRelic[0].speedMod) / 100;
                const playerCreatureCritical = (playerCreature[0].critical + chosenRelic[0].criticalMod) / 100;
                let playerCreatureSpecial = playerCreature[0].special + chosenRelic[0].specialMod;
                let playerCreatureSpecialCost = playerCreature[0].specialCost;
                let enemyDefense = enemyCreature[0].defense / 100;
                let chancePlayer = false;
                let criticalMultiplier = 1;

                // assigns preferred player special and cost
                if (player.preferredSpecial === 2) {
                    playerCreatureSpecial = playerCreature[0].special2 + chosenRelic[0].specialMod;
                    playerCreatureSpecialCost = playerCreature[0].specialCost2;
                }

                //checks for player magic move type and applies effect
                if (moveType === "Magic") {
                    enemyDefense = 0;
                }

                // checks for equal player and enemy speed
                if (playerCreatureSpeed === enemyCreature[0].speed / 100) {
                    chancePlayer = Math.random() >= 0.5;
                } else {
                    chancePlayer = Math.random() >= (enemyCreature[0].speed / 100) - playerCreatureSpeed;
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
                    if (enemyCreatureHP - ((playerCreatureAttack - playerCreatureAttack * enemyDefense) * criticalMultiplier) <= 0 && chancePlayer) {
                        setBattleUndecided(false);
                        playerAttackAnimation();
                        playerAttackCT(playerCreatureAttack, criticalMultiplier, enemyDefense);
                        setEnemyCreatureHP(0);
                        setCombatAlert("Victory!");
                        await Userfront.user.update({
                            data: {
                                userkey: Userfront.user.data.userkey,
                            },
                        });
                        await updateUser(player._id, {
                            userfrontId: Userfront.user.userId, experience: player.experience + enemyCreature[0].reward * 2,
                            drachmas: player.drachmas + enemyCreature[0].reward
                        });
                        // retrieves items
                        const playerItemsData = await getItem();
                        const playerItems = playerItemsData.data;
                        // filter for ingredients
                        const greenMushroomsPlayer = playerItems.filter(item => item.itemId === 1 && item.type === "Ingredient");
                        const redMushroomsPlayer = playerItems.filter(item => item.itemId === 2 && item.type === "Ingredient");
                        const blueMushroomsPlayer = playerItems.filter(item => item.itemId === 3 && item.type === "Ingredient");

                        // drops mushrooms on chance
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
                                    itemQuantity: newGreenMushrooms === undefined ? 1 : newGreenMushrooms.itemQuantity + 1,
                                    userId: Userfront.user.userId,
                                })
                            } else

                                if (Math.random() <= 0.1) {

                                    if (Math.random() <= 0.5) {
                                        await Userfront.user.update({
                                            data: {
                                                userkey: Userfront.user.data.userkey,
                                            },
                                        });
                                        await addItem({
                                            itemId: 2,
                                            type: "Ingredient",
                                            itemQuantity: newRedMushrooms === undefined ? 1 : newRedMushrooms.itemQuantity + 1,
                                            userId: Userfront.user.userId,
                                        })
                                    } else {
                                        await Userfront.user.update({
                                            data: {
                                                userkey: Userfront.user.data.userkey,
                                            },
                                        });
                                        await addItem({
                                            itemId: 3,
                                            type: "Ingredient",
                                            itemQuantity: newBlueMushrooms === undefined ? 1 : newBlueMushrooms.itemQuantity + 1,
                                            userId: Userfront.user.userId,
                                        })
                                    }

                                }

                        }

                        setTimeout(() => {
                            setBattleStatus(false);
                            setEnemyCreature({});
                            setPlayerCreatureHP(0);
                            loadAsyncDataPlayer();
                        }, 1000);
                    } else {

                        // damages enemy
                        if (chancePlayer) {
                            playerAttackAnimation();
                            playerAttackCT(playerCreatureAttack, criticalMultiplier, enemyDefense);
                            setEnemyCreatureHP(enemyCreatureHP - (playerCreatureAttack - playerCreatureAttack * enemyDefense) * criticalMultiplier);
                        }

                        ref.current = playerCreatureHP;
                        enemyCounterAttack(chancePlayer, moveName, moveType);
                    }

                    if (playerCreatureMP !== (playerCreature[0].mp + chosenRelic[0].mpMod + summonMPBonus) && (playerCreatureMP + playerCreature[0].mpRegen + chosenRelic[0].mpRegenMod)
                        <= (playerCreature[0].mp + chosenRelic[0].mpMod + summonMPBonus)) {
                        setPlayerCreatureMP(playerCreatureMP + playerCreature[0].mpRegen + chosenRelic[0].mpRegenMod);
                    }
                    if ((playerCreatureMP + playerCreature[0].mpRegen + chosenRelic[0].mpRegenMod) > playerCreature[0].mp + chosenRelic.mpMod + summonMPBonus) {
                        setPlayerCreatureMP(playerCreature[0].mp + chosenRelic[0].mpMod + summonMPBonus);
                    }

                } else {

                    // checks to see if the player has enough mana to use special attack
                    if (playerCreatureMP >= playerCreatureSpecialCost) {
                        //deducts MP
                        setPlayerCreatureMP(playerCreatureMP - playerCreatureSpecialCost);

                        if (moveType === "Poison" || moveType === "Magic" || moveType === "Lifesteal") {

                            // checks for enemy death
                            if (enemyCreatureHP - ((playerCreatureSpecial - playerCreatureSpecial * enemyDefense) * criticalMultiplier) <= 0 && chancePlayer) {
                                setBattleUndecided(false);
                                playerAttackAnimation();
                                specialAnimation();
                                playerSpecialCT(playerCreatureSpecial, criticalMultiplier, enemyDefense);
                                setEnemyCreatureHP(0);
                                setCombatAlert("Victory!");
                                await Userfront.user.update({
                                    data: {
                                        userkey: Userfront.user.data.userkey,
                                    },
                                });
                                await updateUser(player._id, {
                                    userfrontId: Userfront.user.userId, experience: player.experience + enemyCreature[0].reward * 2,
                                    drachmas: player.drachmas + enemyCreature[0].reward
                                });
                                // retrieves items
                                const playerItemsData = await getItem();
                                const playerItems = playerItemsData.data;
                                // filter for ingredients
                                const greenMushroomsPlayer = playerItems.filter(item => item.itemId === 1 && item.type === "Ingredient");
                                const redMushroomsPlayer = playerItems.filter(item => item.itemId === 2 && item.type === "Ingredient");
                                const blueMushroomsPlayer = playerItems.filter(item => item.itemId === 3 && item.type === "Ingredient");

                                // drops mushrooms on chance
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
                                            itemQuantity: newGreenMushrooms === undefined ? 1 : newGreenMushrooms.itemQuantity + 1,
                                            userId: Userfront.user.userId,
                                        })
                                    } else
                                        if (Math.random() <= 0.1) {
                                            if (Math.random() <= 0.5) {
                                                await Userfront.user.update({
                                                    data: {
                                                        userkey: Userfront.user.data.userkey,
                                                    },
                                                });
                                                await addItem({
                                                    itemId: 2,
                                                    type: "Ingredient",
                                                    itemQuantity: newRedMushrooms === undefined ? 1 : newRedMushrooms.itemQuantity + 1,
                                                    userId: Userfront.user.userId,
                                                })
                                            } else {
                                                await Userfront.user.update({
                                                    data: {
                                                        userkey: Userfront.user.data.userkey,
                                                    },
                                                });
                                                await addItem({
                                                    itemId: 3,
                                                    type: "Ingredient",
                                                    itemQuantity: newBlueMushrooms === undefined ? 1 : newBlueMushrooms.itemQuantity + 1,
                                                    userId: Userfront.user.userId,
                                                })
                                            }
                                        }
                                }

                                setTimeout(() => {
                                    setBattleStatus(false);
                                    setEnemyCreature({});
                                    setPlayerCreatureHP(0);
                                    loadAsyncDataPlayer();
                                }, 1000);

                            } else {

                                // damages enemy
                                if (chancePlayer) {
                                    playerAttackAnimation();
                                    playerSpecialCT(playerCreatureSpecial, criticalMultiplier, enemyDefense);
                                    specialAnimation();
                                    setEnemyCreatureHP(enemyCreatureHP - (playerCreatureSpecial - playerCreatureSpecial * enemyDefense) * criticalMultiplier);
                                }

                                ref.current = playerCreatureHP;

                                //life steal to player
                                if (moveType === "Lifesteal") {

                                    if (playerCreatureHP + ((playerCreatureSpecial * criticalMultiplier) * 0.2) > playerCreature[0].hp + chosenRelic[0].hpMod + summonHPBonus) {
                                        setPlayerCreatureHP(playerCreature[0].hp + chosenRelic[0].hpMod + summonHPBonus);
                                        ref.current = playerCreature[0].hp + chosenRelic[0].hpMod + summonHPBonus;
                                    } else {
                                        setPlayerCreatureHP(playerCreatureHP + ((playerCreatureSpecial * criticalMultiplier) * 0.2));
                                        ref.current = playerCreatureHP + ((playerCreatureSpecial * criticalMultiplier) * 0.2);
                                    }

                                }

                                enemyCounterAttack(chancePlayer, moveName, moveType);
                            }

                        } else {

                            // heals player
                            if (chancePlayer) {
                                playerHealCT(playerCreatureSpecial, criticalMultiplier);
                                specialAnimation();

                                if (playerCreatureHP + playerCreatureSpecial * criticalMultiplier > playerCreature[0].hp + chosenRelic[0].hpMod + summonHPBonus) {
                                    setPlayerCreatureHP(playerCreature[0].hp + chosenRelic[0].hpMod + summonHPBonus);
                                    ref.current = playerCreature[0].hp + chosenRelic[0].hpMod + summonHPBonus;
                                } else {
                                    setPlayerCreatureHP(playerCreatureHP + playerCreatureSpecial * criticalMultiplier);
                                    ref.current = playerCreatureHP + playerCreatureSpecial * criticalMultiplier;
                                }

                                enemyCounterAttack(chancePlayer, moveName, moveType);

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
        {!summonsStatus && !relicsStatus && !templeStatus && !stagesStatus && !alchemyStatus ? <>
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
                        {specialStatus ? <div className="special_effect_container">{player.preferredSpecial === 1 ? <div className={creature.specialEffect} /> :
                            <div className={creature.specialEffect2} />} </div> : null}
                        {!battleStatus ? <button className="game_button_small margin_small" onClick={() => { toggleSpecial() }} > Special: {player.preferredSpecial} </button> : null}
                        <div className="creature_panel">
                            {battleStatus ? <div className="inline_flex">
                                <button className="game_button attack_button" onClick={() => { attackEnemy(creature.attackName, creature.attackType) }}>{creature.attackName}</button>
                                {player.preferredSpecial === 1 ?
                                    <button className="game_button special_button" onClick={() => { attackEnemy(creature.specialName, creature.specialType) }}>{creature.specialName}<br />
                                        Cost: {creature.specialCost} MP</button> :
                                    <button className="game_button special_button" onClick={() => { attackEnemy(creature.specialName2, creature.specialType2) }}>{creature.specialName2}<br />
                                        Cost: {creature.specialCost2} MP</button>}</div> : null}
                            <h4>{player.name}'s {creature.name}</h4>
                            {battleStatus ? <div className="progress_bar_container">
                                <div className="progress_bar"
                                    style={{ width: ((playerCreatureHP / (playerCreature[0].hp + chosenRelic[0].hpMod + summonHPBonus))) * 100 + "%" }} />
                            </div>
                                : null}
                            {!battleStatus ?
                                <div className="inline_flex"><h5>HP: {creature.hp + chosenRelic[0].hpMod + summonHPBonus}</h5>&nbsp;|&nbsp;<h5>MP: {creature.mp + chosenRelic[0].mpMod
                                    + summonMPBonus}</h5></div>
                                : <div className="inline_flex">
                                    <h5>HP: {playerCreatureHP} / {creature.hp + chosenRelic[0].hpMod + summonHPBonus}</h5>&nbsp;|&nbsp;
                                    <h5>MP: {playerCreatureMP} / {creature.mp + chosenRelic[0].mpMod + summonMPBonus}</h5></div>}
                            {creatureStatsStatus ?
                                <div>
                                    <h5>Attack: {creature.attack + chosenRelic[0].attackMod} | Type: {creature.attackType}</h5>
                                    {player.preferredSpecial === 1 ? <h5>Special: {creature.special + chosenRelic[0].specialMod} | Type: {creature.specialType} | {creature.specialCost} </h5> :
                                        <h5>Special: {creature.special2 + chosenRelic[0].specialMod} | Type: {creature.specialType2} | {creature.specialCost2} </h5>}
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

export default PlayerCreature;