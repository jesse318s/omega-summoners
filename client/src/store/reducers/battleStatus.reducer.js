import { ENABLE, DISABLE } from "../actions/battleStatus.actions";

// contains the battleStatus state
const BattleStatusReducer = (state = { battleStatus: false }, action) => {
  switch (action.type) {
    case ENABLE:
      return { battleStatus: true };
    case DISABLE:
      return { battleStatus: false };
    default:
      return state;
  }
};

export default BattleStatusReducer;
