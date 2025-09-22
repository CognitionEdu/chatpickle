/**
 * Base error class for all bot client related errors.
 */
export class BotClientError extends Error {
    constructor(message: string, public readonly code: string, public readonly cause?: Error) {
        super(message);
        this.name = 'BotClientError';
    }
}

/**
 * Error thrown when bot client initialization fails.
 */
export class BotInitializationError extends BotClientError {
    constructor(message: string, cause?: Error) {
        super(message, 'INITIALIZATION_ERROR', cause);
        this.name = 'BotInitializationError';
    }
}

/**
 * Error thrown when communication with the bot fails.
 */
export class BotCommunicationError extends BotClientError {
    constructor(message: string, cause?: Error) {
        super(message, 'COMMUNICATION_ERROR', cause);
        this.name = 'BotCommunicationError';
    }
}

/**
 * Error thrown when bot response is invalid or cannot be processed.
 */
export class BotResponseError extends BotClientError {
    constructor(message: string, cause?: Error) {
        super(message, 'RESPONSE_ERROR', cause);
        this.name = 'BotResponseError';
    }
}

/**
 * Configuration context for the bot.
 */
export interface BotContext {
    botName: string;
    [key: string]: unknown;
}

/**
 * Context information for the user session.
 */
export interface UserContext {
    userId: string;
    userAttributes?: Record<string, unknown>;
    [key: string]: unknown;
}

/**
 * Abstract base class for all bot client implementations.
 * Provides standardized error handling patterns and type safety.
 */
export abstract class BotClient {
    botContext: BotContext;
    userContext: UserContext;

    /**
     * Creates an instance of BotClient.
     * @param botContext - Configuration context for the bot
     * @param userContext - Context information for the user session
     * @throws {BotInitializationError} When required context properties are missing
     */
    constructor(botContext: BotContext, userContext: UserContext) {
        this.validateContexts(botContext, userContext);
        this.botContext = botContext;
        this.userContext = userContext;
    }

    /**
     * Validates that required context properties are present.
     * @param botContext - Bot configuration context
     * @param userContext - User session context
     * @throws {BotInitializationError} When validation fails
     */
    protected validateContexts(botContext: BotContext, userContext: UserContext): void {
        if (!botContext?.botName) {
            throw new BotInitializationError('Bot context must include a botName property');
        }
        if (!userContext?.userId) {
            throw new BotInitializationError('User context must include a userId property');
        }
    }

    /**
     * Initialize any asynchronous components that your bot client relies on.
     * Implementations should wrap initialization logic in try/catch and throw
     * BotInitializationError for any setup failures.
     * @throws {BotInitializationError} When initialization fails
     */
    public async initialize(): Promise<void> {
        return;
    }

    /**
     * Send user input to the bot and receive a response.
     * @param inputText - The user's input message
     * @returns Promise resolving to the bot's response message
     * @throws {BotCommunicationError} When communication with the bot fails
     * @throws {BotResponseError} When the bot response is invalid or cannot be processed
     */
    public abstract speak(inputText: string): Promise<string>;

    /**
     * Fetch a specific attribute from the bot's last response.
     * @param attribute - The attribute path to retrieve (supports lodash.get syntax)
     * @returns Promise resolving to the attribute value as a string
     * @throws {BotResponseError} When the attribute cannot be retrieved or converted
     */
    public abstract fetch(attribute: string): Promise<string>;

    /**
     * Helper method for implementations to handle errors consistently.
     * @param error - The original error
     * @param context - Additional context about where the error occurred
     * @param errorType - The type of BotClientError to throw
     * @throws {BotClientError} The wrapped error with additional context
     */
    protected handleError(
        error: unknown,
        context: string,
        errorType:
            | typeof BotCommunicationError
            | typeof BotResponseError
            | typeof BotInitializationError = BotCommunicationError,
    ): never {
        const message = error instanceof Error ? error.message : String(error);
        const cause = error instanceof Error ? error : undefined;
        throw new errorType(`${context}: ${message}`, cause);
    }
}
