import { createStore, combineReducers } from "redux";
import BattleStatusReducer from "./reducers/battleStatus.reducer";
import AlchemyReducer from "./reducers/alchemy.reducer";

const rootReducer = combineReducers({
  battleStatus: BattleStatusReducer,
  alchemy: AlchemyReducer,
});

export default createStore(rootReducer);
