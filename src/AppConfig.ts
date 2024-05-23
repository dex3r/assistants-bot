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
    return process.env.ANSWER_DM === "true"
}

export function getLogAllMessages() : boolean {
    return process.env.LOG_ALL_MESSAGES === "true"
}

export function getLogAssistantsRequests() : boolean {
    return process.env.LOG_ASSISTANTS_REQUESTS === "true"
}

export function getHistoryLimit() : number {
    return parseInt(process.env.HISTORY_LIMIT || "15")
}