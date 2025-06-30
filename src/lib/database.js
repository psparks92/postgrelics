import { sql } from 'bun';

export async function updateRelics(relics) {
  try {
    await sql`delete from relics where 1 = 1;`;
    console.log("Cleared old relics");
  } catch (error) {
    console.error("Error clearing table:", error);
  }
  let relicsToInsert = relics.map(relic => ({
    tier: /^(.*) ([A-Za-z])(\d+) Relic$/.exec(relic.relic)[1],
    letter: /^(.*) ([A-Za-z])(\d+) Relic$/.exec(relic.relic)[2],
    sequence: /^(.*) ([A-Za-z])(\d+) Relic$/.exec(relic.relic)[3],
    rewards: relic.rewards
  }));
  try {
    await sql`insert into relics ${sql(relicsToInsert)}`;
    console.log("Inserted relics into database");
  }
  catch (error) {
    console.error("Error inserting relics:", error);
  }
}

export async function searchRelicsByReward(searchTerm) {
  try {
    const results = await sql`select r.name, reward->>'item' as item, reward->>'rarity' as rarity
      from relics r, jsonb_array_elements(rewards) as reward
      where reward->>'item' ilike ${'%'+searchTerm+'%'}`;
    return results;
  } catch (error) {
    console.error("Error searching relics:", error);
    return [];
  }
}
