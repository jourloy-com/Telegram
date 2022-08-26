import * as TelegramBot from "node-telegram-bot-api";

export class Bot {
	public jourlayBot = new TelegramBot(process.env.JOURLAY_TOKEN, {polling: true});
}
