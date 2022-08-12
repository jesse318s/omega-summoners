import { ENABLE, DISABLE } from "../actions/battleStatus.actions";

const BattleStatusReducer = (state = { status: false }, action) => {
  switch (action.type) {
    case ENABLE:
      return { status: true };
    case DISABLE:
      return { status: false };
    default:
      return state;
  }
};

export default BattleStatusReducer;
