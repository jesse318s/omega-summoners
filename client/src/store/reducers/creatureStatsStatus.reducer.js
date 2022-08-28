import {
  ENABLECREATURESTATSSTATUS,
  DISABLECREATURESTATSSTATUS,
} from "../actions/creatureStatsStatus.actions";

// contains the creatureStatsStatus state
const CreatureStatsStatusReducer = (
  state = { creatureStatsStatus: false },
  action
) => {
  switch (action.type) {
    case ENABLECREATURESTATSSTATUS:
      return { creatureStatsStatus: true };
    case DISABLECREATURESTATSSTATUS:
      return { creatureStatsStatus: false };
    default:
      return state;
  }
};

export default CreatureStatsStatusReducer;
