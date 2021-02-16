/**
 * @module botbuilder-adapter-slack
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { TurnContext, MiddlewareSet } from 'botbuilder';
/**
 * A middleware for Botkit developers using the BotBuilder SlackAdapter class.
 * This middleware causes Botkit to emit more specialized events for the different types of message that Slack might send.
 * Responsible for classifying messages:
 *
 *      * `direct_message` events are messages received through 1:1 direct messages with the bot
 *      * `direct_mention` events are messages that start with a mention of the bot, i.e "@mybot hello there"
 *      * `mention` events are messages that include a mention of the bot, but not at the start, i.e "hello there @mybot"
 *
 * In addition, messages from bots and changing them to `bot_message` events. All other types of message encountered remain `message` events.
 *
 * To use this, bind it to the adapter before creating the Botkit controller:
 * ```javascript
 * const adapter = new SlackAdapter(options);
 * adapter.use(new SlackMessageTypeMiddleware());
 * const controller = new Botkit({
 *      adapter: adapter,
 *      // ...
 * });
 * ```
 */
export declare class SlackMessageTypeMiddleware extends MiddlewareSet {
    /**
     * Not for direct use - implements the MiddlewareSet's required onTurn function used to process the event
     * @param context
     * @param next
     */
    onTurn(context: TurnContext, next: () => Promise<any>): Promise<void>;
}
