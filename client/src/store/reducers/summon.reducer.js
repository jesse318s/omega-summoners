import { SETPLAYERCREATUREVALUE } from "../actions/summon.actions";

// contains the player creature state
const SummonReducer = (
  state = {
    playerCreature: {},
  },
  action
) => {
  switch (action.type) {
    case SETPLAYERCREATUREVALUE:
      return { ...state, playerCreature: action.payload };
    default:
      return state;
  }
};

export default SummonReducer;
