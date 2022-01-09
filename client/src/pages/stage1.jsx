import React, { useEffect, useState } from "react";
import '../App.scss';
import "./stage1.scss";
import Userfront from "@userfront/core";
import { useNavigate } from "react-router-dom";
import { getUser } from '../services/userServices';
import GameNav from '../components/gameNav';
import Options from "../components/options";
import Player from "../components/player";
import Menu from "../components/menu";
import PlayerCreature from "../components/playerCreature";
import EnemyCreature from "../components/enemyCreature";
import creatures from "../constants/creatures";
import relics from "../constants/relics";
import { enemyCreaturesStage1 } from "../constants/enemyCreatures";

// initialize Userfront
Userfront.init("rbvqd5nd");

// main app component
function Stage1() {

    // navigation hook
    const navigate = useNavigate();

    // sets player state
    const [player, setPlayer] = useState({});
    // sets player options states
    const [optionsStatus, setOptionsStatus] = useState(false);
    const [avatarOptionStatus, setAvatarOptionStatus] = useState(false);
    const [nameOptionStatus, setNameOptionStatus] = useState(false);
    // sets relics, temple, and summons state
    const [relicsStatus, setRelicsStatus] = useState(false);
    const [templeStatus, setTempleStatus] = useState(false);
    const [summonsStatus, setSummonsStatus] = useState(false);
    const [stagesStatus, setStagesStatus] = useState(false);
    // sets player and enemy creatures state
    const [creatureData] = useState(creatures);
    const [enemyCreatureData] = useState(enemyCreaturesStage1);
    // sets player creature state
    const [playerCreature, setPlayerCreature] = useState({});
    // sets creature stats state
    const [creatureStatsStatus, setCreatureStatsStatus] = useState(false);
    // sets battle and enemy creature state
    const [battleStatus, setBattleStatus] = useState(false);
    const [enemyCreature, setEnemyCreature] = useState({});
    // sets player and enemy creature attack state
    const [playerAttackStatus, setPlayerAttackStatus] = useState(false);
    const [enemyAttackStatus, setEnemyAttackStatus] = useState(false);
    // sets special status state
    const [specialStatus, setSpecialStatus] = useState(false);
    // sets player and enemy creature hp state
    const [playerCreatureHP, setPlayerCreatureHP] = useState(0);
    const [enemyCreatureHP, setEnemyCreatureHP] = useState(0);
    // sets player creature MP state
    const [playerCreatureMP, setPlayerCreatureMP] = useState(0);
    // sets relics state
    const [relicsData] = useState(relics);
    // sets player relics state
    const [playerRelics, setPlayerRelics] = useState([{}]);
    // sets chosen relic state
    const [chosenRelic, setChosenRelic] = useState({});
    // sets combat alert state
    const [combatAlert, setCombatAlert] = useState("");
    // sets battle decision state
    const [battleUndecided, setBattleUndecided] = useState(false);
    // sets combat text state
    const [combatText, setCombatText] = useState("");
    // sets crit text state
    const [critText, setCritText] = useState("combat_text");

    useEffect(() => {
        // checks for userfront authentication and redirects visitor if not authenticated
        const checkAuth = () => {
            try {
                if (!Userfront.accessToken()) {
                    navigate('/');
                }
            } catch (error) {
                console.log(error);
            }
        }
        checkAuth();
    });

    useEffect(() => {
        // checks for userkey and logs user out if none is found
        const checkDataPlayer = () => {
            try {
                // if there is no user key
                if (Userfront.user.data.userkey === undefined) {
                    Userfront.logout();
                }
            } catch (error) {
                console.log(error);
            }
        }
        // retrieves user data and updates player state
        const loadAsyncDataPlayer = async () => {
            try {
                const { data } = await getUser();
                setPlayer(data);
            } catch (error) {
                console.log(error);
            }
        }
        checkDataPlayer();
        loadAsyncDataPlayer();
    }, []);

    useEffect(() => {
        // if there is a player
        if (player) {
            try {
                // checks player level for stage requirements
                const checkLevelPlayer = () => {
                    try {
                        if (Math.floor(Math.sqrt(player.experience) * 0.25) < 5) {
                            alert("You must be level 5 to battle at this stage.");
                            navigate(-1);
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                // loads player creature data and sets player creature state
                const loadDataPlayerCreature = () => {
                    const playerCreatureData = creatureData.filter(creature => creature.id === player.creatureId);
                    setPlayerCreature(playerCreatureData);
                    setCreatureStatsStatus(player.displayCreatureStats);
                }
                checkLevelPlayer();
                loadDataPlayerCreature();
            } catch (error) {
                console.log(error);
            }
            // if there are player relics
            if (player.relics) {
                try {
                    // loads player relics data
                    const loadDataPlayerRelics = () => {
                        const playerRelicsData = relicsData.filter(relic => player.relics.includes(relic.id));
                        setPlayerRelics(playerRelicsData);
                        const chosenRelicData = playerRelicsData.filter(relic => relic.id === player.chosenRelic);
                        setChosenRelic(chosenRelicData);
                    }
                    loadDataPlayerRelics();

                } catch (error) {
                    console.log(error);
                }
            }
        }
    }, [player, relicsData, creatureData, navigate]);

    // retrieves user data and updates player state
    const loadAsyncDataPlayer = async () => {
        try {
            const { data } = await getUser();
            setPlayer(data);
        } catch (error) {
            console.log(error);
        }
    }

    // renders if a relic is bestowed
    if (chosenRelic[0]) {
        return (
            <>
                <header>
                    <GameNav Userfront={Userfront} optionsStatus={optionsStatus} setOptionsStatus={setOptionsStatus} setNameOptionStatus={setNameOptionStatus}
                        setAvatarOptionStatus={setAvatarOptionStatus} />
                </header>

                <main className="stage1_game_section">
                    <Options Userfront={Userfront} player={player} optionsStatus={optionsStatus} nameOptionStatus={nameOptionStatus} setNameOptionStatus={setNameOptionStatus}
                        avatarOptionStatus={avatarOptionStatus} setAvatarOptionStatus={setAvatarOptionStatus} creatureStatsStatus={creatureStatsStatus}
                        loadAsyncDataPlayer={() => loadAsyncDataPlayer()} />

                    <Player player={player} />

                    {/* menu and creatures wrapped in options status check */}
                    {!optionsStatus ? <>

                        <Menu Userfront={Userfront} battleStatus={battleStatus} setBattleStatus={setBattleStatus} player={player} setPlayer={setPlayer} relicsData={relicsData}
                            relicsStatus={relicsStatus} setRelicsStatus={setRelicsStatus} playerRelics={playerRelics} templeStatus={templeStatus} setTempleStatus={setTempleStatus}
                            creatureData={creatureData} enemyCreatureData={enemyCreatureData} summonsStatus={summonsStatus} setSummonsStatus={setSummonsStatus}
                            stagesStatus={stagesStatus} setStagesStatus={setStagesStatus} combatAlert={combatAlert} loadAsyncDataPlayer={() => loadAsyncDataPlayer()}
                            setPlayerCreatureHP={setPlayerCreatureHP} setPlayerCreatureMP={setPlayerCreatureMP} playerCreature={playerCreature} chosenRelic={chosenRelic}
                            setEnemyCreature={setEnemyCreature} setEnemyCreatureHP={setEnemyCreatureHP} setCombatAlert={setCombatAlert} setBattleUndecided={setBattleUndecided} />

                        <PlayerCreature summonsStatus={summonsStatus} playerCreature={playerCreature} enemyAttackStatus={enemyAttackStatus} setEnemyAttackStatus={setEnemyAttackStatus}
                            critText={critText} setCritText={setCritText} combatText={combatText} playerAttackStatus={playerAttackStatus} setPlayerAttackStatus={setPlayerAttackStatus}
                            chosenRelic={chosenRelic} specialStatus={specialStatus} setSpecialStatus={setSpecialStatus} battleStatus={battleStatus} setBattleStatus={setBattleStatus}
                            player={player} creatureStatsStatus={creatureStatsStatus} playerCreatureHP={playerCreatureHP} setPlayerCreatureHP={setPlayerCreatureHP}
                            playerCreatureMP={playerCreatureMP} setPlayerCreatureMP={setPlayerCreatureMP} setCombatText={setCombatText} enemyCreature={enemyCreature}
                            setEnemyCreature={setEnemyCreatureHP} battleUndecided={battleUndecided} setBattleUndecided={setBattleUndecided} enemyCreatureHP={enemyCreatureHP}
                            setEnemyCreatureHP={setEnemyCreatureHP} Userfront={Userfront} loadAsyncDataPlayer={() => loadAsyncDataPlayer()} setCombatAlert={setCombatAlert} />

                        <EnemyCreature battleStatus={battleStatus} enemyCreature={enemyCreature} playerAttackStatus={playerAttackStatus} enemyAttackStatus={enemyAttackStatus}
                            critText={critText} combatText={combatText} enemyCreatureHP={enemyCreatureHP} />

                    </> : null}
                </main >
            </>
        );
    }
    else return (<></>);
}

export default Stage1;