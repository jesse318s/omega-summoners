import {
  ENABLEPOTIONCOOLDOWN,
  DISABLEPOTIONCOOLDOWN,
  SETSUMMONHPBONUSAMOUNT,
  SETSUMMONMPBONUSAMOUNT,
  SETINGREDIENTSVALUE,
  SETPOTIONSVALUE,
} from "../actions/alchemy.actions";

// contains the alchemy state
const AlchemyReducer = (
  state = {
    potionCooldown: false,
    summonHPBonus: 0,
    summonMPBonus: 0,
    ingredients: [{}],
    potions: [{}],
  },
  action
) => {
  switch (action.type) {
    case ENABLEPOTIONCOOLDOWN:
      return { ...state, potionCooldown: true };
    case DISABLEPOTIONCOOLDOWN:
      return { ...state, potionCooldown: false };
    case SETSUMMONHPBONUSAMOUNT:
      return { ...state, summonHPBonus: action.payload };
    case SETSUMMONMPBONUSAMOUNT:
      return { ...state, summonMPBonus: action.payload };
    case SETINGREDIENTSVALUE:
      return { ...state, ingredients: action.payload };
    case SETPOTIONSVALUE:
      return { ...state, potions: action.payload };
    default:
      return state;
  }
};

export default AlchemyReducer;
