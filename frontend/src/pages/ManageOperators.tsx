import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import api from '../lib/axios';
import { useLanguage } from "@/context/LanguageContext";
import { toast } from 'sonner';

export interface Operator {
  _id?: string;
  name: string;
  employeeCode?: string;
  role?: string;
  pinCode?: string;
  shift?: string;
  createdAt?: string;
  updatedAt?: string;
  companyId?: string;
  __v?: number;
}

const ManageOperators: React.FC = () => {
  useEffect(() => {
    document.title = "Manage Operators | Ops-log";
  }, []);

  const [operators, setOperators] = useState<Operator[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOperator, setEditOperator] = useState<Operator | null>(null);
  const [form, setForm] = useState<Partial<Operator>>({});
  const { t } = useLanguage();

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    const res = await api.get('/operators');
    setOperators(res.data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/operators', {
      ...form,
      shift: 'A', // Default shift value
      pinCode: '1234', // Default pinCode value
    });
    toast.success(t('admin.operators.toast.addSuccess', 'Operator added successfully'));
    setForm({});
    setAddOpen(false);
    fetchOperators();
  };

  const handleEdit = (op: Operator) => {
    setEditOperator(op);
    setForm(op);
  };

  const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editOperator?._id) return;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...updatePayload } = form;

  // eslint disable 
  delete updatePayload.createdAt;
  delete updatePayload.updatedAt;
  delete updatePayload.__v;
  delete updatePayload.companyId;
  // eslint enable
  
  await api.put(`/operators/${editOperator._id}`, updatePayload);
  toast.success(t('admin.operators.toast.updateSuccess', 'Operator updated successfully'));
  setEditOperator(null);
  setForm({});
  fetchOperators();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/operators/${id}`);
    fetchOperators();
  };

  return (
    <div className="py-4 md:py-8 space-y-8 mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('admin.operators.pageTitle', 'Manage Operators')}</h2>
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{t('admin.operators.cardTitle', 'Operators')}</CardTitle>
          <Button size="sm" onClick={() => setAddOpen(true)}>{t('admin.operators.addButton', 'Add Operator')}</Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/50 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.name', 'Name')}</TableHead>
                  <TableHead>{t('admin.operators.table.employeeCode', 'Employee Code')}</TableHead>
                  <TableHead>{t('admin.operators.table.role', 'Role')}</TableHead>
                  {/* <TableHead>{t('admin.operators.table.pinCode', 'Pin Code')}</TableHead> */}
                  <TableHead>{t('common.actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operators.map(op => (
                  <TableRow key={op._id}>
                    <TableCell className="font-medium">{op.name}</TableCell>
                    <TableCell>{op.employeeCode}</TableCell>
                    <TableCell>{op.role}</TableCell>
                    {/* <TableCell>{op.pinCode}</TableCell> */}
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(op)}>{t('common.edit', 'Edit')}</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(op._id!)} className="ml-2">
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
      {/* Add Operator Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.operators.dialog.addTitle', 'Add Operator')}</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <Input name="name" placeholder={t('admin.operators.placeholder.name', 'Name')} value={form.name || ''} onChange={handleChange} required />
            <Input name="employeeCode" placeholder={t('admin.operators.placeholder.employeeCode', 'Employee Code')} value={form.employeeCode || ''} onChange={handleChange} />
            <Input name="role" placeholder={t('admin.operators.placeholder.role', 'Role')} value={form.role || ''} onChange={handleChange} />
            {/* <Input name="pinCode" placeholder={t('admin.operators.placeholder.pinCode', 'Pin Code')} value={form.pinCode || ''} onChange={handleChange} required /> */}
            <Button size="sm" type="submit">{t('common.add', 'Add')}</Button>
          </form>
        </DialogContent>
      </Dialog>
      {/* Edit Operator Dialog */}
      <Dialog open={!!editOperator} onOpenChange={open => !open && setEditOperator(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.operators.dialog.editTitle', 'Edit Operator')}</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-2" onSubmit={handleUpdate}>
            <Input name="name" placeholder={t('admin.operators.placeholder.name', 'Name')} value={form.name || ''} onChange={handleChange} required />
            <Input name="employeeCode" placeholder={t('admin.operators.placeholder.employeeCode', 'Employee Code')} value={form.employeeCode || ''} onChange={handleChange} />
            <Input name="role" placeholder={t('admin.operators.placeholder.role', 'Role')} value={form.role || ''} onChange={handleChange} />
            {/* <Input name="pinCode" placeholder={t('admin.operators.placeholder.pinCode', 'Pin Code')} value={form.pinCode || ''} onChange={handleChange} required /> */}
            <Button size="sm" type="submit">{t('common.update', 'Update')}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageOperators;
