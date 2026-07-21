import { Module } from "@nestjs/common";
import { CommonModule } from "../common/common.module";
import { StreamsController } from "./streams.controller";

@Module({
  imports: [CommonModule],
  controllers: [StreamsController],
})
export class StreamsModule {}
