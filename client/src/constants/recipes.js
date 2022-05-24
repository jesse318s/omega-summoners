const recipeList = [
    {
        id: 1,
        name: "Potion of Health",
        description: "Creates 1 'Potion of Health', which requires 1 'Green Mushroom' and 1 'Red Mushroom', and adds 50 HP for 5 hours. (A creature may only have one active potion at a time, and if you change stages, you must regenerate your bonus.)",
        imgPath: "img/recipe/recipe1.png",
        ingredient1: 1,
        ingredient2: 2,
        potionProductId: 1,
    },
    {
        id: 2,
        name: "Potion of Mana",
        description: "Creates 1 'Potion of Mana', which requires 1 'Green Mushroom' and 1 'Blue Mushroom', and adds 50 MP for 5 hours. (A creature may only have one active potion at a time, and if you change stages, you must regenerate your bonus.)",
        imgPath: "img/recipe/recipe2.png",
        ingredient1: 1,
        ingredient2: 3,
        potionProductId: 2,
    },
];

export default recipeList;