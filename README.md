# 🥒 Chatpickle

### Conversation Tests for Chatbots

**Chatpickle** is a Node.js CLI framework that enables developers to test chatbots using Behavior-Driven Development (BDD) principles. Write human-readable test scenarios in Gherkin syntax to validate conversational flows, bot responses, and internal state management across different chatbot platforms.

**Perfect for:**
- **Chatbot developers** who need to validate conversational logic and flows
- **QA engineers** automating chatbot testing in CI/CD pipelines  
- **DevOps teams** integrating bot testing into development workflows

**Key Benefits:**
- Test conversations using familiar Gherkin syntax (`Given`, `When`, `Then`)
- Validate both bot responses and internal state (slots, session attributes)
- Support multiple platforms (AWS Lex out-of-the-box, custom integrations)
- Seamless integration into existing Node.js projects and CI/CD pipelines

**How it works:** Create `*.feature` files describing conversation scenarios, configure your bots and user personas in `chatpickle.config.json`, then run the `chatpickle` command to execute automated tests against your deployed chatbots.
### Architecture

Chatpickle follows a layered architecture designed for flexibility and extensibility:

- **CLI Layer** - Wraps Cucumber CLI with chatpickle-specific configuration and setup
- **Test Execution Layer** - Cucumber integration with custom step definitions for bot interactions
- **Bot Abstraction Layer** - Pluggable bot client system via abstract `BotClient` class
- **Platform Integration Layer** - Concrete implementations for specific platforms (AWS Lex, custom bots)

The framework dynamically loads bot clients based on configuration, enabling seamless testing across different chatbot platforms while maintaining consistent test syntax.

### Supported Chatbot Integrations
  * **[AWS Lex](examples/lex/README_LEX.md)** - Production-ready integration
    * Direct integration with AWS Lex Runtime API
    * Session attribute and slot validation support
    * Automatic user ID generation with timestamps
    * Support for regex pattern matching in bot responses
    * Works with any Lex bot (OrderFlowers, ScheduleAppointment, custom bots)
  * **[Custom](examples/custom/README_CUSTOM.md)** - Maximum flexibility for any platform
    * Implement three simple methods: `initialize()`, `speak()`, `fetch()`
    * Full control over bot communication and state management
    * Perfect for proprietary chatbot platforms, APIs, or complex integrations
    * Example implementation provided with SimpleBot demonstration

### Key Features

- **Conversation Flow Testing** - Test complete multi-turn conversations with natural Gherkin syntax
- **State Validation** - Verify bot internal state including slots, session attributes, and user attributes  
- **Flexible Response Matching** - Support both exact string matching and regex patterns for bot responses
- **User Persona Management** - Configure multiple user profiles with different attributes and contexts
- **Platform Agnostic** - Works with AWS Lex out-of-the-box, easily extensible to other platforms
- **CI/CD Ready** - Integrates seamlessly with existing Node.js build pipelines and testing workflows
- **BDD Syntax** - Leverage familiar Cucumber/Gherkin syntax for readable, maintainable tests

### Installing Chatpickle
`npm install chatpickle --save-dev`

### Configuring Chatpickle

Chatpickle requires two main components for setup:

#### 1. Configuration File (`chatpickle.config.json`)
Create a configuration file in your project root defining your bots and users:

```json
{
  "bots": {
    "OrderFlowers": {
      "type": "Lex",
      "context": {
        "botName": "OrderFlowers",
        "botAlias": "prod", 
        "region": "us-east-1"
      }
    },
    "CustomBot": {
      "type": "custom",
      "location": "chatpickle/support/CustomBotClient.js",
      "context": {
        "botName": "My Custom Bot"
      }
    }
  },
  "users": {
    "homer": {
      "context": {
        "userId": "homer",
        "userAttributes": {
          "firstName": "Homer",
          "lastName": "Simpson"
        }
      }
    }
  }
}
```

#### 2. Feature Files Directory (`chatpickle/`)
Create a `chatpickle/` folder in your project root for your Gherkin feature files. This is where you'll write your conversation test scenarios.

**Examples:** See complete configuration examples in [examples/lex/chatpickle.config.json](examples/lex/chatpickle.config.json) and [examples/custom/chatpickle.config.json](examples/custom/chatpickle.config.json)

### Writing Tests

Chatpickle uses Cucumber's Gherkin syntax with specialized step definitions for chatbot testing:

#### Available Step Definitions

- **`Given the user is "username"`** - Set user context from your configuration
- **`Given the user begins a new chat with "botname"`** - Initialize a conversation with the specified bot
- **`User: message`** - Send a message to the bot
- **`Bot: expected response`** - Verify the bot's response (supports regex with `/pattern/`)
- **`Then attribute.path = expected_value`** - Validate bot state (slots, sessionAttributes, userAttributes)

#### Example Feature File

```gherkin
Feature: OrderFlowers Bot

  Scenario: User orders roses for tomorrow
    Given the user begins a new chat with "OrderFlowers"
    * User: I would like to order some flowers
    * Bot: What type of flowers would you like to order?
    * User: roses
    * Bot: What day do you want the roses to be picked up?
    * User: tomorrow
    * Bot: /^Pick up the roses at what time on \d{4}-\d{2}-\d{2}\?$/
    Then slots.FlowerType = roses
```

**See complete examples:** [AWS Lex feature files](examples/lex/chatpickle/) and [Custom bot feature files](examples/custom/chatpickle/)

### Running Chatpickle

#### Basic Usage
From your project root:
```bash
chatpickle
```

#### Command Line Options
- **`--cpPath path/to/project`** - Specify project directory (useful for running examples during development)
- All standard Cucumber CLI options are supported and passed through

#### Integration with npm scripts
Add to your `package.json`:
```json
{
  "scripts": {
    "test:bot": "chatpickle",
    "test:bot:lex": "chatpickle --cpPath examples/lex/"
  }
}
```

#### CI/CD Integration
Chatpickle returns appropriate exit codes for CI systems:
- `0` - All tests passed
- `1` - Test failures or errors

### Examples

Chatpickle includes comprehensive examples to help you get started:

#### AWS Lex Example ([examples/lex/](examples/lex/))
- **OrderFlowers Bot** - Complete conversation flow with slot validation
- **ScheduleAppointment Bot** - Multi-turn appointment booking scenario  
- **Configuration** - Production-ready AWS Lex setup with IAM requirements
- **Documentation** - Step-by-step setup guide for AWS integration

#### Custom Bot Example ([examples/custom/](examples/custom/))
- **Restaurant Greeter Bot** - Custom bot implementation example
- **SimpleBot Integration** - Shows how to wrap any chatbot API
- **CustomBotClient** - Template for creating your own bot integrations
- **User Personas** - Demonstrates user attribute management

**Quick Start:** Run the examples directly:
```bash
npm run example:lex     # AWS Lex example (requires AWS credentials)
npm run example:custom  # Custom bot example (no external dependencies)
```

### Extending Chatpickle
You can help extend chatpickle by contributing to our open source project [https://github.com/libertymutual/chatpickle](https://github.com/libertymutual/chatpickle)

Want to see a new type of bot supported?
 * Add a new bot client to [src/lib/botClients](src/lib/botClients)
 * Add documentation for it in our [examples](examples)

To help with known issues or needed improvements, check out our  [Issues](https://github.com/libertymutual/chatpickle/issues) on GitHub.

### Credits
Credits for Chatpickle can be found [here](CREDITS.md).
