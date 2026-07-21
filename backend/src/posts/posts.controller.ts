import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { CrudService } from "../common/crud.service";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { CreatePostDto, UpdatePostDto } from "./dto";

type RequestWithUser = Request & { user?: { sub: string } };

@Controller("posts")
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly crud: CrudService) {}

  @Get()
  list() {
    return this.crud.list("post");
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.crud.get("post", id);
  }

  @Post()
  create(@Body() dto: CreatePostDto, @Req() request: RequestWithUser) {
    return this.crud.create("post", dto, request.user?.sub);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdatePostDto, @Req() request: RequestWithUser) {
    return this.crud.update("post", id, dto, request.user?.sub);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() request: RequestWithUser) {
    return this.crud.remove("post", id, request.user?.sub);
  }
}
