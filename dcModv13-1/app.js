const {Client} = require('discord.js');
const client = new Client({intents:519});
const fs = require('fs');
const db = require('mongoose');
const {REST} = require('@discordjs/rest');
const { Routes } = require("discord-api-types/v10");
const token = "OTgwNTI3MTAxMDA4NTUyMDA3.GWpaUN.raHZ5dkVWVmMCN4peMQDcTWKZwyU-9qSlw6vvo";
const mongoDB = "mongodb+srv://baniks:baniks@cluster0.x1s7d.mongodb.net/?retryWrites=true&w=majority";
db.connect(mongoDB)
.then(() => console.log("MongoDB bağlantısı başarılı"))
.catch(err => console.log("Mongo bağlantısı başarısız oldu: "+err));

global.client = client;
client.commands = (global.commands = []);
//#region KOMUTLAR LOAD
fs.readdir("./komutlar/", (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        let props = require(`./komutlar/${file}`);
    
        client.commands.push({
             name: props.name.toLowerCase(),
             description: props.description,
             options: props.options,
             type: props.type,
        })
        console.log(`👌 Slash Komut Yüklendi: ${props.name}`);
    });
});
//#endregion
//#region EVENTS LOAD
fs.readdir("./events/", (_err, files) => {
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        
        console.log(`👌 Event yüklendi: ${eventName}`);
        client.on(eventName, (...args) => {
           event(client, ...args);
        });
    });
});
//#endregion
//#region KOMUTLAR SET
client.on("ready",async () => {

    console.log("Bot Hizmete Hazır!");
    client.user.setActivity("/yardım", {type:"WATCHING"});
    const rest = new REST({ version: "10" }).setToken(token);
    try {
      await rest.put(Routes.applicationCommands(client.user.id), {
        body: commands,
      });
    
    } catch (error) {
      console.error(error);
    }
});
//#endregion
client.login(token);

