import {Module} from "@nestjs/common";
import {JourlayService} from "./jourlay.service";
import {JourlayController} from "./jourlay.controller";

@Module({
	controllers: [JourlayController],
	providers: [JourlayService],
})
export class JourlayModule {}
