import Userfront from "@userfront/core";

Userfront.init("rbvqd5nd");

function GameNav({ optionsMenuStatus, setOptionsMenuStatus }) {
  // renders nav for game
  return (
    <>
      <nav className="game_nav">
        <a className="game_nav_brand" href="app">
          <img src="favicon.ico" alt="favicon" width="48px" height="48px" />
        </a>

        <button className="button_logout" onClick={() => Userfront.logout()}>
          Logout
        </button>

        <button
          className="game_button_small button_options"
          onClick={() => {
            setOptionsMenuStatus({
              optionsStatus: !optionsMenuStatus.optionsStatus,
              avatarOptionStatus: false,
              nameOptionStatus: false,
            });
          }}
        >
          Options
        </button>
      </nav>
    </>
  );
}

export default GameNav;
