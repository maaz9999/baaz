import { Module } from "@nestjs/common";
import { CommonModule } from "../common/common.module";
import { CircuitsController } from "./circuits.controller";

@Module({
  imports: [CommonModule],
  controllers: [CircuitsController],
})
export class CircuitsModule {}
