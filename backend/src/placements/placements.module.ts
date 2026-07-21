import { Module } from "@nestjs/common";
import { CommonModule } from "../common/common.module";
import { PlacementsController } from "./placements.controller";

@Module({
  imports: [CommonModule],
  controllers: [PlacementsController],
})
export class PlacementsModule {}
