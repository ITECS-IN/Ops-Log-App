import { useState ,useEffect} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLinesMachines } from "@/hooks/useLinesMachines";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export default function ManageLinesMachines({ section }: { section?: 'lines' | 'machines' }) {
  useEffect(() => {
    document.title = "Manage Lines & Machines | Ops-log";
  }, []);
  const { lines, machines, error, refetch } = useLinesMachines();
  const { t } = useLanguage();
  // Add state for add modals
  const [addLineOpen, setAddLineOpen] = useState(false);
  const [addMachineOpen, setAddMachineOpen] = useState(false);
  const [lineName, setLineName] = useState("");
  const [lineDescription, setLineDescription] = useState("");
  const [lineActive, setLineActive] = useState(true);
  const [machineName, setMachineName] = useState("");
  const [machineStatus, setMachineStatus] = useState("");
  const [machineLocation, setMachineLocation] = useState("");
  const [machineActive, setMachineActive] = useState(true);
  const [selectedLine, setSelectedLine] = useState<string>("");

  const handleAddLine = async () => {
    if (!lineName.trim()) return;
      await api.post("/lines", { lineName, description: lineDescription, isActive: lineActive });
      setLineName("");
      setLineDescription("");
      setLineActive(true);
      setAddLineOpen(false);
      refetch();
      toast.success(t('admin.lines.toast.added', 'Line added successfully'));
  };

  const handleAddMachine = async () => {
    if (!machineName.trim() || !selectedLine) return;
      await api.post("/machines", {
        machineName,
        lineId: selectedLine,
        status: machineStatus,
        location: machineLocation,
        isActive: machineActive,
      });
      setMachineName("");
      setMachineStatus("");
      setMachineLocation("");
      setMachineActive(true);
      setSelectedLine("");
      setAddMachineOpen(false);
      refetch();
      toast.success(t('admin.machines.toast.added', 'Machine added successfully'));
  };


  // Edit state
  type LineType = { _id: string; lineName: string; description?: string; isActive?: boolean };
  type MachineType = { _id: string; machineName: string; lineId: string | { _id: string; lineName: string }; status?: string; location?: string; isActive?: boolean };
  const [editLine, setEditLine] = useState<LineType | null>(null);
  const [editLineName, setEditLineName] = useState("");
  const [editLineDescription, setEditLineDescription] = useState("");
  const [editLineActive, setEditLineActive] = useState(true);
  const [editMachine, setEditMachine] = useState<MachineType | null>(null);
  const [editMachineName, setEditMachineName] = useState("");
  const [editMachineLine, setEditMachineLine] = useState("");
  const [editMachineStatus, setEditMachineStatus] = useState("");
  const [editMachineLocation, setEditMachineLocation] = useState("");
  const [editMachineActive, setEditMachineActive] = useState(true);

  const handleDeleteLine = async (id: string) => {
      await api.delete(`/lines/${id}`);
      refetch();
      toast.success(t('admin.lines.toast.deleted', 'Line deleted successfully'));
  };
  const handleEditLine = (line: LineType) => {
    setEditLine(line);
    setEditLineName(line.lineName);
    setEditLineDescription(line.description || "");
    setEditLineActive(line.isActive ?? true);
  };
  const handleUpdateLine = async () => {
    if (!editLine || !editLineName.trim()) return;
      await api.put(`/lines/${editLine._id}`, {
        lineName: editLineName,
        description: editLineDescription,
        isActive: editLineActive,
      });
      setEditLine(null);
      refetch();
      toast.success(t('admin.lines.toast.updated', 'Line updated successfully'));
  };

  const handleDeleteMachine = async (id: string) => {
      await api.delete(`/machines/${id}`);
      refetch();
      toast.success(t('admin.machines.toast.deleted', 'Machine deleted successfully'));
  };

  const handleEditMachine = (machine: MachineType) => {
    setEditMachine(machine);
    setEditMachineName(machine.machineName);
  setEditMachineLine(typeof machine.lineId === 'object' && machine.lineId !== null ? machine.lineId._id : machine.lineId);
    setEditMachineStatus(machine.status || "");
    setEditMachineLocation(machine.location || "");
    setEditMachineActive(machine.isActive ?? true);
  };
  const handleUpdateMachine = async () => {
    if (!editMachine || !editMachineName.trim() || !editMachineLine) return;
      await api.put(`/machines/${editMachine._id}`, {
        machineName: editMachineName,
        lineId: editMachineLine,
        status: editMachineStatus,
        location: editMachineLocation,
        isActive: editMachineActive,
      });
      setEditMachine(null);
      refetch();
      toast.success(t('admin.machines.toast.updated', 'Machine updated successfully'));
  };

  const sectionTitle =
    section === 'lines'
      ? t('admin.lines.section.lines', 'Manage Lines')
      : section === 'machines'
        ? t('admin.lines.section.machines', 'Manage Machines')
        : t('admin.lines.section.all', 'Manage Lines & Machines');

  return (
    <div className="py-4 md:py-8 space-y-8  mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {sectionTitle}
      </h2>
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex flex-col gap-8">
        {(section === undefined || section === 'lines') && (
          <>
            {/* Lines CRUD */}
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{t('admin.lines.cardTitle', 'Lines')}</CardTitle>
                <Button size="sm" onClick={() => setAddLineOpen(true)}>{t('admin.lines.addButton', 'Add Line')}</Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-muted/50 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('common.name', 'Name')}</TableHead>
                        <TableHead>{t('common.description', 'Description')}</TableHead>
                        <TableHead>{t('common.active', 'Active')}</TableHead>
                        <TableHead>{t('common.actions', 'Actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(lines) && lines.map(line => (
                        <TableRow key={line._id}>
                          <TableCell className="font-medium">{line.lineName}</TableCell>
                          <TableCell>{line.description}</TableCell>
                          <TableCell>{line.isActive ? t('common.yes', 'Yes') : t('common.no', 'No')}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => handleEditLine(line)}>{t('common.edit', 'Edit')}</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteLine(line._id)} className="ml-2">
                              {t('common.delete', 'Delete')}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            {/* Add Line Dialog */}
            <Dialog open={addLineOpen} onOpenChange={setAddLineOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('admin.lines.dialog.addTitle', 'Add Line')}</DialogTitle>
                </DialogHeader>
                <form className="flex flex-col gap-2" onSubmit={e => { e.preventDefault(); handleAddLine(); }}>
                  <Input value={lineName} onChange={e => setLineName(e.target.value)} placeholder={t('admin.lines.dialog.namePlaceholder', 'Line name')} />
                  <Input value={lineDescription} onChange={e => setLineDescription(e.target.value)} placeholder={t('admin.lines.dialog.descriptionPlaceholder', 'Description (optional)')} />
                  <label className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={lineActive} onChange={e => setLineActive(e.target.checked)} /> {t('admin.lines.dialog.activeLabel', 'Active')}
                  </label>
                  <Button size="sm" type="submit">{t('common.add', 'Add')}</Button>
                </form>
              </DialogContent>
            </Dialog>
            {/* Edit Line Dialog */}
            <Dialog open={!!editLine} onOpenChange={open => !open && setEditLine(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('admin.lines.dialog.editTitle', 'Edit Line')}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                  <Input value={editLineName} onChange={e => setEditLineName(e.target.value)} placeholder={t('admin.lines.dialog.namePlaceholder', 'Line name')} />
                  <Input value={editLineDescription} onChange={e => setEditLineDescription(e.target.value)} placeholder={t('admin.lines.dialog.descriptionPlaceholder', 'Description (optional)')} />
                  <label className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={editLineActive} onChange={e => setEditLineActive(e.target.checked)} /> {t('admin.lines.dialog.activeLabel', 'Active')}
                  </label>
                  <Button size="sm" onClick={handleUpdateLine}>{t('common.update', 'Update')}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
        {(section === undefined || section === 'machines') && (
          <>
            {/* Machines CRUD */}
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{t('admin.machines.cardTitle', 'Machines')}</CardTitle>
                <Button size="sm" onClick={() => setAddMachineOpen(true)}>{t('admin.machines.addButton', 'Add Machine')}</Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-muted/50 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('common.name', 'Name')}</TableHead>
                        <TableHead>{t('common.line', 'Line')}</TableHead>
                        <TableHead>{t('common.status', 'Status')}</TableHead>
                        <TableHead>{t('common.location', 'Location')}</TableHead>
                        <TableHead>{t('common.active', 'Active')}</TableHead>
                        <TableHead>{t('common.actions', 'Actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(machines) && machines.map(machine => (
                        <TableRow key={machine._id}>
                          <TableCell className="font-medium">{machine.machineName}</TableCell>
                          <TableCell>{typeof machine.lineId === 'object' && machine.lineId !== null ? machine.lineId.lineName : machine.lineId}</TableCell>
                          <TableCell>{machine.status}</TableCell>
                          <TableCell>{machine.location}</TableCell>
                          <TableCell>{machine.isActive ? t('common.yes', 'Yes') : t('common.no', 'No')}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => handleEditMachine(machine)}>{t('common.edit', 'Edit')}</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteMachine(machine._id)} className="ml-2">
                              {t('common.delete', 'Delete')}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            {/* Add Machine Dialog */}
            <Dialog open={addMachineOpen} onOpenChange={setAddMachineOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('admin.machines.dialog.addTitle', 'Add Machine')}</DialogTitle>
                </DialogHeader>
                <form className="flex flex-col gap-2" onSubmit={e => { e.preventDefault(); handleAddMachine(); }}>
                  <Input value={machineName} onChange={e => setMachineName(e.target.value)} placeholder={t('admin.machines.dialog.namePlaceholder', 'Machine name')} />
                  <Select value={selectedLine} onValueChange={setSelectedLine}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('admin.machines.selectLine', 'Select line')} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(lines) && lines.map(line => (
                        <SelectItem key={line._id} value={line._id}>{line.lineName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input value={machineStatus} onChange={e => setMachineStatus(e.target.value)} placeholder={t('admin.machines.dialog.statusPlaceholder', 'Status (optional)')} />
                  <Input value={machineLocation} onChange={e => setMachineLocation(e.target.value)} placeholder={t('admin.machines.dialog.locationPlaceholder', 'Location (optional)')} />
                  <label className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={machineActive} onChange={e => setMachineActive(e.target.checked)} /> {t('admin.machines.dialog.activeLabel', 'Active')}
                  </label>
                  <Button size="sm" type="submit">{t('common.add', 'Add')}</Button>
                </form>
              </DialogContent>
            </Dialog>
            {/* Edit Machine Dialog */}
            <Dialog open={!!editMachine} onOpenChange={open => !open && setEditMachine(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('admin.machines.dialog.editTitle', 'Edit Machine')}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                  <Input value={editMachineName} onChange={e => setEditMachineName(e.target.value)} placeholder={t('admin.machines.dialog.namePlaceholder', 'Machine name')} />
                  <Select value={editMachineLine} onValueChange={setEditMachineLine}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('admin.machines.selectLine', 'Select line')} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(lines) && lines.map(line => (
                        <SelectItem key={line._id} value={line._id}>{line.lineName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input value={editMachineStatus} onChange={e => setEditMachineStatus(e.target.value)} placeholder={t('admin.machines.dialog.statusPlaceholder', 'Status (optional)')} />
                  <Input value={editMachineLocation} onChange={e => setEditMachineLocation(e.target.value)} placeholder={t('admin.machines.dialog.locationPlaceholder', 'Location (optional)')} />
                  <label className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={editMachineActive} onChange={e => setEditMachineActive(e.target.checked)} /> {t('admin.machines.dialog.activeLabel', 'Active')}
                  </label>
                  <Button size="sm" onClick={handleUpdateMachine}>{t('common.update', 'Update')}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}
