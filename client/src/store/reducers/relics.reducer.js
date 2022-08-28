import {
  SETPLAYERRELICSVALUE,
  SETCHOSENRELICVALUE,
} from "../actions/relics.actions";

// contains the relics state
const RelicsReducer = (
  state = {
    playerRelics: [{}],
    chosenRelic: {},
  },
  action
) => {
  switch (action.type) {
    case SETPLAYERRELICSVALUE:
      return { ...state, playerRelics: action.payload };
    case SETCHOSENRELICVALUE:
      return { ...state, chosenRelic: action.payload };
    default:
      return state;
  }
};

export default RelicsReducer;
