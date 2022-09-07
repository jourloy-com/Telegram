import {Injectable} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";
import * as moment from "moment";
import TelegramBot from "node-telegram-bot-api";
import {Bot} from "src/bot/bot";
import packageJson from 'package.json';

@Injectable()
export class JourlayService {
	constructor() {
		this.jourlay = Bot.jourlayBot;
		this.init();
	}

	private jourlay: TelegramBot;

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
	 * It sends a message to the user at 17:10, and then deletes it at 17:15
	 */
	@Cron(`0 */1 * * * *`)
	private async remind() {
		const date = moment();
		const h = date.hour();
		const m = date.minute();
		
		if (h === 17 && m >= 10 && m < 15) {
			await this.jourlay.sendMessage(
				process.env.JOURLAY_DM,
				`Warning, after ${15 - m} minute${15 - m < 2 ? `` : `s`} you should send challenge's message!`
			);
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
			} else if (msg.text === `/ping` && msg.chat.id.toString() === process.env.JOURLAY_DM) {
				const uptime = this.format(process.uptime());
				await this.jourlay.sendMessage(msg.chat.id, `Uptime: ${uptime}\nVersion: ${packageJson.version}v`, {
					// eslint-disable-next-line camelcase
					reply_to_message_id: msg.message_id,
				});
			}
		});
	}
}
