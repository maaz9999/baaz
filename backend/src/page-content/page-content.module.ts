import { Module } from "@nestjs/common";
import { CommonModule } from "../common/common.module";
import { PageContentController } from "./page-content.controller";

@Module({
  imports: [CommonModule],
  controllers: [PageContentController],
})
export class PageContentModule {}
