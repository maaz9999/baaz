import { Module } from "@nestjs/common";
import { StartggService } from "./startgg.service";

@Module({
  providers: [StartggService],
  exports: [StartggService],
})
export class StartggModule {}
