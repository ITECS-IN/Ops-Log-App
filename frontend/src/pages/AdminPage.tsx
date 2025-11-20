import { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import ManageLinesMachines from "./ManageLinesMachines";
import AdminSettings from "./AdminSettings";
import ManageUsers from "./ManageUsers";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminPage() {
  useEffect(() => {
    document.title = "Admin | Ops-log";
  }, []);
  const [tab, setTab] = useState("lines");
  const { t } = useLanguage();
  return (
    <div className="mx-auto p-3 sm:p-4 md:p-6">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="w-full flex-wrap h-full">
          <TabsTrigger value="lines">{t('admin.tabs.lines', 'Lines Management')}</TabsTrigger>
          <TabsTrigger value="machines">{t('admin.tabs.machines', 'Machines Management')}</TabsTrigger>
          <TabsTrigger value="users">{t('admin.tabs.users', 'Add User')}</TabsTrigger>
          <TabsTrigger value="settings">{t('admin.tabs.settings', 'Settings')}</TabsTrigger>
        </TabsList>
        <TabsContent value="lines">
          <ManageLinesMachines section="lines" />
        </TabsContent>
        <TabsContent value="machines">
          <ManageLinesMachines section="machines" />
        </TabsContent>
        <TabsContent value="users">
          <ManageUsers />
        </TabsContent>
        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
