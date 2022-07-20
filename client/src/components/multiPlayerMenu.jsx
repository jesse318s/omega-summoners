import { Link } from "react-router-dom";
import { updateUser } from "../services/userServices";
import { useState } from "react";
import { getPotionTimer } from "../services/potionTimerServices";
import { potionsList } from "../constants/items";
import { getConnection } from "../services/connectionServices";

function MultiPlayerMenu({ Userfront, battleStatus, setBattleStatus, player, relicsData, relicsStatus, setRelicsStatus, playerRelics, templeStatus, setTempleStatus, creatureData,
    enemyCreatureData, summonsStatus, setSummonsStatus, stagesStatus, setStagesStatus, combatAlert, loadAsyncDataPlayer, setPlayerCreatureHP, setPlayerCreatureMP, playerCreature,
    chosenRelic, setEnemyCreature, setCombatAlert, setBattleUndecided, setSpawn, loadAsyncDataLobby, loadAsyncDataConnection, connections, setConnections, summonHPBonus,
    setSummonHPBonus, summonMPBonus, setSummonMPBonus }) {

    // numbered index state (summons pagination)
    const [index1, setIndex1] = useState(0);
    const [index2, setIndex2] = useState(5);
    // lettered index state (relics pagination)
    const [indexA, setIndexA] = useState(0);
    const [indexB, setIndexB] = useState(7);
    const [indexC, setIndexC] = useState(0);
    const [indexD, setIndexD] = useState(7);

    // paginates creatures for summons menu
    const paginateCreatures = async (index1, direction) => {
        try {
            if (direction === "next" && index1 < creatureData.length - 5) {
                setIndex1(index1 + 5);
                setIndex2(index2 + 5);
            }
            else if (direction === "previous" && index1 > 0) {
                setIndex1(index1 - 5);
                setIndex2(index2 - 5);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // paginates player relics for relics menu
    const paginateRelics = async (indexA, direction) => {
        try {
            if (direction === "next" && indexA < playerRelics.length - 7) {
                setIndexA(indexA + 7);
                setIndexB(indexB + 7);
            }
            else if (direction === "previous" && indexA > 0) {
                setIndexA(indexA - 7);
                setIndexB(indexB - 7);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // paginates relics for temple menu
    const paginateTempleRelics = async (indexC, direction) => {
        try {
            if (direction === "next" && indexC < relicsData.length - 7) {
                setIndexC(indexC + 7);
                setIndexD(indexD + 7);
            }
            else if (direction === "previous" && indexC > 0) {
                setIndexC(indexC - 7);
                setIndexD(indexD - 7);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // updates player chosen relic in database
    const selectRelic = async (relicId) => {
        try {
            await Userfront.user.update({
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
                    await Userfront.user.update({
                        data: {
                            userkey: Userfront.user.data.userkey,
                        },
                    });
                    await updateUser(player._id, { userfrontId: Userfront.user.userId, drachmas: player.drachmas - relicPrice, relics: [...player.relics, relicId] });
                    await loadAsyncDataPlayer();
                }
            } else {
                alert("You can't afford this relic or you already own it.");
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
                    await Userfront.user.update({
                        data: {
                            userkey: Userfront.user.data.userkey,
                        },
                    });
                    await updateUser(player._id, {
                        userfrontId: Userfront.user.userId, experience: player.experience - creaturePrice, creatureId: creatureId, preferredSpecial: 1
                    });
                    await loadAsyncDataPlayer();
                }
            } else {
                alert("You can't afford this creature or you already have it.");
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // enemy spawn animation
    const spawnAnimation = async () => {
        try {
            setSpawn("spawn_effect");
            setTimeout(() => {
                setSpawn("");
            }, 200);
        } catch (error) {
            console.log(error);
        }
    }

    // loads battle data
    const loadDataBattle = async () => {
        try {
            // get and check connections
            await getConnection();
            const { data } = await getConnection();
            setConnections(data);
            await loadAsyncDataPlayer();
            if (connections.length > 2 && connections.filter(connection => connection.userId === Userfront.user.userId).length < 1) {
                alert("There cannot be more than 3 summoners in this battle. Please try again later.");
                return;
            }

            // checks and sets potion timer
            const potionTimer = await getPotionTimer()
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

            setPlayerCreatureMP(playerCreature[0].mp + chosenRelic[0].mpMod + summonMPBonus);
            setPlayerCreatureHP(playerCreature[0].hp + chosenRelic[0].hpMod + summonHPBonus);
            spawnAnimation();
            const enemyCreature = [enemyCreatureData[Math.floor(Math.random() * enemyCreatureData.length)]];
            setEnemyCreature(enemyCreature);
            setCombatAlert("The battle has begun!");
            setBattleStatus(true);
            setBattleUndecided(true);
            await loadAsyncDataLobby();
            await loadAsyncDataPlayer();
        }
        catch (error) {
            console.log(error);
        }
    }

    if (connections) {
        return (
            <>
                <div className="color_white">

                    {/* if there is no battle, displays buttons for selecting temple or relics from menu to display */}
                    {!battleStatus ? <div><div className="inline_flex">
                        <button className="game_button margin_small" onClick={() => {
                            setRelicsStatus(!relicsStatus); setTempleStatus(false); setSummonsStatus(false);
                            setStagesStatus(false);
                        }}>Relics</button>
                        <button className="game_button margin_small" onClick={() => {
                            setTempleStatus(!templeStatus); setRelicsStatus(false); setSummonsStatus(false);
                            setStagesStatus(false);
                        }}>Temple</button>
                    </div></div>
                        : null}

                    {/* displays the combat alert if there is a battle */}
                    {battleStatus ? <div><p className="combat_alert">{combatAlert}</p></div>
                        : null}

                    {/* displays player relics if relics button is clicked */}
                    {relicsStatus ? <div>
                        <h4>Player Relics</h4>
                        <button className="game_button_small margin_small" onClick={() => paginateRelics(indexA, "previous")}>Previous</button>
                        <button className="game_button_small margin_small" onClick={() => paginateRelics(indexA, "next")}>Next</button>
                        {playerRelics.slice(indexA, indexB).map((relic) => (
                            <div
                                className="relic_option"
                                key={relic.id}
                            >
                                <button className="game_button_small" onClick={() => selectRelic(relic.id)}>Use</button>
                                <img onClick={() => alert(relic.description)}
                                    className="relic_option_img"
                                    src={relic.imgPath}
                                    alt={relic.name}
                                    width="48px"
                                    height="48px" /><span className="relic_info" onClick={() => alert(relic.description)}>?</span><br />
                                {relic.name} {relic.id === player.chosenRelic ? <i>{"\u2713"}</i> : null}
                            </div>))}
                    </div>
                        : null
                    }

                    {/* displays temple relics if temple button is clicked */}
                    {templeStatus ? <div>
                        <h4>Temple Relics</h4>
                        <button className="game_button_small margin_small" onClick={() => paginateTempleRelics(indexC, "previous")}>Previous</button>
                        <button className="game_button_small margin_small" onClick={() => paginateTempleRelics(indexC, "next")}>Next</button>
                        {relicsData.slice(indexC, indexD).map((relic) => (
                            <div
                                className="relic_option"
                                key={relic.id}
                            >
                                <button className="game_button_small" onClick={() => buyRelic(relic.id, relic.price)}>Buy</button>
                                <img onClick={() => alert(relic.description)}
                                    className="relic_option_img"
                                    src={relic.imgPath}
                                    alt={relic.name}
                                    width="48px"
                                    height="48px" /><span className="relic_info" onClick={() => alert(relic.description)}>?</span>
                                {player.relics.includes(relic.id) ? <i>{"\u2713"}</i> : null}<br />
                                {relic.name} - {relic.price} {"\u25C9"}
                            </div>))}
                    </div>
                        : null
                    }

                    {/* if there is no battle, displays buttons for selecting summons or stages from menu to display */}
                    {!battleStatus ? <>
                        <button className="game_button margin_small" onClick={() => {
                            setSummonsStatus(!summonsStatus); setTempleStatus(false); setRelicsStatus(false);
                            setStagesStatus(false);
                        }}>
                            Summons</button>
                        <button className="game_button margin_small" onClick={() => {
                            setStagesStatus(!stagesStatus); setSummonsStatus(false); setTempleStatus(false);
                            setRelicsStatus(false);
                        }}>
                            Stages</button>< br />
                    </>
                        : null}

                    {/* displays player summons if summons button is clicked */}
                    {summonsStatus ? <div>
                        <h4>Available Summons</h4>
                        <button className="game_button_small margin_small" onClick={() => paginateCreatures(index1, "previous")}>Previous</button>
                        <button className="game_button_small margin_small" onClick={() => paginateCreatures(index1, "next")}>Next</button>
                        {creatureData.slice(index1, index2).map((creature) => (
                            <div
                                className="summon_option"
                                key={creature.id}
                            >
                                <button className="game_button_small" onClick={() => swapCreature(creature.id, creature.price)}>Swap</button>
                                <img onClick={() => alert("HP: " + creature.hp + "\nAttack: " + creature.attack + " | Type: " +
                                    creature.attackType + "\nSpeed: " + creature.speed + "\nCritical: " + creature.critical + "%\nDefense: " + creature.defense
                                    + "%\nMP: " + creature.mp + " | MP Regen: " + creature.mpRegen + "\nSpecial: " + creature.special + " | Type: " +
                                    creature.specialType + " | Cost: " + creature.specialCost + "\nSpecial 2: " + creature.special2 + " | Type: " +
                                    creature.specialType2 + " | Cost: " + creature.specialCost2 + "\n\n(Poison always crits, Magic ignores armor, and " +
                                    "Lifesteal restores 20% of damage as health)")}
                                    className="summon_option_img"
                                    src={creature.imgPath}
                                    alt={creature.name}
                                    width="96px"
                                    height="96px" /><span className="summon_info" onClick={() => alert("HP: " + creature.hp + "\nAttack: " + creature.attack + " | Type: " +
                                        creature.attackType + "\nSpeed: " + creature.speed + "\nCritical: " + creature.critical + "%\nDefense: " + creature.defense
                                        + "%\nMP: " + creature.mp + " | MP Regen: " + creature.mpRegen + "\nSpecial: " + creature.special + " | Special type: " +
                                        creature.specialType + " | Cost: " + creature.specialCost + "\nSpecial 2: " + creature.special2 + " | Type: " +
                                        creature.specialType2 + " | Cost: " + creature.specialCost2 + "\n\n(Poison always crits, Magic ignores armor, and " +
                                        "Lifesteal restores 20% of damage as health)")}>?</span>
                                <br />
                                {creature.name} - {creature.price} XP {creature.id === player.creatureId ? <i>{"\u2713"}</i> : null}
                            </div>))}
                    </div>
                        : null
                    }

                    {/* displays stages if stages button is clicked */}
                    {stagesStatus ? <>
                        <h4>Battle Stages</h4>
                        <div className="stage_options">
                            <Link to="/app">
                                <button className="game_button_small margin_small">Lvl. 0 | Home<br /> The Bridge (Solo)</button>
                                {window.location.pathname === "/app" ? <span className="color_white">X</span> : null}
                            </Link><br />
                            <Link to="/stage1">
                                <button className="game_button_small margin_small">Lvl. 5 | Stage I<br /> Mount Olympus (Solo)</button>
                                {window.location.pathname === "/stage1" ? <span className="color_white">X</span> : null}
                            </Link><br />
                            <Link to="/lobby1">
                                <button className="game_button_small margin_small">Lvl. 8 | Stage I<br /> (Multiplayer)</button>
                                {window.location.pathname === "/lobby1" ? <span className="color_white">X</span> : null}
                            </Link><br /></div>
                    </>
                        : null
                    }

                    {/* if there is no battle, displays button for attempting to select alchemy from menu, but alerts user instead */}
                    {!battleStatus ? <>
                        <button className="game_button margin_small" onClick={() => { alert("Alchemy cannot be performed here. (Multiplayer stage)"); }}>
                            Alchemy</button> </>
                        : null}

                    {/* if there is no battle, displays a button to start a battle at the current stage */}
                    {!battleStatus ? <>
                        <button className="game_button margin_small" onClick={() => {
                            loadDataBattle(); setTempleStatus(false); setRelicsStatus(false); setSummonsStatus(false);
                            setStagesStatus(false); loadAsyncDataConnection();
                        }}>
                            Battle</button> </>
                        : null}

                    {/* displays allies that are online and fighting */}
                    {!relicsStatus && !templeStatus && !summonsStatus && !stagesStatus ? <>
                        <h4 className="margin_small">Allies online:</h4>
                        {connections.length > 1 ? <>
                            {connections.map((ally) => (
                                <div
                                    className="ally_option"
                                    key={ally.userId}
                                >
                                    <div>
                                        {ally.userId !== player.userfrontId ? ally.name : null}
                                    </div>
                                </div>))}
                        </>
                            : null}
                    </>
                        : null
                    }
                </div>
            </>
        );
    }
    else return (<></>);
}

export default MultiPlayerMenu;