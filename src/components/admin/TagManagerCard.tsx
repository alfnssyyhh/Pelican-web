"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Tags, Pencil, Trash2, Loader2, Check, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAdminToast } from "@/components/admin/ui/toast-provider";

interface TagManagerCardProps {
  initialTags: [string, number][];
}

export function TagManagerCard({ initialTags }: TagManagerCardProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [tags, setTags] = useState<[string, number][]>(initialTags);

  // Edit tag dialog state
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Delete tag dialog state
  const [deletingTag, setDeletingTag] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStartEdit = (tag: string) => {
    setEditingTag(tag);
    setNewTagName(tag);
  };

  const handleSaveRename = async () => {
    if (!editingTag || !newTagName.trim()) return;
    if (editingTag === newTagName.trim()) {
      setEditingTag(null);
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/taxonomy/tags", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldTag: editingTag, newTag: newTagName.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to update tag.", "error");
        return;
      }

      showToast(data.message || "Tag successfully updated.", "success");
      setTags((prev) =>
        prev.map(([t, count]) => (t === editingTag ? [newTagName.trim(), count] : [t, count]))
      );
      setEditingTag(null);
      router.refresh();
    } catch {
      showToast("Failed to connect to server. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTag = async () => {
    if (!deletingTag) return;
    setIsDeleting(true);

    try {
      const res = await fetch(
        `/api/admin/taxonomy/tags?tag=${encodeURIComponent(deletingTag)}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to delete tag.", "error");
        return;
      }

      showToast(data.message || "Tag successfully deleted.", "success");
      setTags((prev) => prev.filter(([t]) => t !== deletingTag));
      setDeletingTag(null);
      router.refresh();
    } catch {
      showToast("Failed to connect to server. Please try again.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="mt-6 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Tags className="size-4 text-primary" />
                <span>Popular Technical Keyword Tags</span>
              </CardTitle>
              <CardDescription className="mt-1">
                Content tags linked to engineering articles to optimize topical search indexing
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tags.length === 0 ? (
            <p className="text-sm text-muted-foreground">No keyword tags registered yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map(([tag, count]) => (
                <div
                  key={tag}
                  className="group relative inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground transition-colors hover:border-primary/40 hover:bg-muted/30"
                >
                  <span className="font-medium">{tag}</span>
                  <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] font-semibold text-muted-foreground">
                    {count}
                  </span>

                  {/* Actions on hover/focus */}
                  <div className="ml-1 flex items-center gap-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(tag)}
                      aria-label={`Edit tag ${tag}`}
                      title={`Edit tag "${tag}" across all articles`}
                      className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <Pencil className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingTag(tag)}
                      aria-label={`Delete tag ${tag}`}
                      title={`Delete tag "${tag}" from all articles`}
                      className="rounded p-0.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit / Rename Tag Modal */}
      {editingTag && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in-50"
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <h3 className="text-base font-semibold text-foreground">
              Edit Technical Keyword Tag
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Renaming this tag will automatically update all linked engineering articles and public SEO metadata.
            </p>

            <div className="mt-4 space-y-1.5">
              <label htmlFor="rename_tag_input" className="text-xs font-medium text-foreground">
                New Tag Name
              </label>
              <Input
                id="rename_tag_input"
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter new tag name..."
                autoFocus
                className="h-9 text-xs"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingTag(null)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSaveRename}
                disabled={isSaving || !newTagName.trim()}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="mr-1.5 size-3.5" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Tag Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deletingTag)}
        title="Delete Technical Keyword Tag"
        message={`Are you sure you want to permanently remove tag "${deletingTag}" from all linked engineering articles? This action cannot be undone.`}
        confirmLabel="Delete permanently"
        variant="destructive"
        loading={isDeleting}
        onConfirm={handleDeleteTag}
        onCancel={() => setDeletingTag(null)}
      />
    </>
  );
}
