import {DMChannel, Message, TextChannel, ThreadChannel} from "discord.js";
import * as AppConfig from "./AppConfig";
import * as AssistantsHandler from "./AssistantsHandler";

export async function handleMessage(message: Message<boolean>) : Promise<void> {
    try {
        if (message.author.bot || !message.content) {
            return;
        }

        if (message.channel instanceof DMChannel) {
            await handleDm(message, message.channel as DMChannel);
            return;
        }

        if (message.channel instanceof ThreadChannel) {
            await handleThreadMessage(message, message.channel as ThreadChannel);
            return;
        }

        if (message.channel instanceof TextChannel) {
            await handleChannelMessage(message, message.channel as TextChannel);
            return;
        }

        // Ignore all other message types
    }
    catch (error) {
        await replyWithCouldNotReply(message);
        console.error(error);
    }
}

async function finishMessageFetch(message: Message<boolean>){
    if(message.partial){
        try {
            await message.fetch();
        } catch (error) {
            console.error(`Failed to fetch message: ${error}`);
            return;
        }
    }
}

async function handleDm(message: Message<boolean>, channel: DMChannel) {
    if(!AppConfig.getAllowDms()) {
        return
    }
    
    await finishMessageFetch(message);
    
    const messagesHistory = await channel.messages.fetch({ limit: AppConfig.getHistoryLimit() });

    const replyMessage : string = await AssistantsHandler.getBotReply(messagesHistory.map(msg => msg));

    logMessageAndReply(message, replyMessage);
    
    await channel.send(replyMessage);
}

async function handleThreadMessage(message: Message<boolean>, channel: ThreadChannel) {
    await finishMessageFetch(message);
}

async function handleChannelMessage(message: Message<boolean>, channel: TextChannel) {
    await finishMessageFetch(message);
}

async function replyWithCouldNotReply(message: Message<boolean>) {
    console.error(`Message Received in channel ${message.channel}: <${message.author.tag}> ${message.content} \n -> Bot has no reply: error occured`);
    
    try{
        await message.reply("I'm sorry, I couldn't properly reply to your message. Please try again later.")
    } catch (error) {
        console.error(`Error replying to message: ${error}`);
    }
}

async function replyToMessage(message: Message<boolean>, reply: string) {
    logMessageAndReply(message, reply);
    
    if (reply) {
        await message.reply(reply);
    }
}

function logMessageAndReply(message: Message<boolean>, reply: string) {
    if (!AppConfig.getLogAllMessages()) {
        return;
    }
    
    if(reply) {
            console.log(`Message Received in channel ${message.channel}: <${message.author.tag}> ${message.content} \n -> Bot reply: ${reply}`);
    }
    else {
            console.log(`Message Received in channel ${message.channel}: <${message.author.tag}> ${message.content} \n -> Bot has no reply`);
    }
}
