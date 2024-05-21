import {DMChannel, Message, TextChannel, ThreadChannel} from "discord.js";
import * as AppConfig from "./AppConfig";

export async function handleMessage(message: Message<boolean>) {
    if (message.author.bot || !message.content) {
        return;
    }

    if(message.channel instanceof DMChannel) {
        await handleDm(message, message.channel as DMChannel);
        return;
    }
    
    if(message.channel instanceof ThreadChannel) {
        await handleThreadMessage(message, message.channel as ThreadChannel);
        return;
    }
    
    if(message.channel instanceof TextChannel) {
        await handleTextMessage(message, message.channel as TextChannel);
        return;
    }
    
    // Ignore all other message types
}

async function handleDm(message: Message<boolean>, channel: DMChannel) {
    if(!AppConfig.getAllowDms()) {
        return
    }
}


async function handleThreadMessage(message: Message<boolean>, channel: ThreadChannel) {
}

async function handleTextMessage(message: Message<boolean>, channel: TextChannel) {

}