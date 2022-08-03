export const potionsList = [
  {
    id: 1,
    name: "Potion of Health",
    description:
      "Adds 50 HP for 10 minutes. (A creature may only have one active potion at a time, and if you refresh or change Stages, you must regenerate your bonus)",
    imgPath: "img/potion/potion1.png",
    duration: 600000,
    hpMod: 50,
    mpMod: 0,
  },
  {
    id: 2,
    name: "Potion of Mana",
    description:
      "Adds 50 MP for 10 minutes. (A creature may only have one active potion at a time, and if you refresh or change Stages, you must regenerate your bonus)",
    imgPath: "img/potion/potion2.png",
    duration: 600000,
    hpMod: 0,
    mpMod: 50,
  },
];

export const ingredientsList = [
  {
    id: 1,
    name: "Green Mushroom",
    description:
      "Used in 'Potion of Health', and 'Potion of Mana'. (15% chance to drop from non-boss enemies)",
    imgPath: "img/ingredient/ingredient1.png",
  },
  {
    id: 2,
    name: "Red Mushroom",
    description:
      "Used in 'Potion of Health'. (10% chance to drop from non-boss enemies)",
    imgPath: "img/ingredient/ingredient2.png",
  },
  {
    id: 3,
    name: "Blue Mushroom",
    description:
      "Used in 'Potion of Mana'. (10% chance to drop from non-boss enemies)",
    imgPath: "img/ingredient/ingredient3.png",
  },
];
