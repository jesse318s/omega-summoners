// sets level req to the passed number
export const SETLEVELREQAMOUNT = "SETLEVELREQAMOUNT";
export const setLevelReqAmount = (value) => ({
  type: SETLEVELREQAMOUNT,
  payload: value,
});

// sets background to the passed string
export const SETBACKGROUNDVALUE = "SETBACKGROUNDVALUE";
export const setBackgroundValue = (value) => ({
  type: SETBACKGROUNDVALUE,
  payload: value,
});

// sets enemy creatures to the passed array of objects
export const SETENEMYCREATURESVALUE = "SETENEMYCREATURESVALUE";
export const setEnemyCreaturesValue = (value) => ({
  type: SETENEMYCREATURESVALUE,
  payload: value,
});
