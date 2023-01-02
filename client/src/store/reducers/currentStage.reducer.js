import {
  SETLEVELREQAMOUNT,
  SETBACKGROUNDVALUE,
  SETENEMYCREATURESVALUE,
} from "../actions/currentStage.actions";

// contains the current stage state
const CurrentStageReducer = (
  state = {
    levelReq: 0,
    background: "",
    enemyCreatures: [{}],
  },
  action
) => {
  switch (action.type) {
    case SETLEVELREQAMOUNT:
      return { ...state, levelReq: action.payload };
    case SETBACKGROUNDVALUE:
      return { ...state, background: action.payload };
    case SETENEMYCREATURESVALUE:
      return { ...state, enemyCreatures: action.payload };
    default:
      return state;
  }
};

export default CurrentStageReducer;
