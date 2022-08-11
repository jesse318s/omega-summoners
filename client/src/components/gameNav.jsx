function GameNav({
  Userfront,
  optionsStatus,
  setOptionsStatus,
  setAvatarOptionStatus,
  setNameOptionStatus,
}) {
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
            setOptionsStatus(!optionsStatus);
            setAvatarOptionStatus(false);
            setNameOptionStatus(false);
          }}
        >
          Options
        </button>
      </nav>
    </>
  );
}

export default GameNav;
