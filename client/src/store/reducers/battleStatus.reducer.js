import {
  ENABLEBATTLESTATUS,
  DISABLEBATTLESTATUS,
} from "../actions/battleStatus.actions";

// contains the battleStatus state
const BattleStatusReducer = (state = { battleStatus: false }, action) => {
  switch (action.type) {
    case ENABLEBATTLESTATUS:
      return { battleStatus: true };
    case DISABLEBATTLESTATUS:
      return { battleStatus: false };
    default:
      return state;
  }
};

export default BattleStatusReducer;
