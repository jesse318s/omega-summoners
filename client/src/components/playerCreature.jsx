function PlayerCreature({ summonsStatus, playerCreature, enemyAttackStatus, critText, combatText, playerAttackStatus, chosenRelic, specialStatus, battleStatus, player,
    creatureStatsStatus, playerCreatureHP, playerCreatureMP, attackEnemy }) {
    return (<>
        {!summonsStatus ? <>
            <div className="player_creature">
                {playerCreature.map((creature) => (
                    <div
                        key={creature.id}
                    >
                        {enemyAttackStatus ? <div className="special_effect_container"><div className={critText}>{combatText}</div></div> : null}
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
                                    style={{ width: ((playerCreatureHP / playerCreature[0].hp)) * 100 + "%" }} />
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
                                    <h5>Sp. Attack: {creature.special + chosenRelic[0].specialMod} | Type: {creature.specialType}</h5>
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
