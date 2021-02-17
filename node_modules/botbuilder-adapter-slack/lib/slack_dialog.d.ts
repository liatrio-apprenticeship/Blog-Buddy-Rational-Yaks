/**
 * @module botbuilder-adapter-slack
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
  * Create a Slack Dialog object for use with [replyWithDialog()](#replyWithDialog).
  *
  * ```javascript
  * let dialog = new SlackDialog('My Dialog', 'callback_123', 'Save');
  * dialog.addText('Your full name', 'name').addEmail('Your email', 'email');
  * dialog.notifyOnCancel(true);
  * bot.replyWithDialog(message, dialog.asObject());
  * ```
  *
  */
export declare class SlackDialog {
    private data;
    /**
     * Create a new dialog object
     * @param title Title of dialog
     * @param callback_id Callback id of dialog
     * @param submit_label Label for the submit button
     * @param elements An array of dialog elements
     */
    constructor(title?: string, callback_id?: string, submit_label?: string, elements?: any);
    /**
     * Set the dialog's state field
     * @param v value for state
     */
    state(v: any): SlackDialog;
    /**
     * Set true to have Slack notify you with a `dialog_cancellation` event if a user cancels the dialog without submitting
     * @param set True or False
     */
    notifyOnCancel(set: boolean): SlackDialog;
    /**
     * Set the title of the dialog
     * @param v Value for title
     */
    title(v: string): SlackDialog;
    /**
     * Set the dialog's callback_id
     * @param v Value for the callback_id
     */
    callback_id(v: string): SlackDialog;
    /**
     * Set the button text for the submit button on the dialog
     * @param v Value for the button label
     */
    submit_label(v: string): SlackDialog;
    /**
     * Add a text input to the dialog
     * @param label
     * @param name
     * @param value
     * @param options
     * @param subtype
     */
    addText(label: string | any, name: string, value: string, options: string | any, subtype?: string): SlackDialog;
    /**
     * Add an email input to the dialog
     * @param label
     * @param name
     * @param value
     * @param options
     */
    addEmail(label: string, name: string, value: string, options?: any): SlackDialog;
    /**
     * Add a number input to the dialog
     * @param label
     * @param name
     * @param value
     * @param options
     */
    addNumber(label: string, name: string, value: string, options?: any): SlackDialog;
    /**
     * Add a telephone number input to the dialog
     * @param label
     * @param name
     * @param value
     * @param options
     */
    addTel(label: string, name: string, value: string, options?: any): SlackDialog;
    /**
     * Add a URL input to the dialog
     * @param label
     * @param name
     * @param value
     * @param options
     */
    addUrl(label: string, name: string, value: string, options?: any): SlackDialog;
    /**
     * Add a text area input to the dialog
     * @param label
     * @param name
     * @param value
     * @param options
     * @param subtype
     */
    addTextarea(label: string, name: string, value: string, options: any, subtype: string): SlackDialog;
    /**
     * Add a dropdown select input to the dialog
     * @param label
     * @param name
     * @param value
     * @param option_list
     * @param options
     */
    addSelect(label: string, name: string, value: string | number | Record<string, any> | null, option_list: {
        label: string;
        value: string | number | Record<string, any> | null;
    }[], options?: any): SlackDialog;
    /**
     * Get the dialog object as a JSON encoded string.
     */
    asString(): string;
    /**
     * Get the dialog object for use with bot.replyWithDialog()
     */
    asObject(): any;
}
