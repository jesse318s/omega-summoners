// checks player level for stage requirements
const checkLevelPlayer = (player, levelReq, navigate) => {
  try {
    if (!levelReq) {
      navigate("/app");
    }
    if (Math.floor(Math.sqrt(player.experience) * 0.25) < levelReq) {
      if (window.location.pathname !== "/app") {
        alert("You must be level " + levelReq + " to battle at this stage.");
      }
      navigate("/app");
      window.location.reload(false);
    }
  } catch (error) {
    console.log(error);
  }
};

export default checkLevelPlayer;
