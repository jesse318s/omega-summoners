import { SETENEMYCREATUREVALUE } from "../actions/enemy.actions";

// contains the enemy creature state
const EnemyReducer = (
  state = {
    enemyCreature: {},
  },
  action
) => {
  switch (action.type) {
    case SETENEMYCREATUREVALUE:
      return { ...state, enemyCreature: action.payload };
    default:
      return state;
  }
};

export default EnemyReducer;
