import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { CrudService } from "../common/crud.service";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { CreatePostTemplateDto, UpdatePostTemplateDto } from "./dto";

type RequestWithUser = Request & { user?: { sub: string } };

@Controller("post-templates")
@UseGuards(JwtAuthGuard)
export class PostTemplatesController {
  constructor(private readonly crud: CrudService) {}

  @Get()
  list() {
    return this.crud.list("postTemplate");
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.crud.get("postTemplate", id);
  }

  @Post()
  create(@Body() dto: CreatePostTemplateDto, @Req() request: RequestWithUser) {
    return this.crud.create("postTemplate", dto, request.user?.sub);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdatePostTemplateDto, @Req() request: RequestWithUser) {
    return this.crud.update("postTemplate", id, dto, request.user?.sub);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() request: RequestWithUser) {
    return this.crud.remove("postTemplate", id, request.user?.sub);
  }
}
