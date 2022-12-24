import Userfront from "@userfront/core";
import { updateUser } from "../services/userServices";
import { useSelector } from "react-redux";

Userfront.init("rbvqd5nd");

function CommonPlayerCreaturePanel({
  player,
  playerCreatureResources,
  attackEnemy,
  performSpecial1,
  performSpecial2,
  loadAsyncDataPlayer,
}) {
  // display creature stats status state from redux store
  const creatureStatsStatus = useSelector(
    (state) => state.creatureStatsStatus.creatureStatsStatus
  );
  // player creature state from redux store
  const playerCreature = useSelector((state) => state.summon.playerCreature);
  // battle status combat state from redux store
  const battleStatus = useSelector((state) => state.battleStatus.battleStatus);
  // relics state from redux store
  const chosenRelic = useSelector((state) => state.relics.chosenRelic);
  // alchemy state from redux store
  const summonHPBonus = useSelector((state) => state.alchemy.summonHPBonus);
  const summonMPBonus = useSelector((state) => state.alchemy.summonMPBonus);

  // toggles special choice
  const toggleSpecial = async () => {
    try {
      let newSpecial = 1;
      if (player.preferredSpecial === 1) {
        newSpecial = 2;
      }
      await Userfront.user.update({
        data: {
          userkey: Userfront.user.data.userkey,
        },
      });
      await updateUser(player._id, {
        userfrontId: Userfront.user.userId,
        preferredSpecial: newSpecial,
      });
      await loadAsyncDataPlayer();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* creature panel */}
      <div className="creature_panel">
        {/* panel controls */}
        {!battleStatus ? (
          <button
            className="game_button_small"
            onClick={() => {
              toggleSpecial();
            }}
          >
            {" "}
            Special: {player.preferredSpecial}{" "}
          </button>
        ) : null}
        {battleStatus ? (
          <div className="inline_flex">
            <button
              className="game_button attack_button"
              onClick={() => {
                attackEnemy();
              }}
            >
              {playerCreature.attackName}
            </button>
            {player.preferredSpecial === 1 ? (
              <button
                className="game_button special_button"
                onClick={() => {
                  performSpecial1();
                }}
              >
                {playerCreature.specialName}
                <br />
                Cost: {playerCreature.specialCost} MP
              </button>
            ) : (
              <button
                className="game_button special_button"
                onClick={() => {
                  performSpecial2();
                }}
              >
                {playerCreature.specialName2}
                <br />
                Cost: {playerCreature.specialCost2} MP
              </button>
            )}
          </div>
        ) : null}

        {/* panel name and resources */}
        <h4>
          {player.name}'s {playerCreature.name}
        </h4>
        {battleStatus ? (
          <div className="progress_bar_container">
            <div
              className="progress_bar"
              style={{
                width:
                  (playerCreatureResources.playerCreatureHP /
                    (playerCreature.hp + chosenRelic.hpMod + summonHPBonus)) *
                    100 +
                  "%",
              }}
            />
          </div>
        ) : null}
        {!battleStatus ? (
          <div className="inline_flex">
            <h5>HP: {playerCreature.hp + chosenRelic.hpMod + summonHPBonus}</h5>
            &nbsp;|&nbsp;
            <h5>MP: {playerCreature.mp + chosenRelic.mpMod + summonMPBonus}</h5>
          </div>
        ) : (
          <div className="inline_flex">
            <h5>
              HP: {playerCreatureResources.playerCreatureHP} /{" "}
              {playerCreature.hp + chosenRelic.hpMod + summonHPBonus}
            </h5>
            &nbsp;|&nbsp;
            <h5>
              MP: {playerCreatureResources.playerCreatureMP} /{" "}
              {playerCreature.mp + chosenRelic.mpMod + summonMPBonus}
            </h5>
          </div>
        )}

        {/* panel stats */}
        {creatureStatsStatus ? (
          <div>
            <h5>
              Attack: {playerCreature.attack + chosenRelic.attackMod} | Type:{" "}
              {playerCreature.attackType}
            </h5>
            {player.preferredSpecial === 1 ? (
              <h5>
                Special: {playerCreature.special + chosenRelic.specialMod} |
                Type: {playerCreature.specialType} |{" "}
                {playerCreature.specialCost}{" "}
              </h5>
            ) : (
              <h5>
                Special: {playerCreature.special2 + chosenRelic.specialMod} |
                Type: {playerCreature.specialType2} |{" "}
                {playerCreature.specialCost2}{" "}
              </h5>
            )}
            <h5>
              MP Regen: {playerCreature.mpRegen + chosenRelic.mpRegenMod} |
              Speed: {playerCreature.speed + chosenRelic.speedMod}
            </h5>
            <h5>
              Critical: {playerCreature.critical + chosenRelic.criticalMod}% |
              Defense: {playerCreature.defense + chosenRelic.defenseMod}%
            </h5>
          </div>
        ) : null}
      </div>{" "}
    </>
  );
}

export default CommonPlayerCreaturePanel;
