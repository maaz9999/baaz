async function test() {
  const res = await fetch("https://api.start.gg/gql/alpha", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer 16f9636227e3c5fb894dc32e9a4201df",
    },
    body: JSON.stringify({
      query: `
        query EventDetails($slug: String!) {
          event(slug: $slug) {
            id
            name
            state
            standings(query: { page: 1, perPage: 16 }) {
              nodes {
                placement
                entrant {
                  id
                  name
                }
              }
            }
            sets(page: 1, perPage: 50) {
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
      `,
      variables: { slug: "tournament/pakistan-tekken-league-stage-4/event/tekken-8" },
    }),
  });
  const data = await res.json();
  console.log("EVENT:", data.data?.event?.name, "STATE:", data.data?.event?.state);
  console.log("STANDINGS:", JSON.stringify(data.data?.event?.standings?.nodes, null, 2));
  console.log("SETS COUNT:", data.data?.event?.sets?.nodes?.length);
  console.log("SAMPLE SETS:", JSON.stringify(data.data?.event?.sets?.nodes?.slice(0, 10), null, 2));
}
test();
