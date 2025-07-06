import { Card, CardContent } from "@/components/ui/card";
import { RelicSearch } from "@/components/relicSearch";
import { APITester } from "./APITester";
import "./index.css";
import logo from "./logo.svg";
import reactLogo from "./react.svg";

export function App() {
  return (
    <div className="container mx-auto p-8 text-center relative z-10">
    <RelicSearch className="fixed bottom-0 left-0 right-0 z-20" />
    </div>
  );
}

export default App;
