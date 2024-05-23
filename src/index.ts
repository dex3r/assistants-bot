import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import { handleMessage } from "./MessagesHandler";
import * as AppConfig from "./AppConfig";

dotenv.config();

let intents : Discord.BitFieldResolvable<Discord.GatewayIntentsString, number> = [
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.Guilds
]

const partials : Discord.Partials[] = []

if(AppConfig.getAllowDms()){
    console.log("Config: allowing DMs")
    intents = intents.concat(Discord.GatewayIntentBits.DirectMessages)
    partials.push(Discord.Partials.Channel)
}
else {
    console.log("Config: not allowing DMs")
}

const discordClientOptions : Discord.ClientOptions = {intents: intents, partials: partials}
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