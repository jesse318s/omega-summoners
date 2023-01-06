import {
  enemyCreaturesStage1,
  enemyCreaturesStage3,
  enemyCreaturesStage4,
  enemyCreatureLobby1,
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
    levelReq: 8,
    isLobby: true,
    enemyCreatures: enemyCreatureLobby1,
  },
  {
    id: 3,
    name: "Countryside",
    background: "stage3_game_section",
    levelReq: 10,
    isLobby: false,
    enemyCreatures: enemyCreaturesStage3,
  },
  {
    id: 4,
    name: "Pillaged Ruins",
    background: "stage4_game_section",
    levelReq: 12,
    isLobby: false,
    enemyCreatures: enemyCreaturesStage4,
  },
];

export default stages;
