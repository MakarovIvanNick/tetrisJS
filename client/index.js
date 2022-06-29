import Game from './src/game.js';
import View from './src/view.js';
import Controller from './src/controller.js';

const WS_URL = "ws://localhost:5000";

const websocket = {};

const root = document.querySelector('#root');

const game = new Game();
const game2 = new Game();

const view = new View(root, 480, 640, 20, 10);
const view2 = new View(root, 480, 640, 20, 10);
let controller;
let controller2 = new Controller(game2, view2, null, false);

async function messageHandler(message){
    let state = JSON.parse(await message.data.text());
    controller2.isPlaying = true;
    controller2.updateView(state);
}

const connectToServer = function () {
    const client = new WebSocket(WS_URL);
    websocket.client = client;
    controller = new Controller(game,view,client, true);
    client.onmessage = function (message) {
        try {
            messageHandler(message);
        } catch (error) {
            console.log(error);
            console.log(message);
        }
    }
};

connectToServer();

window.game = game;
window.game2 = game2;
window.view = view;
window.view2 = view2;
window.controller = controller;
window.controller2 = controller2;

