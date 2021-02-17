/**
 * @module botbuilder-adapter-slack
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Activity, BotAdapter, TurnContext, ConversationReference, ResourceResponse } from 'botbuilder';
import { WebClient } from '@slack/web-api';
import { SlackBotWorker } from './botworker';
/**
 * Connect [Botkit](https://www.npmjs.com/package/botkit) or [BotBuilder](https://www.npmjs.com/package/botbuilder) to Slack.
 */
export declare class SlackAdapter extends BotAdapter {
    private options;
    private slack;
    private identity;
    /**
     * Name used by Botkit plugin loader
     * @ignore
     */
    name: string;
    /**
     * Object containing one or more Botkit middlewares to bind automatically.
     * @ignore
     */
    middlewares: any;
    /**
     * A customized BotWorker object that exposes additional utility methods.
     * @ignore
     */
    botkit_worker: typeof SlackBotWorker;
    /**
     * Create a Slack adapter.
     *
     * The SlackAdapter can be used in 2 modes:
     *      * As an "[internal integration](https://api.slack.com/internal-integrations) connected to a single Slack workspace
     *      * As a "[Slack app](https://api.slack.com/slack-apps) that uses oauth to connect to multiple workspaces and can be submitted to the Slack app.
     *
     * [Read here for more information about all the ways to configure the SlackAdapter &rarr;](../../botbuilder-adapter-slack/readme.md).
     *
     * Use with Botkit:
     *```javascript
     * const adapter = new SlackAdapter({
     *      clientSigningSecret: process.env.CLIENT_SIGNING_SECRET,
     *      botToken: process.env.BOT_TOKEN
     * });
     * const controller = new Botkit({
     *      adapter: adapter,
     *      // ... other configuration options
     * });
     * ```
     *
     * Use with BotBuilder:
     *```javascript
     * const adapter = new SlackAdapter({
     *      clientSigningSecret: process.env.CLIENT_SIGNING_SECRET,
     *      botToken: process.env.BOT_TOKEN
     * });
     * // set up restify...
     * const server = restify.createServer();
     * server.use(restify.plugins.bodyParser());
     * server.post('/api/messages', (req, res) => {
     *      adapter.processActivity(req, res, async(context) => {
     *          // do your bot logic here!
     *      });
     * });
     * ```
     *
     * Use in "Slack app" multi-team mode:
     * ```javascript
     * const adapter = new SlackAdapter({
     *     clientSigningSecret: process.env.CLIENT_SIGNING_SECRET,
     *     clientId: process.env.CLIENT_ID, // oauth client id
     *     clientSecret: process.env.CLIENT_SECRET, // oauth client secret
     *     scopes: ['bot'], // oauth scopes requested
     *     oauthVersion: 'v1',
     *     redirectUri: process.env.REDIRECT_URI, // url to redirect post login defaults to `https://<mydomain>/install/auth`
     *     getTokenForTeam: async(team_id) => Promise<string>, // function that returns a token based on team id
     *     getBotUserByTeam: async(team_id) => Promise<string>, // function that returns a bot's user id based on team id
     * });
     * ```
     *
     * @param options An object containing API credentials, a webhook verification token and other options
     */
    constructor(options: SlackAdapterOptions);
    /**
     * Get a Slack API client with the correct credentials based on the team identified in the incoming activity.
     * This is used by many internal functions to get access to the Slack API, and is exposed as `bot.api` on any bot worker instances.
     * @param activity An incoming message activity
     */
    getAPI(activity: Partial<Activity>): Promise<WebClient>;
    /**
     * Get the bot user id associated with the team on which an incoming activity originated. This is used internally by the SlackMessageTypeMiddleware to identify direct_mention and mention events.
     * In single-team mode, this will pull the information from the Slack API at launch.
     * In multi-team mode, this will use the `getBotUserByTeam` method passed to the constructor to pull the information from a developer-defined source.
     * @param activity An incoming message activity
     */
    getBotUserByTeam(activity: Partial<Activity>): Promise<string>;
    /**
     * Get the oauth link for this bot, based on the clientId and scopes passed in to the constructor.
     *
     * An example using Botkit's internal webserver to configure the /install route:
     *
     * ```javascript
     * controller.webserver.get('/install', (req, res) => {
     *  res.redirect(controller.adapter.getInstallLink());
     * });
     * ```
     *
     * @returns A url pointing to the first step in Slack's oauth flow.
     */
    getInstallLink(): string;
    /**
     * Validates an oauth v2 code sent by Slack during the install process.
     *
     * An example using Botkit's internal webserver to configure the /install/auth route:
     *
     * ```javascript
     * controller.webserver.get('/install/auth', async (req, res) => {
     *      try {
     *          const results = await controller.adapter.validateOauthCode(req.query.code);
     *          // make sure to capture the token and bot user id by team id...
     *          const team_id = results.team.id;
     *          const token = results.access_token;
     *          const bot_user = results.bot_user_id;
     *          // store these values in a way they'll be retrievable with getBotUserByTeam and getTokenForTeam
     *      } catch (err) {
     *           console.error('OAUTH ERROR:', err);
     *           res.status(401);
     *           res.send(err.message);
     *      }
     * });
     * ```
     * @param code the value found in `req.query.code` as part of Slack's response to the oauth flow.
     */
    validateOauthCode(code: string): Promise<any>;
    /**
     * Formats a BotBuilder activity into an outgoing Slack message.
     * @param activity A BotBuilder Activity object
     * @returns a Slack message object with {text, attachments, channel, thread_ts} as well as any fields found in activity.channelData
     */
    activityToSlack(activity: Partial<Activity>): any;
    /**
     * Standard BotBuilder adapter method to send a message from the bot to the messaging API.
     * [BotBuilder reference docs](https://docs.microsoft.com/en-us/javascript/api/botbuilder-core/botadapter?view=botbuilder-ts-latest#sendactivities).
     * @param context A TurnContext representing the current incoming message and environment.
     * @param activities An array of outgoing activities to be sent back to the messaging API.
     */
    sendActivities(context: TurnContext, activities: Partial<Activity>[]): Promise<ResourceResponse[]>;
    /**
     * Standard BotBuilder adapter method to update a previous message with new content.
     * [BotBuilder reference docs](https://docs.microsoft.com/en-us/javascript/api/botbuilder-core/botadapter?view=botbuilder-ts-latest#updateactivity).
     * @param context A TurnContext representing the current incoming message and environment.
     * @param activity The updated activity in the form `{id: <id of activity to update>, ...}`
     */
    updateActivity(context: TurnContext, activity: Partial<Activity>): Promise<void>;
    /**
     * Standard BotBuilder adapter method to delete a previous message.
     * [BotBuilder reference docs](https://docs.microsoft.com/en-us/javascript/api/botbuilder-core/botadapter?view=botbuilder-ts-latest#deleteactivity).
     * @param context A TurnContext representing the current incoming message and environment.
     * @param reference An object in the form `{activityId: <id of message to delete>, conversation: { id: <id of slack channel>}}`
     */
    deleteActivity(context: TurnContext, reference: Partial<ConversationReference>): Promise<void>;
    /**
     * Standard BotBuilder adapter method for continuing an existing conversation based on a conversation reference.
     * [BotBuilder reference docs](https://docs.microsoft.com/en-us/javascript/api/botbuilder-core/botadapter?view=botbuilder-ts-latest#continueconversation)
     * @param reference A conversation reference to be applied to future messages.
     * @param logic A bot logic function that will perform continuing action in the form `async(context) => { ... }`
     */
    continueConversation(reference: Partial<ConversationReference>, logic: (context: TurnContext) => Promise<void>): Promise<void>;
    /**
     * Verify the signature of an incoming webhook request as originating from Slack.
     * @param req A request object from Restify or Express
     * @param res A response object from Restify or Express
     * @returns If signature is valid, returns true. Otherwise, sends a 401 error status via http response and then returns false.
     */
    private verifySignature;
    /**
     * Accept an incoming webhook request and convert it into a TurnContext which can be processed by the bot's logic.
     * @param req A request object from Restify or Express
     * @param res A response object from Restify or Express
     * @param logic A bot logic function in the form `async(context) => { ... }`
     */
    processActivity(req: any, res: any, logic: (context: TurnContext) => Promise<void>): Promise<void>;
}
/**
 * This interface defines the options that can be passed into the SlackAdapter constructor function.
 */
