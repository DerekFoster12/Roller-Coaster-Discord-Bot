require('dotenv').config();
const{ REST, Routes} = require('discord.js');

const commands = [
    {
        name: 'hey',
        description: 'Replies with hey',
    },

    {
        name: 'ping',
        description: 'pong',
    },

    {
        name: 'coaster',
        description: 'Get stats of roller coaster by name',
        options: [
            {
                name: 'name',
                type: 3,
                description: 'Name of roller coaster',
                required: true,
            },
        ],
    },
    {
        name: 'random',
        description: 'Get a random roller coaster',
    },
];

const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

(async() => {
    try{
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {body: commands}
        );

        console.log('Slash commands were registered successfully!');
    } catch (error){
        console.log(`There was an error: ${error}`)
    }
})();