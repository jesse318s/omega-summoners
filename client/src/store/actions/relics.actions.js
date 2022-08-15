// sets player relics to the passed array of objects
export const SETPLAYERRELICSVALUE = "SETPLAYERRELICSVALUE";
export const setPlayerRelicsValue = (value) => ({
  type: SETPLAYERRELICSVALUE,
  payload: value,
});

// sets chosen relic to the passed object
export const SETCHOSENRELICVALUE = "SETCHOSENRELICVALUE";
export const setChosenRelicValue = (value) => ({
  type: SETCHOSENRELICVALUE,
  payload: value,
});
