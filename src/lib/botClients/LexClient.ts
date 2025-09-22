import LexRuntime from 'aws-sdk/clients/lexruntime';
import get from 'lodash.get';
import { BotClient, BotContext, UserContext, BotCommunicationError, BotResponseError } from './BotClient';

export default class LexClient extends BotClient {
    private botName: string;
    private botAlias: string;
    private userId: string;
    private lastResponse: any;
    private sessionAttributes: any;
    private props: any;
    private lex: LexRuntime;

    constructor(botContext: BotContext, userContext: UserContext) {
        super(botContext, userContext);
        this.botName = this.botContext.botName;
        this.botAlias = (this.botContext as any).botAlias;
        this.userId = `${this.userContext.userId}-${Date.now()}`;
        this.lastResponse = null;
        this.sessionAttributes = this.userContext.userAttributes || {};

        this.props = {
            region: (this.botContext as any).region,
        };
        // Optional Auth Environment Variables
        this.props.accessKeyId = process.env.chatpickle_access_id || undefined;
        this.props.secretAccessKey = process.env.chatpickle_access_secret || undefined;

        this.lex = new LexRuntime(this.props);
        console.log(`[${this.userId}] New Conversation with ${this.botName}`);
    }

    public async speak(inputText: string): Promise<string> {
        try {
            console.log(`[${this.userId}] User: ${inputText}`);

            const params = {
                botName: this.botName,
                botAlias: this.botAlias,
                userId: this.userId,
                inputText,
                sessionAttributes: this.sessionAttributes,
            };

            this.lastResponse = await this.lex.postText(params).promise();
            this.sessionAttributes = this.lastResponse.sessionAttributes;

            if (!this.lastResponse.message) {
                throw new BotResponseError('Bot response missing message field');
            }

            const reply: string = this.lastResponse.message.trim();
            console.log(`[${this.userId}] Bot: ${reply}`);

            return reply;
        } catch (error) {
            if (error instanceof BotResponseError) {
                throw error;
            }
            this.handleError(error, 'Failed to communicate with Lex bot', BotCommunicationError);
        }
    }

    public async fetch(attributePath: string): Promise<string> {
        try {
            if (!this.lastResponse) {
                throw new BotResponseError('No response available to fetch attributes from');
            }
            const value = await get(this.lastResponse, attributePath);
            return value !== undefined ? String(value) : '';
        } catch (error) {
            if (error instanceof BotResponseError) {
                throw error;
            }
            this.handleError(error, `Failed to fetch attribute '${attributePath}'`, BotResponseError);
        }
    }
}
