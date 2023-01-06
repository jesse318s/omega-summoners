import {
  enemyCreatureLobby1,
  enemyCreaturesStage1,
  enemyCreaturesStage2,
} from "./enemyCreatures";

const stages = [
  {
    id: 1,
    name: "Mount Olympus",
    background: "stage1_game_section",
    levelReq: 5,
    isLobby: false,
    enemyCreatures: enemyCreaturesStage1,
  },
  {
    id: 2,
    name: "Ruins",
    background: "lobby1_game_section",
    levelReq: 5,
    isLobby: true,
    enemyCreatures: enemyCreatureLobby1,
  },
  {
    id: 3,
    name: "Countryside",
    background: "stage2_game_section",
    levelReq: 10,
    isLobby: false,
    enemyCreatures: enemyCreaturesStage2,
  },
];

export default stages;
