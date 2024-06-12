# assistants-bot
Discord bot that uses OpenAI Assistants API v2.

# Features
 - reads Discord messages and responds them using the OpenAI Assistants API V2
 - can response in channels when mentioned
 - can response in DMs (off by default)
 - can response in new thread or in the channel (in the channel by default)
 - can respond to reply to it's messages
 - can read replies flow
 - can read channel history (off by default)
 - can read thread history
 - logging all replies and messages to output (off by default)
 - logging all OpenAI requests and responses to output (off by default)
 - limited number of message to send from history
 - highly configurable

# Configuration
Example configuration can be found in the `.env.sample` file. 
Rename it to `.env`, comment out the commented variables and fill them in.

For production, I recommend storing the secrets in environment variables instead.

# Running the bot
### Running locally
Execute the following commands in the root directory of the project:
```bash
npm install
npm run start
```

### Running in Docker
Execute the following command in the root directory of the project:
```bash
docker compose up --detach
```

