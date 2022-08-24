import { useState } from "react";
import recipeList from "../constants/recipes";
import { potionsList } from "../constants/items";
import { getItems, addItem } from "../services/itemServices";
import {
  getPotionTimer,
  addPotionTimer,
} from "../services/potionTimerServices";
import { useSelector, useDispatch } from "react-redux";
import {
  enablePotionCooldown,
  disablePotionCooldown,
  setSummonHPBonusAmount,
  setSummonMPBonusAmount,
} from "../store/actions/alchemy.actions";

function AlchemyMenu({
  Userfront,
  gameMenuStatus,
  setGameMenuStatus,
  loadDataAlchemy,
  playerCreature,
  setPlayerCreatureHP,
  setPlayerCreatureMP,
}) {
  // dispatch hook for redux
  const dispatch = useDispatch();

  // relics state from redux store
  const chosenRelic = useSelector((state) => state.relics.chosenRelic);
  // alchemy state from redux store
  const ingredients = useSelector((state) => state.alchemy.ingredients);
  const potions = useSelector((state) => state.alchemy.potions);
  const summonHPBonus = useSelector((state) => state.alchemy.summonHPBonus);
  const summonMPBonus = useSelector((state) => state.alchemy.summonMPBonus);
  const potionCooldown = useSelector((state) => state.alchemy.potionCooldown);

  // alchemy menu state
  const [potionsStatus, setPotionsStatus] = useState(false);
  const [ingredientsStatus, setIngredientsStatus] = useState(false);
  const [recipesStatus, setRecipesStatus] = useState(false);
  // numbered index state (recipes pagination)
  const [index1, setIndex1] = useState(0);
  const [index2, setIndex2] = useState(4);
  // lettered index state (potions and ingredients pagination)
  const [indexA, setIndexA] = useState(0);
  const [indexB, setIndexB] = useState(7);
  const [indexC, setIndexC] = useState(0);
  const [indexD, setIndexD] = useState(7);

  // paginates recipes for alchemy menu
  const paginateRecipes = async (index1, direction) => {
    try {
      if (direction === "next" && index1 < recipeList.length - 4) {
        setIndex1(index1 + 4);
        setIndex2(index2 + 4);
      } else if (direction === "previous" && index1 > 0) {
        setIndex1(index1 - 4);
        setIndex2(index2 - 4);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // paginates potions for alchemy menu
  const paginatePotions = async (indexA, direction) => {
    try {
      if (direction === "next" && indexA < potions.length - 7) {
        setIndexA(indexA + 7);
        setIndexB(indexB + 7);
      } else if (direction === "previous" && indexA > 0) {
        setIndexA(indexA - 7);
        setIndexB(indexB - 7);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // paginates ingredients for alchemy menu
  const paginateIngredients = async (indexC, direction) => {
    try {
      if (direction === "next" && indexC < ingredients.length - 7) {
        setIndexC(indexC + 7);
        setIndexD(indexD + 7);
      } else if (direction === "previous" && indexC > 0) {
        setIndexC(indexC - 7);
        setIndexD(indexD - 7);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // creates a new potion
  const createPotion = async (potionId) => {
    try {
      if (!potionCooldown) {
        dispatch(enablePotionCooldown());
        const { data } = await getItems();
        const playerPotionData = data.filter(
          (item) => item.type === "Potion" && item.itemId === potionId
        );
        const potion = potionsList.find((item) => item.id === potionId);
        const newPotionData = {
          itemId: potion.id,
          type: "Potion",
          itemQuantity: playerPotionData[0]
            ? playerPotionData[0].itemQuantity + 1
            : 1,
          userId: Userfront.user.userId,
        };
        const playerIngredientData = data.filter(
          (item) => item.type === "Ingredient"
        );
        const currentRecipe = recipeList.filter(
          (item) => item.potionProductId === potion.id
        )[0];
        // check if player has enough ingredients for recipe
        const ingredient1Check = playerIngredientData.find(
          (item) => item.itemId === currentRecipe.ingredient1
        );
        const ingredient2Check = playerIngredientData.find(
          (item) => item.itemId === currentRecipe.ingredient2
        );
        if (
          ingredient1Check &&
          ingredient1Check.itemQuantity > 0 &&
          ingredient2Check &&
          ingredient2Check.itemQuantity > 0
        ) {
          // confirm potion creation
          if (window.confirm(`Are you sure you want to create this potion?`)) {
            const currentIngredient1 = playerIngredientData.find(
              (ingredient) => ingredient.itemId === currentRecipe.ingredient1
            );
            const currentIngredient2 = playerIngredientData.find(
              (ingredient) => ingredient.itemId === currentRecipe.ingredient2
            );
            // delete the ingredients from the player's inventory
            currentIngredient1.itemQuantity -= 1;
            currentIngredient2.itemQuantity -= 1;
            await Userfront.user.update({
              data: {
                userkey: Userfront.user.data.userkey,
              },
            });
            await addItem(currentIngredient1);
            await loadDataAlchemy();
            await Userfront.user.update({
              data: {
                userkey: Userfront.user.data.userkey,
              },
            });
            await addItem(currentIngredient2);
            await loadDataAlchemy();
            // add the potion to the player's inventory
            await Userfront.user.update({
              data: {
                userkey: Userfront.user.data.userkey,
              },
            });
            await addItem(newPotionData);
            await loadDataAlchemy();
            setTimeout(() => {
              dispatch(disablePotionCooldown());
            }, 1000);
          } else {
            setTimeout(() => {
              dispatch(disablePotionCooldown());
            }, 1000);
          }
        } else {
          alert("You don't have enough ingredients for this potion.");
          setTimeout(() => {
            dispatch(disablePotionCooldown());
          }, 1000);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // uses clicked potion
  const consumePotion = async (potionId) => {
    try {
      if (!potionCooldown) {
        await getPotionTimer();
        const timerCheck = await getPotionTimer();
        dispatch(enablePotionCooldown());
        const { data } = await getItems();
        const playerPotionData = data.filter(
          (item) => item.type === "Potion" && item.itemId === potionId
        );
        const potion = potionsList.find((item) => item.id === potionId);
        const currentPotionData = playerPotionData.filter(
          (item) => item.itemId === potionId
        );
        // prevent over use
        if (timerCheck.data.length !== 0) {
          alert(
            "You already have an active potion. Please wait for it to expire."
          );
          setTimeout(() => {
            dispatch(disablePotionCooldown());
          }, 1000);
          return;
        }
        // check if player has enough potions
        if (currentPotionData[0].itemQuantity > 0) {
          // confirm potion use
          if (
            window.confirm(`Are you sure you want to use this potion?`) === true
          ) {
            // use potion
            currentPotionData[0].itemQuantity -= 1;
            await Userfront.user.update({
              data: {
                userkey: Userfront.user.data.userkey,
              },
            });
            await addItem(currentPotionData[0]);
            await loadDataAlchemy();
            await Userfront.user.update({
              data: {
                userkey: Userfront.user.data.userkey,
              },
            });
            await addPotionTimer({
              userId: Userfront.user.userId,
              potionId: potion.id,
              potionDuration: potion.duration,
            });
            await loadDataAlchemy();
            // checks potion timer
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

            setPlayerCreatureMP(
              playerCreature.mp + chosenRelic.mpMod + summonMPBonus
            );
            setPlayerCreatureHP(
              playerCreature.hp + chosenRelic.hpMod + summonHPBonus
            );
            setTimeout(() => {
              dispatch(disablePotionCooldown());
            }, 1000);
          } else {
            setTimeout(() => {
              dispatch(disablePotionCooldown());
            }, 1000);
          }
        } else {
          alert("You don't have enough potions.");
          setTimeout(() => {
            dispatch(disablePotionCooldown());
          }, 1000);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* displays new alchemy menu if alchemy button is clicked */}
      {gameMenuStatus.alchemyStatus ? (
        <div className="color_white">
          <button
            className="game_button margin_small"
            onClick={() => {
              setGameMenuStatus({
                templeStatus: false,
                relicsStatus: false,
                summonsStatus: false,
                stagesStatus: false,
                alchemyStatus: false,
              });
              setRecipesStatus(false);
              setIngredientsStatus(false);
              setPotionsStatus(false);
            }}
          >
            {" "}
            Exit Alchemy
          </button>
          <br />

          <button
            className="game_button margin_small"
            onClick={() => {
              setRecipesStatus(!recipesStatus);
              setIngredientsStatus(false);
              setPotionsStatus(false);
            }}
          >
            {" "}
            Recipes{" "}
          </button>

          <button
            className="game_button margin_small"
            onClick={() => {
              setPotionsStatus(!potionsStatus);
              setIngredientsStatus(false);
              setRecipesStatus(false);
            }}
          >
            {" "}
            Potions{" "}
          </button>
          <br />

          {/* displays recipes if recipes button is clicked */}
          {recipesStatus ? (
            <div>
              <h4 className="margin_small">Available Recipes</h4>
              <button
                className="game_button_small margin_small"
                onClick={() => {
                  paginateRecipes(index1, "previous");
                }}
              >
                Previous
              </button>
              <button
                className="game_button_small margin_small"
                onClick={() => {
                  paginateRecipes(index1, "next");
                }}
              >
                Next
              </button>
              {recipeList.slice(index1, index2).map((recipe) => (
                <div className="recipe_option" key={recipe.id}>
                  <button
                    className="game_button_small margin_small"
                    onClick={() => {
                      createPotion(recipe.potionProductId);
                    }}
                  >
                    Create
                    <br />
                    Potion
                  </button>
                  <img
                    onClick={() => alert(recipe.description)}
                    className="recipe_option_img"
                    src={recipe.imgPath}
                    alt={recipe.name}
                    width="96px"
                    height="96px"
                  />
                  <span
                    className="recipe_info"
                    onClick={() => alert(recipe.description)}
                  >
                    ?
                  </span>
                  <h5>Recipe: {recipe.name}</h5>
                </div>
              ))}
            </div>
          ) : null}

          {/* displays player potions if potions button is clicked */}
          {potionsStatus ? (
            <div>
              <h4 className="margin_small">Player Potions</h4>
              <button
                className="game_button_small margin_small"
                onClick={() => paginatePotions(indexA, "previous")}
              >
                Previous
              </button>
              <button
                className="game_button_small margin_small"
                onClick={() => paginatePotions(indexA, "next")}
              >
                Next
              </button>
              {potions.slice(indexA, indexB).map((potion) => (
                <div className="alchemy_item_option" key={potion.id}>
                  <button
                    className="game_button_small margin_small"
                    onClick={() => consumePotion(potion.id)}
                  >
                    Use
                  </button>
                  <img
                    onClick={() => alert(potion.description)}
                    className="alchemy_item_option_img"
                    src={potion.imgPath}
                    alt={potion.name}
                    width="48px"
                    height="48px"
                  />
                  <span
                    className="alchemy_item_info"
                    onClick={() => alert(potion.description)}
                  >
                    ?
                  </span>
                  <h5>
                    {potion.name} x {potion.itemQuantity}
                  </h5>
                </div>
              ))}
            </div>
          ) : null}

          <button
            className="game_button margin_small"
            onClick={() => {
              setIngredientsStatus(!ingredientsStatus);
              setPotionsStatus(false);
              setRecipesStatus(false);
            }}
          >
            {" "}
            Ingredients{" "}
          </button>

          {/* displays player ingredients if ingredients button is clicked */}
          {ingredientsStatus ? (
            <div>
              <h4 className="margin_small">Player Ingredients</h4>
              <button
                className="game_button_small margin_small"
                onClick={() => paginateIngredients(indexC, "previous")}
              >
                Previous
              </button>
              <button
                className="game_button_small margin_small"
                onClick={() => paginateIngredients(indexC, "next")}
              >
                Next
              </button>
              {ingredients.slice(indexC, indexD).map((ingredient) => (
                <div className="alchemy_item_option" key={ingredient.id}>
                  <img
                    onClick={() => alert(ingredient.description)}
                    className="alchemy_item_option_img"
                    src={ingredient.imgPath}
                    alt={ingredient.name}
                    width="48px"
                    height="48px"
                  />
                  <span
                    className="alchemy_item_info"
                    onClick={() => alert(ingredient.description)}
                  >
                    ?
                  </span>
                  <h5>
                    {ingredient.name} x {ingredient.itemQuantity}
                  </h5>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export default AlchemyMenu;
