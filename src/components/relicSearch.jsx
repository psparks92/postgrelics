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
