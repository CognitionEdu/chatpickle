# AWS Lex Example

This sample project, [examples/lex](./), is designed to be pointed at the OrderFlowers and ScheduleAppointment bots as provided by AWS as a blueprint.

### Create a config file

You need a [chatpickle.config.json](chatpickle.config.json) (or .js) in the root of your node.js project and it should be formatted like the example provided.

### Create a chatpickle/ folder
You also need a [chatpickle/](chatpickle) folder in the root of your project.  This is where you will put your gherkin feature files which can leverage the extended chatpickle syntax.

### Setup a Lex Chatbot
**Important Note:** AWS Lex V1 will be discontinued on September 15, 2025. We recommend migrating to AWS Lex V2 for new projects.

To setup your own OrderFlowers and ScheduleAppointment bots from a blueprint in your AWS account, follow this [AWS Lex V2 Getting Started Guide](https://docs.aws.amazon.com/lexv2/latest/dg/getting-started.html).

For legacy AWS Lex V1 setups (deprecated), you can still reference the [AWS Lex V1 Guide](https://docs.aws.amazon.com/lex/latest/dg/gs-bp-create-bot.html) until the deprecation date.

Or if you want to get started with chatpickling a custom lex bot,  alter your project's chatpickle config; see example at [chatpickle.config.json](chatpickle.config.json) 

### Setup IAM Credentials
You will need to create IAM credentials that can invoke your bot. You can use the Amazon managed policies as shown below. Load them in your `.aws` directory or follow this [AWS CLI Configure Guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

**AWS SDK Compatibility Note:** This project currently uses AWS SDK v2 (^2.880.0). AWS has released SDK v3 with improved performance and features. Consider the [AWS SDK v2 to v3 migration guide](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/migrating-to-v3.html) for future updates.

![Lex Execution IAM Credentials](https://miro.medium.com/max/750/0*m55m6A95OcpcFRDa.png)
