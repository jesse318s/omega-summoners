function EnemyCreature({ battleStatus, enemyCreature, playerAttackStatus, enemyAttackStatus, critText, combatText, enemyCreatureHP, spawn }) {
    return (
        <>
            {battleStatus ?
                <div className="enemy_creature">
                    {enemyCreature.map((creature) => (
                        <div
                            key={creature.id}
                        >
                            <div className="special_effect_container"><div className={spawn} /></div>
                            {playerAttackStatus ? <div className="special_effect_container"><div className={spawn} /><div className={critText}>{combatText}</div></div> : null}
                            {enemyAttackStatus ? <img className="enemy_creature_img"
                                src={creature.imgPath.slice(0, -4) + "_attack.png"}
                                alt={creature.name}
                                width="128px"
                                height="128px" />
                                : playerAttackStatus ? <img className="enemy_creature_img"
                                    src={creature.imgPath.slice(0, -4) + "_hurt.png"}
                                    alt={creature.name}
                                    width="128px"
                                    height="128px" />
                                    : <img className="enemy_creature_img"
                                        src={creature.imgPath}
                                        alt={creature.name}
                                        width="128px"
                                        height="128px" />}
                            <div className="creature_panel">
                                <h4>Enemy {creature.name}</h4>
                                <div className="progress_bar_container">
                                    <div className="progress_bar"
                                        style={{ width: ((enemyCreatureHP / enemyCreature[0].hp)) * 100 + "%" }} />
                                </div>
                                <h5>HP: {enemyCreatureHP} / {creature.hp}</h5>
                            </div>
                        </div>
                    ))}
                </div>
                : null}
        </>
    );
}

export default EnemyCreature;