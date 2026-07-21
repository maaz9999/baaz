import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto";

type RequestWithUser = Request & { user?: { sub: string } };

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("auth/login")
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() request: RequestWithUser) {
    return this.auth.me(request.user?.sub || "");
  }
}
