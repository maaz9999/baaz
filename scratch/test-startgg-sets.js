const STARTGG_ENDPOINT = "https://api.start.gg/gql/alpha";
const STARTGG_TOKEN = "16f9636227e3c5fb894dc32e9a4201df";

async function main() {
  try {
    const res = await fetch(STARTGG_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STARTGG_TOKEN}`,
      },
      body: JSON.stringify({
        query: `
          query EventDetails($slug: String!) {
            event(slug: $slug) {
              id
              name
              state
              sets(page: 1, perPage: 50, filters: { hideEmpty: true }) {
                nodes {
                  id
                  state
                  winnerId
                  fullRoundText
                  round
                  phaseGroup {
                    displayIdentifier
                    phase {
                      id
                      name
                    }
                  }
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
        `,
        variables: { slug: "tournament/pakistan-tekken-league-stage-4/event/tekken-8" },
      }),
    });
    const json = await res.json();
    const sets = json.data?.event?.sets?.nodes || [];
    console.log("Total sets:", sets.length);
    sets.forEach(s => {
      const p1 = s.slots?.[0]?.entrant?.name || "TBA";
      const p2 = s.slots?.[1]?.entrant?.name || "TBA";
      const phase = s.phaseGroup?.phase?.name || "No Phase";
      console.log(`Phase: "${phase}" | Round: "${s.fullRoundText}" (id: ${s.id}, round: ${s.round}) | ${p1} vs ${p2}`);
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
