import {Controller} from "@nestjs/common";
import {JourlayService} from "./jourlay.service";

@Controller()
export class JourlayController {
	constructor(private readonly jourlayService: JourlayService) {}
}
