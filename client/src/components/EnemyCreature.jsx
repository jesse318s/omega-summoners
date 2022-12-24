import React from "react";
import { useSelector } from "react-redux";

function EnemyCreature({
  combatTextAndCombatStatus,
  enemyCreatureHP,
  spawnAnimation,
}) {
  // enemy creature state from redux store
  const enemyCreature = useSelector((state) => state.enemy.enemyCreature);
  // battle status combat state from redux store
  const battleStatus = useSelector((state) => state.battleStatus.battleStatus);

  // renders spawn portal, enemy combat text, and enemy creature with stats panel
  return (
    <>
      {battleStatus ? (
        <div className="enemy_creature">
          <div className="special_effect_container">
            <div className={spawnAnimation} />
          </div>

          {/* displays player combat text */}
          <div className="special_effect_container">
            <div className={combatTextAndCombatStatus.critText}>
              {combatTextAndCombatStatus.combatText}
            </div>
          </div>

          {/* displays enemy based on attack state */}
          {combatTextAndCombatStatus.enemyAttackStatus ? (
            <img
              className="enemy_creature_img"
              src={enemyCreature.imgPath.slice(0, -4) + "_attack.png"}
              alt={enemyCreature.name}
              width="128px"
              height="128px"
            />
          ) : combatTextAndCombatStatus.playerAttackStatus ? (
            <img
              className="enemy_creature_img"
              src={enemyCreature.imgPath.slice(0, -4) + "_hurt.png"}
              alt={enemyCreature.name}
              width="128px"
              height="128px"
            />
          ) : (
            <img
              className="enemy_creature_img"
              src={enemyCreature.imgPath}
              alt={enemyCreature.name}
              width="128px"
              height="128px"
            />
          )}

          {/* creature panel */}
          <div className="creature_panel">
            <h4>Enemy {enemyCreature.name}</h4>
            <div className="progress_bar_container">
              <div
                className="progress_bar"
                style={{
                  width: (enemyCreatureHP / enemyCreature.hp) * 100 + "%",
                }}
              />
            </div>
            <h5>
              HP: {enemyCreatureHP} / {enemyCreature.hp}
            </h5>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default React.memo(EnemyCreature);
