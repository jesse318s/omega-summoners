import {
    ENABLELOBBYTIMER,
    DISABLELOBBYTIMER,
  } from "../actions/lobbyTimer.actions";
  
  // contains the lobbyTimer state
  const LobbyTimerReducer = (state = { lobbyTimer: false }, action) => {
    switch (action.type) {
      case ENABLELOBBYTIMER:
        return { lobbyTimer: true };
      case DISABLELOBBYTIMER:
        return { lobbyTimer: false };
      default:
        return state;
    }
  };
  
  export default LobbyTimerReducer;