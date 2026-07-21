import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export type StartggStanding = {
  placement: number;
  entrantName: string;
};

const STARTGG_ENDPOINT = "https://api.start.gg/gql/alpha";
const CACHE_TTL_MS = 60_000;

const STANDINGS_QUERY = `
  query EventStandings($slug: String!, $perPage: Int!) {
    event(slug: $slug) {
      id
      name
      standings(query: { page: 1, perPage: $perPage }) {
        nodes {
          placement
          entrant {
            id
            name
          }
        }
      }
    }
  }
`;

type StandingsResponse = {
  data?: {
    event?: {
      standings?: {
        nodes?: Array<{
          placement?: number;
          entrant?: { name?: string } | null;
        }>;
      } | null;
    } | null;
  };
  errors?: Array<{ message: string }>;
};

@Injectable()
export class StartggService {
  private readonly logger = new Logger(StartggService.name);
  private readonly cache = new Map<string, { expires: number; data: StartggStanding[] }>();

  constructor(private readonly config: ConfigService) {}

  async getEventStandings(slug: string, perPage = 8): Promise<StartggStanding[] | null> {
    if (!slug) return null;
    const token = this.config.get<string>("STARTGG_API_TOKEN");
    if (!token) {
      this.logger.warn("STARTGG_API_TOKEN is not configured; skipping start.gg fetch");
      return null;
    }

    const cacheKey = `${slug}:${perPage}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expires > Date.now()) return cached.data;

    try {
      const response = await fetch(STARTGG_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: STANDINGS_QUERY,
          variables: { slug, perPage },
        }),
      });

      if (!response.ok) {
        this.logger.warn(`start.gg API responded ${response.status} for event slug "${slug}"`);
        return null;
      }

      const payload = (await response.json()) as StandingsResponse;
      if (payload.errors?.length) {
        this.logger.warn(`start.gg API error for event slug "${slug}": ${payload.errors[0]?.message}`);
        return null;
      }

      const nodes = payload.data?.event?.standings?.nodes;
      if (!Array.isArray(nodes)) return null;

      const standings: StartggStanding[] = nodes
        .filter((node): node is { placement: number; entrant: { name: string } } => Boolean(node?.entrant?.name) && typeof node?.placement === "number")
        .map((node) => ({ placement: node.placement, entrantName: node.entrant.name }));

      this.cache.set(cacheKey, { expires: Date.now() + CACHE_TTL_MS, data: standings });
      return standings;
    } catch (error) {
      this.logger.warn(`start.gg API request failed for event slug "${slug}": ${error}`);
      return null;
    }
  }
}
