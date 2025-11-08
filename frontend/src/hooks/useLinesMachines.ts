import { useEffect, useState } from "react";
import api from "@/lib/axios";

export function useLinesMachines() {
  const [lines, setLines] = useState<any[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = () => setRefreshKey(k => k + 1);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/lines"),
      api.get("/machines"),
    ])
      .then(([linesRes, machinesRes]) => {
        setLines(linesRes.data);
        setMachines(machinesRes.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return { lines, machines, loading, error, refetch };
}
