import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { PostsModule } from "./posts/posts.module";
import { PostTemplatesModule } from "./post-templates/post-templates.module";
import { PlacementsModule } from "./placements/placements.module";
import { EventsModule } from "./events/events.module";
import { PlayersModule } from "./players/players.module";
import { SponsorsModule } from "./sponsors/sponsors.module";
import { CircuitsModule } from "./circuits/circuits.module";
import { StreamsModule } from "./streams/streams.module";
import { PageContentModule } from "./page-content/page-content.module";
import { MediaModule } from "./media/media.module";
import { PublicModule } from "./public/public.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET") || "change-me-local-secret",
        signOptions: { expiresIn: "7d" },
      }),
    }),
    PrismaModule,
    AuthModule,
    PostsModule,
    PostTemplatesModule,
    PlacementsModule,
    EventsModule,
    PlayersModule,
    SponsorsModule,
    CircuitsModule,
    StreamsModule,
    PageContentModule,
    MediaModule,
    PublicModule,
  ],
})
export class AppModule {}
