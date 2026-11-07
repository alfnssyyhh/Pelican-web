"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  User,
  Settings2,
  LogOut,
  Palette,
  Sun,
  Moon,
  Monitor,
  Bell,
  Package2,
  FileText,
  Briefcase,
  Layers,
  Image as ImageIcon,
  Truck,
  MailCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotificationBell } from "@/components/admin/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useTheme, type Theme } from "@/components/admin/theme-provider";

interface DropdownItem {
  label: string;
  path: string;
  icon?: LucideIcon;
  variant?: "default" | "destructive";
}

type MenuKey = "content" | "catalog" | "account";

interface NavEntryLink {
  type: "link";
  label: string;
  path: string;
}

interface NavEntryDropdown {
  type: "dropdown";
  key: MenuKey;
  label: string;
  items: DropdownItem[];
}

type NavEntry = NavEntryLink | NavEntryDropdown;

export function AppNavbar() {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({
    content: false,
    catalog: false,
    account: false,
  });

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const wrapRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const openedByHoverRef = useRef(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [currentUser, setCurrentUser] = useState<{
    displayName: string;
    roleLabel: string;
    initials: string;
  }>({
    displayName: "PelicanAdmin88",
    roleLabel: "Administrator",
    initials: "PA",
  });

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.displayName) {
          setCurrentUser({
            displayName: data.displayName,
            roleLabel: data.roleLabel || (data.role === "admin" ? "Administrator" : "Staff Member"),
            initials: data.initials || "PA",
          });
        }
      })
      .catch(() => {});
  }, []);

  const openMenuKey = useCallback((key: MenuKey) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenMenu(key);
  }, []);

  const closeHoverMenu = useCallback((key: MenuKey) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      if (!openedByHoverRef.current) return;
      openedByHoverRef.current = false;
      setOpenMenu((current) => (current === key ? null : current));
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  // Close notifications on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notificationsOpen]);

  const contentItems: DropdownItem[] = [
    { label: "Technical Articles", path: "/admin/posts", icon: FileText },
    { label: "Project Portfolio", path: "/admin/works", icon: Briefcase },
    { label: "Media Library", path: "/admin/media", icon: ImageIcon },
  ];

  const catalogItems: DropdownItem[] = [
    { label: "Spare Parts & Products", path: "/admin/products", icon: Package2 },
    { label: "Rental Fleet (Gensets)", path: "/admin/rentals", icon: Truck },
    { label: "Categories & Taxonomy", path: "/admin/taxonomy", icon: Layers },
  ];

  const navEntries: NavEntry[] = [
    { type: "link", label: "Overview", path: "/admin/overview" },
    { type: "dropdown", key: "content", label: "Content", items: contentItems },
    { type: "dropdown", key: "catalog", label: "Catalog", items: catalogItems },
    { type: "link", label: "Inquiries (RFQ)", path: "/admin/rfq" },
  ];

  const isActive = (path: string) => {
    if (path === "/admin/overview") return pathname === "/admin/overview";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const isDropdownActive = (items: DropdownItem[]) =>
    items.some((item) => isActive(item.path));

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {}
    router.push("/admin/login");
    router.refresh();
  };

  const caretClass = (key: MenuKey) =>
    cn(
      "size-3.5 transition-transform duration-150",
      openMenu === key ? "rotate-180 text-primary" : "text-muted-foreground"
    );

  const themeOptions: { value: Theme; label: string; icon: LucideIcon }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <header className="sticky top-0 z-40 flex flex-col border-b border-border bg-card/75 dark:bg-card/50 backdrop-blur-xl px-6 py-2.5 transition-colors">
      <div className="flex w-full items-center justify-between gap-4">
        {/* Brand: Logo linking to /admin/dashboard */}
        <Link
          href="/admin/dashboard"
          className="inline-flex min-w-0 items-center gap-2.5 no-underline transition-opacity hover:opacity-90"
        >
          {/* Light Mode Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Pelican-Mitra-Sejati-logo-HD-transparent.png"
            alt="PT Pelican Mitra Sejati"
            className="block dark:hidden h-9 sm:h-10 w-auto max-w-[240px] sm:max-w-[270px] object-contain"
          />
          {/* Dark Mode Logo: Keeps red 'PELICAN' & emblem, changes 'MITRA SEJATI' to white */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Pelican-Mitra-Sejati-logo-HD-white-text.png"
            alt="PT Pelican Mitra Sejati"
            className="hidden dark:block h-9 sm:h-10 w-auto max-w-[240px] sm:max-w-[270px] object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center justify-end gap-1 md:flex">
          {navEntries.map((entry) => {
            if (entry.type === "link") {
              const active = isActive(entry.path);
              return (
                <Link
                  key={entry.path}
                  href={entry.path}
                  className={cn(
                    "inline-flex h-9 items-center justify-center rounded-lg px-3.5 text-sm font-medium transition-colors no-underline",
                    "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    active && "font-semibold text-primary dark:text-red-400"
                  )}
                >
                  {entry.label}
                </Link>
              );
            }

            if (entry.type === "dropdown") {
              const anyActive = isDropdownActive(entry.items);
              return (
                <div
                  key={entry.key}
                  ref={(el) => {
                    wrapRefs.current[entry.key] = el;
                  }}
                  className="relative"
                  onMouseEnter={() => {
                    openedByHoverRef.current = true;
                    openMenuKey(entry.key);
                  }}
                  onMouseLeave={(e) => {
                    if (
                      e.relatedTarget instanceof Element &&
                      e.relatedTarget.closest('[data-slot="dropdown-menu-content"]')
                    ) {
                      return;
                    }
                    closeHoverMenu(entry.key);
                  }}
                >
                  <DropdownMenu
                    open={openMenu === entry.key}
                    onOpenChange={(open) => {
                      if (open) {
                        openedByHoverRef.current = false;
                        setOpenMenu(entry.key);
                      } else {
                        openedByHoverRef.current = false;
                        setOpenMenu(null);
                      }
                    }}
                  >
                    <DropdownMenuTrigger
                      render={
                        <button
                          type="button"
                          className={cn(
                            "inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-sm font-medium transition-colors cursor-pointer outline-none",
                            "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                            anyActive && "font-semibold text-primary dark:text-red-400"
                          )}
                        >
                          <span>{entry.label}</span>
                          <ChevronDown className={caretClass(entry.key)} />
                        </button>
                      }
                    />
                    <DropdownMenuContent
                      align="start"
                      sideOffset={0}
                      className="w-52 p-1.5"
                      onMouseEnter={() => {
                        if (closeTimeoutRef.current) {
                          clearTimeout(closeTimeoutRef.current);
                          closeTimeoutRef.current = null;
                        }
                        openedByHoverRef.current = true;
                      }}
                      onMouseLeave={(e) => {
                        if (
                          e.relatedTarget instanceof Element &&
                          (e.relatedTarget.closest('[data-slot="dropdown-menu-trigger"]') ||
                            wrapRefs.current[entry.key]?.contains(e.relatedTarget))
                        ) {
                          return;
                        }
                        closeHoverMenu(entry.key);
                      }}
                    >
                      {entry.items.map((item) => {
                        const active = isActive(item.path);
                        const Icon = item.icon;
                        return (
                          <DropdownMenuItem
                            key={item.path}
                            className={cn(
                              "cursor-pointer",
                              active && "bg-red-50 font-semibold text-primary dark:bg-red-950/40 dark:text-red-300"
                            )}
                            onClick={() => router.push(item.path)}
                          >
                            {Icon && <Icon className="size-4" />}
                            <span>{item.label}</span>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            }
            return null;
          })}

          {/* Notification Bell Component */}
          <div className="ml-2 mr-1">
            <NotificationBell />
          </div>

          {/* Account Pill Dropdown: Avatar + Name + Role + ChevronDown */}
          <DropdownMenu
            open={openMenu === "account"}
            onOpenChange={(open) => setOpenMenu(open ? "account" : null)}
          >
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="flex items-center gap-2.5 rounded-full border border-border bg-card dark:bg-red-950/25 dark:border-red-900/40 py-1 pr-3.5 pl-1 shadow-xs hover:border-slate-300 dark:hover:border-red-800/60 transition-colors cursor-pointer outline-none ml-1.5"
                >
                  <Avatar className="size-8 border-transparent shrink-0">
                    <AvatarFallback className="bg-[#dc2626] text-xs font-bold text-white dark:bg-[#dc2626] dark:text-white">
                      {currentUser.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex flex-col text-left leading-tight min-w-0 max-w-[130px]">
                    <span className="text-[0.82rem] font-bold text-foreground truncate" title={currentUser.displayName}>
                      {currentUser.displayName}
                    </span>
                    <span className="text-[0.68rem] font-medium text-muted-foreground truncate" title={currentUser.roleLabel}>
                      {currentUser.roleLabel}
                    </span>
                  </span>
                  <ChevronDown className={caretClass("account")} />
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-52 p-1.5">
              <DropdownMenuItem
                className={cn("cursor-pointer", isActive("/admin/profile") && "bg-red-50 font-semibold text-primary dark:bg-red-950/40 dark:text-red-300")}
                onClick={() => router.push("/admin/profile")}
              >
                <User className="size-4" />
                <span>Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className={cn("cursor-pointer", isActive("/admin/settings") && "bg-red-50 font-semibold text-primary dark:bg-red-950/40 dark:text-red-300")}
                onClick={() => router.push("/admin/settings")}
              >
                <Settings2 className="size-4" />
                <span>Settings</span>
              </DropdownMenuItem>

              {/* Theme Flyout Submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <Palette className="size-4" />
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(val: any) => setTheme(val as Theme)}
                  >
                    {themeOptions.map((opt) => (
                      <DropdownMenuRadioItem
                        key={opt.value}
                        value={opt.value}
                        className="cursor-pointer"
                        onClick={() => setTheme(opt.value)}
                      >
                        <opt.icon className="size-4" />
                        <span>{opt.label}</span>
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={() => {
                  setOpenMenu(null);
                  setIsLogoutModalOpen(true);
                }}
              >
                <LogOut className="size-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <NotificationBell />
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3 md:hidden">
          <Link
            href="/admin/overview"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors no-underline",
              isActive("/admin/overview")
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-foreground hover:bg-muted"
            )}
          >
            Overview
          </Link>

          <div>
            <button
              type="button"
              onClick={() =>
                setMobileExpanded((prev) => ({ ...prev, content: !prev.content }))
              }
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted cursor-pointer"
            >
              <span>Content</span>
              <ChevronDown
                className={cn("size-4 transition-transform", mobileExpanded.content && "rotate-180")}
              />
            </button>
            {mobileExpanded.content && (
              <div className="ml-3 mt-1 flex flex-col gap-1 border-l-2 border-border pl-2">
                {contentItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted no-underline"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() =>
                setMobileExpanded((prev) => ({ ...prev, catalog: !prev.catalog }))
              }
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted cursor-pointer"
            >
              <span>Catalog</span>
              <ChevronDown
                className={cn("size-4 transition-transform", mobileExpanded.catalog && "rotate-180")}
              />
            </button>
            {mobileExpanded.catalog && (
              <div className="ml-3 mt-1 flex flex-col gap-1 border-l-2 border-border pl-2">
                {catalogItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted no-underline"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/admin/rfq"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors no-underline",
              isActive("/admin/rfq")
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-foreground hover:bg-muted"
            )}
          >
            Inquiries (RFQ)
          </Link>

          <div className="my-2 border-t border-border pt-2">
            <Link
              href="/admin/profile"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted no-underline"
            >
              <User className="size-4 text-muted-foreground" />
              <span>Profile</span>
            </Link>
            <Link
              href="/admin/settings"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted no-underline"
            >
              <Settings2 className="size-4 text-muted-foreground" />
              <span>Settings</span>
            </Link>

            <div className="mt-2 flex items-center justify-between px-3 py-1.5">
              <span className="text-xs font-medium text-muted-foreground">Theme</span>
              <div className="flex gap-1">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTheme(opt.value)}
                    className={cn(
                      "flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium border cursor-pointer",
                      theme === opt.value
                        ? "border-primary bg-primary text-primary-foreground font-bold"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <opt.icon className="size-3" />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setIsLogoutModalOpen(true);
              }}
              className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer"
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        open={isLogoutModalOpen}
        title="Confirm Logout"
        message="Are you sure you want to sign out of the Pelican Admin session?"
        variant="destructive"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        loading={loggingOut}
        loadingLabel="Logging out..."
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </header>
  );
}
