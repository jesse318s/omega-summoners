import { Link } from "react-router-dom";

function Menu({
    battleStatus, player, relicsData, relicsStatus, setRelicsStatus, playerRelics, selectRelic, templeStatus, setTempleStatus, buyRelic, creatureData,
    summonsStatus, setSummonsStatus, swapCreature, stagesStatus, setStagesStatus, combatAlert, loadDataBattle
}) {
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
                        </Link></div><br />
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