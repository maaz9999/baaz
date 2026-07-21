import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { CrudService } from "../common/crud.service";
import { JwtAuthGuard } from "../common/jwt-auth.guard";

type RequestWithUser = Request & { user?: { sub: string } };

@Controller("circuits")
@UseGuards(JwtAuthGuard)
export class CircuitsController {
  constructor(private readonly crud: CrudService) {}

  @Get()
  list() {
    return this.crud.list("circuit");
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.crud.get("circuit", id);
  }

  @Post()
  create(@Body() dto: Record<string, unknown>, @Req() request: RequestWithUser) {
    return this.crud.create("circuit", dto, request.user?.sub);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: Record<string, unknown>, @Req() request: RequestWithUser) {
    return this.crud.update("circuit", id, dto, request.user?.sub);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() request: RequestWithUser) {
    return this.crud.remove("circuit", id, request.user?.sub);
  }
}
