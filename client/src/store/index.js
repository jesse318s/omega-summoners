import { createStore, combineReducers } from "redux";
import BattleStatusReducer from "./reducers/battleStatus.reducer";
import AlchemyReducer from "./reducers/alchemy.reducer";
import RelicsReducer from "./reducers/relics.reducer";
import LobbyTimerReducer from "./reducers/lobbyTimer.reducer";
import SummonReducer from "./reducers/summon.reducer";
import CreatureStatsStatusReducer from "./reducers/creatureStatsStatus.reducer";

const rootReducer = combineReducers({
  battleStatus: BattleStatusReducer,
  alchemy: AlchemyReducer,
  relics: RelicsReducer,
  lobbyTimer: LobbyTimerReducer,
  summon: SummonReducer,
  creatureStatsStatus: CreatureStatsStatusReducer,
});

export default createStore(rootReducer);
