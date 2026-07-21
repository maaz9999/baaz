import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";

type RequestWithUser = Request & {
  user?: { sub: string; email: string; role: string };
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

    if (!token) throw new UnauthorizedException("Missing bearer token");

    try {
      request.user = await this.jwt.verifyAsync<{ sub: string; email: string; role: string }>(token);
      return true;
    } catch {
      throw new UnauthorizedException("Invalid bearer token");
    }
  }
}
