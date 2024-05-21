import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import { handleMessage } from "./MessagesHandler";
import * as AppConfig from "./AppConfig";

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

discordClient.on('messageCreate', async (message: Discord.Message<boolean>) => {
    await handleMessage(message);
})

console.log("Logging in to Discord...")
discordClient.login(AppConfig.getDiscordToken())
    .then(() => console.log("Discord LogIn Finished"))