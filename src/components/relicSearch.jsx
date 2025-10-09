import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { RelicCard } from "./relicCard";

export function RelicSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [relics, setRelics] = useState([]);

  useEffect(() => {
	if (searchTerm.length > 3) {
	  searchRelics(searchTerm);
	}
	else {
	  setRelics([]);
	}
  }, [searchTerm]);
  const searchRelics = async (term) => {
	const searchResponse = await fetch(`/api/relic/${searchTerm}`);
	const data = await searchResponse.json();
	setRelics(data);
  }
  //todo: buttons to call these, notification of success
  const updateRelics = async () => {
	await fetch(`/api/relic`, { method: 'PUT' });
    // show updated
  }
  const updateMissions = async () => {
	await fetch(`/api/mission`, { method: 'PUT' });
    // show updated
  }
  const scrapeData = async () => {
    await updateRelics();
    await updateMissions();
  }
  function printRelic(relic) {
	let rewardName = searchTerm.toLowerCase();
	let relicReward = relic.rewards.find((reward) =>
	  reward.item.toLowerCase().includes(rewardName.toLowerCase()));
	if (relicReward) {
	  return (
		<li key={relic.id} className="py-2">
		  <span className="font-semibold">{relic.name}</span> - {relicReward.rarity} - {relicReward.item}
		</li>
	  );
	}
  }

  return (
	<div className="max-w-2xl mx-auto p-6 space-y-4">
	  <div>
		<h1 className="text-2xl font-bold mb-4">Warframe Relic Search</h1>
		<button onClick={scrapeData} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
		Update Data
		</button>
		<Input
		  type="text"
		  placeholder="Search for rewards (e.g., 'Prime', 'Blueprint')..."
		  value={searchTerm}
		  onChange={(e) => setSearchTerm(e.target.value)}
		  className="w-full"
		/>

		{searchTerm.length > 0 && searchTerm.length < 3 && (
		  <p className="text-sm text-muted-foreground mt-2">
			Type at least 3 characters to search
		  </p>
		)}
	  </div>
	  { relics.length > 0 && (
		<div>
		  { relics.map((relic) => (
			<RelicCard key={relic.name} relic={relic} searchTerm={searchTerm} />
		  ))
		  }
		</div>
	  ) }
	</div>
  );

}
