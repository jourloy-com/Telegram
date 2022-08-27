import * as TelegramBot from "node-telegram-bot-api";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require(`dotenv`).config();

export class Bot {
	public static jourlayBot = new TelegramBot(process.env.JOURLAY_TOKEN, {polling: true});
}
