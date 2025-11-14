import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import api from "@/lib/axios";
import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "../ui/pagination";
import { toast } from "sonner";
import { useCompany } from "@/context/useCompany";

type Log = {
  _id: string;
  dateTime?: string;
  lineId?: { lineName: string } | string;
  machineId?: { machineName: string } | string;
  shift?: string;
  noteType?: string;
  severity?: string;
  duration?: number;
  description?: string;
  status?: string;
};

interface LogsSearchProps {
  setAddLogOpen: (open: boolean) => void;
  lines: { _id: string; lineName: string }[];
  machines: { _id: string; machineName: string }[];
  refreshKey?: number;
  onEditLog?: (log: any) => void;
  companyId: string;
}

export function LogsSearch({ setAddLogOpen, lines, machines, refreshKey, onEditLog, companyId }: LogsSearchProps) {
  const [logs, setLogs] = useState<Log[]>([]);
  const { company } = useCompany();
  const [filters, setFilters] = useState({
    dateTime: "", // for date-only search
    downtimeStart: "",
    downtimeEnd: "",
    lineId: "",
    machineId: "",
    shift: "",
    noteType: "",
    status: "",
    description: "",
  });
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState(filters);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, [filters, page, limit, refreshKey, companyId]);

  const fetchLogs = async () => {
    const params = { ...filters, page, limit, companyId };
    // Remove empty string filters to avoid sending "" for ObjectId fields
    Object.keys(params).forEach((k) => {
      if (typeof params[k] === "string" && params[k] === "") delete params[k];
    });
    const res = await api.get("/records", { params });
    setLogs(res.data.data);
    setTotal(res.data.total);
  };

  const handleFilter = (field: string, value: string) => {
    setPendingFilters(f => ({ ...f, [field]: value }));
  };

  const handleApplyFilters = () => {
    setFilters(pendingFilters);
    setPage(1);
    setPopoverOpen(false);
  };

  const handleResetFilters = () => {
    const reset = {
      dateTime: "",
      downtimeStart: "",
      downtimeEnd: "",
      lineId: "",
      machineId: "",
      shift: "",
      noteType: "",
      status: "",
      description: "",
    };
    setPendingFilters(reset);
    setFilters(reset);
    setPage(1);
    setPopoverOpen(false);
  };

  const totalPages = Math.ceil(total / limit);

  // Export CSV handler
  const handleExportCsv = async () => {
    const params: Record<string, string> = { ...filters };
    Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
    const query = new URLSearchParams(params).toString();
    const url = `/records/export${query ? `?${query}` : ""}`;
    try {
      const res = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'records.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
     toast.error('Failed to export CSV.');
    }
  };

  return (
    <div className="space-y-6 mt-2">
      {/* Action row: Add Log, Export CSV, Filters (inline) */}
      <div className="flex flex-row justify-between items-center gap-2 mb-2">
        <Button onClick={() => setAddLogOpen(true)} size="sm" className="whitespace-nowrap">Add Log</Button>
    <div className="flex flex-row justify-end items-center gap-2 mb-2">
         <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={Object.values(filters).some(v => v) ? "secondary" : "outline"}
              size="sm"
              className={
                "whitespace-nowrap relative" +
                (Object.values(filters).some(v => v)
                  ? " border-primary text-primary font-semibold ring-2 ring-primary/30"
                  : "")
              }
            >
              Filters
              {Object.values(filters).some(v => v) && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[340px] max-w-full p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="dateTime" className="text-xs mb-1">Date</Label>
                <Input id="dateTime" type="date" value={pendingFilters.dateTime} onChange={e => handleFilter('dateTime', e.target.value)} className="h-8 text-xs px-2" />
              </div>
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="downtimeStart" className="text-xs mb-1">Downtime Start</Label>
                <Input id="downtimeStart" type="date" value={pendingFilters.downtimeStart} onChange={e => handleFilter('downtimeStart', e.target.value)} className="h-8 text-xs px-2" />
              </div>
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="downtimeEnd" className="text-xs mb-1">Downtime End</Label>
                <Input id="downtimeEnd" type="date" value={pendingFilters.downtimeEnd} onChange={e => handleFilter('downtimeEnd', e.target.value)} className="h-8 text-xs px-2" />
              </div>
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="description" className="text-xs mb-1">Description</Label>
                <Input id="description" value={pendingFilters.description} onChange={e => handleFilter('description', e.target.value)} placeholder="Description" className="h-8 text-xs px-2" />
              </div>
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="lineId" className="text-xs mb-1">Line</Label>
                <Select value={pendingFilters.lineId} onValueChange={v => handleFilter('lineId', v)}>
                  <SelectTrigger id="lineId" size="sm" className="h-8 text-xs px-2"><SelectValue placeholder="All Lines" /></SelectTrigger>
                  <SelectContent>
                    {Array.isArray(lines) && lines.length > 0 && lines.map(line => (
                      <SelectItem key={line._id} value={line._id}>{line.lineName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="machineId" className="text-xs mb-1">Machine</Label>
                <Select value={pendingFilters.machineId} onValueChange={v => handleFilter('machineId', v)}>
                  <SelectTrigger id="machineId" size="sm" className="h-8 text-xs px-2"><SelectValue placeholder="All Machines" /></SelectTrigger>
                  <SelectContent>
                    {Array.isArray(machines) && machines.length > 0 && machines
                      .filter(m => {
                        // If no lineId filter, show all
                        if (!pendingFilters.lineId) return true;
                        // If machine has no lineId property, show it (fallback)
                        if (!('lineId' in m)) return true;
                        // If machine.lineId is string or object
                        const lineId = (m as { lineId?: string | { _id: string } }).lineId;
                        if (typeof lineId === 'string') return lineId === pendingFilters.lineId;
                        if (lineId && typeof lineId === 'object' && '_id' in lineId) return (lineId as { _id: string })._id === pendingFilters.lineId;
                        return false;
                      })
                      .map(m => (
                        <SelectItem key={m._id} value={m._id}>{m.machineName}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="shift" className="text-xs mb-1">Shift</Label>
                <Select value={pendingFilters.shift} onValueChange={v => handleFilter('shift', v)}>
                  <SelectTrigger id="shift" size="sm" className="h-8 text-xs px-2"><SelectValue placeholder="All Shifts" /></SelectTrigger>
                  <SelectContent>
                    {Array.isArray(company?.shiftTimings)
                      ? (company.shiftTimings as { name: string; start?: string; end?: string }[]).map((shift, idx) => (
                          <SelectItem key={shift.name || idx} value={shift.name} className="text-sm">
                            {shift.name} {shift.start && shift.end ? `(${shift.start} - ${shift.end})` : ""}
                          </SelectItem>
                        ))
                      : []}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="noteType" className="text-xs mb-1">Type</Label>
                <Select value={pendingFilters.noteType} onValueChange={v => handleFilter('noteType', v)}>
                  <SelectTrigger id="noteType" size="sm" className="h-8 text-xs px-2"><SelectValue placeholder="All Types" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Observation">Observation</SelectItem>
                    <SelectItem value="Breakdown">Breakdown</SelectItem>
                    <SelectItem value="Setup">Setup</SelectItem>
                    <SelectItem value="Quality">Quality</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="status" className="text-xs mb-1">Status</Label>
                <Select value={pendingFilters.status} onValueChange={v => handleFilter('status', v)}>
                  <SelectTrigger id="status" size="sm" className="h-8 text-xs px-2"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={handleResetFilters}>Reset</Button>
              <Button size="sm" onClick={handleApplyFilters}>Apply</Button>
            </div>
          </PopoverContent>
        </Popover>
        <Button variant="outline" size="sm" onClick={handleExportCsv} className="whitespace-nowrap">Export CSV</Button>
      </div>
      </div>
      <div className="overflow-x-auto rounded-lg border bg-white min-h-[260px] flex flex-col justify-between">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Line</TableHead>
              <TableHead>Machine</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Downtime (min)</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(Array.isArray(logs) && logs.length === 0) ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">No logs found.</TableCell>
              </TableRow>
            ) : (Array.isArray(logs) ? logs : []).map(log => (
              <TableRow
                key={log._id}
                className="hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onEditLog && onEditLog(log)}
              >
                <TableCell>{log.dateTime ? new Date(log.dateTime).toLocaleString() : ""}</TableCell>
                <TableCell>{typeof log.lineId === 'object' && log.lineId !== null ? log.lineId.lineName : log.lineId || ""}</TableCell>
                <TableCell>{typeof log.machineId === 'object' && log.machineId !== null ? log.machineId.machineName : log.machineId || ""}</TableCell>
                <TableCell>{log.shift}</TableCell>
                <TableCell>{log.noteType}</TableCell>
                <TableCell>{log.severity}</TableCell>
                <TableCell>{log.duration ?? 0}</TableCell>
                <TableCell className="max-w-xs truncate" title={log.description}>{log.description}</TableCell>
                <TableCell>{log.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination: centered, compact, modern look */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-2">
        <div className="flex justify-center w-full md:w-auto">
          <Pagination>
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    setPage(p => Math.max(1, p - 1));
                  }}
                  aria-disabled={page === 1}
                  tabIndex={page === 1 ? -1 : 0}
                  className="rounded-md px-2 h-8"
                />
              </PaginationItem>
              {/* Show up to 5 page links, with ellipsis if needed */}
              {(() => {
                const items = [];
                let start = 1;
                let end = totalPages;
                if (totalPages > 5) {
                  if (page <= 3) {
                    end = 5;
                  } else if (page >= totalPages - 2) {
                    start = totalPages - 4;
                  } else {
                    start = page - 2;
                    end = page + 2;
                  }
                }
                for (let p = start; p <= end; p++) {
                  items.push(
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={p === page}
                        onClick={e => {
                          e.preventDefault();
                          setPage(p);
                        }}
                        className="rounded-md px-2 h-8 text-sm"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                if (totalPages > 5 && end < totalPages) {
                  items.push(
                    <PaginationItem key="ellipsis">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return items;
              })()}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    setPage(p => Math.min(totalPages, p + 1));
                  }}
                  aria-disabled={page === totalPages || totalPages === 0}
                  tabIndex={page === totalPages || totalPages === 0 ? -1 : 0}
                  className="rounded-md px-2 h-8"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm">
          <span>Rows per page:</span>
          <Select value={String(limit)} onValueChange={v => setLimit(Number(v))}>
            <SelectTrigger className="w-20 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map(opt => (
                <SelectItem key={opt} value={String(opt)}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
