import { Module } from "@nestjs/common";
import { CommonModule } from "../common/common.module";
import { PostsController } from "./posts.controller";

@Module({
  imports: [CommonModule],
  controllers: [PostsController],
})
export class PostsModule {}
