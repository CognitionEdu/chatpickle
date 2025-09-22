import { LexRuntimeServiceClient, PostTextCommand } from '@aws-sdk/client-lex-runtime-service';
import { mockClient } from 'aws-sdk-client-mock';
import LexClient from './LexClient';

const lexMock = mockClient(LexRuntimeServiceClient);

beforeEach(() => {
    lexMock.reset();
    lexMock.on(PostTextCommand).resolves({
        sessionAttributes: { foo: 'bar' },
        message: 'This is a mocked message.',
    });
});

test('LexClient.speak()', async (): Promise<void> => {
    const botContext = {
        botName: 'OrderFlowers',
        botAlias: 'prod',
        region: 'us-east-1',
    };
    const userContext = {
        userId: 'homer',
        userAttributes: {
            firstName: 'Homer',
            lastName: 'Simpson',
            address: 'Springfield',
        },
    };
    const botClient = new LexClient(botContext, userContext);
    const reply = await botClient.speak('Hello World');
    expect(reply).toBe('This is a mocked message.');
});
