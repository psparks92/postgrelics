import { Card, CardContent } from "@/components/ui/card";

export function MissionCard({mission}) {
  const getMissionType = (name) => 
  {
    return name.replace(/.*\((.*)\).*/, '$1');
  }
  const getMissionNode = (name) => {
    return name.replace(/(.*) \(.*\)/, '$1');
  }

  return (


    <Card className="w-full mb-4">
      <CardContent>
	<h1 className="text-lg font-semibold mb-2">{getMissionType(mission.name)}</h1>
	<p className="text-sm text-muted-foreground mb-2">{getMissionNode(mission.name)}</p>
	<p className="text-sm text-muted-foreground mb-2">{mission.reward} - {mission.rarity}</p>
      </CardContent>
    </Card>
  );
}
