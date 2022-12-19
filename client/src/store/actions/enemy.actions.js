// sets enemy creature to the passed object
export const SETENEMYCREATUREVALUE = "SETENEMYCREATUREVALUE";
export const setEnemyCreatureValue = (value) => ({
  type: SETENEMYCREATUREVALUE,
  payload: value,
});
