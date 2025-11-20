import { useEffect, useState, useCallback, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "@/lib/firebase";
import { useAdmin } from "@/hooks/useAdmin";

type TeamUser = {
  uid: string;
  email: string;
  role: "admin" | "user";
  admin?: boolean;
  disabled?: boolean;
  deletedAt?: string | null;
  employeeCode?: string | null;
};

export default function ManageUsers() {
  const { t } = useLanguage();
  const auth = getAuth(firebaseApp);
  const { isAdmin, claimsChecked } = useAdmin();
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [rowLoading, setRowLoading] = useState<Record<string, boolean>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(auth.currentUser?.uid ?? null);
  const [employeeCode, setEmployeeCode] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setCurrentUserId(firebaseUser?.uid ?? null);
    });
    return unsubscribe;
  }, [auth]);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await api.get("/auth/users");
      setTeamUsers(res.data);
    } catch (error: any) {
      const message = error?.response?.data?.message || t("admin.users.error.load", "Unable to load users");
      toast.error(message);
    } finally {
      setUsersLoading(false);
    }
  }, [t]);

useEffect(() => {
  if (!isAdmin || !claimsChecked) return;
  void fetchUsers();
}, [fetchUsers, isAdmin, claimsChecked]);

  const handleCreateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAdmin) return;
    if (!newUserEmail.trim()) {
      toast.error(t("admin.users.error.emailRequired", "Email is required"));
      return;
    }
    setCreateUserLoading(true);
    try {
      await api.post("/auth/users", {
        email: newUserEmail.trim(),
        role: "user",
        employeeCode: employeeCode.trim() || undefined,
      });
      toast.success(t("admin.users.toast.created", "User invitation sent"));
      setNewUserEmail("");
      setEmployeeCode("");
      await fetchUsers();
    } catch (error: any) {
      const message = error?.response?.data?.message || t("admin.users.error.create", "Unable to create user");
      toast.error(message);
    } finally {
      setCreateUserLoading(false);
    }
  };

  const setRowState = (uid: string, value: boolean) => {
    setRowLoading((prev) => {
      if (value) {
        return { ...prev, [uid]: true };
      }
      const { [uid]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const isRowLoading = (uid: string) => !!rowLoading[uid];

  const handleToggleDisabled = async (uid: string, disabled: boolean) => {
    if (!isAdmin) return;
    setRowState(uid, true);
    try {
      await api.put(`/auth/users/${uid}`, { disabled });
      toast.success(t("admin.users.toast.statusUpdated", "User status updated"));
      await fetchUsers();
    } catch (error: any) {
      const message = error?.response?.data?.message || t("admin.users.error.update", "Unable to update user");
      toast.error(message);
    } finally {
      setRowState(uid, false);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!isAdmin) return;
    const confirmMessage = t(
      "admin.users.confirmDelete",
      "Remove this user? They will no longer be able to sign in.",
    );
    if (!window.confirm(confirmMessage)) {
      return;
    }
    setRowState(uid, true);
    try {
      await api.delete(`/auth/users/${uid}`);
      toast.success(t("admin.users.toast.deleted", "User removed"));
      await fetchUsers();
    } catch (error: any) {
      const message = error?.response?.data?.message || t("admin.users.error.delete", "Unable to remove user");
      toast.error(message);
    } finally {
      setRowState(uid, false);
    }
  };

  const handleResetPassword = async (uid: string) => {
    if (!isAdmin) return;
    const confirmMessage = t(
      "admin.users.confirmReset",
      "Send a new temporary password to this user?",
    );
    if (!window.confirm(confirmMessage)) {
      return;
    }
    setRowState(uid, true);
    try {
      await api.post(`/auth/users/${uid}/reset-password`);
      toast.success(t("admin.users.toast.passwordReset", "New temporary password sent"));
    } catch (error: any) {
      const message = error?.response?.data?.message || t("admin.users.error.reset", "Unable to reset password");
      toast.error(message);
    } finally {
      setRowState(uid, false);
    }
  };

  if (!claimsChecked) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="py-8 md:py-12 mx-auto max-w-2xl">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-sm text-muted-foreground">
              {t("admin.users.noAccess", "You need administrator privileges to manage users.")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-4 md:py-8 space-y-6 mx-auto">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t("admin.users.title", "Team Members")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {t("admin.users.description", "Invite teammates and manage their access.")}
          </p>
          <form className="space-y-4" onSubmit={handleCreateUser}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="newUserEmail">{t("admin.users.emailLabel", "User Email")}</Label>
                <Input
                  id="newUserEmail"
                  type="email"
                  placeholder="user@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  disabled={createUserLoading || !isAdmin}
                />
              </div>
              <div>
                <Label htmlFor="newUserRole">{t("admin.users.roleLabel", "Role")}</Label>
                <select
                  id="newUserRole"
                  className="w-full border rounded px-3 py-2 bg-muted text-muted-foreground cursor-not-allowed"
                  value="user"
                  disabled
                >
                  <option value="user">{t("admin.users.role.user", "User")}</option>
                </select>
              </div>
              <div>
                <Label htmlFor="employeeCode">{t("admin.users.employeeCodeLabel", "Employee Code (optional)")}</Label>
                <Input
                  id="employeeCode"
                  type="text"
                  placeholder={t("admin.users.employeeCodePlaceholder", "Optional employee code")}
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                  disabled={createUserLoading || !isAdmin}
                />
              </div>
            </div>
            <Button type="submit" disabled={createUserLoading || !isAdmin}>
              {createUserLoading
                ? t("admin.users.inviteButtonLoading", "Inviting...")
                : t("admin.users.inviteButton", "Invite User")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg">{t("admin.users.tableTitle", "Current Users")}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void fetchUsers();
            }}
            disabled={usersLoading || !isAdmin}
          >
            {usersLoading ? t("admin.users.refreshing", "Refreshing...") : t("admin.users.refresh", "Refresh list")}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/50 overflow-x-auto">
            {usersLoading ? (
              <p className="p-4 text-sm text-muted-foreground">
                {t("admin.users.loading", "Loading users...")}
              </p>
            ) : teamUsers.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                {t("admin.users.empty", "No users yet. Invite someone to get started.")}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("admin.users.table.email", "Email")}</TableHead>
                    <TableHead>{t("admin.users.table.employeeCode", "Employee Code")}</TableHead>
                    <TableHead>{t("admin.users.table.status", "Status")}</TableHead>
                    <TableHead>{t("admin.users.table.actions", "Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamUsers.map((user) => {
                    const isSelf = user.uid === currentUserId;
                    return (
                      <TableRow key={user.uid} className={isSelf ? "opacity-70" : undefined}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{user.employeeCode ?? "—"}</TableCell>
                        <TableCell>
                          <span className={`text-sm font-medium ${user.disabled ? "text-red-600" : "text-green-600"}`}>
                            {user.disabled
                              ? t("admin.users.status.disabled", "Disabled")
                              : t("admin.users.status.active", "Active")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleDisabled(user.uid, !user.disabled)}
                              disabled={isRowLoading(user.uid) || isSelf || !isAdmin}
                            >
                              {user.disabled
                                ? t("admin.users.actions.enable", "Enable")
                                : t("admin.users.actions.disable", "Disable")}
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleResetPassword(user.uid)}
                              disabled={isRowLoading(user.uid) || (isSelf && user.role === "admin") || !isAdmin}
                            >
                              {t("admin.users.actions.resetPassword", "Reset Password")}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteUser(user.uid)}
                              disabled={isRowLoading(user.uid) || isSelf || !isAdmin}
                            >
                              {t("admin.users.actions.delete", "Remove")}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
