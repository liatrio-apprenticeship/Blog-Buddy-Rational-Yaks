/**
 * @module botkit
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { BotkitMessage } from './core';
import { BotWorker } from './botworker';
import { TeamsInfo, MiddlewareSet, TurnContext } from 'botbuilder';
/**
 * This is a specialized version of [Botkit's core BotWorker class](core.md#BotWorker) that includes additional methods for interacting with Microsoft Teams.
 * It includes all functionality from the base class, as well as the extension methods below.
 * This BotWorker is used with the built-in Bot Framework adapter.
 * @noInheritDoc
 */
export declare class TeamsBotWorker extends BotWorker {
    /**
     * Grants access to the TeamsInfo helper class
     * See: https://docs.microsoft.com/en-us/javascript/api/botbuilder/teamsinfo?view=botbuilder-ts-latest
     */
    teams: TeamsInfo;
    /**
     * Reply to a Teams task module task/fetch or task/submit with a task module response.
     * See https://docs.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/task-modules/task-modules-bots
     * @param message
     * @param taskInfo an object in the form {type, value}
     */
    replyWithTaskInfo(message: BotkitMessage, taskInfo: any): Promise<any>;
}
/**
 * When used, causes Botkit to emit special events for teams "invokes"
 * Based on https://github.com/microsoft/botbuilder-js/blob/master/libraries/botbuilder/src/teamsActivityHandler.ts
 * This allows Botkit bots to respond directly to task/fetch or task/submit events, as an example.
 * To use this, bind it to the adapter before creating the Botkit controller:
 * ```javascript
 * const Botkit = new Botkit({...});
 * botkit.adapter.use(new TeamsInvokeMiddleware());
 *
 * // can bind directly to task/fetch, task/submit and other invoke types used by teams
 * controller.on('task/fetch', async(bot, message) => {
 *    await bot.replyWithTaskInfo(message, taskInfo);
 * });
 * ```
 */
export declare class TeamsInvokeMiddleware extends MiddlewareSet {
    /**
     * Not for direct use - implements the MiddlewareSet's required onTurn function used to process the event
     * @param context
     * @param next
     */
    onTurn(context: TurnContext, next: () => Promise<any>): Promise<void>;
}
