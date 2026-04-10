"use client";

import { useEffect, useMemo } from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import { AdminImagePickButton } from "@/components/admin/AdminImagePickButton";
import { resolveTeamMemberPhotoUrl } from "@/lib/team/photo-url";

type TeamPhotoFieldProps = {
  storedRaw: string;
  onStoredRawChange: (v: string) => void;
  pendingFile: File | null;
  onPendingFileChange: (f: File | null) => void;
  disabled?: boolean;
};

/** Preview + file picker; stores Supabase public URL or legacy filename in `storedRaw` on save. */
export default function TeamPhotoField({
  storedRaw,
  onStoredRawChange,
  pendingFile,
  onPendingFileChange,
  disabled,
}: TeamPhotoFieldProps) {
  const previewBlobUrl = useMemo(
    () => (pendingFile ? URL.createObjectURL(pendingFile) : null),
    [pendingFile]
  );

  useEffect(() => {
    return () => {
      if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
    };
  }, [previewBlobUrl]);

  const previewSrc = previewBlobUrl || resolveTeamMemberPhotoUrl(storedRaw);
  const showPreview = !!previewSrc;

  return (
      <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-muted/20 p-3 sm:flex-row sm:items-start">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/50">
          {showPreview ? (
            // eslint-disable-next-line @next/next/no-img-element -- blob + arbitrary Supabase URLs
            <img
              src={previewSrc}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlus className="h-8 w-8 text-muted-foreground/60" aria-hidden />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Photo</p>
          <div className="flex flex-wrap items-center gap-2">
            <AdminImagePickButton
              variant="muted"
              icon={Upload}
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={disabled}
              className="!py-1.5 !text-xs"
              onPick={(files) => {
                onPendingFileChange(files?.[0] ?? null);
              }}
            >
              {pendingFile ? "Replace image…" : "Upload image…"}
            </AdminImagePickButton>
            {(pendingFile || storedRaw.trim()) && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  onPendingFileChange(null);
                  onStoredRawChange("");
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                Remove
              </button>
            )}
          </div>
          <p className="text-[11px] leading-snug text-muted-foreground">
            JPEG, PNG, WebP, or GIF · max 5MB. Saved to Supabase Storage on{" "}
            <strong className="text-foreground/80">Save</strong>. You can also
            type a legacy file name (e.g.{" "}
            <code className="rounded bg-muted px-1">team-2.jpg</code>) or a full
            image URL below.
          </p>
        </div>
      </div>
  );
}
