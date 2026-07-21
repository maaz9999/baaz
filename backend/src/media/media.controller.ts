import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Request, Response } from "express";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { MediaService } from "./media.service";

type RequestWithUser = Request & { user?: { sub: string } };

@Controller("media")
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  list() {
    return this.media.list();
  }

  @Post("upload")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { alt?: string; caption?: string },
    @Req() request: RequestWithUser
  ) {
    return this.media.save(file, body, request.user?.sub);
  }

  @Patch("asset/:id")
  @UseGuards(JwtAuthGuard)
  update(@Param("id") id: string, @Body() body: { alt?: string; caption?: string }, @Req() request: RequestWithUser) {
    return this.media.update(id, body, request.user?.sub);
  }

  @Delete("asset/:id")
  @UseGuards(JwtAuthGuard)
  remove(@Param("id") id: string, @Req() request: RequestWithUser) {
    return this.media.remove(id, request.user?.sub);
  }

  @Get(":filename")
  async serve(@Param("filename") filename: string, @Res() response: Response) {
    const asset = await this.media.findByFilename(filename);
    if (asset.url.startsWith("http")) return response.redirect(asset.url);
    return response.type(asset.mimeType).sendFile(asset.path);
  }
}
