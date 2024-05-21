import * as Discord from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

let intents : Discord.BitFieldResolvable<Discord.GatewayIntentsString, number> = [
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMessages,
]

if(process.env.ALLOW_DMS === "true"){
    intents = intents.concat(Discord.GatewayIntentBits.DirectMessages)
}

const discordClientOptions : Discord.ClientOptions = {intents: intents}
const discordClient = new Discord.Client(discordClientOptions);

discordClient.once(Discord.Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
})

console.log("Logging in to Discord...")
discordClient.login(process.env.DISCORD_BOT_TOKEN)
    .then(() => console.log("Discord LogIn Finished"))