"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, MoreHorizontal, Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { RequiredFieldLabel } from "@/components/ui/RequiredFieldLabel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAdminToast } from "@/components/admin/ui/toast-provider";
import { AppNavbar } from "@/components/admin/AppNavbar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import type { AdminUserItem } from "@/lib/admin-store";

const ROLE_OPTIONS = [
  "Super Admin",
  "Technical Editor",
  "Catalog Manager",
  "Fleet Coordinator",
  "Operations Officer",
];

const DEPARTMENT_OPTIONS = [
  "Operations Management",
  "Marine Engineering",
  "Inventory & Fleet",
  "Logistics & Parts",
  "Commercial & Sales",
];

export default function AdminUsersPage() {
  const { showToast } = useAdminToast();
  const [users, setUsers] = React.useState<AdminUserItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  // Modal states
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<AdminUserItem | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState({
    display_name: "",
    username: "",
    email: "",
    password: "",
    role: "Technical Editor",
    department: "Marine Engineering",
    status: "Active",
  });

  // Deletion confirm
  const [deletingUser, setDeletingUser] = React.useState<AdminUserItem | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const fetchUsers = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch {
      showToast("Failed to load user accounts.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openCreateDialog = () => {
    setEditingUser(null);
    setForm({
      display_name: "",
      username: "",
      email: "",
      password: "",
      role: "Technical Editor",
      department: "Marine Engineering",
      status: "Active",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (user: AdminUserItem) => {
    setEditingUser(user);
    setForm({
      display_name: user.display_name,
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
      department: user.department,
      status: user.status,
    });
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.display_name || !form.username || !form.email) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    if (!editingUser && (!form.password || form.password.length < 8)) {
      showToast("Password is required and must be at least 8 characters.", "error");
      return;
    }

    if (editingUser && form.password && form.password.length < 8) {
      showToast("Password must be at least 8 characters.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const url = editingUser
        ? `/api/admin/users/${editingUser.id}`
        : "/api/admin/users";
      const method = editingUser ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to save user account.", "error");
        return;
      }

      setDialogOpen(false);
      showToast(
        editingUser
          ? "User account updated successfully."
          : "New user account created successfully.",
        "success"
      );
      fetchUsers();
    } catch {
      showToast("Server connection error.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${deletingUser.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        showToast("Failed to delete user.", "error");
        return;
      }
      setDeletingUser(null);
      showToast("User account removed.", "success");
      fetchUsers();
    } catch {
      showToast("Server connection error.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = u.display_name?.toLowerCase().includes(q);
        const matchUser = u.username?.toLowerCase().includes(q);
        const matchEmail = u.email?.toLowerCase().includes(q);
        const matchDept = u.department?.toLowerCase().includes(q);
        const matchRole = u.role?.toLowerCase().includes(q);
        if (!matchName && !matchUser && !matchEmail && !matchDept && !matchRole) {
          return false;
        }
      }
      return true;
    });
  }, [users, search]);

  const userSuggestions = React.useMemo(() => {
    const list: string[] = [];
    users.forEach((u) => {
      if (u.display_name) list.push(u.display_name);
      if (u.username) list.push(u.username);
      if (u.email) list.push(u.email);
      if (u.department) list.push(u.department);
      if (u.role) list.push(u.role);
    });
    return list;
  }, [users]);

  return (
    <div className="min-h-screen">
      <AppNavbar />
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
      {/* Header with Back to Settings */}
      <div className="mb-6">
        <Link
          href="/admin/settings"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Settings
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Users & Staff
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage system administrator accounts and operational role assignments
            </p>
          </div>
          <Button size="lg" onClick={openCreateDialog} className="self-start sm:self-auto">
            <Plus className="mr-1.5 size-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="mb-4">
        <ListToolbar
          search={search}
          onSearchChange={setSearch}
          placeholder="Search personnel name, username, email, or department..."
          suggestions={userSuggestions}
          hasActiveFilters={Boolean(search)}
          onResetFilters={() => setSearch("")}
        />
      </div>

      {/* Users Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table className="min-w-[840px] table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[32%] min-w-[220px] pl-6">Personnel Name</TableHead>
                <TableHead className="w-[18%] min-w-[130px]">Username</TableHead>
                <TableHead className="w-[20%] min-w-[140px]">Department</TableHead>
                <TableHead className="w-[16%] min-w-[120px]">Assigned Role</TableHead>
                <TableHead className="w-[14%] min-w-[100px]">Status</TableHead>
                <TableHead className="w-[76px] shrink-0 pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <Loader2 className="mx-auto size-6 animate-spin text-primary" />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-sm text-muted-foreground">
                    No users found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="pl-6 truncate">
                      <div className="font-normal text-sm text-slate-900 dark:text-white truncate" title={user.display_name}>
                        {user.display_name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate" title={user.email}>
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-[#dc2626] truncate">
                      <span title={`@${user.username}`}>@{user.username}</span>
                    </TableCell>
                    <TableCell className="text-xs font-normal text-slate-900 dark:text-white truncate">
                      <span title={user.department}>{user.department}</span>
                    </TableCell>
                    <TableCell className="text-xs font-normal text-slate-900 dark:text-white truncate">
                      <span title={user.role}>{user.role}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <button
                              type="button"
                              className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer outline-none ml-auto"
                              aria-label={`Actions for ${user.display_name}`}
                            >
                              <MoreHorizontal className="size-4" />
                            </button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(user)}>
                            <Pencil className="mr-2 size-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeletingUser(user)}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User Account" : "Add New User Account"}
              </DialogTitle>
              <DialogDescription>
                Provide account credentials and department permissions.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Field>
                <RequiredFieldLabel htmlFor="display_name">
                  Full Name / Display Name
                </RequiredFieldLabel>
                <Input
                  id="display_name"
                  placeholder="e.g. John Doe"
                  value={form.display_name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, display_name: e.target.value }))
                  }
                  required
                />
              </Field>

              <Field>
                <RequiredFieldLabel htmlFor="username">Username</RequiredFieldLabel>
                <Input
                  id="username"
                  placeholder="e.g. jdoe"
                  value={form.username}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, username: e.target.value }))
                  }
                  required
                />
              </Field>

              <Field>
                <RequiredFieldLabel htmlFor="email">Email Address</RequiredFieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. jdoe@pelican-ms.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <RequiredFieldLabel htmlFor="password">
                    {editingUser ? "Account Password" : "Set Account Password"}
                  </RequiredFieldLabel>
                  {editingUser && (
                    <span className="text-[11px] text-muted-foreground">
                      Leave blank to keep unchanged
                    </span>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder={editingUser ? "•••••••• (Leave blank to keep current)" : "Enter secure password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, password: e.target.value }))
                  }
                  required={!editingUser}
                  minLength={8}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="role">Assigned Role</FieldLabel>
                <Select
                  value={form.role}
                  onValueChange={(val) => {
                    if (val) setForm((p) => ({ ...p, role: val }));
                  }}
                >
                  <SelectTrigger className="w-full h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {ROLE_OPTIONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="department">Department</FieldLabel>
                <Select
                  value={form.department}
                  onValueChange={(val) => {
                    if (val) setForm((p) => ({ ...p, department: val }));
                  }}
                >
                  <SelectTrigger className="w-full h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {DEPARTMENT_OPTIONS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="status">Account Status</FieldLabel>
                <Select
                  value={form.status}
                  onValueChange={(val) => {
                    if (val) setForm((p) => ({ ...p, status: val }));
                  }}
                >
                  <SelectTrigger className="w-full h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : editingUser ? (
                  "Save Changes"
                ) : (
                  "Create User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Deletion */}
      <ConfirmDialog
        open={!!deletingUser}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete the account for "${deletingUser?.display_name}" (@${deletingUser?.username})? This action cannot be undone.`}
        confirmLabel="Delete Account"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingUser(null)}
      />
      </div>
    </div>
  );
}
