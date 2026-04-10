"use client";

import { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { ImageUp, Loader2 } from "lucide-react";

type AdminImagePickButtonProps = {
  /** Called with selected files; reset your own busy state after async work. */
  onPick: (files: FileList | null) => void;
  children: React.ReactNode;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  busy?: boolean;
  /** Default `ImageUp`. */
  icon?: LucideIcon;
  variant?: "brand" | "muted";
  className?: string;
};

const VARIANT =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50";

const BRAND =
  `${VARIANT} rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand/15`;

const MUTED =
  `${VARIANT} rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/60`;

/**
 * Hides the native file control and opens the picker from a real button (no “Choose file” text).
 */
export function AdminImagePickButton({
  onPick,
  children,
  accept = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml",
  multiple = false,
  disabled = false,
  busy = false,
  icon: Icon = ImageUp,
  variant = "brand",
  className = "",
}: AdminImagePickButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const off = disabled || busy;

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        tabIndex={-1}
        disabled={off}
        onChange={(e) => {
          onPick(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        disabled={off}
        onClick={() => inputRef.current?.click()}
        className={`${variant === "muted" ? MUTED : BRAND} ${className}`.trim()}
      >
        {busy ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
        ) : (
          <Icon className="h-4 w-4 shrink-0" aria-hidden />
        )}
        {children}
      </button>
    </>
  );
}
