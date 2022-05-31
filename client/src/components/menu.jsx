import { Link } from "react-router-dom";
import { updateUser } from "../services/userServices";
import { getItem, addItem } from "../services/itemServices";
import { getPotionTimer, addPotionTimer } from "../services/potionTimerServices";
import { useState } from "react";
import { potionsList } from "../constants/items";
import { ingredientsList } from "../constants/items";
import recipeList from "../constants/recipes";

function Menu({
    Userfront, battleStatus, setBattleStatus, player, relicsData, relicsStatus, setRelicsStatus, playerRelics, templeStatus, setTempleStatus, creatureData, enemyCreatureData,
    summonsStatus, setSummonsStatus, stagesStatus, setStagesStatus, combatAlert, loadAsyncDataPlayer, setPlayerCreatureHP, setPlayerCreatureMP, playerCreature, chosenRelic,
    setEnemyCreature, setEnemyCreatureHP, setCombatAlert, setBattleUndecided, setSpawn, alchemyStatus, setAlchemyStatus, potions, setPotions, ingredients, setIngredients,
    summonHPBonus, setSummonHPBonus, summonMPBonus, setSummonMPBonus
}) {
    // sets index 1 state
    const [index1, setIndex1] = useState(0);
    // sets index 2 state
    const [index2, setIndex2] = useState(5);
    // sets index 3 state
    const [index3, setIndex3] = useState(0);
    // sets index 4 state
    const [index4, setIndex4] = useState(4);
    // sets index A state
    const [indexA, setIndexA] = useState(0);
    // sets index B state
    const [indexB, setIndexB] = useState(7);
    // sets index C state
    const [indexC, setIndexC] = useState(0);
    // sets index D state
    const [indexD, setIndexD] = useState(7);
    // sets index E state
    const [indexE, setIndexE] = useState(0);
    // sets index F state
    const [indexF, setIndexF] = useState(7);
    // sets index G state
    const [indexG, setIndexG] = useState(0);
    // sets index H state
    const [indexH, setIndexH] = useState(7);
    // sets potion status state
    const [potionsStatus, setPotionsStatus] = useState(false);
    // sets ingredient status state
    const [ingredientsStatus, setIngredientsStatus] = useState(false);
    // sets recipe status state
    const [recipesStatus, setRecipesStatus] = useState(false);
    // sets potion cooldown state
    const [potionCooldown, setPotionCooldown] = useState(false);

    // paginates creatures for summons menu
    const paginateCreatures = async (index1, direction) => {
        try {
            if (direction === "next" && index1 < creatureData.length - 5) {
                setIndex1(index1 + 5);
                setIndex2(index2 + 5);
            }
            else if (direction === "previous" && index1 > 0) {
                setIndex1(index1 - 5);
                setIndex2(index2 - 5);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // paginates player relics for relics menu
    const paginateRelics = async (indexA, direction) => {
        try {
            if (direction === "next" && indexA < playerRelics.length - 7) {
                setIndexA(indexA + 7);
                setIndexB(indexB + 7);
            }
            else if (direction === "previous" && indexA > 0) {
                setIndexA(indexA - 7);
                setIndexB(indexB - 7);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // paginates relics for temple menu
    const paginateTempleRelics = async (indexC, direction) => {
        try {
            if (direction === "next" && indexC < relicsData.length - 7) {
                setIndexC(indexC + 7);
                setIndexD(indexD + 7);
            }
            else if (direction === "previous" && indexC > 0) {
                setIndexC(indexC - 7);
                setIndexD(indexD - 7);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // paginates recipes for alchemy menu
    const paginateRecipes = async (index3, direction) => {
        try {
            if (direction === "next" && index3 < recipeList.length - 5) {
                setIndex3(index3 + 5);
                setIndex4(index4 + 5);
            }
            else if (direction === "previous" && index3 > 0) {
                setIndex3(index3 - 5);
                setIndex4(index4 - 5);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // paginates potions for alchemy menu
    const paginatePotions = async (indexE, direction) => {
        try {
            if (direction === "next" && indexE < potions.length - 7) {
                setIndexE(indexE + 7);
                setIndexF(indexF + 7);
            }
            else if (direction === "previous" && indexE > 0) {
                setIndexE(indexE - 7);
                setIndexF(indexF - 7);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // paginates ingredients for alchemy menu
    const paginateIngredients = async (indexG, direction) => {
        try {
            if (direction === "next" && indexG < ingredients.length - 7) {
                setIndexG(indexG + 7);
                setIndexH(indexH + 7);
            }
            else if (direction === "previous" && indexG > 0) {
                setIndexG(indexG - 7);
                setIndexH(indexH - 7);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // updates player chosen relic in database
    const selectRelic = async (relicId) => {
        try {
            if (window.confirm("Are you sure you want to select this relic? You can change relics as many times as you wish.")) {
                await Userfront.user.update({
                    data: {
                        userkey: Userfront.user.data.userkey,
                    },
                });
                await updateUser(player._id, { userfrontId: Userfront.user.userId, chosenRelic: relicId });
                await loadAsyncDataPlayer();
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // updates player relics in database
    const buyRelic = async (relicId, relicPrice) => {
        try {
            // if the player can afford the relic and doesn't own it
            if (player.drachmas >= relicPrice && !player.relics.includes(relicId)) {
                if (window.confirm(`Are you sure you want to buy this relic? It will cost ${relicPrice} drachmas.`)) {
                    await Userfront.user.update({
                        data: {
                            userkey: Userfront.user.data.userkey,
                        },
                    });
                    await updateUser(player._id, { userfrontId: Userfront.user.userId, drachmas: player.drachmas - relicPrice, relics: [...player.relics, relicId] });
                    await loadAsyncDataPlayer();
                }
            } else {
                alert("You can't afford this relic or you already own it.");
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // swaps player creature in database
    const swapCreature = async (creatureId, creaturePrice) => {
        try {
            // if the player can afford the creature and isn't already using it
            if (player.experience >= creaturePrice && player.creatureId !== creatureId) {
                if (window.confirm(`Are you sure you want to swap your creature for this one? It will cost ${creaturePrice} experience.`)) {
                    await Userfront.user.update({
                        data: {
                            userkey: Userfront.user.data.userkey,
                        },
                    });
                    await updateUser(player._id, { userfrontId: Userfront.user.userId, experience: player.experience - creaturePrice, creatureId: creatureId });
                    await loadAsyncDataPlayer();
                }
            } else {
                alert("You can't afford this creature or you already have it.");
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // enemy spawn animation
    const spawnAnimation = async () => {
        try {
            setSpawn("spawn_effect");
            setTimeout(() => {
                setSpawn("");
            }, 200);
        } catch (error) {
            console.log(error);
        }
    }

    // loads battle data
    const loadDataBattle = async () => {
        try {
            // checks and sets potion timer
            var potionTimer = [{}];
            await getPotionTimer().then(res => {
                potionTimer = res.data;
                // set to potion with same id
                if (res.data.length > 0) {
                    const playerPotion = potionsList.find(potion => potion.id === potionTimer[0].potionId);
                    const playerMPBonus = playerPotion.mpMod;
                    const playerHPBonus = playerPotion.hpMod;
                    setSummonMPBonus(playerMPBonus);
                    setSummonHPBonus(playerHPBonus);
                }
                if (res.data.length === 0) {
                    setSummonMPBonus(0);
                    setSummonHPBonus(0);
                }
            });

            setPlayerCreatureMP(playerCreature[0].mp + chosenRelic[0].mpMod + summonMPBonus);
            setPlayerCreatureHP(playerCreature[0].hp + chosenRelic[0].hpMod + summonHPBonus);
            spawnAnimation();
            const enemyCreature = [enemyCreatureData[Math.floor(Math.random() * enemyCreatureData.length)]];
            setEnemyCreature(enemyCreature);
            setEnemyCreatureHP(enemyCreature[0].hp);
            setCombatAlert("The battle has begun!");
            setBattleStatus(true);
            setBattleUndecided(true);
            await loadAsyncDataPlayer();
        }
        catch (error) {
            console.log(error);
        }
    }

    // loads alchemy data
    const loadDataAlchemy = async () => {
        try {
            setPotions([]);
            setIngredients([]);
            const { data } = await getItem();
            const playerPotionsData = data.filter(item => item.type === "Potion" && item.userId === player.userfrontId);
            const playerPotions = potionsList.filter(potion => playerPotionsData.some(item => item.itemId === potion.id));
            for (let i = 0; i < playerPotions.length; i++) {
                playerPotions[i].itemQuantity = playerPotionsData.find(item => item.itemId === playerPotions[i].id).itemQuantity;
            }
            setPotions(playerPotions);
            const playerIngredientsData = data.filter(item => item.type === "Ingredient" && item.userId === player.userfrontId);
            const playerIngredients = ingredientsList.filter(ingredient => playerIngredientsData.some(item => item.itemId === ingredient.id));
            for (let i = 0; i < playerIngredients.length; i++) {
                playerIngredients[i].itemQuantity = playerIngredientsData.find(item => item.itemId === playerIngredients[i].id).itemQuantity;
            }
            setIngredients(playerIngredients);
            setAlchemyStatus(true);
        }
        catch (error) {
            console.log(error);
        }
    }

    // creates a new potion
    const createPotion = async (potionId) => {
        try {
            if (!potionCooldown) {
                setPotionCooldown(true);
                const { data } = await getItem();
                const playerPotionData = data.filter(item => item.type === "Potion" && item.itemId === potionId);
                const potion = potionsList.find(item => item.id === potionId);
                const newPotionData = {
                    itemId: potion.id,
                    type: "Potion",
                    itemQuantity: playerPotionData[0] ? playerPotionData[0].itemQuantity + 1 : 1,
                    userId: Userfront.user.userId,
                };
                const playerIngredientData = data.filter(item => item.type === "Ingredient");
                const currentRecipe = recipeList.filter(item => item.potionProductId === potion.id);
                // check if player has enough ingredients for recipe
                const ingredient1Check = playerIngredientData.find(item => item.itemId === currentRecipe[0].ingredient1);
                const ingredient2Check = playerIngredientData.find(item => item.itemId === currentRecipe[0].ingredient2);
                if (ingredient1Check && ingredient1Check.itemQuantity > 0 && ingredient2Check && ingredient2Check.itemQuantity > 0) {
                    // confirm potion creation
                    if (window.confirm(`Are you sure you want to create this potion?`)) {
                        const currentIngredient1 = currentRecipe.map(item => playerIngredientData.find(ingredient => ingredient.itemId === item.ingredient1));
                        let currentIngredient1Data = playerIngredientData.filter(item => currentIngredient1.some(ingredient => ingredient.itemId === item.itemId));
                        const currentIngredient2 = currentRecipe.map(item => playerIngredientData.find(ingredient => ingredient.itemId === item.ingredient2));
                        let currentIngredient2Data = playerIngredientData.filter(item => currentIngredient2.some(ingredient => ingredient.itemId === item.itemId));
                        // delete the ingredients from the player's inventory
                        currentIngredient1Data[0].itemQuantity -= 1;
                        currentIngredient2Data[0].itemQuantity -= 1;
                        await Userfront.user.update({
                            data: {
                                userkey: Userfront.user.data.userkey,
                            },
                        });
                        await addItem(currentIngredient1Data[0]);
                        await loadDataAlchemy();
                        await Userfront.user.update({
                            data: {
                                userkey: Userfront.user.data.userkey,
                            },
                        });
                        await addItem(currentIngredient2Data[0]);
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
                            setPotionCooldown(false);
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            setPotionCooldown(false);
                        }, 1000);
                    }
                } else {
                    alert("You don't have enough ingredients for this potion.");
                    setTimeout(() => {
                        setPotionCooldown(false);
                    }, 1000);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // uses clicked potion
    const consumePotion = async (potionId) => {
        try {
            if (!potionCooldown) {
                await getPotionTimer();
                const timerData = await getPotionTimer();
                setPotionCooldown(true);
                const { data } = await getItem();
                const playerPotionData = data.filter(item => item.type === "Potion" && item.itemId === potionId);
                const potion = potionsList.find(item => item.id === potionId);
                const currentPotionData = playerPotionData.filter(item => item.itemId === potionId);
                // prevent over use
                if (timerData.data.length !== 0) {
                    alert("You already have an active potion. Please wait for it to expire.");
                    setTimeout(() => {
                        setPotionCooldown(false);
                    }, 1000);
                    return;
                }
                // check if player has enough potions
                if (currentPotionData[0].itemQuantity > 0) {
                    // confirm potion use
                    if (window.confirm(`Are you sure you want to use this potion?`) === true) {
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
                        await addPotionTimer(
                            {
                                userId: Userfront.user.userId,
                                potionId: potion.id,
                                potionDuration: potion.duration,
                            }
                        );
                        await loadDataAlchemy();
                        // checks and sets potion timer
                        var potionTimer = [{}];
                        getPotionTimer().then(res => {
                            potionTimer = res.data;
                            // set to potion with same id
                            if (res.data.length > 0) {
                                const playerPotion = potionsList.find(potion => potion.id === potionTimer[0].potionId);
                                const playerMPBonus = playerPotion.mpMod;
                                const playerHPBonus = playerPotion.hpMod;
                                setSummonMPBonus(playerMPBonus);
                                setSummonHPBonus(playerHPBonus);
                            }
                            setPlayerCreatureMP(playerCreature[0].mp + chosenRelic[0].mpMod + summonMPBonus);
                            setPlayerCreatureHP(playerCreature[0].hp + chosenRelic[0].hpMod + summonHPBonus);
                        });
                        setTimeout(() => {
                            setPotionCooldown(false);
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            setPotionCooldown(false);
                        }, 1000);
                    }
                } else {
                    alert("You don't have enough potions.");
                    setTimeout(() => {
                        setPotionCooldown(false);
                    }, 1000);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="color_white">
                {!battleStatus && !alchemyStatus ? <div><div className="inline_flex">
                    <button className="game_button margin_small" onClick={() => {
                        setRelicsStatus(!relicsStatus); setTempleStatus(false); setSummonsStatus(false);
                        setStagesStatus(false);
                    }}>Relics</button>
                    <button className="game_button margin_small" onClick={() => {
                        setTempleStatus(!templeStatus); setRelicsStatus(false); setSummonsStatus(false);
                        setStagesStatus(false);
                    }}>Temple</button>
                </div></div>
                    : null}
                {battleStatus ? <div><p className="combat_alert">{combatAlert}</p></div>
                    : null}
                {relicsStatus ? <div>
                    <h4>Player Relics</h4>
                    <button className="game_button_small margin_small" onClick={() => paginateRelics(indexA, "previous")}>Previous</button>
                    <button className="game_button_small margin_small" onClick={() => paginateRelics(indexA, "next")}>Next</button>
                    {playerRelics.slice(indexA, indexB).map((relic) => (
                        <div
                            className="relic_option"
                            key={relic.id}
                        >
                            <button className="game_button_small" onClick={() => selectRelic(relic.id)}>Use</button>
                            <img onClick={() => alert(relic.description)}
                                className="relic_option_img"
                                src={relic.imgPath}
                                alt={relic.name}
                                width="48px"
                                height="48px" /><span className="relic_info" onClick={() => alert(relic.description)}>?</span><br />
                            {relic.name} {relic.id === player.chosenRelic ? <i>{"\u2713"}</i> : null}
                        </div>))}
                </div>
                    : null
                }
                {templeStatus ? <div>
                    <h4>Temple Relics</h4>
                    <button className="game_button_small margin_small" onClick={() => paginateTempleRelics(indexC, "previous")}>Previous</button>
                    <button className="game_button_small margin_small" onClick={() => paginateTempleRelics(indexC, "next")}>Next</button>
                    {relicsData.slice(indexC, indexD).map((relic) => (
                        <div
                            className="relic_option"
                            key={relic.id}
                        >
                            <button className="game_button_small" onClick={() => buyRelic(relic.id, relic.price)}>Buy</button>
                            <img onClick={() => alert(relic.description)}
                                className="relic_option_img"
                                src={relic.imgPath}
                                alt={relic.name}
                                width="48px"
                                height="48px" /><span className="relic_info" onClick={() => alert(relic.description)}>?</span>
                            {player.relics.includes(relic.id) ? <i>{"\u2713"}</i> : null}<br />
                            {relic.name} - {relic.price} {"\u25C9"}
                        </div>))}
                </div>
                    : null
                }
                {!battleStatus && !alchemyStatus ? <>
                    <button className="game_button margin_small" onClick={() => {
                        setSummonsStatus(!summonsStatus); setTempleStatus(false); setRelicsStatus(false);
                        setStagesStatus(false);
                    }}>
                        Summons</button>
                    <button className="game_button margin_small" onClick={() => {
                        setStagesStatus(!stagesStatus); setSummonsStatus(false); setTempleStatus(false);
                        setRelicsStatus(false);
                    }}>
                        Stages</button>< br />
                </>
                    : null}
                {summonsStatus ? <div>
                    <h4>Available Summons</h4>
                    <button className="game_button_small margin_small" onClick={() => paginateCreatures(index1, "previous")}>Previous</button>
                    <button className="game_button_small margin_small" onClick={() => paginateCreatures(index1, "next")}>Next</button>
                    {creatureData.slice(index1, index2).map((creature) => (
                        <div
                            className="summon_option"
                            key={creature.id}
                        >
                            <button className="game_button_small" onClick={() => swapCreature(creature.id, creature.price)}>Swap</button>
                            <img onClick={() => alert("HP: " + creature.hp + "\nAttack: " + creature.attack + " | Attack type: " +
                                creature.attackType + "\nSpeed: " + creature.speed + "\nCritical: " + creature.critical + "%\nDefense: " + creature.defense
                                + "%\nMP: " + creature.mp + " | MP Regen: " + creature.mpRegen + "\nSpecial: " + creature.special + " | Special type: " +
                                creature.specialType + " | Special cost: " + creature.specialCost + "\n\nMagic attacks ignore defense, and poison attacks are always critical.")}
                                className="summon_option_img"
                                src={creature.imgPath}
                                alt={creature.name}
                                width="96px"
                                height="96px" /><span className="summon_info" onClick={() => alert("HP: " + creature.hp + "\nAttack: " + creature.attack + " | Attack type: " +
                                    creature.attackType + "\nSpeed: " + creature.speed + "\nCritical: " + creature.critical + "%\nDefense: " + creature.defense
                                    + "%\nMP: " + creature.mp + " | MP Regen: " + creature.mpRegen + "\nSpecial: " + creature.special + " | Special type: " +
                                    creature.specialType + " | Special cost: " + creature.specialCost + "\n\nMagic attacks ignore defense, and poison attacks are always critical.")}>?</span>
                            <br />
                            {creature.name} - {creature.price} XP {creature.id === player.creatureId ? <i>{"\u2713"}</i> : null}
                        </div>))}
                </div>
                    : null
                }
                {stagesStatus ? <>
                    <h4>Battle Stages</h4>
                    <div className="stage_options">
                        <Link to="/app">
                            <button className="game_button_small margin_small">Lvl. 0 | Home<br /> The Bridge (Solo)</button>
                            {window.location.pathname === "/app" ? <span className="color_white">X</span> : null}
                        </Link><br />
                        <Link to="/stage1">
                            <button className="game_button_small margin_small">Lvl. 5 | Stage I<br /> Mount Olympus (Solo)</button>
                            {window.location.pathname === "/stage1" ? <span className="color_white">X</span> : null}
                        </Link><br />
                        <Link to="/lobby1">
                            <button className="game_button_small margin_small">Lvl. 8 | Stage I<br /> (Multiplayer)</button>
                            {window.location.pathname === "/lobby1" ? <span className="color_white">X</span> : null}
                        </Link><br /></div>
                </>
                    : null
                }
                {!battleStatus && !alchemyStatus ? <>
                    <button className="game_button margin_small" onClick={() => {
                        loadDataAlchemy(); setTempleStatus(false); setRelicsStatus(false); setSummonsStatus(false);
                        setStagesStatus(false);
                    }}>
                        Alchemy</button>
                </>
                    : null}
                {!battleStatus && !alchemyStatus ? <>
                    <button className="game_button margin_small" onClick={() => {
                        loadDataBattle(); setTempleStatus(false); setRelicsStatus(false); setSummonsStatus(false);
                        setStagesStatus(false);
                    }}>
                        Battle</button> </>
                    : null}
                {
                    alchemyStatus ? <div>
                        <button className="game_button margin_small" onClick={() => {
                            setAlchemyStatus(false); setRecipesStatus(false); setIngredientsStatus(false); setPotionsStatus(false);
                        }}> Exit Alchemy</button><br />
                        <button className="game_button margin_small" onClick={() => {
                            setRecipesStatus(!recipesStatus); setIngredientsStatus(false); setPotionsStatus(false);
                        }}> Recipes </button>
                        <button className="game_button margin_small" onClick={() => {
                            setPotionsStatus(!potionsStatus); setIngredientsStatus(false); setRecipesStatus(false);
                        }}> Potions </button>< br />
                        {recipesStatus ? <div>
                            <h4 className="margin_small">Available Recipes</h4>
                            <button className="game_button_small margin_small" onClick={() => { paginateRecipes(index3, "previous") }}>Previous</button>
                            <button className="game_button_small margin_small" onClick={() => { paginateRecipes(index3, "next") }}>Next</button>
                            {recipeList.slice(index3, index4).map((recipe) => (
                                <div
                                    className="recipe_option"
                                    key={recipe.id}
                                >
                                    <button className="game_button_small margin_small" onClick={() => { createPotion(recipe.potionProductId) }} >Create<br />Potion</button>
                                    <img onClick={() => alert(recipe.description)}
                                        className="recipe_option_img"
                                        src={recipe.imgPath}
                                        alt={recipe.name}
                                        width="96px"
                                        height="96px" /><span className="recipe_info" onClick={() => alert(recipe.description)}>?</span>
                                    <h5>Recipe: {recipe.name}</h5>
                                </div>))}
                        </div>
                            : null}
                        {potionsStatus ? <div>
                            <h4 className="margin_small">Player Potions</h4>
                            <button className="game_button_small margin_small" onClick={() => paginatePotions(indexE, "previous")}>Previous</button>
                            <button className="game_button_small margin_small" onClick={() => paginatePotions(indexE, "next")}>Next</button>
                            {potions.slice(indexE, indexF).map((potion) => (
                                <div
                                    className="alchemy_item_option"
                                    key={potion.id}
                                >
                                    <button className="game_button_small margin_small" onClick={() => consumePotion(potion.id)}>Use</button>
                                    <img onClick={() => alert(potion.description)}
                                        className="alchemy_item_option_img"
                                        src={potion.imgPath}
                                        alt={potion.name}
                                        width="48px"
                                        height="48px" /><span className="alchemy_item_info" onClick={() => alert(potion.description)}>?</span>
                                    <h5>{potion.name} x {potion.itemQuantity}</h5>
                                </div>))}
                        </div>
                            : null}
                        <button className="game_button margin_small" onClick={() => {
                            setIngredientsStatus(!ingredientsStatus); setPotionsStatus(false); setRecipesStatus(false);
                        }}> Ingredients </button>
                        {ingredientsStatus ? <div>
                            <h4 className="margin_small">Player Ingredients</h4>
                            <button className="game_button_small margin_small" onClick={() => paginateIngredients(indexG, "previous")}>Previous</button>
                            <button className="game_button_small margin_small" onClick={() => paginateIngredients(indexG, "next")}>Next</button>
                            {ingredients.slice(indexG, indexH).map((ingredient) => (
                                <div
                                    className="alchemy_item_option"
                                    key={ingredient.id}
                                >
                                    <img onClick={() => alert(ingredient.description)}
                                        className="alchemy_item_option_img"
                                        src={ingredient.imgPath}
                                        alt={ingredient.name}
                                        width="48px"
                                        height="48px" /><span className="alchemy_item_info" onClick={() => alert(ingredient.description)}>?</span>
                                    <h5>{ingredient.name} x {ingredient.itemQuantity}</h5>
                                </div>))}
                        </div>
                            : null}
                    </div>
                        : null
                }
            </div>
        </>
    );
}

export default Menu;