import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Bar, Pie, Line } from 'react-chartjs-2';
import { useLanguage } from "@/context/LanguageContext";

type MachineAgg = { _id: string; label: string; value: number };
type SeverityAgg = { _id: string | number; label?: string; value?: number; count?: number };
type TrendAgg = { _id: string; label?: string; value?: number; totalDowntime?: number; count?: number };
type IssueTypeAgg = { _id: string; label?: string; value?: number; count?: number };
type OperatorAgg = { _id: string; label?: string; value?: number; count?: number };
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale
);

export default function AnalyticsTab() {
  const { t } = useLanguage();
  const [logsPerMachine, setLogsPerMachine] = useState<MachineAgg[]>([]);
  const [downtimePerMachine, setDowntimePerMachine] = useState<MachineAgg[]>([]);
  const [severityDist, setSeverityDist] = useState<SeverityAgg[]>([]);
  const [downtimeTrend, setDowntimeTrend] = useState<TrendAgg[]>([]);
  const [issueTypes, setIssueTypes] = useState<IssueTypeAgg[]>([]);
  const [operatorActivity, setOperatorActivity] = useState<OperatorAgg[]>([]);

  useEffect(() => {
    api.get(`/analytics/logs-per-machine`).then(r => setLogsPerMachine(r.data));
    api.get(`/analytics/downtime-per-machine`).then(r => setDowntimePerMachine(r.data));
    api.get(`/analytics/severity-distribution`).then(r => setSeverityDist(r.data));
    api.get(`/analytics/downtime-trend?interval=day`).then(r => setDowntimeTrend(r.data));
    api.get(`/analytics/issue-types`).then(r => setIssueTypes(r.data));
    api.get(`/analytics/operator-activity`).then(r => setOperatorActivity(r.data));
  }, []);

  // Chart options for consistent small height and responsive layout
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      <div className="h-48"><h3 className="font-semibold mb-2">{t('landing.analytics.card.logsTitle', 'Logs per Machine')}</h3>
        <Bar
          data={{
            labels: logsPerMachine.map((d) => d.label || d._id),
            datasets: [{ label: t('analytics.datasets.logs', 'Logs'), data: logsPerMachine.map((d) => d.value), backgroundColor: '#6366f1' }],
          }}
          options={chartOptions}
        />
      </div>
      <div className="h-48"><h3 className="font-semibold mb-2">{t('landing.analytics.card.downtimeMachineTitle', 'Downtime per Machine')}</h3>
        <Bar
          data={{
            labels: downtimePerMachine.map((d) => d.label || d._id),
            datasets: [{ label: t('analytics.datasets.downtimeMinutes', 'Downtime (min)'), data: downtimePerMachine.map((d) => d.value), backgroundColor: '#f59e42' }],
          }}
          options={chartOptions}
        />
      </div>
      <div className="h-48"><h3 className="font-semibold mb-2">{t('landing.analytics.card.severityTitle', 'Severity Distribution')}</h3>
        <Pie
          data={{
            labels: severityDist.length > 0 ? severityDist.map((d) => d.label || d._id.toString()) : ["No Data"],
            datasets: [
              {
                data: severityDist.length > 0 ? severityDist.map((d) => d.value ?? d.count ?? 0) : [1],
                backgroundColor: ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'],
              },
            ],
          }}
          options={chartOptions}
        />
      </div>
      <div className="h-48"><h3 className="font-semibold mb-2">{t('landing.analytics.card.downtimeTrendTitle', 'Downtime Trend')}</h3>
        <Line
          data={{
            labels: downtimeTrend.map((d) => d.label || d._id),
            datasets: [{ label: t('analytics.datasets.totalDowntime', 'Total Downtime'), data: downtimeTrend.map((d) => d.value ?? d.totalDowntime ?? 0), borderColor: '#6366f1', backgroundColor: '#c7d2fe' }],
          }}
          options={chartOptions}
        />
      </div>
      <div className="h-48"><h3 className="font-semibold mb-2">{t('landing.analytics.card.issueTypesTitle', 'Issue Types')}</h3>
        <Bar
          data={{
            labels: issueTypes.map((d) => d.label || d._id),
            datasets: [{ label: t('analytics.datasets.count', 'Count'), data: issueTypes.map((d) => d.value ?? d.count ?? 0), backgroundColor: '#2982A6' }],
          }}
          options={chartOptions}
        />
      </div>
      <div className="h-48"><h3 className="font-semibold mb-2">{t('landing.analytics.card.operatorTitle', 'Operator Activity')}</h3>
        <Bar
          data={{
            labels: operatorActivity.map((d) => d.label || d._id),
            datasets: [{ label: t('analytics.datasets.logs', 'Logs'), data: operatorActivity.map((d) => d.value ?? d.count ?? 0), backgroundColor: '#34d399' }],
          }}
          options={chartOptions}
        />
      </div>
    </div>
  );
}
