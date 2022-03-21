import { Link } from "react-router-dom";
import { updateUser } from "../services/userServices";

function MultiPlayerMenu({
    Userfront, battleStatus, setBattleStatus, player, relicsData, relicsStatus, setRelicsStatus, playerRelics, templeStatus, setTempleStatus, creatureData, enemyCreatureData,
    summonsStatus, setSummonsStatus, stagesStatus, setStagesStatus, combatAlert, loadAsyncDataPlayer, setPlayerCreatureHP, setPlayerCreatureMP, playerCreature, chosenRelic,
    setEnemyCreature, setCombatAlert, setBattleUndecided, setSpawn, loadAsyncDataLobby, loadAsyncDataConnection, connections, alliesStatus, setAlliesStatus
}) {

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

    // enemy spawn animation
    const spawnAnimation = () => {
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
    const loadDataBattle = () => {
        try {
            // if the player can afford the battle
            if (player.drachmas >= 500 && player.drachmas >= 500) {
                if (window.confirm(`Are you sure you want to enter this battle? It will cost 750 drachmas and experience.`)) {
                    setPlayerCreatureHP(playerCreature[0].hp + chosenRelic[0].hpMod);
                    setPlayerCreatureMP(playerCreature[0].mp + chosenRelic[0].mpMod);
                    spawnAnimation();
                    const enemyCreature = [enemyCreatureData[Math.floor(Math.random() * enemyCreatureData.length)]];
                    setEnemyCreature(enemyCreature);
                    loadAsyncDataLobby();
                    setCombatAlert("The battle has begun!");
                    setBattleStatus(true);
                    setBattleUndecided(true);
                    Userfront.user.update({
                        data: {
                            userkey: Userfront.user.data.userkey,
                        },
                    });
                    updateUser(player._id, { userfrontId: Userfront.user.userId, experience: player.experience - 750, drachmas: player.drachmas - 750 });
                    loadAsyncDataPlayer();
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="color_white">
                {!battleStatus ? <div><div className="inline_flex">
                    <button className="game_button margin_small" onClick={() => {
                        setRelicsStatus(!relicsStatus); setTempleStatus(false); setSummonsStatus(false);
                        setStagesStatus(false); setAlliesStatus(false);
                    }}>Relics</button>
                    <button className="game_button margin_small" onClick={() => {
                        setTempleStatus(!templeStatus); setRelicsStatus(false); setSummonsStatus(false);
                        setStagesStatus(false); setAlliesStatus(false);
                    }}>Temple</button>
                </div></div>
                    : null}
                {battleStatus ? <div><p className="combat_alert">{combatAlert}</p></div>
                    : null}
                {relicsStatus ? <div>
                    <h4>Player Relics</h4>
                    {playerRelics.map((relic) => (
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
                {templeStatus ? <div>
                    <h4>Temple Relics</h4>
                    {relicsData.map((relic) => (
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
                {!battleStatus ? <>
                    <button className="game_button margin_small" onClick={() => {
                        setSummonsStatus(!summonsStatus); setTempleStatus(false); setRelicsStatus(false);
                        setStagesStatus(false); setAlliesStatus(false);
                    }}>
                        Summons</button>
                    <button className="game_button margin_small" onClick={() => {
                        setStagesStatus(!stagesStatus); setSummonsStatus(false); setTempleStatus(false);
                        setRelicsStatus(false); setAlliesStatus(false);
                    }}>
                        Stages</button>< br />
                </>
                    : null}
                {summonsStatus ? <div>
                    <h4>Available Summons</h4>
                    {creatureData.map((creature) => (
                        <div
                            className="summon_option"
                            key={creature.id}
                        >
                            <button className="game_button_small" onClick={() => swapCreature(creature.id, creature.price)}>Swap</button>
                            <img onClick={() => alert("HP: " + creature.hp + "\nAttack: " + creature.attack + " | Attack type: " +
                                creature.attackType + "\nSpeed: " + creature.speed + "\nCritical: " + creature.critical + "%\nDefense: " + creature.defense
                                + "%\nMP: " + creature.mp + " | MP Regen: " + creature.mpRegen + "\nSpecial: " + creature.special + " | Special type: " +
                                creature.specialType + " | Special cost: " + creature.specialCost + "\n\nMagic attacks ignore defense, and poison attacks are always critical.")}
                                className="summon_option_img"
                                src={creature.imgPath}
                                alt={creature.name}
                                width="96px"
                                height="96px" /><span className="summon_info" onClick={() => alert("HP: " + creature.hp + "\nAttack: " + creature.attack + " | Attack type: " +
                                    creature.attackType + "\nSpeed: " + creature.speed + "\nCritical: " + creature.critical + "%\nDefense: " + creature.defense
                                    + "%\nMP: " + creature.mp + " | MP Regen: " + creature.mpRegen + "\nSpecial: " + creature.special + " | Special type: " +
                                    creature.specialType + " | Special cost: " + creature.specialCost + "\n\nMagic attacks ignore defense, and poison attacks are always critical.")}>?</span>
                            <br />
                            {creature.name} - {creature.price} XP {creature.id === player.creatureId ? <i>{"\u2713"}</i> : null}
                        </div>))}
                </div>
                    : null
                }
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
                <button className="game_button margin_small" onClick={() => {
                    setAlliesStatus(!alliesStatus); setStagesStatus(false); setSummonsStatus(false); setTempleStatus(false);
                    setRelicsStatus(false); loadAsyncDataConnection();
                }}>
                    Allies</button>
                {!battleStatus ? <>
                    <button className="game_button margin_small" onClick={() => {
                        loadDataBattle(); setTempleStatus(false); setRelicsStatus(false); setSummonsStatus(false);
                        setStagesStatus(false); loadAsyncDataConnection();
                    }}>
                        Battle</button> </>
                    : null}
                {alliesStatus ? <>
                    <h4>Allies Online: {connections.length}</h4>
                </>
                    : null
                }
            </div>
        </>
    );
}

export default MultiPlayerMenu;