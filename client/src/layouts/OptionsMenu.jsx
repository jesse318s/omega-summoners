import Userfront from "@userfront/core";
import { updateUser } from "../services/userServices";
import { useSelector } from "react-redux";

Userfront.init("rbvqd5nd");

function OptionsMenu({
  player,
  optionsMenuStatus,
  setOptionsMenuStatus,
  loadAsyncDataPlayer,
}) {
  // display creature stats status state from redux store
  const creatureStatsStatus = useSelector(
    (state) => state.creatureStatsStatus.creatureStatsStatus
  );

  // toggles display creature stats in database
  const toggleDisplayCreatureStats = async () => {
    try {
      await Userfront.user.update({
        data: {
          userkey: Userfront.user.data.userkey,
        },
      });
      await updateUser(player._id, {
        userfrontId: Userfront.user.userId,
        displayCreatureStats: !creatureStatsStatus,
      });
      await loadAsyncDataPlayer();
    } catch (error) {
      console.log(error);
    }
  };

  // updates player name in database
  const submitName = async (e) => {
    try {
      if (e === "") {
        alert("Please enter a name.");
      } else if (e.length < 20) {
        await Userfront.user.update({
          data: {
            userkey: Userfront.user.data.userkey,
          },
        });
        await updateUser(player._id, {
          userfrontId: Userfront.user.userId,
          name: e,
        });
        await loadAsyncDataPlayer();
      } else {
        alert("Name must be less than 20 characters.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // updates player avatar path in database
  const selectAvatar = async (avatarPath) => {
    try {
      await Userfront.user.update({
        data: {
          userkey: Userfront.user.data.userkey,
        },
      });
      await updateUser(player._id, {
        userfrontId: Userfront.user.userId,
        avatarPath: avatarPath,
      });
      await loadAsyncDataPlayer();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* if the options are being used */}
      {optionsMenuStatus.optionsStatus ? (
        <div className="color_white">
          {/* gameplay option menu */}
          <h3>Game Options</h3>
          <button
            className="game_button margin_small"
            onClick={() => {
              toggleDisplayCreatureStats();
            }}
          >
            Display Summon Stats:
            {player.displayCreatureStats ? " ON" : " OFF"}
          </button>

          {/* player profile option menu */}
          <h3>Player Options</h3>
          <button
            className="game_button margin_small"
            onClick={() => {
              setOptionsMenuStatus({
                optionsStatus: true,
                avatarOptionStatus: !optionsMenuStatus.avatarOptionStatus,
                nameOptionStatus: false,
              });
            }}
          >
            {" "}
            Change Avatar
          </button>

          <button
            className="game_button margin_small"
            onClick={() => {
              setOptionsMenuStatus({
                optionsStatus: true,
                nameOptionStatus: !optionsMenuStatus.nameOptionStatus,
                avatarOptionStatus: false,
              });
            }}
          >
            Change Name
          </button>

          {/* displays player name selection on change name button click */}
          {optionsMenuStatus.nameOptionStatus ? (
            <div>
              <label htmlFor="name">Player name:&nbsp;</label>
              <input
                id="name"
                className="margin_small color_black background_white"
                type="text"
                name="name"
                placeholder={player.name}
              />
              <br />
              <button
                className="game_button_small margin_small"
                onClick={() =>
                  submitName(document.querySelector("input[name='name']").value)
                }
              >
                Submit Name
              </button>
            </div>
          ) : null}

          {/* displays player avatar selection on change avatar button click */}
          {optionsMenuStatus.avatarOptionStatus ? (
            <div>
              <div className="inline_flex">
                <div
                  className="margin_small"
                  onClick={() => selectAvatar("img/avatar/f_mage_avatar.png")}
                >
                  <img
                    className="player_avatar avatar_option"
                    src={"img/avatar/f_mage_avatar.png"}
                    alt={"f_mage"}
                    width="96"
                    height="96"
                  />
                  <p className="avatar_option">Avatar 1</p>
                </div>
                <div
                  className="margin_small"
                  onClick={() => selectAvatar("img/avatar/m_mage_avatar.png")}
                >
                  <img
                    className="player_avatar avatar_option"
                    src={"img/avatar/m_mage_avatar.png"}
                    alt={"m_mage"}
                    width="96"
                    height="96"
                  />
                  <p className="avatar_option">Avatar 2</p>
                </div>
              </div>
              <br />
              <div className="inline_flex">
                <div
                  className="margin_small"
                  onClick={() => selectAvatar("img/avatar/f_rogue_avatar.png")}
                >
                  <img
                    className="player_avatar avatar_option"
                    src={"img/avatar/f_rogue_avatar.png"}
                    alt={"f_rogue"}
                    width="96"
                    height="96"
                  />
                  <p className="avatar_option">Avatar 3</p>
                </div>
                <div
                  className="margin_small"
                  onClick={() => selectAvatar("img/avatar/m_rogue_avatar.png")}
                >
                  <img
                    className="player_avatar avatar_option"
                    src={"img/avatar/m_rogue_avatar.png"}
                    alt={"m_rogue"}
                    width="96"
                    height="96"
                  />
                  <p className="avatar_option">Avatar 4</p>
                </div>
              </div>
              <br />
              <div className="inline_flex">
                <div
                  className="margin_small"
                  onClick={() =>
                    selectAvatar("img/avatar/f_warrior_avatar.png")
                  }
                >
                  <img
                    className="player_avatar avatar_option"
                    src={"img/avatar/f_warrior_avatar.png"}
                    alt={"f_warrior"}
                    width="96"
                    height="96"
                  />
                  <p className="avatar_option">Avatar 5</p>
                </div>
                <div
                  className="margin_small"
                  onClick={() =>
                    selectAvatar("img/avatar/m_warrior_avatar.png")
                  }
                >
                  <img
                    className="player_avatar avatar_option"
                    src={"img/avatar/m_warrior_avatar.png"}
                    alt={"m_warrior"}
                    width="96"
                    height="96"
                  />
                  <p className="avatar_option">Avatar 6</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export default OptionsMenu;
