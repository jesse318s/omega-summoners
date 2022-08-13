import React from "react";
import { useSelector } from "react-redux";

function MultiPlayerEnemyCreature({
  enemyCreature,
  playerAttackStatus,
  enemyAttackStatus,
  critText,
  combatText,
  spawnAnimation,
  lobby,
}) {
  // battle status combat state from redux store
  const battleStatus = useSelector((state) => state.battleStatus);

  // renders spawn portal, enemy combat text, and boss enemy creature with stats panel for multiplayer
  return (
    <>
      {battleStatus ? (
        <div className="enemy_creature">
          <div className="special_effect_container">
            <div className={spawnAnimation} />
          </div>

          {/* displays enemy combat text */}
          {playerAttackStatus ? (
            <div className="special_effect_container">
              <div className={critText}>{combatText}</div>
            </div>
          ) : null}

          {/* displays enemy based on attack state */}
          {enemyAttackStatus ? (
            <img
              className="enemy_creature_img"
              src={enemyCreature.imgPath.slice(0, -4) + "_attack.png"}
              alt={enemyCreature.name}
              width="256px"
              height="256px"
            />
          ) : playerAttackStatus ? (
            <img
              className="enemy_creature_img"
              src={enemyCreature.imgPath.slice(0, -4) + "_hurt.png"}
              alt={enemyCreature.name}
              width="256px"
              height="256px"
            />
          ) : (
            <img
              className="enemy_creature_img"
              src={enemyCreature.imgPath}
              alt={enemyCreature.name}
              width="256px"
              height="256px"
            />
          )}

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
              HP: {lobby.enemyHP} / {enemyCreature.hp}
            </h5>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default React.memo(MultiPlayerEnemyCreature);
