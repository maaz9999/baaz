import { Module } from "@nestjs/common";
import { CommonModule } from "../common/common.module";
import { PostTemplatesController } from "./post-templates.controller";

@Module({
  imports: [CommonModule],
  controllers: [PostTemplatesController],
})
export class PostTemplatesModule {}
