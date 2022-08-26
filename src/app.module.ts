import {Module} from "@nestjs/common";
import {ScheduleModule} from "@nestjs/schedule";
import {JourlayModule} from "./jourlay/jourlay.module";

@Module({
	imports: [ScheduleModule.forRoot(), JourlayModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
