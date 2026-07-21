import { Module } from "@nestjs/common";
import { CommonModule } from "../common/common.module";
import { SponsorsController } from "./sponsors.controller";

@Module({
  imports: [CommonModule],
  controllers: [SponsorsController],
})
export class SponsorsModule {}
