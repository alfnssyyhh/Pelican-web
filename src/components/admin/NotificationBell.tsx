"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  ChevronRight,
  Inbox,
  Loader2,
  MailCheck,
  Truck,
  Edit3,
  Package,
  Wrench,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { NotificationItem } from "@/lib/admin-store";

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

function getNotifIcon(type: string) {
  switch (type) {
    case "rfq":
      return <MailCheck className="size-4 text-emerald-600 dark:text-emerald-400" />;
    case "rental":
      return <Truck className="size-4 text-blue-600 dark:text-blue-400" />;
    case "post":
      return <Edit3 className="size-4 text-amber-600 dark:text-amber-400" />;
    case "product":
      return <Package className="size-4 text-purple-600 dark:text-purple-400" />;
    case "work":
    default:
      return <Wrench className="size-4 text-red-600 dark:text-red-400" />;
  }
}

export function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifs = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      }
    } catch {
      // Ignore background errors
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  // Dropdown only shows unread notifications
  const unreadNotifications = notifications.filter((n) => !n.is_read);

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.is_read) {
      try {
        await fetch("/api/admin/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: notif.id }),
        });
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
        );
      } catch {
        // ignore
      }
    }
    setIsOpen(false);
    setIsModalOpen(false);
    if (notif.link) {
      router.push(notif.link);
    }
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mark_all_read: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div ref={dropdownRef} className="relative inline-block">
        {/* Bell Button with Conditional Red Dot */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Notification Inbox"
          aria-expanded={isOpen}
          className="relative flex size-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card dark:bg-red-950/25 dark:border-red-900/40 text-muted-foreground dark:text-white transition-colors hover:border-slate-300 dark:hover:border-red-800/60 hover:bg-muted dark:hover:bg-red-900/35 hover:text-foreground dark:hover:text-white shadow-xs outline-none"
        >
          <Bell className="size-4 text-muted-foreground dark:text-white transition-colors" />

          {/* Red indicator dot: only appears when there are unread notifications */}
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[#dc2626] ring-2 ring-card dark:ring-red-950" />
            </span>
          )}
        </button>

        {/* Dropdown Card Popover */}
        {isOpen && (
          <Card className="absolute right-0 z-50 mt-2 w-[min(340px,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between border-b border-border px-3.5 py-2.5 space-y-0">
              <CardTitle className="text-xs font-semibold text-foreground">
                Notifications
              </CardTitle>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={loading}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <CheckCheck className="size-3" />
                  )}
                  Mark all as read
                </button>
              )}
            </CardHeader>

            {/* Content List: Only shows unread notifications */}
            <CardContent className="p-0">
              {unreadNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
                  <Inbox className="size-8 text-muted-foreground/60" strokeWidth={1.5} />
                  <span className="text-xs font-normal text-muted-foreground">
                    No notifications yet
                  </span>
                </div>
              ) : (
                <div className="max-h-[340px] divide-y divide-border overflow-y-auto">
                  {unreadNotifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className="group flex cursor-pointer items-start gap-2.5 p-3 text-xs transition-colors hover:bg-muted/50 bg-red-50/50 dark:bg-red-950/20"
                    >
                      {/* Icon */}
                      <div className="relative mt-0.5 shrink-0">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-muted border border-border">
                          {getNotifIcon(item.type)}
                        </div>
                        <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary ring-2 ring-card" />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-1.5">
                          <span className="text-xs truncate text-foreground font-semibold">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {formatTimeAgo(item.created_at)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground line-clamp-2">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>

            {/* Footer: View All Button to open history */}
            <CardFooter className="border-t border-border p-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full h-7 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10"
              >
                View all notifications ({notifications.length})
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Modal Dialog: All Notifications History */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-5 pb-3 border-b border-border shrink-0">
            <div className="flex items-center justify-between pr-6">
              <DialogTitle className="text-base font-semibold">
                Notifications Center
              </DialogTitle>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={loading}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline cursor-pointer"
                >
                  <CheckCheck className="size-3.5" />
                  Mark all as read
                </button>
              )}
            </div>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Review all recent alerts, inquiries, system logs, and status notifications.
            </DialogDescription>
          </DialogHeader>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto divide-y divide-border p-2">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <Inbox className="size-10 text-muted-foreground/60" strokeWidth={1.5} />
                <span className="text-sm font-medium text-muted-foreground">
                  No notifications recorded yet
                </span>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={cn(
                    "flex cursor-pointer items-start gap-3.5 rounded-lg p-3 text-xs transition-colors hover:bg-muted/60",
                    !item.is_read && "bg-red-50/50 dark:bg-red-950/20"
                  )}
                >
                  <div className="relative mt-0.5 shrink-0">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-muted border border-border">
                      {getNotifIcon(item.type)}
                    </div>
                    {!item.is_read && (
                      <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary ring-2 ring-card" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={cn(
                          "text-sm text-foreground",
                          item.is_read ? "font-normal" : "font-semibold"
                        )}
                      >
                        {item.title}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimeAgo(item.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-end border-t border-border bg-card px-4 py-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="h-8 px-4 text-xs font-medium cursor-pointer border border-border bg-background hover:bg-muted text-foreground transition-colors shadow-xs"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