export interface SlackAdapterOptions {
    /**
     * Legacy method for validating the origin of incoming webhooks. Prefer `clientSigningSecret` instead.
     */
    verificationToken?: string;
    /**
     * A token used to validate that incoming webhooks originated with Slack.
     */
    clientSigningSecret?: string;
    /**
     * A token (provided by Slack) for a bot to work on a single workspace
     */
    botToken?: string;
    /**
     * The oauth client id provided by Slack for multi-team apps
     */
    clientId?: string;
    /**
     * The oauth client secret provided by Slack for multi-team apps
     */
    clientSecret?: string;
    /**
     * A array of scope names that are being requested during the oauth process. Must match the scopes defined at api.slack.com
     */
    scopes?: string[];
    /**
     * Which version of Slack's oauth protocol to use, v1 or v2. Defaults to v1.
     */
    oauthVersion?: string;
    /**
     * The URL users will be redirected to after an oauth flow. In most cases, should be `https://<mydomain.com>/install/auth`
     */
    redirectUri?: string;
    /**
     * A method that receives a Slack team id and returns the bot token associated with that team. Required for multi-team apps.
     */
    getTokenForTeam?: (teamId: string) => Promise<string>;
    /**
     * A method that receives a Slack team id and returns the bot user id associated with that team. Required for multi-team apps.
     */
    getBotUserByTeam?: (teamId: string) => Promise<string>;
    /**
     * Allow the adapter to startup without a complete configuration.
     * This is risky as it may result in a non-functioning or insecure adapter.
     * This should only be used when getting started.
     */
    enable_incomplete?: boolean;
}
