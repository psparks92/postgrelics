import * as cheerio from 'cheerio';

export function parseRelics(table) {

  let relics = [];
  let relicTables = table.children('tbody').children('tr');
  console.log(relicTables.length);
  if (relicTables.length === 0) {
	return '';
  }
  return parseRelicTables(relicTables);
}

function parseRelicTables(rows) {
  let relics = [];
  let relicRows = [];
  for (let i = 0; i < rows.length; i++) {
	if (cheerio.load(rows[i])('tr').children('.blank-row').length > 0) {
	  console.log(`parsing ${relicRows.length} relic rows (i = ${i})`);
	  let relic = parseRelicTable(relicRows);
	  if (!relic.relic.includes('Requiem') && relic.refinement == 'Intact') {
		relics.push({ relic: relic.relic, rewards: relic.rewards});
	  }
	  relicRows = [];
	}
	else {
	  relicRows.push(rows[i]);
	}
  }
  console.log(relics[0]);
  console.log(`Found ${relics.length} relics.`);
  return relics;
}

function parseRelicTable(rows) {
  if (rows.length === 0) {
	console.log('no rows?');
	return '';
  }
  let title = rows[0].children[0].children[0].data;
  let parts = /^(.*) \((.*)\)$/.exec(title);
  let relicName = parts[1];
  let refinement = parts[2];
  let rewards = [];
  rows.slice(1).forEach((row) => {
	let cells = row.children;
	if (cells.length > 0) {
	  let reward = {
		item: cells[0].children[0].data,
		rarity: cells[1].children[0].data
	  };
	  if (reward.rarity.includes('25.33%')) {
		reward.rarity = 'Common';
	  }
	  else if (reward.rarity.includes('Uncommon')) {
		reward.rarity = 'Uncommon';
	  }
	  else if (reward.rarity.includes('Rare')) {
		reward.rarity = 'Rare';
	  }
	  // console.log(`Found reward: ${reward.reward} (${reward.rarity})`);
	  rewards.push(reward);
	}
  });
  // console.log(`Found relic: ${relicName} (${refinement}) with ${rewards.length} rewards.`);
  return {
	relic: relicName,
	refinement: refinement,
	rewards: rewards
  };
}

export function parseMissions(table) {
	let missions = [];
	let rows = table.children('tbody').children('tr');
  let missionRows = [];
  for (let i = 0; i < rows.length; i++) {
	if (cheerio.load(rows[i])('tr').children('.blank-row').length > 0) {
	  console.log(`parsing ${missionRows.length} mission rows (i = ${i})`);
	  let mission = parseMissionTable(missionRows);
	  if (mission && !mission.planet.includes('Event')) {
		missions.push({ planet: mission.planet, node: mission.node, missionType: mission.missionType, rotations: mission.rotations});
	  }
	  missionRows = [];
	}
	else {
	  missionRows.push(rows[i]);
	}
  }
  console.log(missions[0]);
  console.log(`Found ${missions.length} missions.`);
  return missions;
}

function parseMissionTable(rows) {
  if (rows.length === 0) {
	console.log('no rows?');
	return null;
  }
  let title = rows[0].children[0].children[0].data;
  let parts = /^(.*)\/(.*) \((.*)\)$/.exec(title);
  if (!parts) {
	console.log(`Failed to parse mission title: ${title}`);
	return null;
  }
  let planet = parts[1];
  let missionName = parts[2];
  let missionType = parts[3];
  let rotations = [];
  console.log(`Parsing mission: ${missionName} (${missionType})`);
  let rotationTitle = rows[1].children[0].children[0].data;
  let rotationRewards = [];
  rows.slice(2).forEach((row) => {
	let cells = row.children;
	console.log(`Parsing row with ${cells.length} cells`);
	//console.log(cells);
	if (cells.length == 2) {
	  let reward = {
		item: cells[0].children[0].data,
		rarity: cells[1].children[0].data
	  };
	  rotationRewards.push(reward);
	  console.log(`Found reward: ${reward.item} (${reward.rarity})`);
	}
	else if (cells.length == 1) {
	  if (rotationRewards.length > 0) {
		rotations.push({ rotation: rotationTitle, rewards: rotationRewards });
		rotationRewards = [];
		rotationTitle = cells[0].children[0].data;
	  }
	}
  });
  rotations.push({ rotation: rotationTitle, rewards: rotationRewards });
  // console.log(`Found mission: ${missionName} (${refinement}) with ${rewards.length} rewards.`);
  return {
	planet: planet,
	node: missionName,
	missionType: missionType,
	rotations: rotations
  };
}
