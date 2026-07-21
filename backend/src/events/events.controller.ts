import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { CrudService } from "../common/crud.service";
import { JwtAuthGuard } from "../common/jwt-auth.guard";

type RequestWithUser = Request & { user?: { sub: string } };

@Controller("events")
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly crud: CrudService) {}

  @Get()
  list() {
    return this.crud.list("event");
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.crud.get("event", id);
  }

  @Post()
  create(@Body() dto: Record<string, unknown>, @Req() request: RequestWithUser) {
    return this.crud.create("event", dto, request.user?.sub);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: Record<string, unknown>, @Req() request: RequestWithUser) {
    return this.crud.update("event", id, dto, request.user?.sub);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() request: RequestWithUser) {
    return this.crud.remove("event", id, request.user?.sub);
  }
}
