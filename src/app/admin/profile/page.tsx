"use client";

import * as React from "react";
import { LockKeyhole, UserRound, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { useAdminToast } from "@/components/admin/ui/toast-provider";
import { AppNavbar } from "@/components/admin/AppNavbar";
import type { SiteSettings } from "@/lib/admin-store";

export default function AdminProfilePage() {
  const { showToast } = useAdminToast();
  const [loading, setLoading] = React.useState(true);
  const [editingUser, setEditingUser] = React.useState(false);
  const [editingStaff, setEditingStaff] = React.useState(false);
  const [savingUser, setSavingUser] = React.useState(false);
  const [savingStaff, setSavingStaff] = React.useState(false);
  const [changingPassword, setChangingPassword] = React.useState(false);

  const [userForm, setUserForm] = React.useState({
    display_name: "Principal Administrator",
    username: "admin",
    email: "admin@pelican-ms.com",
    phone: "+62 877-8780-6333",
    role: "Super Admin",
  });

  const [staffForm, setStaffForm] = React.useState({
    full_name: "Principal Administrator",
    department: "Operations & Engineering Division",
    position: "Chief Systems Administrator",
    employment_type: "Full-time",
    location: "Tiban Baru, Sekupang, Batam",
    hire_date: "2021-03-15",
    emergency_contact_name: "Pelican Operational Command Center",
    emergency_contact_phone: "+62 877-8780-6333",
  });

  const [passwordForm, setPasswordForm] = React.useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const loadProfile = React.useCallback(() => {
    fetch("/api/admin/profile")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setUserForm({
          display_name: data.display_name || "Principal Administrator",
          username: data.username || "admin",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || "Super Admin",
        });
        setStaffForm({
          full_name: data.display_name || "Principal Administrator",
          department: data.department || "Operations Management",
          position: data.position || "Chief Systems Administrator",
          employment_type: data.employment_type || "Full-time",
          location: data.location || "Tiban Baru, Sekupang, Batam",
          hire_date: data.hire_date || "2021-03-15",
          emergency_contact_name: data.emergency_contact_name || "Pelican Operational Command Center",
          emergency_contact_phone: data.emergency_contact_phone || "+62 877-8780-6333",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const userInitials =
    userForm.display_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AD";

  const handleSaveProfile = async () => {
    setSavingUser(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: userForm.display_name,
          email: userForm.email,
          phone: userForm.phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to update profile.", "error");
        return;
      }
      setEditingUser(false);
      showToast("Profile updated successfully.", "success");
      loadProfile();
    } catch {
      showToast("Unable to reach server. Please try again.", "error");
    } finally {
      setSavingUser(false);
    }
  };

  const handleSaveStaff = async () => {
    setSavingStaff(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: staffForm.full_name,
          department: staffForm.department,
          position: staffForm.position,
          location: staffForm.location,
          emergency_contact_name: staffForm.emergency_contact_name,
          emergency_contact_phone: staffForm.emergency_contact_phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to update employee details.", "error");
        return;
      }
      setEditingStaff(false);
      showToast("Employee details updated successfully.", "success");
      loadProfile();
    } catch {
      showToast("Unable to reach server. Please try again.", "error");
    } finally {
      setSavingStaff(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.newPassword) {
      showToast("Please enter both current and new password.", "error");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      showToast("New password must be at least 8 characters long.", "error");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirm) {
      showToast("New passwords do not match.", "error");
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.current,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to change password.", "error");
        return;
      }
      setPasswordForm({ current: "", newPassword: "", confirm: "" });
      showToast("Password updated successfully.", "success");
    } catch {
      showToast("Unable to reach server. Please try again.", "error");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <AppNavbar />
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppNavbar />
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
      {/* Header (matches deliverjob-share ProfilePage.tsx 1:1) */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal account information and credentials
        </p>
      </div>

      {/* User Card */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground shadow-xs">
              {userInitials}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">
                {userForm.display_name}
              </h2>
              <p className="text-sm text-muted-foreground">{userForm.role}</p>
            </div>
            <div className="self-start">
              {!editingUser && (
                <Button variant="outline" onClick={() => setEditingUser(true)}>
                  Edit
                </Button>
              )}
            </div>
          </div>

          {!editingUser ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">
                  Email Address
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {userForm.email}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">
                  Username
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {userForm.username}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">
                  Display Name
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {userForm.display_name}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">
                  Phone Number
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {userForm.phone}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="display_name">Display Name</FieldLabel>
                <Input
                  id="display_name"
                  value={userForm.display_name}
                  onChange={(e) =>
                    setUserForm((p) => ({ ...p, display_name: e.target.value }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  value={userForm.username}
                  disabled
                  className="opacity-70"
                />
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <Input
                  id="phone"
                  value={userForm.phone}
                  onChange={(e) =>
                    setUserForm((p) => ({ ...p, phone: e.target.value }))
                  }
                />
              </Field>
              <div className="mt-2 flex justify-end gap-2 sm:col-span-2">
                <Button variant="outline" onClick={() => setEditingUser(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} disabled={savingUser}>
                  {savingUser ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee Information Card */}
      <Card className="mb-6 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-foreground">
              <UserRound className="size-5 text-primary" />
            </div>
            <h3 className="flex-1 text-base font-semibold text-foreground">
              Employee Information
            </h3>
            {!editingStaff && (
              <Button variant="outline" onClick={() => setEditingStaff(true)}>
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!editingStaff ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">
                  Full Name
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {staffForm.full_name}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">
                  Department
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {staffForm.department}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">
                  Position
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {staffForm.position}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">
                  Employment Type
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {staffForm.employment_type}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">
                  Work Location
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {staffForm.location}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">
                  Hire Date
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {staffForm.hire_date}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">
                  Emergency Contact
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {staffForm.emergency_contact_name}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">
                  Emergency Phone
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {staffForm.emergency_contact_phone}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="full_name">Full Name</FieldLabel>
                <Input
                  id="full_name"
                  value={staffForm.full_name}
                  onChange={(e) =>
                    setStaffForm((p) => ({ ...p, full_name: e.target.value }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="department">Department</FieldLabel>
                <Input
                  id="department"
                  value={staffForm.department}
                  onChange={(e) =>
                    setStaffForm((p) => ({ ...p, department: e.target.value }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="position">Position</FieldLabel>
                <Input
                  id="position"
                  value={staffForm.position}
                  onChange={(e) =>
                    setStaffForm((p) => ({ ...p, position: e.target.value }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="employment_type">Employment Type</FieldLabel>
                <Input
                  id="employment_type"
                  value={staffForm.employment_type}
                  onChange={(e) =>
                    setStaffForm((p) => ({ ...p, employment_type: e.target.value }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="location">Work Location</FieldLabel>
                <Input
                  id="location"
                  value={staffForm.location}
                  onChange={(e) =>
                    setStaffForm((p) => ({ ...p, location: e.target.value }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="emergency_contact_name">
                  Emergency Contact Name
                </FieldLabel>
                <Input
                  id="emergency_contact_name"
                  value={staffForm.emergency_contact_name}
                  onChange={(e) =>
                    setStaffForm((p) => ({
                      ...p,
                      emergency_contact_name: e.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="emergency_contact_phone">
                  Emergency Phone Number
                </FieldLabel>
                <Input
                  id="emergency_contact_phone"
                  value={staffForm.emergency_contact_phone}
                  onChange={(e) =>
                    setStaffForm((p) => ({
                      ...p,
                      emergency_contact_phone: e.target.value,
                    }))
                  }
                />
              </Field>
              <div className="mt-2 flex justify-end gap-2 sm:col-span-2">
                <Button variant="outline" onClick={() => setEditingStaff(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveStaff} disabled={savingStaff}>
                  {savingStaff ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Information"
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <LockKeyhole className="size-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Change Password
            </h3>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="grid gap-4">
            <Field>
              <FieldLabel htmlFor="current_password">Current Password</FieldLabel>
              <Input
                id="current_password"
                type="password"
                value={passwordForm.current}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, current: e.target.value }))
                }
                placeholder="Enter current password"
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="new_password">New Password</FieldLabel>
                <Input
                  id="new_password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                  }
                  placeholder="Enter new password"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm_password">Confirm New Password</FieldLabel>
                <Input
                  id="confirm_password"
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) =>
                    setPasswordForm((p) => ({ ...p, confirm: e.target.value }))
                  }
                  placeholder="Repeat new password"
                />
              </Field>
            </div>
            <div className="mt-2 flex justify-end">
              <Button type="submit" disabled={changingPassword}>
                {changingPassword ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
