import {Injectable} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";
import {Bot} from "src/bot/bot";

@Injectable()
export class JourlayService {

	private BotManager = new Bot();
	private jourlay = this.BotManager.jourlayBot;

	@Cron(`0 */1 * * * *`)
	private async remind() {
		const date = new Date();
		const h = date.getHours();
		const m = date.getMinutes();

		if (h === 15 && m >= 15 && m < 22) {
			await this.jourlay.sendMessage(process.env.JOURLAY_DM, `Внимание, через ${22 - m} минут у тебя челлендж!`);
		}
	}
}
