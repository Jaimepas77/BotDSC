const { Client, GatewayIntentBits, Partials, Collection, ActivityType } = require('discord.js');

const config = require('./config.json');

const { handleErrors } = require('./Functions/antiCrash');
const { loadEvents } = require('./Functions/loadEvents');
const { loadCommands } = require('./Functions/loadCommands');

const client = new Client({
    intents: [Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)],
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('Lhelp', { type: ActivityType.Listening });
});

client.commands = new Collection();
client.events = new Collection();
client.setMaxListeners(0);

//Detección de mensajes
client.on('messageCreate', async (message) => {

    //SALUDO
    const saludos = ['hola', 'holita', 'holi'];
    for (i = 0; i < saludos.length; i++) {
        if (message.content.toLowerCase().includes(saludos[i])) {
            return message.reply({ content: `👋 Buenas ${message.author}, como estás?` })
        }
    }

    //ELIMINACIÓN DE MALSONANTES
    //Si el mensaje es de un bot, no se elimina
    if (message.author.bot) return
    let insultos = []
    const fs = require('fs')
    fs.readFile('./insultos.txt', 'utf-8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        insultos = data.split('\r\n')
    });
    await new Promise(r => setTimeout(r, 1000));//Espera 1 segundo para que se carguen los insultos y si no se carga, no se elimina el mensaje

    for (i = 0; i < insultos.length; i++) {
        if (message.content.toLowerCase().includes(insultos[i].toLowerCase())) {
            message.channel.send({ content: `${message.author}, por favor no escribas ese tipo de groserías` })
            await message.delete()
            break
        }
    }

    //MENSAJE TROL XD
    if (message.content.includes('vaya bot')) {
        message.reply('¿Qué decis de mi? Porque siempre habláis a mi espalda ehh😡😡')
    }
})

//Consola
client.login(config.token).then(async () => {
    handleErrors(client)
    await loadEvents(client)
    await loadCommands(client)
}).catch((err) => {
    console.log(err);
});