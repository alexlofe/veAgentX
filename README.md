# Project Starter

This is the starter template AI Agent for Eliza x VeChain. 

## Features

- Pre-configured project structure for ElizaOS development
- Default character configuration with plugin integration
- Example service, action, and provider implementations
- TypeScript configuration for optimal developer experience
- Built-in VeChain tools for direct interaction with the blockchain (testnet)

1. Get an account's balance
2. Get an account's alias
3. Get an account's latest VET transfers
4. Get an account's Stargate deposit
5. Get an account's Stargate withdrawal

## Getting Started


```bash 
# prereqs: Node 18+ and bun installed
bun i -g @elizaos/cli
elizaos --version

npm install
```

```bash
# Install the VeChain SDK
npm install @vechain/sdk-network
```

```bash
# Install the Eliza Twitter Plugin
elizaos plugins add twitter

# Build your project
bun run build

# Start development immediately
elizaos dev
```


## Development

```bash
# Start development with hot-reloading (recommended)
elizaos dev

# OR start without hot-reloading
elizaos start
# Note: When using 'start', you need to rebuild after changes:
    # rm -rf dist 2>/dev/null || rimraf dist
    # bun run build
```

You can also use `bun` to build and start up the project

```bash
bun run build

bun dev
```

## General Character Configuration

Customize your project by modifying:

- `src/index.ts` - Main entry point
- `src/character.ts` - Character definition

## VeChain Tooling Configuration

To add more tools that interact directly with VeChain:

- `vechain/` - VeChain tooling. Use SDK to interact with onchain data

To handle the new tools, include the handler on `src/index.ts` ensuring you include:

- `name`: The name of your agent tool
- `similes`: Similar keywords to the function
- `description`: Function description
- `validate`: Extract the account address
- `handler`: Process the validated information and execute the action
- `examples`: Example of interaction between user and agent.

You may use the example below to build your tool handler:

```ts
const vechainAliasAction: any = {
  name: "VECHAIN_WALLET_ALIAS",
  similes: ["ALIAS", "NAME", "IDENTITY"],
  description: "Return VeChain domain alias for a wallet address",

  validate: async (_runtime: any, message: any) => {
    const text = message?.content?.text || "";
    const hasAddr = /\b0x[a-fA-F0-9]{40}\b/i.test(text);
    const hasKeyword = /\b(alias|name|identity)\b/i.test(text);
    return hasAddr || hasKeyword;
  },

  handler: async (_runtime: any, message: any, _state: any, _options: any, callback: any) => {
    const text = message?.content?.text || "";
    const address = extractAddress(text);

    if (!address) {
      await callback({ text: "Provide an address. Example: alias 0xYourWalletHere" });
      return true;
    }

    try {
      const { alias } = await getAlias(address);
      await callback({
        text: alias ? `Alias for ${address}: ${alias}` : `No alias is registered for ${address}.`
      });
    } catch (e: any) {
      console.error("[alias error]", e?.message || e);
      await callback({ text: "Couldn't fetch alias right now. Try again shortly." });
    }

    return true;
  },

  examples: [
    [
      { user: "user", content: { text: "alias 0x9366662519dc456bd5b8bc4ee4b6852338d82f08" } },
      { user: "assistant", content: { text: "Alias for 0x... is example.vet" } }
    ]
  ],
};
```

### Wire your tools to the main agent

1. On `src/index.ts` and wire `yourNewAction` to be loaded in your character init:

```ts
const initCharacter = ({ runtime }: { runtime: any }) => {
  console.log("Initializing character:", character?.name);
  runtime.registerAction(vechainBalanceAction);
  runtime.registerAction(vechainAliasAction);
  // your new vechain tools here ie `runtime.registerAction(yourNewAction);`
};
```

2. Rebuild your agent:

```bash
rm -rf dist 2>/dev/null || rimraf dist

bun run build

bun dev
```

## Run Agent on Twitter

You can interact with this agent directly from Twitter. Just tagging `@yourAgent` and your request will return a tweet response with the information you're requesting. 

To deploy on Twitter, make sure your `.env` variables include the API keys from the official [Twitter Developer Portal](https://developer.x.com/).

```
TWITTER_API_KEY=
TWITTER_API_SECRET_KEY=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_TOKEN_SECRET=
```

Then, activate the twitter plugin on `src/character.ts`

```ts
  plugins: [
    "@elizaos/plugin-sql",
    '@elizaos/plugin-bootstrap',
    "@elizaos/plugin-openai",
    "@elizaos/plugin-twitter",
  ]
```

And rebuild your agent:

```bash
rm -rf dist 2>/dev/null || rimraf dist

bun run build

bun dev
```