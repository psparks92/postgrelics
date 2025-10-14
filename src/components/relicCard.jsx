import { Card, CardContent } from "./ui/card";
import { MissionCard} from "./missionCard";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export function RelicCard({ relic, searchTerm }) {
  const [reward, setReward] = useState(null);
  const [missions, setMissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMissions, setShowMissions] = useState(false);

  const handleShowMissions = async () => {
    if (showMissions) {
			setShowMissions(false);
			return;
		}
    setIsLoading(true);
    let relicMissions = [];
    console.log('relic name');
    console.log(relic.name);
    const missionsResponse = await fetch(`/api/mission/${relic.name}`);
    const missions = await missionsResponse.json();
    if (missions.length > 0) {
      let relicMissions = missions.map(mission => ({
	name: mission.mission_name,
	rotation: mission.rotation_name,
	reward: mission.reward_item,
	rarity: mission.reward_rarity
      }));
      let orderedRelicMissions = relicMissions.sort((a, b) => {
	let rarityPctA = /.*(\d+)%.*/.exec(a.rarity);
	let rarityPctB = /.*(\d+)%.*/.exec(b.rarity);
	return rarityPctB[1] - rarityPctA[1];
      });
      setShowMissions(true);
      setMissions(orderedRelicMissions);
    }
      setIsLoading(false);
  }


  return (


    <Card className="w-full mb-4">
      <CardContent>
	<h1 className="text-lg font-semibold mb-2">{relic.name}</h1>
	<p className="text-sm text-muted-foreground mb-2">{relic.item}: {relic.rarity}</p>
	<Button 
	  onClick={handleShowMissions}
	  disabled={isLoading}
	  variant="outline"
	  size="sm"
	>
	  {isLoading ? 'Loading...' : showMissions ? 'Hide Missions' : 'Show Missions'}
	</Button>
	{missions.length > 0 && showMissions && (
	 //  <ul className="mt-4 space-y-2">
	 //    {missions.map((mission, index) => (
	 //      <li key={index} className="text-sm">
		// {mission.name} - Rotation: {mission.rotation} - Reward: {mission.reward} ({mission.rarity})
	 //      </li>
	 //    ))}
	 //  </ul>
	  missions.map((mission, index) => (
	    <MissionCard key={index} mission={mission} />
	  ))
	)}
      </CardContent>
    </Card>
  );
}
