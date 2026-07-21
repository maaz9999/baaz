const STARTGG_ENDPOINT = "https://api.start.gg/gql/alpha";
const STARTGG_TOKEN = process.env.STARTGG_API_TOKEN || "16f9636227e3c5fb894dc32e9a4201df";

export interface StartggStandingNode {
  placement: number;
  entrant?: {
    id: number;
    name: string;
  } | null;
}

export interface StartggSlot {
  standing?: {
    stats?: {
      score?: {
        value?: number | null;
      } | null;
    } | null;
  } | null;
  entrant?: {
    id: number;
    name: string;
  } | null;
}

export interface StartggSet {
  id: string | number;
  state: number; // 1 = waiting, 2 = in_progress, 3 = completed
  winnerId?: number | null;
  winnerText?: string | null;
  fullRoundText?: string | null;
  round: number;
  phaseGroup?: {
    phase?: {
      id: number;
      name: string;
    } | null;
  } | null;
  slots?: StartggSlot[] | null;
}

export interface StartggPhaseGroup {
  id: number;
  displayIdentifier: string;
  sets?: {
    nodes?: StartggSet[] | null;
  } | null;
}

export interface StartggPhase {
  id: number;
  name: string;
  phaseGroups?: {
    nodes?: StartggPhaseGroup[] | null;
  } | null;
}

export interface StartggEventPayload {
  id: number;
  name: string;
  state: number;
  sets?: {
    nodes?: StartggSet[] | null;
  } | null;
  standings?: {
    nodes?: StartggStandingNode[] | null;
  } | null;
}

async function runQuery<T>(query: string, variables: Record<string, any>): Promise<T | null> {
  try {
    const response = await fetch(STARTGG_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STARTGG_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const json = await response.json();
    if (json.errors) {
      console.error("Start.gg GraphQL Errors:", json.errors);
      return null;
    }
    return json.data as T;
  } catch (error) {
    console.error("Start.gg Fetch Error:", error);
    return null;
  }
}

export async function fetchEventDetails(slug: string): Promise<StartggEventPayload | null> {
  const query = `
    query EventDetails($slug: String!) {
      event(slug: $slug) {
        id
        name
        state
        standings(query: { page: 1, perPage: 32 }) {
          nodes {
            placement
            entrant {
              id
              name
            }
          }
        }
        sets(page: 1, perPage: 50, filters: { hideEmpty: true }) {
          nodes {
            id
            state
            winnerId
            fullRoundText
            round
            slots {
              standing {
                stats {
                  score {
                    value
                  }
                }
              }
              entrant {
                id
                name
              }
            }
          }
        }
      }
    }
  `;
  const result = await runQuery<{ event: StartggEventPayload }>(query, { slug });
  return result?.event || null;
}
