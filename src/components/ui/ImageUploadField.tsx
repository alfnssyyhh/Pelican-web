"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, Image as ImageIcon, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";

export interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  category?: string;
  className?: string;
}

export function ImageUploadField({
  value,
  onChange,
  label = "Cover Image / Photo",
  category = "Upload",
  className,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [confirmAction, setConfirmAction] = useState<"replace" | "remove" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name);
      formData.append("category", category);

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to upload image.");
      }

      const result = await res.json();
      if (result.media && result.media.url) {
        onChange(result.media.url);
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground">{label}</label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={cn(
              "px-2 py-0.5 text-[11px] font-medium rounded transition-colors",
              mode === "upload"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={cn(
              "px-2 py-0.5 text-[11px] font-medium rounded transition-colors",
              mode === "url"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Direct URL
          </button>
        </div>
      </div>

      {mode === "url" ? (
        <div className="flex gap-2">
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... or /uploads/..."
            className="h-8 text-xs bg-card"
          />
          {value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange("")}
              className="h-8 px-2 text-xs"
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>
      ) : (
        <div>
          {value ? (
            <div className="relative group w-full max-w-full overflow-hidden rounded-xl border border-border bg-muted/30 p-2.5">
              <div className="flex items-center gap-3 w-full min-w-0">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-background">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={value}
                    alt="Preview"
                    className="size-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="truncate text-xs font-medium text-foreground" title={value}>
                    {value.split("/").pop() || value}
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5 font-medium truncate">
                    <Check className="size-3 shrink-0" /> Image uploaded & linked
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => setConfirmAction("replace")}
                    disabled={uploading}
                  >
                    Replace
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="xs"
                    onClick={() => setConfirmAction("remove")}
                    disabled={uploading}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 text-center cursor-pointer transition-colors",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:bg-muted/40",
                uploading && "pointer-events-none opacity-60"
              )}
            >
              {uploading ? (
                <>
                  <Loader2 className="size-6 animate-spin text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">Uploading image to server...</span>
                </>
              ) : (
                <>
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <UploadCloud className="size-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-foreground">Click to upload</span>{" "}
                    <span className="text-xs text-muted-foreground">or drag and drop photo</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    PNG, JPG, WebP or SVG up to 5 MB
                  </span>
                </>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
        </div>
      )}

      {error && <p className="text-[11px] font-medium text-red-600">{error}</p>}

      {/* Confirmation for Replace */}
      <ConfirmDialog
        open={confirmAction === "replace"}
        title="Replace Attached Image"
        message="Are you sure you want to replace this image? Selecting a new image file will overwrite the existing image attachment."
        confirmLabel="Choose New File"
        variant="default"
        onConfirm={() => {
          setConfirmAction(null);
          fileInputRef.current?.click();
        }}
        onCancel={() => setConfirmAction(null)}
      />

      {/* Confirmation for Remove */}
      <ConfirmDialog
        open={confirmAction === "remove"}
        title="Remove Attached Image"
        message="Are you sure you want to remove this attached image? The file reference will be unlinked from this record."
        confirmLabel="Remove Image"
        variant="destructive"
        onConfirm={() => {
          setConfirmAction(null);
          onChange("");
        }}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
