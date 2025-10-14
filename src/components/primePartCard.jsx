import { Card, CardContent } from "./ui/card";

export function PrimePartCard({primePart, searchTerm, onSelect, selected}) {

  return (


    <Card className="w-full mb-4 cursor-pointer" onClick={onSelect}>
      <CardContent>
	<h1 className={selected ? "text-lg font-semibold mb-2 bg-blue-100" : "text-lg font-semibold mb-2"}>{primePart}</h1>
      </CardContent>
    </Card>
  );
}
