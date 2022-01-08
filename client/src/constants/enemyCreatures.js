const enemyCreatures = [
    {
        id: 1,
        name: "Demon",
        imgPath: "img/creature/demon_creature.png",
        reward: 3,
        hp: 60,
        attack: 50,
        attackType: "Normal",
        speed: 60,
        defense: 20,
        critical: 50,
    },
    {
        id: 2,
        name: "Lizard",
        imgPath: "img/creature/lizard_creature.png",
        reward: 3,
        hp: 110,
        attack: 30,
        attackType: "Normal",
        speed: 30,
        defense: 15,
        critical: 20,
    },
    {
        id: 3,
        name: "Medusa",
        imgPath: "img/creature/medusa_creature.png",
        reward: 5,
        hp: 110,
        attack: 30,
        attackType: "Magic",
        speed: 30,
        defense: 15,
        critical: 20,
    },
    {
        id: 4,
        name: "Baby Dragon",
        imgPath: "img/creature/small_dragon_creature.png",
        reward: 5,
        hp: 60,
        attack: 50,
        attackType: "Magic",
        speed: 60,
        defense: 20,
        critical: 50,
    }
];

export default enemyCreatures;