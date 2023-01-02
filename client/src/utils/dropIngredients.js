import { getItems, addItem } from "../services/itemServices";
import { ingredientsList } from "../constants/items";

// drops ingredients for player
const dropIngredients = async (ingredientId, dropAmount, Userfront) => {
  const playerItems = await getItems();
  const playerItemsData = playerItems.data;
  const oldIngredients = playerItemsData.filter(
    (item) => item.itemId === ingredientId && item.type === "Ingredient"
  );
  const newIngredients = oldIngredients[0];

  await Userfront.user.update({
    data: {
      userkey: Userfront.user.data.userkey,
    },
  });
  await addItem({
    itemId: ingredientId,
    type: "Ingredient",
    itemQuantity:
      newIngredients === undefined
        ? dropAmount
        : newIngredients.itemQuantity + dropAmount,
    userId: Userfront.user.userId,
  });
  alert(
    "You have gained " +
      dropAmount +
      " " +
      ingredientsList.find((item) => item.id === ingredientId).name +
      "s."
  );
};

export default dropIngredients;
