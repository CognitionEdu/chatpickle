# 🥒 Chatpickle

[![npm version](https://badge.fury.io/js/chatpickle.svg)](https://badge.fury.io/js/chatpickle)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Node.js CI](https://github.com/libertymutual/chatpickle/workflows/Node.js%20CI/badge.svg)](https://github.com/libertymutual/chatpickle/actions)

**Conversation Tests for Chatbots** - Document, test, and validate your chatbot conversations using Cucumber's powerful Gherkin syntax.

## ✨ Features

- 🥒 **Gherkin Syntax**: Write conversational scenarios using familiar Cucumber/Gherkin syntax
- 🤖 **Multi-Platform Support**: Works with AWS Lex, custom chatbots, and more
- 🧪 **Automated Testing**: Run conversations as automated tests against your deployed bots
- 📊 **Detailed Reporting**: Get comprehensive test reports with conversation flows
- 🔧 **Extensible**: Easy to extend with custom bot integrations
- ⚡ **CLI Ready**: Simple command-line interface for CI/CD integration

## 🚀 Quick Start

### Installation

```bash
npm install chatpickle --save-dev
```

### Basic Setup

1. **Create a configuration file** (`chatpickle.config.json`):
```json
{
  "bots": {
    "MyBot": {
      "type": "custom",
      "location": "chatpickle/support/MyBotClient.js",
      "context": {
        "botName": "MyBot"
      }
    }
  },
  "users": {
    "testUser": {
      "description": "Test User Profile",
      "context": {
        "userId": "testUser",
        "userAttributes": {
          "firstName": "Test",
          "lastName": "User"
        }
      }
    }
  }
}
```

2. **Create a chatpickle folder** with your feature files:
```
your-project/
├── chatpickle/
│   ├── my-bot-conversation.feature
│   └── support/
│       └── MyBotClient.js
├── chatpickle.config.json
└── package.json
```

3. **Write your first conversation test** (`chatpickle/my-bot-conversation.feature`):
```gherkin
Feature: My Bot Conversation

  Scenario: User greets the bot
    Given the user is "testUser"
    And the user begins a new chat with "MyBot"
    * User: Hello
    * Bot: Hi there! How can I help you today?
    * User: What's the weather like?
    * Bot: I'd be happy to help with weather information!
```

4. **Run your tests**:
```bash
npx chatpickle
```

## 🤖 Supported Integrations

### AWS Lex
Perfect for testing AWS Lex chatbots with built-in support for slots, session attributes, and intents.

```json
{
  "bots": {
    "OrderFlowers": {
      "type": "Lex",
      "context": {
        "botName": "OrderFlowers",
        "botAlias": "BETA",
        "region": "us-east-1"
      }
    }
  }
}
```

**[📖 AWS Lex Setup Guide](examples/lex/README_LEX.md)**

### Custom Bots
Integrate with any chatbot platform by implementing three simple methods: `initialize()`, `speak()`, and `fetch()`.

```javascript
class MyBotClient {
  constructor(botContext, userContext) {
    this.botContext = botContext;
    this.userContext = userContext;
  }

  async initialize() {
    // Initialize your bot connection
  }

  async speak(inputText) {
    // Send message to bot and return response
    return "Bot response";
  }

  async fetch(attributePath) {
    // Fetch bot state/attributes
    return this.botState[attributePath];
  }
}
```

**[📖 Custom Bot Setup Guide](examples/custom/README_CUSTOM.md)**

## 📝 Writing Conversation Tests

### Basic Conversation Flow
```gherkin
Feature: Restaurant Booking Bot

  Scenario: Successful reservation
    Given the user is "customer"
    And the user begins a new chat with "RestaurantBot"
    * User: I'd like to make a reservation
    * Bot: Great! For how many people?
    * User: Table for 2
    * Bot: What time would you prefer?
    * User: 7 PM tonight
    * Bot: Perfect! I've booked a table for 2 at 7 PM.
    Then slots.partySize = 2
    And slots.time = 19:00
```

### Advanced Features

**Regular Expression Matching:**
```gherkin
* Bot: /^Your reservation is confirmed for \d{4}-\d{2}-\d{2}$/
```

**State Validation:**
```gherkin
Then sessionAttributes.userId = customer123
And slots.FlowerType = roses
```

**User Context:**
```gherkin
Given the user is "premiumCustomer"
Then userAttributes.membershipLevel = premium
```

## 🛠️ Configuration

### Configuration File Options

| Option | Type | Description |
|--------|------|-------------|
| `bots` | Object | Define your bot configurations |
| `users` | Object | Define user profiles for testing |
| `cucumber` | Object | Pass-through options to Cucumber |

### Bot Configuration

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | String | Yes | Bot type (`"Lex"` or `"custom"`) |
| `location` | String | Custom only | Path to your custom bot client |
| `context` | Object | Yes | Bot-specific configuration |

### User Configuration

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `description` | String | No | Human-readable description |
| `context` | Object | Yes | User context and attributes |
| `context.userId` | String | Yes | Unique user identifier |
| `context.userAttributes` | Object | Yes | User profile data |

## 🔧 CLI Usage

### Basic Commands

```bash
# Run all tests
npx chatpickle

# Run specific feature file
npx chatpickle path/to/specific.feature

# Run with custom config path
npx chatpickle --cpPath examples/custom/

# Pass Cucumber options
npx chatpickle --format json --tags @smoke
```

### Available Scripts

```bash
# Run Lex example
npm run example:lex

# Run custom example  
npm run example:custom

# Build the project
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## 🧪 Testing & Validation

### Running Tests Locally

```bash
# Install dependencies
npm install

# Run the test suite
npm test

# Run linting
npm run lint

# Test with examples
npm run example:custom
npm run example:lex
```

### Continuous Integration

Add to your CI pipeline:

```yaml
# .github/workflows/chatbot-tests.yml
name: Chatbot Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npx chatpickle
```

## 🔍 Troubleshooting

### Common Issues

**"Cannot find module" errors:**
- Ensure your custom bot client path is correct in the config
- Check that all dependencies are installed with `npm install`

**AWS Lex authentication errors:**
- Verify your AWS credentials are configured (`~/.aws/credentials`)
- Ensure your IAM user has `AmazonLexRunBotsOnly` policy
- Check that bot name, alias, and region are correct

**Tests timing out:**
- Increase timeout in your feature files or config
- Check network connectivity to your bot endpoints
- Verify bot is responding correctly outside of tests

**Conversation flow mismatches:**
- Use regex patterns for dynamic responses: `/^Hello .+!$/`
- Check for extra whitespace or formatting differences
- Enable debug logging to see actual vs expected responses

### Debug Mode

Enable verbose logging:

```bash
DEBUG=chatpickle* npx chatpickle
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Run the test suite**: `npm test`
5. **Submit a pull request**

### Adding New Bot Integrations

1. Create a new client in `src/lib/botClients/`
2. Extend the `BotClient` abstract class
3. Implement `initialize()`, `speak()`, and `fetch()` methods
4. Add documentation and examples
5. Submit a PR with tests

### Development Setup

```bash
git clone https://github.com/libertymutual/chatpickle.git
cd chatpickle
npm install
npm run build
npm test
```

## 📋 Requirements

- **Node.js**: ^10 || ^12 || ^14 || ^15 || ^16 || ^18 || ^20 || ^22
- **npm**: 6.0.0 or higher

## 📚 Examples & Resources

- **[AWS Lex Example](examples/lex/)** - Complete setup with OrderFlowers bot
- **[Custom Bot Example](examples/custom/)** - Restaurant greeter bot implementation
- **[API Documentation](src/lib/botClients/)** - Technical reference for bot clients
- **[Release Notes](RELEASENOTES.md)** - Version history and changes

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

Chatpickle is built on top of [Cucumber](https://github.com/cucumber/common) and uses the Gherkin syntax. Special thanks to all our [contributors](CREDITS.md) who made this project possible.

---

**Need help?** 
- 📖 Check our [examples](examples/)
- 🐛 [Report issues](https://github.com/libertymutual/chatpickle/issues)
- 💬 [Start a discussion](https://github.com/libertymutual/chatpickle/discussions)
