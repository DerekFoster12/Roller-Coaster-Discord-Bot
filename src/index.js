const axios = require('axios');
require('dotenv').config();
const {Client, IntentsBitField} = require('discord.js');


const client = new Client({
    // set of permissions for the bot
    intents: [
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

// log to console bot is online
client.on('ready',(c) => {
    console.log(`${c.user.tag} is online.`);
});

// respond to user saying hello
client.on('messageCreate', (message) => {
    // if message is from bot, ignore
    if(message.author.bot){
        return;
    }

    if(message.content === 'Hello'){
        message.reply('Hello');
    }
});

// respond to user using slash commands
client.on('interactionCreate', async (interaction) => {
    if(!interaction.isChatInputCommand()) return;

    // hey command
    if(interaction.commandName === 'hey'){
        interaction.reply('Hey!');
    }

    // ping command
    if(interaction.commandName === 'ping'){
        interaction.reply('pong');
    }

    // coaster command
    if(interaction.commandName === 'coaster'){
        const searchTerm = interaction.options.getString('name');
        try{
// Debug for console
console.log(`Querying for ${searchTerm}`);

            // Query API for coaster and set it to response constant
            const response = await axios.get(`https://rcdb-api.vercel.app/api/coasters/search?q=${searchTerm}`);

// Debug for console
console.group('Response Status: ', response.status);

            // Ensure that response has an object and has data
            if(typeof response.data == 'object' && response.data !== null){
                const coaster = response.data.coasters[0];

                // call print coaster function
                await printCoasterStats(interaction, coaster);

            // Error statement for discord bot if coaster is not found
            } else{
                await interaction.reply('No roller coaster found');
            }
        }

        // Catched satement if there was an nerror finding the coaster
        catch(error){
            console.error(error);
            interaction.reply('Error searching for roller coaster');
        }
    }

    // command that prints a random coaster in discord
    if(interaction.commandName === 'random'){
        console.log('Querying for random coaster');
        await interaction.reply('Querying for random coaster');
        await getRandomCoaster(interaction);
    }
});

// Function to print coster stats, can be reused
async function printCoasterStats(interaction, coaster){
    await interaction.reply(`Found Coaster: ${coaster.name}
    Park: ${coaster.park.name}
    Location: ${coaster.city}, ${coaster.state}, ${coaster.country}
    Company: ${coaster.make}
    Opened: ${coaster.status.date.opened}
    Height: ${coaster.stats.height} meters
    Length: ${coaster.stats.length} meters
    Speed: ${coaster.stats.speed} km/h
    Inversions: ${coaster.stats.inversions}
    Capacity: ${coaster.stats.arrangement}
    Operating: ${coaster.status.state}`);
}

// Function to do random coaster requests
async function getRandomCoaster(interaction){
    try{
        const response = await axios.get('https://rcdb-api.vercel.app/api/coasters');

        if(Array.isArray(response.data) && response.data.length > 0){
            const randomIndex = Math.floor(Math.random() * response.data.length);
            const coaster = response.data[randomIndex];
            await printCoasterStats(interaction, coaster);
        } else{
            await interaction.reply('No roller coasters found');
        }
    } catch(error){
        console.error(error);
        await interaction.reply('Error searching for roller coaster');
    }
}

client.login(process.env.TOKEN);
