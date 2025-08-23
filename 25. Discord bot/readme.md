# Discord Bot Development Tutorial - Complete Notes

## Overview

This tutorial covers building an interactive Discord bot using Discord.js library that can respond to messages and handle slash commands.

## Prerequisites

- Basic JavaScript knowledge
- Node.js installed
- Discord account

---

## Part 1: Initial Setup

### 1. Create Discord Account & Server

- Go to `discord.com` and create a free account
- Create a new Discord server:
  - Click "+" to add server
  - Choose "Create My Own"
  - Name it (e.g., "Piyush Garg's Server")
  - Server comes with default "general" channel

### 2. Enable Developer Mode

- Go to User Settings (gear icon)
- Navigate to "Advanced" section
- Enable "Developer Mode"

### 3. Create Discord Application

- Search "Discord Developer Portal" on Google
- Go to Applications section
- Click "New App"
- Name your application (e.g., "YouTube Bot")

---

## Part 2: Bot Creation & Configuration

### 1. Create the Bot

```
Applications → Your App → Bot Section → "Add Bot"

```

- Set bot username (e.g., "PiyushGargBot.01")
- Bot gets automatically created

### 2. Set Bot Permissions

- In Bot section, enable "Administrator" privileges
- **Alternative**: Select specific permissions like:
  - Send Messages
  - Read Message History
  - Use Slash Commands

### 3. Generate Bot Invite URL

- Go to "URL Generator" section
- Select "bot" scope
- Copy generated URL
- Paste URL in browser
- Select your server from dropdown
- Authorize bot to join server

### 4. Enable Message Content Intent

**Important**: Go back to Bot section and enable:

- "Message Content Intent" (allows bot to read message content)

---

## Part 3: Development Environment Setup

### 1. Project Initialization

```bash
# Initialize new Node.js project
npm init

# Install Discord.js library
npm install discord.js

```

### 2. Create Main File

Create `index.js` file in project root.

### 3. Get Bot Token

- In Discord Developer Portal → Bot section
- Click "Reset Token" to generate new token
- **⚠️ IMPORTANT**: Keep this token secret - never share it publicly

---

## Part 4: Basic Bot Code Structure

### 1. Import Required Libraries

```jsx
const { Client, GatewayIntentBits } = require("discord.js");
```

### 2. Create Client Instance

```jsx
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
```

**Intent Explanations:**

- `Guilds`: Access to server information
- `GuildMessages`: Listen to message events
- `MessageContent`: Read actual message text

### 3. Message Event Listener

```jsx
client.on("messageCreate", (message) => {
  // Prevent bot from responding to its own messages
  if (message.author.bot) return;

  console.log("Message:", message.content);

  // Reply to user messages
  message.reply("Hi from bot!");
});
```

### 4. Bot Login

```jsx
client.login("YOUR_BOT_TOKEN_HERE");
```

### 5. Package.json Script

```json
{
  "scripts": {
    "start": "node index.js"
  }
}
```

---

## Part 5: Testing Basic Bot

### 1. Run the Bot

```bash
npm start

```

### 2. Test Functionality

- Go to Discord server
- Type any message in general channel
- Bot should respond with "Hi from bot!"

---

## Part 6: Advanced Features - Slash Commands

### 1. Create Command Registration File

Create `commands.js` file:

```jsx
const { REST, Routes } = require("discord.js");

// Define commands
const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
];

// Create REST client
const rest = new REST().setToken("YOUR_BOT_TOKEN");

// Register commands
(async () => {
  try {
    await rest.put(Routes.applicationCommands("YOUR_CLIENT_ID"), {
      body: commands,
    });
    console.log("Commands registered successfully!");
  } catch (error) {
    console.error(error);
  }
})();
```

### 2. Get Client ID

- In Discord Developer Portal → General Information
- Copy "Application ID"

### 3. Register Commands

```bash
node commands.js

```

### 4. Handle Slash Commands in Main File

Add to `index.js`:

```jsx
client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    interaction.reply("Pong!");
  }
});
```

---

## Part 7: Practical Example - URL Shortener Bot

### Enhanced Message Handler

```jsx
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("create ")) {
    const url = message.content.replace("create ", "");
    message.reply(`Generating short ID for ${url}`);

    // Here you would:
    // 1. Connect to MongoDB
    // 2. Generate short ID
    // 3. Save URL to database
    // 4. Reply with short URL
  }
});
```

---

## Bot Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Discord Bot Flow                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Discord Server                                         │
│  ┌─────────────┐    1. User Message    ┌─────────────┐  │
│  │    User     │ ────────────────────▶ │    Bot      │  │
│  │             │                       │             │  │
│  │             │ ◀──── 4. Bot Reply ── │             │  │
│  └─────────────┘                       └─────────────┘  │
│                                               │         │
│                                               │         │
│                    2. Process Message         │         │
│                                               ▼         │
│                                        ┌─────────────┐  │
│                                        │  Your App   │  │
│                                        │  (Node.js)  │  │
│                                        │             │  │
│                                        │ ┌─────────┐ │  │
│                                        │ │Database │ │  │
│                                        │ │(MongoDB)│ │  │
│                                        │ └─────────┘ │  │
│                                        └─────────────┘  │
│                                               │         │
│                                               │         │
│                                    3. Generate Response │
└─────────────────────────────────────────────────────────┘

