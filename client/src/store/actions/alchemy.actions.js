// sets potionCooldown to true
export const ENABLEPOTIONCOOLDOWN = "ENABLEPOTIONCOOLDOWN";
export const enablePotionCooldown = () => ({ type: ENABLEPOTIONCOOLDOWN });

// sets potionCooldown to false
export const DISABLEPOTIONCOOLDOWN = "DISABLEPOTIONCOOLDOWN";
export const disablePotionCooldown = () => ({ type: DISABLEPOTIONCOOLDOWN });

// sets summonHPBonus to the passed number
export const SETSUMMONHPBONUSAMOUNT = "SETSUMMONHPBONUSAMOUNT";
export const setSummonHPBonusAmount = (value) => ({
  type: SETSUMMONHPBONUSAMOUNT,
  payload: value,
});

// sets summonMPBonus to the passed number
export const SETSUMMONMPBONUSAMOUNT = "SETSUMMONMPBONUSAMOUNT";
export const setSummonMPBonusAmount = (value) => ({
  type: SETSUMMONMPBONUSAMOUNT,
  payload: value,
});

// sets ingredients to the passed array of objects
export const SETINGREDIENTSVALUE = "SETINGREDIENTSVALUE";
export const setIngredientsValue = (value) => ({
  type: SETINGREDIENTSVALUE,
  payload: value,
});

// sets potions to the passed array of objects
export const SETPOTIONSVALUE = "SETPOTIONSVALUE";
export const setPotionsValue = (value) => ({
  type: SETPOTIONSVALUE,
  payload: value,
});
