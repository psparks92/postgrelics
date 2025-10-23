import { sql } from 'bun';

export async function updateRelics(relics) {
  try {
    await sql`delete from relics where 1 = 1;`;
    console.log("Cleared old relics");
  } catch (error) {
    console.error("Error clearing table:", error);
  }
  try {
    for (const relic of relics) {
      const tier = /^(.*) ([A-Za-z])(\d+) Relic$/.exec(relic.relic)[1];
      const letter = /^(.*) ([A-Za-z])(\d+) Relic$/.exec(relic.relic)[2];
      const sequence = /^(.*) ([A-Za-z])(\d+) Relic$/.exec(relic.relic)[3];
      await sql`insert into relics (tier, letter, sequence, rewards) values (${tier}, ${letter}, ${sequence}, ${relic.rewards})`;
      // await sql`insert into relics (tier, letter, sequence, rewards) values (${tier}, ${letter}, ${sequence}, ${JSON.stringify(relic.rewards)}::jsonb)`;
    }
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

export async function searchRelicsWithMultipleRewards(parts) {
  try {
    let partsParam = sql.array(parts, 'text');
    const results = await sql`
WITH relic_names AS (
    SELECT
        r.name,
        concat(r.name, ' Relic') as full_relic_name,
        relic_rewards->>'item' as item,
        relic_rewards->>'rarity' as rarity
    FROM relics r,
         jsonb_array_elements(r.rewards) as relic_rewards
    WHERE relic_rewards->>'item' = ANY(${partsParam})
)
SELECT
    rn.name,
    rn.rarity,
    rn.full_relic_name,
    NOT EXISTS (  -- Added NOT here
        SELECT 1
        FROM missions m,
        jsonb_array_elements(rotations) as rot,
        jsonb_array_elements(rot->'rewards') as rewards
        WHERE rewards->>'item' = rn.full_relic_name
    ) as vaulted,
    rn.item
FROM relic_names rn
ORDER BY vaulted
`;
//where reward->>'item' = ANY(${partsParam})
    return results;
  } catch (error) {
    console.error("Error searching relics:", error);
    return [];
  }
}

export async function searchPrimeParts(searchTerm) {
  try {
    const results = await sql`select distinct reward->>'item' as item
from relics r, jsonb_array_elements(rewards) as reward
where reward->>'item' ilike ${'%'+searchTerm+'%'}`;
    return results.map(row => row.item);
  } catch (error) {
    console.error("Error searching prime parts:", error);
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
  try {
    for (const mission of missions) {
      await sql`insert into missions (planet, node, mission_type, rotations) values (${mission.planet}, ${mission.node}, ${mission.missionType}, ${mission.rotations})`;
    }
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
