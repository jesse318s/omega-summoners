// checks player level for stage requirements
const checkLevelPlayer = (player, levelReq, navigate) => {
  try {
    if (Math.floor(Math.sqrt(player.experience) * 0.25) < levelReq) {
      alert("You must be level " + levelReq + " to battle at this stage.");
      navigate(-1);
    }
  } catch (error) {
    console.log(error);
  }
};

export default checkLevelPlayer;
