import { Link } from "react-router-dom";
import { updateUser } from '../services/userServices';

function Menu({
    Userfront, battleStatus, player, relicsData, relicsStatus, setRelicsStatus, playerRelics, templeStatus, setTempleStatus, creatureData, summonsStatus, setSummonsStatus,
    stagesStatus, setStagesStatus, combatAlert, loadAsyncDataPlayer, setPlayerCreatureHP, setPlayerCreatureMP, playerCreature, chosenRelic, setEnemyCreature, setEnemyCreatureHP,
    setCombatAlert, setBattleStatus, setBattleUndecided
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

    return (
        <>
            <div className="color_white">
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
                                height="48px" /><span className="relic_info" onClick={() => alert(relic.description)}>?</span><br />
                            {relic.name} - {relic.price} {"\u25C9"}
                        </div>))}
                </div>
                    : null
                }
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
                            <button className="game_button_small margin_small">Home</button>
                        </Link><br />
                        <Link to="/stage1">
                            <button className="game_button_small margin_small">Stage I - Path to Olympus</button>
                        </Link><br /></div>
                </>
                    : null
                }
                {!battleStatus ? <>
                    <button className="game_button margin_small" onClick={() => {
                        loadDataBattle(); setTempleStatus(false); setRelicsStatus(false); setSummonsStatus(false);
                        setStagesStatus(false);
                    }}>
                        Battle</button> </>
                    : null}
            </div>
        </>
    );
}

export default Menu;