import { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import ManageLinesMachines from "./ManageLinesMachines";
import AdminSettings from "./AdminSettings";
import ManageOperators from "./ManageOperators";

export default function AdminPage() {
  useEffect(() => {
    document.title = "Admin | Shift Log";
  }, []);
  const [tab, setTab] = useState("lines");
  return (
    <div className="mx-auto p-3 sm:p-4 md:p-6">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="w-full flex-wrap h-full">
          <TabsTrigger value="lines">Lines Management</TabsTrigger>
          <TabsTrigger value="machines">Machines Management</TabsTrigger>
          <TabsTrigger value="operators">Operators</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="lines">
          <ManageLinesMachines section="lines" />
        </TabsContent>
        <TabsContent value="machines">
          <ManageLinesMachines section="machines" />
        </TabsContent>
        <TabsContent value="operators">
          <ManageOperators />
        </TabsContent>
        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
