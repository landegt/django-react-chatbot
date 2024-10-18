import { Link, Outlet, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RootLayout() {
  const location = useLocation();

  return (
    <>
      <header>
        <h1 className="text-4xl font-bold text-center m-10 blue">
          Recommender ChatBot
        </h1>
      </header>
      <div className="w-full flex justify-center">
        <Tabs value={location.pathname} className="w-[90%]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="/" asChild>
              <Link to="/">Recommendations</Link>
            </TabsTrigger>
            <TabsTrigger value="/view-data" asChild>
              <Link to="/view-data">View Data</Link>
            </TabsTrigger>
            <TabsTrigger value="/create-data" asChild>
              <Link to="/create-data">Create Data</Link>
            </TabsTrigger>
          </TabsList>
          <TabsContent value={location.pathname}>
            <Outlet />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
