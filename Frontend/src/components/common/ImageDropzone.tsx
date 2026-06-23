import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  onFile: (file: File | null) => void;
  aspect?: "square" | "cover";
  initialUrl?: string;
  required?: boolean;
}

export function ImageDropzone({ label, onFile, aspect = "square", initialUrl, required }: Props) {
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setPreview(url);
      onFile(file);
    },
    [onFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onFile(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground/90">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div
        {...getRootProps()}
        className={cn(
          "relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all hover:scale-[1.005]",
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          aspect === "square" ? "aspect-square" : "aspect-[4/1]",
        )}
      >
        <input {...getInputProps()} />
        {preview ? (
          <>
            <img src={preview} alt="preview" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={clear}
              className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/80 backdrop-blur hover:bg-background"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm font-medium">
              {isDragActive ? "Drop it here" : "Drag & drop or click"}
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
