import { useState } from "react";
import recipeList from "../constants/recipes";
import { useSelector } from "react-redux";

function AlchemyMenu({
  gameMenuStatus,
  setGameMenuStatus,
  createPotion,
  consumePotion,
}) {
  // alchemy state from redux store
  const ingredients = useSelector((state) => state.alchemy.ingredients);
  const potions = useSelector((state) => state.alchemy.potions);

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
