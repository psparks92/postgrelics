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
     rewards: sql.jsonb(relic.rewards)
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

export async function updateMissionRewards(missions) {
  try {
    await sql`delete from missions where 1 = 1;`;
    console.log("Cleared old missions");
  } catch (error) {
    console.error("Error clearing table:", error);
  }
   let missionsToInsert = missions.map(mission => ({
     planet: mission.planet,
     node: mission.node,
     mission_type: mission.missionType,
     rotations: sql.jsonb(mission.rotations)
   }));
  try {
    await sql`insert into missions ${sql(missionsToInsert)}`;
    console.log("Inserted missions into database");
  }
  catch (error) {
    console.error("Error inserting missions:", error);
  }
}

export async function searchMissionsByReward(searchTerm) {
  try {
    const results = await sql`
      SELECT 
          m.mission_name,
          rotation->>'rotation' AS rotation_name,
          reward->>'item' AS reward_item,
          reward->>'rarity' AS reward_rarity
      FROM missions m,
           jsonb_array_elements(m.rotations) AS rotation,
           jsonb_array_elements(rotation->'rewards') AS reward
      WHERE reward->>'item' ILIKE ${'%' + searchTerm + '%'}
    `;
    console.log(`Found ${results.length} rewards matching '${searchTerm}'`);
    return results;
  } catch (error) {
    console.error("Error querying missions:", error);
    throw error;
  }
}
