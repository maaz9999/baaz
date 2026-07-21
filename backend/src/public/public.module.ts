import { Module } from "@nestjs/common";
import { StartggModule } from "../startgg/startgg.module";
import { PublicController } from "./public.controller";
import { PublicService } from "./public.service";

@Module({
  imports: [StartggModule],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
