import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import api from '../lib/axios';

export interface Operator {
  _id?: string;
  name: string;
  employeeCode?: string;
  role?: string;
  pinCode: string;
}

const ManageOperators: React.FC = () => {
  useEffect(() => {
    document.title = "Manage Operators | Shift Log";
  }, []);

  const [operators, setOperators] = useState<Operator[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOperator, setEditOperator] = useState<Operator | null>(null);
  const [form, setForm] = useState<Partial<Operator>>({});

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
    await api.post('/operators', form);
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
  const { _id, companyId, createdAt, updatedAt, __v, ...updatePayload } = form;
  await api.put(`/operators/${editOperator._id}`, updatePayload);
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
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Operators</h2>
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Operators</CardTitle>
          <Button size="sm" onClick={() => setAddOpen(true)}>Add Operator</Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/50 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Employee Code</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Pin Code</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operators.map(op => (
                  <TableRow key={op._id}>
                    <TableCell className="font-medium">{op.name}</TableCell>
                    <TableCell>{op.employeeCode}</TableCell>
                    <TableCell>{op.role}</TableCell>
                    <TableCell>{op.pinCode}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(op)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(op._id!)} className="ml-2">Delete</Button>
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
            <DialogTitle>Add Operator</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <Input name="name" placeholder="Name" value={form.name || ''} onChange={handleChange} required />
            <Input name="employeeCode" placeholder="Employee Code" value={form.employeeCode || ''} onChange={handleChange} />
            <Input name="role" placeholder="Role" value={form.role || ''} onChange={handleChange} />
            <Input name="pinCode" placeholder="Pin Code" value={form.pinCode || ''} onChange={handleChange} required />
            <Button size="sm" type="submit">Add</Button>
          </form>
        </DialogContent>
      </Dialog>
      {/* Edit Operator Dialog */}
      <Dialog open={!!editOperator} onOpenChange={open => !open && setEditOperator(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Operator</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-2" onSubmit={handleUpdate}>
            <Input name="name" placeholder="Name" value={form.name || ''} onChange={handleChange} required />
            <Input name="employeeCode" placeholder="Employee Code" value={form.employeeCode || ''} onChange={handleChange} />
            <Input name="role" placeholder="Role" value={form.role || ''} onChange={handleChange} />
            <Input name="pinCode" placeholder="Pin Code" value={form.pinCode || ''} onChange={handleChange} required />
            <Button size="sm" type="submit">Update</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageOperators;
