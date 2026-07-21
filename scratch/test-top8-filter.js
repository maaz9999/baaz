const STARTGG_ENDPOINT = "https://api.start.gg/gql/alpha";
const STARTGG_TOKEN = "16f9636227e3c5fb894dc32e9a4201df";

async function main() {
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
            sets(page: 1, perPage: 60, filters: { hideEmpty: true }) {
              nodes {
                id
                state
                winnerId
                fullRoundText
                round
                phaseGroup {
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
  const validSets = (json.data?.event?.sets?.nodes || []).filter(s => s?.slots?.some(sl => sl.entrant));

  // 1. Prefer Top 8 phase sets
  let top8Sets = validSets.filter(s => s.phaseGroup?.phase?.name?.toLowerCase().includes("top 8"));

  if (top8Sets.length === 0) {
    top8Sets = validSets.filter(s => s.phaseGroup?.phase?.name?.toLowerCase().includes("top 16"));
  }

  if (top8Sets.length === 0) {
    top8Sets = validSets;
  }

  const cleanName = (name) => name ? name.split("|").pop().trim().toUpperCase() : "TBA";

  const getMatchInfo = (s) => {
    if (!s) return "EMPTY";
    const p1 = cleanName(s.slots?.[0]?.entrant?.name);
    const s1 = s.slots?.[0]?.standing?.stats?.score?.value ?? "-";
    const p2 = cleanName(s.slots?.[1]?.entrant?.name);
    const s2 = s.slots?.[1]?.standing?.stats?.score?.value ?? "-";
    return `${p1} (${s1}) vs ${p2} (${s2}) [${s.fullRoundText}]`;
  };

  const wSemis = top8Sets.filter((s) => s.fullRoundText?.toLowerCase().includes("winners semi"));
  const wFinal = top8Sets.filter((s) => s.fullRoundText?.toLowerCase().includes("winners final"));
  const gFinals = top8Sets.filter((s) => s.fullRoundText?.toLowerCase().includes("grand final")).sort((a, b) => Number(a.id) - Number(b.id));
  const gf1 = gFinals.find((s) => !s.fullRoundText?.toLowerCase().includes("reset")) || gFinals[0] || null;
  const gf2 = gFinals.find((s) => s.fullRoundText?.toLowerCase().includes("reset")) || (gFinals.length > 1 ? gFinals[1] : null);

  const lRound1 = top8Sets.filter((s) => s.fullRoundText?.toLowerCase().includes("losers round 1"));
  const lQuarters = top8Sets.filter((s) => s.fullRoundText?.toLowerCase().includes("losers quarter"));
  const lSemis = top8Sets.filter((s) => s.fullRoundText?.toLowerCase().includes("losers semi"));
  const lFinal = top8Sets.filter((s) => s.fullRoundText?.toLowerCase().includes("losers final"));

  console.log("=== WINNERS SEMI 1 ===", getMatchInfo(wSemis[0]));
  console.log("=== WINNERS SEMI 2 ===", getMatchInfo(wSemis[1]));
  console.log("=== WINNERS FINAL ===", getMatchInfo(wFinal[0]));
  console.log("=== GRAND FINAL ===", getMatchInfo(gf1));
  console.log("=== GRAND FINAL RESET ===", getMatchInfo(gf2));

  console.log("=== LOSERS R1 (Match 1) ===", getMatchInfo(lRound1[0]));
  console.log("=== LOSERS R1 (Match 2) ===", getMatchInfo(lRound1[1]));
  console.log("=== LOSERS QF (Match 1) ===", getMatchInfo(lQuarters[0]));
  console.log("=== LOSERS QF (Match 2) ===", getMatchInfo(lQuarters[1]));
  console.log("=== LOSERS SEMI ===", getMatchInfo(lSemis[0]));
  console.log("=== LOSERS FINAL ===", getMatchInfo(lFinal[0]));
}

main();
