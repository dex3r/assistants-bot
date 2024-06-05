import {
    AnyThreadChannel,
    BaseChannel,
    BaseGuildTextChannel,
    DMChannel,
    Message,
    MessageType,
    TextChannel,
    ThreadChannel
} from "discord.js";
import * as AppConfig from "./AppConfig";
import * as AssistantsHandler from "./AssistantsHandler";
import {discordClient} from "./index";

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
    
    await channel.sendTyping();
    
    await finishMessageFetch(message);
    
    let messagesHistory = await channel.messages.fetch({ limit: AppConfig.getHistoryLimit() });
    messagesHistory = messagesHistory.reverse();

    const replyMessages : string[] = await AssistantsHandler.getBotReply(messagesHistory.map(msg => msg));
    
    for(const replyMessage of replyMessages) {
        logMessageAndReply(message, replyMessage);
        
        await channel.send(replyMessage);
    }
}

async function handleThreadMessage(message: Message<boolean>, channel: ThreadChannel) {
    await finishMessageFetch(message);
}

async function handleChannelMessage(message: Message<boolean>, channel: TextChannel) {
    await finishMessageFetch(message);
    
    //const isImmediateReplyToMyMessage : boolean = getIsImmediateReplyToMyMessage(message);
    //const isReplyToMyMessage : boolean = getIsReplyToMyMessage(message);
    
    if(AppConfig.getAnswerChannelMentions() && getAmIMentioned(message)) {
        
        if(AppConfig.getAnswerInThread()){
            await generateAndSendReplayInNewThread(message, channel);
        } else {
            await channel.sendTyping();
            await generateAndSendReply(message, await getRepliesHistory(message));
        }
        
        return;
    }
}

async function generateAndSendReplayInNewThread(message: Message<boolean>, channel: TextChannel) {
    const targetChannel: AnyThreadChannel<boolean> | null = await tryToCreateNewThread(message, channel);
    
    if(targetChannel === null) {
        await generateAndSendReply(message, await getRepliesHistory(message));
        return;
    }
    
    await targetChannel.sendTyping();

    const replyMessages : string[] = await AssistantsHandler.getBotReply([message]);

    for(const replyMessage of replyMessages) {
        logMessageAndReply(message, replyMessage);

        await targetChannel.send(replyMessage);
    }
}

async function generateAndSendReply(message: Message<boolean>, messagesHistory: Message<boolean>[]) {
    const replyMessages : string[] = await AssistantsHandler.getBotReply(messagesHistory);

    for(const replyMessage of replyMessages) {
        logMessageAndReply(message, replyMessage);

        await message.reply(replyMessage);
    }
}

async function getRepliesHistory(message: Message<boolean>) {
    if(message.partial){
        await message.fetch();
    }
    
    const result : Message<boolean>[] = [];
    result.push(message);

    let nextMessage : Message<boolean> = message;

    while(nextMessage.type === MessageType.Reply) {
        nextMessage = await nextMessage.fetchReference();
        
        if(nextMessage.partial) {
            await nextMessage.fetch();
        }
        
        result.push(nextMessage);
    }
    
    return result.reverse();
}

function getAmIMentioned(message: Message<boolean>) {
    return message.mentions.parsedUsers.has(discordClient.user.id);
}

async function tryToCreateNewThread(message: Message<boolean>, channel: TextChannel) : Promise<AnyThreadChannel<boolean> | null> {
    try {
        const newThread: AnyThreadChannel<boolean> = await message.startThread({name: `${discordClient.user.displayName} answer thread to ${message.content}`});
        if (newThread) {
            return newThread
        } else {
            console.warn(`Failed to create thread in channel ${channel.id}`);
            return null;
        }
    } catch (error) {
        console.error(`Failed to create thread in channel ${channel.id}: ${error}`);
        return null;
    }
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
