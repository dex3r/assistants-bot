export function getDiscordToken() : string {
    return process.env.DISCORD_TOKEN;
}

export function getAllowDms() : boolean {
    return process.env.ALLOW_DM === "true"
}
