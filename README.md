# Project Starter

This is the starter template for ElizaOS projects.

## Features

- Pre-configured project structure for ElizaOS development
- Comprehensive testing setup with component and e2e tests
- Default character configuration with plugin integration
- Example service, action, and provider implementations
- TypeScript configuration for optimal developer experience
- Built-in documentation and examples

## Getting Started


```bash 
# prereqs: Node 18+ and bun installed
bun i -g @elizaos/cli
elizaos --version
```

```bash
# Create a new project
elizaos create --type project my-project
# Dependencies are automatically installed and built

# Navigate to the project directory
cd my-project

# Install the Eliza Twitter Plugin
bun add @elizaos/plugin-twitter axios

npm i @elizaos/plugin-knowledge

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

# Test the project
elizaos test
```

## Configuration

Customize your project by modifying:

- `src/index.ts` - Main entry point
- `src/character.ts` - Character definition
