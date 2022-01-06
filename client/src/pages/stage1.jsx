import React, { useEffect, useState } from "react";
import '../App.scss';
import "./stage1.scss";
import Userfront from "@userfront/core";
import { useNavigate } from "react-router-dom";
import { getUser, updateUser } from '../services/userServices';
import GameNav from '../components/gameNav';
import Options from "../components/options";
import Player from "../components/player";
import Menu from "../components/menu";
import PlayerCreature from "../components/playerCreature";
import EnemyCreature from "../components/enemyCreature";
import creatures from "../constants/creatures";
import relics from "../constants/relics";

// initialize Userfront
Userfront.init("rbvqd5nd");

// main app component
function Stage1() {

    // navigation hook
    const navigate = useNavigate();

    // sets player state
    const [player, setPlayer] = useState({});
    // sets player options states
    const [optionsStatus, setOptionsStatus] = useState(false);
    const [avatarOptionStatus, setAvatarOptionStatus] = useState(false);
    const [nameOptionStatus, setNameOptionStatus] = useState(false);
    // sets relics, temple, and summons state
    const [relicsStatus, setRelicsStatus] = useState(false);
    const [templeStatus, setTempleStatus] = useState(false);
    const [summonsStatus, setSummonsStatus] = useState(false);
    const [stagesStatus, setStagesStatus] = useState(false);
    // sets creatures state
    const [creatureData] = useState(creatures);
    // sets player creature state
    const [playerCreature, setPlayerCreature] = useState({});
    // sets creature stats state
    const [creatureStatsStatus, setCreatureStatsStatus] = useState(false);
    // sets battle and enemy creature state
    const [battleStatus, setBattleStatus] = useState(false);
    const [enemyCreature, setEnemyCreature] = useState({});
    // sets player and enemy creature attack state
    const [playerAttackStatus, setPlayerAttackStatus] = useState(false);
    const [enemyAttackStatus, setEnemyAttackStatus] = useState(false);
    // sets special status state
    const [specialStatus, setSpecialStatus] = useState(false);
    // sets player and enemy creature hp state
    const [playerCreatureHP, setPlayerCreatureHP] = useState(0);
    const [enemyCreatureHP, setEnemyCreatureHP] = useState(0);
    // sets player creature MP state
    const [playerCreatureMP, setPlayerCreatureMP] = useState(0);
    // sets relics state
    const [relicsData] = useState(relics);
    // sets player relics state
    const [playerRelics, setPlayerRelics] = useState([{}]);
    // sets chosen relic state
    const [chosenRelic, setChosenRelic] = useState({});
    // sets combat alert state
    const [combatAlert, setCombatAlert] = useState("");
    // sets battle decision state
    const [battleUndecided, setBattleUndecided] = useState(false);
    // sets combat text state
    const [combatText, setCombatText] = useState("");
    // sets crit text state
    const [critText, setCritText] = useState("combat_text");

    useEffect(() => {
        // checks for userfront authentication and redirects visitor if not authenticated
        const checkAuth = () => {
            try {
                if (!Userfront.accessToken()) {
                    navigate('/');
                }
            } catch (error) {
                console.log(error);
            }
        }
        checkAuth();
    });

    useEffect(() => {
        // checks for userkey and logs user out if none is found
        const genDataPlayer = () => {
            try {
                // if there is no user key
                if (Userfront.user.data.userkey === undefined) {
                    Userfront.logout();
                }
            } catch (error) {
                console.log(error);
            }
        }
        // retrieves user data and updates player state
        const loadAsyncDataPlayer = async () => {
            try {
                const { data } = await getUser();
                setPlayer(data);
            } catch (error) {
                console.log(error);
            }
        }
        genDataPlayer();
        loadAsyncDataPlayer();
    }, []);

    useEffect(() => {
        // if there is a player
        if (player) {
            try {
                // loads player creature data and sets player creature state
                const loadDataPlayerCreature = () => {
                    const playerCreatureData = creatureData.filter(creature => creature.id === player.creatureId);
                    setPlayerCreature(playerCreatureData);
                    setCreatureStatsStatus(player.displayCreatureStats);
                }
                loadDataPlayerCreature();
            } catch (error) {
                console.log(error);
            }
            try {
                // if there are player relics
                if (player.relics) {
                    // loads player relics data
                    const loadDataPlayerRelics = () => {
                        const playerRelicsData = relicsData.filter(relic => player.relics.includes(relic.id));
                        setPlayerRelics(playerRelicsData);
                        const chosenRelicData = playerRelicsData.filter(relic => relic.id === player.chosenRelic);
                        setChosenRelic(chosenRelicData);
                    }
                    loadDataPlayerRelics();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }, [player, relicsData, creatureData]);

    // retrieves user data and updates player state
    const loadAsyncDataPlayer = async () => {
        try {
            const { data } = await getUser();
            setPlayer(data);
        } catch (error) {
            console.log(error);
        }
    }

    // toggles display creature stats in database
    const toggleDisplayCreatureStats = async () => {
        try {
            Userfront.user.update({
                data: {
                    userkey: Userfront.user.data.userkey,
                },
            });
            await updateUser(player._id, { userfrontId: Userfront.user.userId, displayCreatureStats: !creatureStatsStatus });
            await loadAsyncDataPlayer();
        }
        catch (error) {
            console.log(error);
        }
    }

    // updates player avatar path in database
    const selectAvatar = async (avatarPath) => {
        try {
            Userfront.user.update({
                data: {
                    userkey: Userfront.user.data.userkey,
                },
            });
            await updateUser(player._id, { userfrontId: Userfront.user.userId, avatarPath: avatarPath });
            await loadAsyncDataPlayer();
        }
        catch (error) {
            console.log(error);
        }
    }

    // updates player name in database
    const selectName = async (e) => {
        try {
            Userfront.user.update({
                data: {
                    userkey: Userfront.user.data.userkey,
                },
            });
            await updateUser(player._id, { userfrontId: Userfront.user.userId, name: e });
            await loadAsyncDataPlayer();
        }
        catch (error) {
            console.log(error);
        }
    }

    // updates player chosen relic in database
    const selectRelic = async (relicId) => {
        try {
            Userfront.user.update({
                data: {
                    userkey: Userfront.user.data.userkey,
                },
            });
            await updateUser(player._id, { userfrontId: Userfront.user.userId, chosenRelic: relicId });
            await loadAsyncDataPlayer();
        }
        catch (error) {
            console.log(error);
        }
    }

    // updates player relics in database
    const buyRelic = async (relicId, relicPrice) => {
        try {
            // if the player can afford the relic and doesn't own it
            if (player.drachmas >= relicPrice && !player.relics.includes(relicId)) {
                if (window.confirm(`Are you sure you want to buy this relic? It will cost ${relicPrice} drachmas.`)) {
                    Userfront.user.update({
                        data: {
                            userkey: Userfront.user.data.userkey,
                        },
                    });
                    await updateUser(player._id, { userfrontId: Userfront.user.userId, drachmas: player.drachmas - relicPrice, relics: [...player.relics, relicId] });
                    await loadAsyncDataPlayer();
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // swaps player creature in database
    const swapCreature = async (creatureId, creaturePrice) => {
        try {
            // if the player can afford the creature and isn't already using it
            if (player.experience >= creaturePrice && player.creatureId !== creatureId) {
                if (window.confirm(`Are you sure you want to swap your creature for this one? It will cost ${creaturePrice} experience.`)) {
                    Userfront.user.update({
                        data: {
                            userkey: Userfront.user.data.userkey,
                        },
                    });
                    await updateUser(player._id, { userfrontId: Userfront.user.userId, experience: player.experience - creaturePrice, creatureId: creatureId });
                    await loadAsyncDataPlayer();
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // loads battle data
    const loadDataBattle = () => {
        try {
            setPlayerCreatureHP(playerCreature[0].hp + chosenRelic[0].hpMod);
            setPlayerCreatureMP(playerCreature[0].mp + chosenRelic[0].mpMod);
            const enemyCreatureData = [creatureData[Math.floor(Math.random() * creatureData.length)]];
            setEnemyCreature(enemyCreatureData);
            setEnemyCreatureHP(enemyCreatureData[0].hp);
            setCombatAlert("The battle has begun!");
            setBattleStatus(true);
            setBattleUndecided(true);
        }
        catch (error) {
            console.log(error);
        }
    }

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
    const enemyCounterAttack = (chancePlayer, moveName) => {
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
                attackEnemy(moveName);
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
                if (playerCreatureHP - ((enemyCreature[0].attack - enemyCreature[0].attack * playerCreatureDefense) * criticalMultiplier) <= 0) {
                    setBattleUndecided(false);
                    setTimeout(() => {
                        enemyAttackCT(criticalMultiplier, playerCreatureDefense);
                        setPlayerCreatureHP(0);
                        setCombatAlert("Defeat!");
                    }, 750);
                    setTimeout(() => {
                        setBattleStatus(false);
                        setEnemyCreature({});
                        setEnemyCreatureHP(0);
                    }, 2750);
                } else {
                    setTimeout(() => {
                        enemyAttackCT(criticalMultiplier, playerCreatureDefense);
                        setPlayerCreatureHP(playerCreatureHP - (enemyCreature[0].attack - enemyCreature[0].attack * playerCreatureDefense) * criticalMultiplier);
                    }, 750);
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
                    if (enemyCreatureHP - ((playerCreatureAttack - playerCreatureAttack * enemyDefense) * criticalMultiplier) <= 0 && chancePlayer) {
                        setBattleUndecided(false);
                        playerAttackAnimation();
                        playerAttackCT(playerCreatureAttack, criticalMultiplier, enemyDefense);
                        await setTimeout(() => {
                            setEnemyCreatureHP(0);
                            setCombatAlert("Victory!");
                            Userfront.user.update({
                                data: {
                                    userkey: Userfront.user.data.userkey,
                                },
                            });
                            updateUser(player._id, { userfrontId: Userfront.user.userId, experience: player.experience + 5, drachmas: player.drachmas + 3 });
                        }, 250);
                        setTimeout(() => {
                            setBattleStatus(false);
                            setEnemyCreature({});
                            setPlayerCreatureHP(0);
                        }, 2250);
                        await setTimeout(() => {
                            loadAsyncDataPlayer();
                        }, 2250);
                    } else {

                        // damages enemy
                        if (chancePlayer) {
                            playerAttackAnimation();
                            playerAttackCT(playerCreatureAttack, criticalMultiplier, enemyDefense);
                            setTimeout(() => {
                                setEnemyCreatureHP(enemyCreatureHP - (playerCreatureAttack - playerCreatureAttack * enemyDefense) * criticalMultiplier);
                            }, 250);
                        }

                        enemyCounterAttack(chancePlayer, moveName);
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

                        // checks for enemy death
                        if (enemyCreatureHP - ((playerCreatureSpecial - playerCreatureSpecial * enemyDefense) * criticalMultiplier) <= 0 && chancePlayer) {
                            setBattleUndecided(false);
                            playerAttackAnimation();
                            specialAnimation();
                            playerSpecialCT(playerCreatureSpecial, criticalMultiplier, enemyDefense);
                            await setTimeout(() => {
                                setEnemyCreatureHP(0);
                                setCombatAlert("Victory!");
                                Userfront.user.update({
                                    data: {
                                        userkey: Userfront.user.data.userkey,
                                    },
                                });
                                updateUser(player._id, { userfrontId: Userfront.user.userId, experience: player.experience + 5, drachmas: player.drachmas + 3 });
                            }, 250);
                            setTimeout(() => {
                                setBattleStatus(false);
                                setEnemyCreature({});
                                setPlayerCreatureHP(0);
                            }, 2250);
                            await setTimeout(() => {
                                loadAsyncDataPlayer();
                            }, 2250);
                        } else {

                            // damages enemy
                            if (chancePlayer) {
                                playerAttackAnimation();
                                playerSpecialCT(playerCreatureSpecial, criticalMultiplier, enemyDefense);
                                specialAnimation();
                                setTimeout(() => {
                                    setEnemyCreatureHP(enemyCreatureHP - (playerCreatureSpecial - playerCreatureSpecial * enemyDefense) * criticalMultiplier);
                                }, 250);
                            }

                            enemyCounterAttack(chancePlayer, moveName);
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

    // renders if a relic is bestowed
    if (chosenRelic[0]) {
        return (
            <>
                <header>
                    <GameNav Userfront={Userfront} optionsStatus={optionsStatus} setOptionsStatus={setOptionsStatus} setNameOptionStatus={setNameOptionStatus}
                        setAvatarOptionStatus={setAvatarOptionStatus} />
                </header>

                <main className="stage1_game_section">
                    <Options player={player} optionsStatus={optionsStatus} nameOptionStatus={nameOptionStatus} setNameOptionStatus={setNameOptionStatus} selectName={selectName}
                        avatarOptionStatus={avatarOptionStatus} setAvatarOptionStatus={setAvatarOptionStatus} selectAvatar={selectAvatar}
                        toggleDisplayCreatureStats={() => toggleDisplayCreatureStats()} />

                    <Player player={player} />

                    {/* menu and creatures wrapped in options status check */}
                    {!optionsStatus ? <>

                        <Menu battleStatus={battleStatus} player={player} relicsData={relicsData} relicsStatus={relicsStatus} setRelicsStatus={setRelicsStatus} playerRelics={playerRelics}
                            selectRelic={selectRelic} templeStatus={templeStatus} setTempleStatus={setTempleStatus} buyRelic={buyRelic} creatureData={creatureData} summonsStatus={summonsStatus}
                            setSummonsStatus={setSummonsStatus} swapCreature={swapCreature} stagesStatus={stagesStatus} setStagesStatus={setStagesStatus} combatAlert={combatAlert}
                            loadDataBattle={() => loadDataBattle()}
                        />

                        <PlayerCreature summonsStatus={summonsStatus} playerCreature={playerCreature} enemyAttackStatus={enemyAttackStatus} critText={critText} combatText={combatText}
                            playerAttackStatus={playerAttackStatus} chosenRelic={chosenRelic} specialStatus={specialStatus} battleStatus={battleStatus} player={player}
                            creatureStatsStatus={creatureStatsStatus} playerCreatureHP={playerCreatureHP} playerCreatureMP={playerCreatureMP} attackEnemy={attackEnemy} />

                        <EnemyCreature battleStatus={battleStatus} enemyCreature={enemyCreature} playerAttackStatus={playerAttackStatus} enemyAttackStatus={enemyAttackStatus}
                            critText={critText} combatText={combatText} enemyCreatureHP={enemyCreatureHP} />

                    </> : null}
                </main >
            </>
        );
    }
    else return (<></>);
}

export default Stage1;