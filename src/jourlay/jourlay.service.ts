import {Injectable, Logger} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";
import * as moment from "moment";
import TelegramBot from "node-telegram-bot-api";
import {Bot} from "src/bot/bot";
import * as fs from "fs";

@Injectable()
export class JourlayService {
	constructor() {
		this.jourlay = Bot.jourlayBot;
		this.init();
	}

	private logger = new Logger(JourlayService.name);
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
		const date = new Date();
		const h = date.getHours();
		const m = date.getMinutes();

		const needM = 34;

		if (h === 22 && m >= needM-5 && m < needM) {
			await this.jourlay.sendMessage(
				process.env.JOURLAY_DM,
				`Warning, after ${needM - m} minute${needM - m < 2 ? `` : `s`} you should send challenge's message!`
			);
		}
	}

	/**
	 * It listens for messages and responds to them
	 */
	private init() {
		this.jourlay.on(`message`, async msg => {
			this.logger.debug(`🔨 Get message`);
			if (!msg.text) return;

			if (msg.text === `/start`) {
				await this.jourlay.sendMessage(msg.chat.id, `Hi 👋`, {
					// eslint-disable-next-line camelcase
					reply_to_message_id: msg.message_id,
				});
			} else if (msg.text === `/ping` && msg.chat.id.toString() === process.env.JOURLAY_DM) {
				const uptime = this.format(process.uptime());

				const packageJson = JSON.parse(fs.readFileSync(`package.json`, `utf-8`));

				await this.jourlay.sendMessage(msg.chat.id, `Uptime: ${uptime}\nVersion: ${packageJson.version}`, {
					// eslint-disable-next-line camelcase
					reply_to_message_id: msg.message_id,
				});
			}
		});

		this.logger.log(`✅ Events init`);
	}
}
