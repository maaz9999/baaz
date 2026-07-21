import { Module } from "@nestjs/common";
import { CommonModule } from "../common/common.module";
import { PlayersController } from "./players.controller";

@Module({
  imports: [CommonModule],
  controllers: [PlayersController],
})
export class PlayersModule {}
