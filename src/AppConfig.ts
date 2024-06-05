export function getDiscordToken() : string {
    return process.env.DISCORD_TOKEN;
}

export function getOpenAiKey() : string {
    return process.env.OPENAI_API_KEY;
}

export function getAssistantId() : string {
    return process.env.ASSISTANT_ID;
}

export function getAllowDms() : boolean {
    return process.env.ANSWER_DM.toLowerCase() === "true"
}

export function getLogAllMessages() : boolean {
    return process.env.LOG_ALL_MESSAGES.toLowerCase() === "true"
}

export function getLogAssistantsRequests() : boolean {
    return process.env.LOG_ASSISTANTS_REQUESTS.toLowerCase() === "true"
}

export function getHistoryLimit() : number {
    return parseInt(process.env.HISTORY_LIMIT || "15")
}

export function getAnswerChannelMentions() : boolean {
    return process.env.ANSWER_CHANNEL_MENTIONS.toLowerCase() === "true"
}

export function getAnswerInThread() : boolean {
    return process.env.REPLY_IN_THREAD.toLowerCase() === "true"
}