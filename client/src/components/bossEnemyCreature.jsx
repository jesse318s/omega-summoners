import React from 'react';

function BossEnemyCreature({ battleStatus, enemyCreature, playerAttackStatus, enemyAttackStatus, critText, combatText, spawn, lobby }) {
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
                                width="256px"
                                height="256px" />
                                : playerAttackStatus ? <img className="enemy_creature_img"
                                    src={creature.imgPath.slice(0, -4) + "_hurt.png"}
                                    alt={creature.name}
                                    width="256px"
                                    height="256px" />
                                    : <img className="enemy_creature_img"
                                        src={creature.imgPath}
                                        alt={creature.name}
                                        width="256px"
                                        height="256px" />}
                            <div className="creature_panel">
                                <h4>Enemy {creature.name}</h4>
                                <div className="progress_bar_container">
                                    <div className="progress_bar"
                                        style={{ width: ((lobby.enemyHP / enemyCreature[0].hp)) * 100 + "%" }} />
                                </div>
                                <h5>HP: {lobby.enemyHP} / {creature.hp}</h5>
                            </div>
                        </div>
                    ))}
                </div>
                : null}
        </>
    );
}

export default React.memo(BossEnemyCreature);