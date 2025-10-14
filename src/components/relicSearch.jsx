import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { RelicCard } from "./relicCard";
import { PrimePartCard } from "./primePartCard";

export function RelicSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [parts, setParts] = useState([]);
  const [relics, setRelics] = useState([]);
  const [eras, setEras] = useState(["Lith", "Meso", "Neo", "Axi"]);
  const [selectedParts, setSelectedParts] = useState([]);

  useEffect(() => {
	if (searchTerm.length > 2) {
	  searchPrimeParts(searchTerm);
	}
	else {
	  setParts([]);
	}
  }, [searchTerm]);

  const togglePartSelection = (part) => {
    if (selectedParts.includes(part)) {
      setSelectedParts(selectedParts.filter(p => p !== part).sort());
    }
    else {
      setSelectedParts([...selectedParts, part].sort());
      }
  }

  const searchPrimeParts = async (term) => {
	const searchResponse = await fetch(`/api/primePart/${encodeURI(searchTerm)}`);
	const data = await searchResponse.json();
	setParts(data);
	console.log("parts");
	console.log(data);
  }

  const searchRelicsForSelected = async (term) => {
	const searchResponse = await fetch(`/api/primePart/${encodeURI(searchTerm)}`, {METHOD: 'POST', body: JSON.stringify(selectedParts)});
	const data = await searchResponse.json();
	setParts(data);
	console.log("parts");
	console.log(data);
  }

  const searchRelics = async (term) => {
	const searchResponse = await fetch(`/api/relic/${encodeURI(searchTerm)}`);
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

  return (
	<div className="max-w-2xl mx-auto p-6 space-y-4">
	  <div>
		<h1 className="text-2xl font-bold mb-4">Warframe Relic Search</h1>
	  { selectedParts.length > 0 && (
		<div>
		  { selectedParts.map((part) => (
			<PrimePartCard key={part} primePart={part} searchTerm={searchTerm} onSelect={() => togglePartSelection(part)} selected={selectedParts.includes(part)}/>
		  ))
		  }
		</div>
	  ) }
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
	
	  { parts.length > 0 && (
		<div>
		  { parts.filter((p) => !selectedParts.includes(p)).map((part) => (
			<PrimePartCard key={part} primePart={part} searchTerm={searchTerm} onSelect={() => togglePartSelection(part)} selected={selectedParts.includes(part)}/>
		  ))
		  }
		</div>
	  ) }
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
