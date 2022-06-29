const { Server } = require("ws");
const WS = require("ws");

const PORT = 5000

const server = new WS.Server({port: PORT});

function messageHandler(message, client){
    server.clients.forEach(cli=>{
       if(client!=cli){
           cli.send(message);
       }
    });
}

server.on("connection", client => {
        client.id = Date.now();
        console.log("New player " + client.id);
        client.on("close", ()=>{
           console.log("Player " + client.id + " is quit");
        });
        client.on("message", message => {
            try {
                messageHandler(message,client);
            } catch (error){
                console.log(error);
                console.log(message);
            }
        });
    });