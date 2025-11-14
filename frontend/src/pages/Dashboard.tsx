import { AddLogModal } from "@/components/dashboard/AddLogModal";
import { LogsSearch } from "@/components/dashboard/LogsSearch";
import { StatCard } from "@/components/dashboard/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLinesMachines } from "@/hooks/useLinesMachines";
import api from "@/lib/axios";
import { useCallback, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import firebaseApp from "@/lib/firebase";
import AnalyticsTab from "@/components/dashboard/AnalyticsTab";
import { useLanguage } from "@/context/LanguageContext";

export default function Dashboard() {
  useEffect(() => {
    document.title = "Dashboard | Shift Log";
  }, []);
  const [addLogOpen, setAddLogOpen] = useState(false);
  const [editLog, setEditLog] = useState<any | null>(null);
  const [tab, setTab] = useState("logs");
  const [user, setUser] = useState<any | null>(null);
  // const navigate = useNavigate();
  const { lines, machines } = useLinesMachines();
  const [stats, setStats] = useState({
    totalLogsToday: 0,
    totalDowntimeHours: 0,
    avgMTTR: 0,
    availability: 0,
  });
  const [logsRefreshKey, setLogsRefreshKey] = useState(0);
  const { t } = useLanguage();
  const fetchStats = useCallback(() => {
    api.get("/dashboard/stats").then(res => {
      setStats(res.data);
    });
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogAdded = useCallback(() => {
    setLogsRefreshKey(k => k + 1);
    fetchStats();
    setEditLog(null);
  }, [fetchStats]);

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">{t('dashboard.title', 'Dashboard')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title={t('dashboard.stat.totalLogs', 'Total Logs Today')} value={stats.totalLogsToday} compact />
        <StatCard title={t('dashboard.stat.totalDowntime', 'Total Downtime (Hours)')} value={stats.totalDowntimeHours} compact />
        <StatCard title={t('dashboard.stat.avgMttr', 'Average MTTR (Min)')} value={stats.avgMTTR} compact />
        <StatCard title={t('dashboard.stat.availability', 'Availability (%)')} value={stats.availability} compact />
      </div>
      <AddLogModal
        lines={lines}
        machines={machines}
        onSubmit={handleLogAdded}
        open={addLogOpen || !!editLog}
        setOpen={v => {
          setAddLogOpen(v);
          if (!v) setEditLog(null);
        }}
        isEdit={!!editLog}
        editLog={editLog}
      />
      <div className="mt-6 sm:mt-8">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 sm:flex">
            <TabsTrigger value="logs">{t('dashboard.tabs.logs', 'View Log')}</TabsTrigger>
            <TabsTrigger value="analytics">{t('dashboard.tabs.analytics', 'Analytics')}</TabsTrigger>
          </TabsList>
          <TabsContent value="logs">
            <LogsSearch
              setAddLogOpen={setAddLogOpen}
              lines={lines || []}
              machines={machines || []}
              refreshKey={logsRefreshKey}
              onEditLog={log => setEditLog(log)}
              companyId={user?.companyId || ""}
            />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
