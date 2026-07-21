import { fetchEventDetails } from '../src/lib/startgg';

async function main() {
  const data = await fetchEventDetails("tournament/pakistan-tekken-league-stage-4/event/tekken-8");
  console.log("FETCHED STANDINGS COUNT:", data?.standings?.nodes?.length);
  console.log("FETCHED SETS COUNT:", data?.sets?.nodes?.length);
  console.log("FIRST STANDING:", data?.standings?.nodes?.[0]);
  console.log("FIRST SET:", data?.sets?.nodes?.[0]);
}
main();
