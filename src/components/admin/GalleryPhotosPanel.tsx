"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Loader2, Trash2 } from "lucide-react";
import { AdminImagePickButton } from "@/components/admin/AdminImagePickButton";
import { GALLERY_ARCHIVE_PAGE_SIZE, GALLERY_CURATED_COUNT } from "@/data/gallery-page";
import {
  deleteGalleryPhoto,
  fetchGalleryPhotosForAdmin,
  insertGalleryPhoto,
  reorderGalleryPhotos,
  type GalleryPhoto,
  updateGalleryPhoto,
} from "@/lib/gallery/supabase-gallery-photos";
import { uploadHomepageImage } from "@/lib/homepage/homepage-image-storage";

function roleLabel(index: number): string {
  if (index === 0) return "Hero";
  if (index >= 1 && index <= 2) return "Side strip";
  if (index >= 3 && index <= 8) return "Event tile";
  if (index < GALLERY_CURATED_COUNT) return "Lab bento";
  return "Archive grid";
}

export default function GalleryPhotosPanel() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [addingUrl, setAddingUrl] = useState(false);

  const refresh = useCallback(async () => {
    const list = await fetchGalleryPhotosForAdmin();
    setPhotos(list);
  }, []);

  useEffect(() => {
    let alive = true;
    void (async () => {
      setLoading(true);
      setErr(null);
      try {
        await refresh();
      } catch (e) {
        if (alive) {
          setErr(e instanceof Error ? e.message : "Could not load photos");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [refresh]);

  async function move(from: number, to: number) {
    if (to < 0 || to >= photos.length || from === to) return;
    setErr(null);
    const ids = photos.map((p) => p.id);
    const [id] = ids.splice(from, 1);
    ids.splice(to, 0, id!);
    try {
      await reorderGalleryPhotos(ids);
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Reorder failed");
    }
  }

  async function onBulkUpload(files: FileList | null) {
    if (!files?.length) return;
    setBulkBusy(true);
    setErr(null);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadHomepageImage(file, "gallery");
        const base = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
        await insertGalleryPhoto({
          src: url,
          alt: base || "Gallery photo",
          title: "",
        });
      }
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBulkBusy(false);
    }
  }

  async function addFromUrl() {
    const src = newUrl.trim();
    if (!src) return;
    setAddingUrl(true);
    setErr(null);
    try {
      await insertGalleryPhoto({
        src,
        alt: newAlt.trim() || "Gallery photo",
        title: newTitle.trim(),
      });
      setNewUrl("");
      setNewAlt("");
      setNewTitle("");
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Add failed");
    } finally {
      setAddingUrl(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[20vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
        <span className="text-sm">Loading photos…</span>
      </div>
    );
  }

  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Photos</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Order matters: positions 1–{GALLERY_CURATED_COUNT} fill the curated layout (hero, side
          strips, six event tiles, then lab bento). Everything after that appears in the paginated
          archive ({GALLERY_ARCHIVE_PAGE_SIZE} per page on the public site). Run{" "}
          <code className="rounded bg-muted px-1">supabase/gallery_photos.sql</code> in Supabase if
          this list is empty or saves fail.
        </p>
        <p className="mt-2 text-xs font-medium text-foreground">
          {photos.length} photo{photos.length === 1 ? "" : "s"}
        </p>
      </div>

      {err && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {err}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <AdminImagePickButton
          busy={bulkBusy}
          multiple
          variant="muted"
          onPick={(fl) => void onBulkUpload(fl)}
        >
          Upload images (multi-select)
        </AdminImagePickButton>
      </div>

      <div className="space-y-3 rounded-xl border border-border/70 bg-muted/10 p-4">
        <p className="text-xs font-semibold text-muted-foreground">Add by URL</p>
        <div className="grid gap-2 md:grid-cols-3">
          <label className="block text-xs font-medium text-muted-foreground md:col-span-3">
            Image URL
            <input
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://…"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Alt text
            <input
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={newAlt}
              onChange={(e) => setNewAlt(e.target.value)}
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Title (event cards / lightbox)
            <input
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </label>
        </div>
        <button
          type="button"
          disabled={addingUrl || !newUrl.trim()}
          onClick={() => void addFromUrl()}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted/60 disabled:opacity-50"
        >
          {addingUrl ? "Adding…" : "Add photo"}
        </button>
      </div>

      <ul className="max-h-[min(70vh,1200px)] space-y-3 overflow-y-auto pr-1">
        {photos.map((photo, index) => (
          <PhotoRow
            key={photo.id}
            photo={photo}
            index={index}
            total={photos.length}
            role={roleLabel(index)}
            onRefresh={refresh}
            onMoveUp={() => void move(index, index - 1)}
            onMoveDown={() => void move(index, index + 1)}
          />
        ))}
      </ul>

      {photos.length === 0 && (
        <p className="text-sm text-muted-foreground">No photos yet. Upload or paste a URL above.</p>
      )}
    </section>
  );
}

function PhotoRow({
  photo,
  index,
  total,
  role,
  onRefresh,
  onMoveUp,
  onMoveDown,
}: {
  photo: GalleryPhoto;
  index: number;
  total: number;
  role: string;
  onRefresh: () => Promise<void>;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [src, setSrc] = useState(photo.src);
  const [alt, setAlt] = useState(photo.alt);
  const [title, setTitle] = useState(photo.title);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadRow, setUploadRow] = useState(false);
  const [rowErr, setRowErr] = useState<string | null>(null);

  useEffect(() => {
    setSrc(photo.src);
    setAlt(photo.alt);
    setTitle(photo.title);
  }, [photo.id, photo.src, photo.alt, photo.title]);

  const dirty =
    src.trim() !== photo.src ||
    alt.trim() !== photo.alt ||
    title.trim() !== photo.title;

  async function saveRow() {
    setSaving(true);
    setRowErr(null);
    try {
      await updateGalleryPhoto(photo.id, {
        src: src.trim(),
        alt: alt.trim(),
        title: title.trim(),
      });
      await onRefresh();
    } catch (e) {
      setRowErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("Remove this photo from the gallery?")) return;
    setDeleting(true);
    setRowErr(null);
    try {
      await deleteGalleryPhoto(photo.id);
      await onRefresh();
    } catch (e) {
      setRowErr(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  async function replaceFromFile(files: FileList | null) {
    const f = files?.[0];
    if (!f) return;
    setUploadRow(true);
    setRowErr(null);
    try {
      const url = await uploadHomepageImage(f, "gallery");
      setSrc(url);
      await updateGalleryPhoto(photo.id, { src: url });
      await onRefresh();
    } catch (e) {
      setRowErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploadRow(false);
    }
  }

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border/70 bg-background p-3 sm:flex-row sm:items-start">
      <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:h-24 sm:w-28">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src || photo.src}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            #{index + 1} · {role}
          </span>
          <span className="text-border">·</span>
          <span className="truncate font-mono text-[10px] opacity-80">{photo.id.slice(0, 8)}…</span>
        </div>
        <label className="block text-xs font-medium text-muted-foreground">
          Image URL
          <input
            className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
            value={src}
            onChange={(e) => setSrc(e.target.value)}
          />
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="block text-xs font-medium text-muted-foreground">
            Alt
            <input
              className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Title
            <input
              className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
        </div>
        {rowErr && (
          <p className="text-xs text-destructive" role="alert">
            {rowErr}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!dirty || saving}
            onClick={() => void saveRow()}
            className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save row"}
          </button>
          <AdminImagePickButton
            busy={uploadRow}
            variant="muted"
            onPick={(fl) => void replaceFromFile(fl)}
          >
            Replace file
          </AdminImagePickButton>
          <button
            type="button"
            disabled={index <= 0}
            onClick={onMoveUp}
            className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-40"
            aria-label="Move up"
          >
            <ChevronUp className="h-3.5 w-3.5" />
            Up
          </button>
          <button
            type="button"
            disabled={index >= total - 1}
            onClick={onMoveDown}
            className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-40"
            aria-label="Move down"
          >
            <ChevronDown className="h-3.5 w-3.5" />
            Down
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={() => void remove()}
            className="inline-flex items-center gap-1 rounded-lg border border-destructive/40 px-2 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
