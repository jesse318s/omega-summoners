// sets player creature to the passed object
export const SETPLAYERCREATUREVALUE = "SETPLAYERCREATUREVALUE";
export const setPlayerCreatureValue = (value) => ({
  type: SETPLAYERCREATUREVALUE,
  payload: value,
});
