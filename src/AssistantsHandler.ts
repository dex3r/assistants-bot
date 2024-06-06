import {DMChannel, Message, TextChannel, ThreadChannel} from "discord.js";
import * as AppConfig from "./AppConfig";
import {OpenAI} from "openai";
import {ThreadCreateParams} from "openai/src/resources/beta/threads/threads";
import * as dotenv from "dotenv";
import {discordClient} from "./index";

dotenv.config();

const openai = new OpenAI({
    apiKey: AppConfig.getOpenAiKey()
});

export async function getBotReply(messages: Message<boolean>[]) : Promise<string[]> {
    const messagesForAssistant : Array<ThreadCreateParams.Message> = messages.map(msg => {
        return {
            role: msg.author.id === discordClient.user.id ? "assistant" : "user",
            content: `<${msg.author.displayName}> ${msg.cleanContent}`
        }
    });

    if(AppConfig.getLogAssistantsRequests()) {
        console.log("Sending OpenAI request with the following messages:");
        console.log(JSON.stringify(messagesForAssistant, null, 2));
    }
    
    const thread = await openai.beta.threads.create({messages: messagesForAssistant});

    const run = openai.beta.threads.runs.stream(
        thread.id,
        { assistant_id: AppConfig.getAssistantId() }
    )
    
    const threadMessages = await run.finalMessages();
    const responses : string[] = [];
    
    for(const message of threadMessages) {
        for (const content of message.content) {
            if(content.type === "text") {
                if(AppConfig.getLogAssistantsRequests()) {
                    console.log(`Received OpenAI response: ${content.text.value}`);
                }
                
                const clearResponses = cleanupResponse(content.text.value);
                clearResponses.forEach(response => responses.push(response));
                
            } else {
                console.error(`Received unsupported message type from OpenAI: ${content.type}`);
            }
        }
    }
    
    return responses;
}

function cleanupResponse(response: string) : string[] {
    let clearResponse = response.trim();
    
    if(clearResponse.startsWith("<")){
        // Remove the bot name at the start of the response
        clearResponse = clearResponse.substring(clearResponse.indexOf(">") + 1);
    }
    
    // Split the response into chunks of 2000 characters
    const maxChar = 2000;
    const messages = [];
    while (clearResponse.length > 0) {
        if (clearResponse.length > maxChar) {
            messages.push(clearResponse.substring(0, maxChar));
            clearResponse = clearResponse.substring(maxChar);
        } else {
            messages.push(clearResponse);
            break;
        }
    }
    
    return messages;
}