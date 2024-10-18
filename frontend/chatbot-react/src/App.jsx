import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Recommendations from "./routes/Recommendations";
import CreateData from "./routes/ViewData";

// import './App.css'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <header>
        <h1 className="text-4xl font-bold text-center mt-10 blue">
          This will become the ChatBot
        </h1>
      </header>
      <div className="w-full flex justify-center">
        <Tabs defaultValue="recommendations" className="w-[80%]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recommendations">
              Get Recommendations
            </TabsTrigger>
            <TabsTrigger value="create-data">Create Data</TabsTrigger>
          </TabsList>
          <TabsContent
            value="recommendations"
            className="w-full bg-gray-200 p-4"
          >
            <div className="prose">
              <h2>Recommendations</h2>
              <p>Recommendations will go here</p>
            </div>
            <Recommendations />
          </TabsContent>
          <TabsContent value="create-data" className="w-full bg-gray-200 p-4">
            <CreateData />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default App;
