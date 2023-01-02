import { getPotionTimer } from "../services/potionTimerServices";
import { potionsList } from "../constants/items";
import {
  setSummonHPBonusAmount,
  setSummonMPBonusAmount,
} from "../store/actions/alchemy.actions";

// checks potion timer
const checkPotionTimer = async (dispatch) => {
  const potionTimer = await getPotionTimer();
  if (potionTimer.data.length > 0) {
    const playerPotion = potionsList.find(
      (potion) => potion.id === potionTimer.data[0].potionId
    );
    const playerMPBonus = playerPotion.mpMod;
    const playerHPBonus = playerPotion.hpMod;
    dispatch(setSummonMPBonusAmount(playerMPBonus));
    dispatch(setSummonHPBonusAmount(playerHPBonus));
  }
  if (potionTimer.data.length === 0) {
    dispatch(setSummonMPBonusAmount(0));
    dispatch(setSummonHPBonusAmount(0));
  }
};

export default checkPotionTimer;
