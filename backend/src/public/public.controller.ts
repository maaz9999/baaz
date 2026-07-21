import { Controller, Get, Param, Query } from "@nestjs/common";
import { PublicService } from "./public.service";

@Controller()
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get("health")
  health() {
    return this.publicService.health();
  }

  @Get("public/home")
  home() {
    return this.publicService.home();
  }

  @Get("public/page/:pageKey")
  page(@Param("pageKey") pageKey: string) {
    return this.publicService.page(pageKey);
  }

  @Get("public/posts")
  posts(@Query("take") take?: string) {
    return this.publicService.posts(take ? Number(take) : undefined);
  }

  @Get("public/posts/:slug")
  postBySlug(@Param("slug") slug: string) {
    return this.publicService.postBySlug(slug);
  }

  @Get("public/events")
  events() {
    return this.publicService.events();
  }

  @Get("public/events/:slug")
  eventBySlug(@Param("slug") slug: string) {
    return this.publicService.eventBySlug(slug);
  }

  @Get("public/players")
  players() {
    return this.publicService.players();
  }

  @Get("public/players/:slug")
  playerBySlug(@Param("slug") slug: string) {
    return this.publicService.playerBySlug(slug);
  }

  @Get("public/sponsors")
  sponsors() {
    return this.publicService.sponsors();
  }

  @Get("public/sponsors/:slug")
  sponsorBySlug(@Param("slug") slug: string) {
    return this.publicService.sponsorBySlug(slug);
  }

  @Get("public/ptl-2026")
  ptl2026() {
    return this.publicService.ptl2026();
  }

  @Get("public/circuits/:slug")
  circuitBySlug(@Param("slug") slug: string) {
    return this.publicService.circuitBySlug(slug);
  }

  @Get("public/watch")
  watch() {
    return this.publicService.watch();
  }

  @Get("public/about")
  about() {
    return this.publicService.about();
  }

  @Get("public/placements")
  placements(@Query("page") page = "home") {
    return this.publicService.placements(page);
  }

  @Get("public/startgg/standings")
  startggStandings(@Query("slug") slug: string) {
    return this.publicService.startggStandings(slug);
  }
}
