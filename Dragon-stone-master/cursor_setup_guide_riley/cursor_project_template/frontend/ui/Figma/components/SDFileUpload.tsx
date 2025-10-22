import { useState, useRef } from "react";
import { cn } from "./ui/utils";
import { Upload, Camera, X, FileText, Image as ImageIcon } from "lucide-react";
import { SDButton } from "./SDButton";

interface SDFileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  preview?: string;
  error?: string;
  loading?: boolean;
  className?: string;
  label?: string;
  description?: string;
}

export function SDFileUpload({
  onFileSelect,
  onFileRemove,
  acceptedTypes = ['image/*', '.pdf'],
  maxSizeMB = 10,
  preview,
  error,
  loading = false,
  className,
  label = "Upload File",
  description = "Drag and drop or click to select"
}: SDFileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return; // Handle error in parent component
    }

    onFileSelect(file);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const openCameraDialog = () => {
    cameraInputRef.current?.click();
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return ImageIcon;
    }
    return FileText;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {!preview ? (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            error && "border-destructive",
            loading && "opacity-50 pointer-events-none"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload className={cn(
                "h-12 w-12",
                dragOver ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            
            <div>
              <h3 className="font-medium text-foreground">{label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Accepted: {acceptedTypes.join(', ')} • Max size: {maxSizeMB}MB
              </p>
            </div>

            <div className="flex gap-2 justify-center">
              <SDButton
                type="button"
                variant="tertiary"
                size="sm"
                onClick={openFileDialog}
                disabled={loading}
              >
                Choose File
              </SDButton>
              
              <SDButton
                type="button"
                variant="tertiary"
                size="sm"
                onClick={openCameraDialog}
                disabled={loading}
              >
                <Camera className="h-4 w-4 mr-1" />
                Camera
              </SDButton>
            </div>
          </div>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="border rounded-lg p-4 bg-muted/20">
            <div className="flex items-start gap-3">
              {preview.startsWith('data:image') ? (
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="h-16 w-16 object-cover rounded border"
                />
              ) : (
                <div className="h-16 w-16 bg-muted rounded border flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">
                  File uploaded successfully
                </p>
                <p className="text-xs text-muted-foreground">
                  Ready to submit
                </p>
              </div>

              {onFileRemove && (
                <button
                  type="button"
                  onClick={onFileRemove}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelection(file);
        }}
        className="hidden"
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelection(file);
        }}
        className="hidden"
      />
    </div>
  );
}