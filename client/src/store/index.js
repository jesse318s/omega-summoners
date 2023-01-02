import { combineReducers, createStore } from "redux";
import AlchemyReducer from "./reducers/alchemy.reducer";
import BattleStatusReducer from "./reducers/battleStatus.reducer";
import CreatureStatsStatusReducer from "./reducers/creatureStatsStatus.reducer";
import CurrentStageReducer from "./reducers/currentStage.reducer";
import EnemyReducer from "./reducers/enemy.reducer";
import LobbyTimerReducer from "./reducers/lobbyTimer.reducer";
import RelicsReducer from "./reducers/relics.reducer";
import SummonReducer from "./reducers/summon.reducer";

const rootReducer = combineReducers({
  alchemy: AlchemyReducer,
  battleStatus: BattleStatusReducer,
  creatureStatsStatus: CreatureStatsStatusReducer,
  currentStage: CurrentStageReducer,
  enemy: EnemyReducer,
  lobbyTimer: LobbyTimerReducer,
  relics: RelicsReducer,
  summon: SummonReducer,
});

export default createStore(rootReducer);
