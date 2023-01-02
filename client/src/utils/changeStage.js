import {
  setLevelReqAmount,
  setBackgroundValue,
  setEnemyCreaturesValue,
} from "../store/actions/currentStage.actions";

// changes stage for player
const changeStage = (levelReq, stageNumber, enemyCreaturesData, dispatch) => {
  try {
    dispatch(setLevelReqAmount(levelReq));
    dispatch(setBackgroundValue("stage" + stageNumber + "_game_section"));
    dispatch(setEnemyCreaturesValue(enemyCreaturesData));
  } catch (err) {
    console.log(err);
  }
};

export default changeStage;
