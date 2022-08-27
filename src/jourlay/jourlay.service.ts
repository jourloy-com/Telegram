import {Injectable} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";
import moment from "moment-timezone";
import TelegramBot from "node-telegram-bot-api";
import {Bot} from "src/bot/bot";

@Injectable()
export class JourlayService {
	constructor() {
		this.jourlay = Bot.jourlayBot;
		this.init();
	}

	private jourlay: TelegramBot;
	private messageForDelete: {chatID: number; msgID: string}[] = [];

	/**
	 * It takes a number of seconds and returns a string in the format `hh:mm:ss`
	 * @param {number} seconds - The number of seconds to format.
	 * @returns the hours, minutes, and seconds of the time.
	 */
	private format(seconds: number) {
		function pad(s: number) {
			return (s < 10 ? `0` : ``) + s.toString();
		}
		const hours = Math.floor(seconds / (60 * 60));
		const minutes = Math.floor((seconds % (60 * 60)) / 60);
		seconds = Math.floor(seconds % 60);

		return pad(hours) + `:` + pad(minutes) + `:` + pad(seconds);
	}

	/**
	 * It sends a message to the user at 15:15, and then deletes it at 15:22
	 */
	@Cron(`0 */1 * * * *`)
	private async remind() {
		const date = moment().tz(`Europe/Moscow`);
		const h = date.hour();
		const m = date.minute();

		if (h === 15 && m >= 15 && m < 22) {
			const msg = await this.jourlay.sendMessage(
				process.env.JOURLAY_DM,
				`Warning, after ${22 - m} minutes you should send challeng's message!`
			);
			this.messageForDelete.push({
				chatID: msg.chat.id,
				msgID: msg.message_id.toString(),
			});
		} else if (h === 15 && m === 22) {
			for (let i = 0; i < this.messageForDelete.length; i++) {
				const data = this.messageForDelete.pop();
				await this.jourlay.deleteMessage(data.chatID, data.msgID);
			}
		}
	}

	/**
	 * It listens for messages and responds to them
	 */
	private init() {
		this.jourlay.on(`message`, async msg => {
			if (!msg.text) return;
			if (msg.text === `/start`) {
				await this.jourlay.sendMessage(msg.chat.id, `Hi 👋`, {
					// eslint-disable-next-line camelcase
					reply_to_message_id: msg.message_id,
				});
			} else if (msg.text === `/ping`) {
				const uptime = this.format(process.uptime());
				await this.jourlay.sendMessage(msg.chat.id, `Uptime: ${uptime}`, {
					// eslint-disable-next-line camelcase
					reply_to_message_id: msg.message_id,
				});
			}
		});
	}
}
