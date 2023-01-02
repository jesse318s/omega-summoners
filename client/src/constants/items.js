export const potionsList = [
  {
    id: 1,
    name: "Potion of Health",
    description:
      "Adds 50 HP for 10 minutes. (A creature may only have one active potion at a time, and if you reload you must regenerate your bonus)",
    imgPath: "img/potion/potion1.png",
    duration: 600000,
    hpMod: 50,
    mpMod: 0,
  },
  {
    id: 2,
    name: "Potion of Mana",
    description:
      "Adds 50 MP for 10 minutes. (A creature may only have one active potion at a time, and if you reload you must regenerate your bonus)",
    imgPath: "img/potion/potion2.png",
    duration: 600000,
    hpMod: 0,
    mpMod: 50,
  },
  {
    id: 3,
    name: "Potion of Restoration",
    description:
      "Adds 20 HP and MP for 12 minutes. (A creature may only have one active potion at a time, and if you reload you must regenerate your bonus)",
    imgPath: "img/potion/potion3.png",
    duration: 720000,
    hpMod: 20,
    mpMod: 20,
  },
];

export const ingredientsList = [
  {
    id: 1,
    name: "Green Mushroom",
    description: "Used in many potions. (Chance to drop from non-boss enemies)",
    imgPath: "img/ingredient/ingredient1.png",
  },
  {
    id: 2,
    name: "Red Mushroom",
    description:
      "Used in 'Potion of Health'. (Small chance to drop from non-boss enemies)",
    imgPath: "img/ingredient/ingredient2.png",
  },
  {
    id: 3,
    name: "Blue Mushroom",
    description:
      "Used in 'Potion of Mana'. (Small chance to drop from non-boss enemies)",
    imgPath: "img/ingredient/ingredient3.png",
  },
  {
    id: 4,
    name: "Purple Mushroom",
    description:
      "Used in 'Potion of Restoration'. (Small chance to drop from non-boss enemies)",
    imgPath: "img/ingredient/ingredient4.png",
  },
];
