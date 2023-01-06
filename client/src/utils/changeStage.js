import {
  setLevelReqAmount,
  setBackgroundValue,
  setEnemyCreaturesValue,
} from "../store/actions/currentStage.actions";

// changes stage for player
const changeStage = (levelReq, background, enemyCreaturesData, dispatch) => {
  try {
    dispatch(setLevelReqAmount(levelReq));
    dispatch(setBackgroundValue(background));
    dispatch(setEnemyCreaturesValue(enemyCreaturesData));
  } catch (err) {
    console.log(err);
  }
};

export default changeStage;
