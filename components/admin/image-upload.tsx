'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Loader2, X, Upload } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
}

export function ImageUpload({ value, onChange, bucket = 'projects' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const sb = createClient();

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

      const { error: uploadError } = await sb.storage
        .from(bucket)
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = sb.storage
        .from(bucket)
        .getPublicUrl(path);

      onChange(publicUrl);
      toast.success('Image uploaded');
    } catch (error: any) {
      toast.error(error.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mt-1.5 space-y-4">
      {value ? (
        <div className="relative aspect-video w-full max-w-sm rounded-lg border border-border overflow-hidden bg-muted group">
          <Image src={value} alt="Preview" fill className="object-cover" />
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1 bg-background/80 hover:bg-background rounded-full border border-border opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center aspect-video w-full max-w-sm rounded-lg border border-dashed border-border bg-muted/30 text-muted-foreground">
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <>
              <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-xs">No image uploaded</p>
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="relative"
          disabled={uploading}
        >
          {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          {value ? 'Change Image' : 'Upload Image'}
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="image/*"
            onChange={onUpload}
            disabled={uploading}
          />
        </Button>
        {value && (
          <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">
            {value}
          </span>
        )}
      </div>
    </div>
  );
}
