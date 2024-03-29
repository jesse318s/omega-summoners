import React from "react";
import { useSelector } from "react-redux";

function MultiPlayerEnemyCreature({
  combatTextAndCombatStatus,
  spawnAnimation,
  lobby,
}) {
  // enemy creature state from redux store
  const enemyCreature = useSelector((state) => state.enemy.enemyCreature);
  // battle status combat state from redux store
  const battleStatus = useSelector((state) => state.battleStatus.battleStatus);

  return (
    <>
      {/* if there is a battle, displays enemy creature with spawn animation and creature info panel */}
      {battleStatus ? (
        <div className="enemy_creature">
          {/* displays spawn animation */}
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
          <img
            className={
              combatTextAndCombatStatus.playerAttackStatus ||
              combatTextAndCombatStatus.enemyAttackStatus
                ? "creature_hidden"
                : "enemy_creature_img"
            }
            src={enemyCreature.imgPath}
            alt={enemyCreature.name}
            width="256px"
            height="256px"
          />
          <img
            className={
              combatTextAndCombatStatus.enemyAttackStatus
                ? "enemy_creature_img"
                : "creature_hidden"
            }
            src={enemyCreature.imgPath.slice(0, -4) + "_attack.png"}
            alt={enemyCreature.name}
            width="256px"
            height="256px"
          />
          <img
            className={
              combatTextAndCombatStatus.playerAttackStatus &&
              !combatTextAndCombatStatus.enemyAttackStatus
                ? "enemy_creature_img"
                : "creature_hidden"
            }
            src={enemyCreature.imgPath.slice(0, -4) + "_hurt.png"}
            alt={enemyCreature.name}
            width="256px"
            height="256px"
          />

          {/* creature panel */}
          <div className="creature_panel">
            <h4>Enemy {enemyCreature.name}</h4>
            <div className="progress_bar_container">
              <div
                className="progress_bar"
                style={{
                  width: (lobby.enemyHP / enemyCreature.hp) * 100 + "%",
                }}
              />
            </div>
            <h5>
              HP: {lobby.enemyHP}/{enemyCreature.hp}
            </h5>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default React.memo(MultiPlayerEnemyCreature);