```

---

## Key Concepts Summary

### **Bot vs Regular User**

- Bot is essentially a special user account
- Needs permissions to interact in servers
- Can respond to messages and commands automatically

### **Intents System**

- Discord's way of controlling what data bots can access
- Must be explicitly enabled in code and Developer Portal
- Different intents for different types of data

### **Event-Driven Architecture**

- Bot listens for events (messages, interactions, etc.)
- Responds with callback functions
- Asynchronous by nature

---

## Troubleshooting Common Issues

### Bot Not Responding

1. Check if bot is online in Discord server
2. Verify Message Content Intent is enabled
3. Ensure correct intents in code
4. Check console for error messages

### Commands Not Appearing

1. Run command registration script
2. Refresh Discord (Ctrl+R)
3. Check Client ID is correct
4. Verify bot has proper permissions

### Token Errors

1. Regenerate token in Developer Portal
2. Update token in code
3. Never share token publicly
4. Use environment variables for production

---

## Next Steps & Expansion Ideas

### Database Integration

- Connect MongoDB for data persistence
- Store user data, server settings, etc.

### API Integration

- Connect to external APIs
- Weather data, news feeds, etc.

### Advanced Commands

- Parameters in slash commands
- Multiple command options
- Embed messages with rich formatting

### ChatGPT Integration

- Connect OpenAI API
- Make bot conversational
- Process natural language queries

---

## Security Best Practices

1. **Never expose bot token**
2. **Use environment variables**
3. **Implement rate limiting**
4. **Validate user input**
5. **Use minimal required permissions**

---

_This bot serves as a foundation for building more complex Discord applications. The possibilities are endless - from utility bots to gaming companions to business automation tools._

# Discord Bot Tutorial - Complete Guide

## Prerequisites

- Node.js installed
- A Discord account

## Step 1: Set up Discord Account and Server

1. Go to [discord.com](https://discord.com/) and create a free account
2. Create a new Discord server:
   - Click "+" to add a server
   - Choose "Create My Own"
   - Name it (e.g., "Piyush Garg's Server")
3. Enable Developer Mode:
   - Go to User Settings (gear icon)
   - Navigate to Advanced settings
   - Enable Developer Mode

## Step 2: Create Discord Application

1. Search for "Discord Developer Portal" on Google
2. Go to the Discord Developer Portal
3. Click on "Applications"
4. Create a new application:
   - Click "New Application"
   - Name it (e.g., "YouTube Bot")

## Step 3: Create the Bot

1. In your application, go to the "Bot" section
2. Click "Add Bot"
3. Set a username for your bot (e.g., "PiyushGargBot.01")
4. Enable Administrator permissions (or select specific permissions)
5. Copy the bot token (keep this secret!)

## Step 4: Add Bot to Server

1. Go to OAuth2 → URL Generator
2. Select "bot" scope
3. Select Administrator permissions
4. Copy the generated URL and paste it in your browser
5. Select your server to add the bot

## Step 5: Set up Project

```bash
# Initialize npm project
npm init

# Install discord.js
npm install discord.js

```

## Step 6: Main Bot Code (index.js)

```jsx
// Import required modules
const { Client, GatewayIntentBits } = require("discord.js");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Event listener for when a message is created
client.on("messageCreate", (message) => {
  // Don't respond to bot messages to avoid infinite loops
  if (message.author.bot) return;

  console.log("Message content:", message.content);

  // Check if message starts with "create"
  if (message.content.startsWith("create ")) {
    const url = message.content.slice(7); // Remove "create " prefix
    message.reply(`Generating short ID for ${url}`);

    // Here you can add database logic to store the URL
    // and generate a short ID
    return;
  }

  // Reply to any other message
  message.reply("Hi from bot!");
});

// Event listener for slash command interactions
client.on("interactionCreate", (interaction) => {
  console.log("Interaction:", interaction);

  if (interaction.commandName === "ping") {
    interaction.reply("Pong!");
  }
});

// Login to Discord with your bot token
client.login("YOUR_BOT_TOKEN_HERE");
```

## Step 7: Register Slash Commands (commands.js)

```jsx
const { REST, Routes } = require("discord.js");

// Define commands
const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "create",
    description: "Create a new short URL",
  },
];

// Create REST client
const rest = new REST({ version: "10" }).setToken("YOUR_BOT_TOKEN_HERE");

// Register commands
(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands("YOUR_CLIENT_ID_HERE"), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
```

## Step 8: Update package.json

```json
{
  "name": "discord-bot",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "discord.js": "^14.7.1"
  }
}
```

## Step 9: Running the Bot

1. First, register the slash commands:

   ```bash
   node commands.js

   ```

2. Start the bot:

   ```bash
   npm start

   ```

## Features Explained

### Message Events

- The bot listens for `messageCreate` events
- It responds to regular messages with "Hi from bot!"
- Special handling for messages starting with "create"

### Slash Commands

- The bot can handle slash commands like `/ping`
- Commands need to be registered first using the commands.js file

### Intents

- `Guilds`: Access to server information
- `GuildMessages`: Access to message events
- `MessageContent`: Access to message content

## Important Security Notes

1. **Never share your bot token** - Keep it secret and secure
2. **Reset tokens** after sharing them publicly
3. **Use environment variables** for production:

   ```jsx
   // Use process.env.BOT_TOKEN instead of hardcoded tokenclient.login(process.env.BOT_TOKEN);
   ```

## Extending the Bot

You can enhance this bot by:

1. **Adding database integration** (MongoDB, PostgreSQL)
2. **Creating URL shortener functionality**
3. **Integrating with external APIs**
4. **Adding ChatGPT integration**
5. **Creating moderation features**
6. **Adding music playback**
7. **Implementing custom games**

## Example: URL Shortener Integration

```jsx
// In messageCreate event
if (message.content.startsWith("create ")) {
  const longUrl = message.content.slice(7);

  // Generate short ID (you can use libraries like shortid)
  const shortId = generateShortId();

  // Save to database
  await saveToDatabase(longUrl, shortId);

  message.reply(`Short URL created: https://yoursite.com/${shortId}`);
}
```
