"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";

type ExistingImage = { id: string; type: "existing"; url: string; position: number };
type NewImage = { id: string; type: "new"; file: File; position: number };
type ImageItem = ExistingImage | NewImage;

export default function EditPropertyDialog({
  record,
  onRecordUpdated,
}: {
  record: any;
  onRecordUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(record);
  const [draftImages, setDraftImages] = useState<ImageItem[]>(
    (record.images || []).map((url: string, i: number) => ({
      id: crypto.randomUUID(),
      type: "existing" as const,
      url,
      position: i + 1,
    }))
  );
  const [isUploading, setIsUploading] = useState(false);
  const [newFiles, setNewFiles] = useState<FileList | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const normalize = (items: ImageItem[]) =>
    [...items].sort((a, b) => a.position - b.position).map((img, i) => ({ ...img, position: i + 1 }));

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: form.description,
    immediatelyRender: true,
    onUpdate: ({ editor }) => setForm((p: any) => ({ ...p, description: editor.getHTML() })),
  });

  // ---------------- File handling ----------------
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setNewFiles(files);
    setDraftImages(prev =>
      normalize([
        ...prev,
        ...Array.from(files).map((file, i) => ({
          id: crypto.randomUUID(),
          type: "new" as const,
          file,
          position: prev.length + i + 1,
        })),
      ])
    );
    e.target.value = "";
  };

  const removeImage = (id: string) => {
    if (!confirm("Remove this image?")) return;
    setDraftImages(prev => normalize(prev.filter(img => img.id !== id)));
  };

  const setAsCover = (id: string) => {
    setDraftImages(prev =>
      normalize(
        prev.map(img =>
          img.id === id
            ? { ...img, position: 1 }
            : { ...img, position: img.position + 1 }
        )
      )
    );
  };

  const updatePosition = (id: string, newPos: number) => {
    setDraftImages(prev =>
      normalize(prev.map(img => (img.id === id ? { ...img, position: newPos } : img)))
    );
  };

  // ---------------- Drag & Drop ----------------
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => setDraggingIndex(index);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;
    const temp = [...draftImages];
    const [moved] = temp.splice(draggingIndex, 1);
    temp.splice(index, 0, moved);
    setDraftImages(normalize(temp));
    setDraggingIndex(index);
  };

  const handleDragEnd = () => setDraggingIndex(null);

  // ---------------- Input change ----------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------- Submit ----------------
  const handleSubmit = async () => {
    setIsUploading(true);
    try {
      const imageUrls: string[] = [];

      for (const img of draftImages) {
        if (img.type === "existing") imageUrls.push(img.url);
        else if (img.type === "new" && newFiles) {
          const file = img.file;
          const path = `properties/${Date.now()}-${file.name}`;
          await supabase.storage.from("properties").upload(path, file);
          const { data } = supabase.storage.from("properties").getPublicUrl(path);
          imageUrls.push(data.publicUrl);
        }
      }

      await supabase
        .from("properties")
        .update({ ...form, images: imageUrls })
        .eq("id", form.id);

      onRecordUpdated();
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update property");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent className="fixed inset-0 h-full w-full overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>

        <form className="space-y-4 flex flex-col mt-4">
          {["title", "price", "location_city", "location_address", "property_type", "rooms", "ground_area", "house_area"].map((field) => (
            <input
              key={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={field.replace("_", " ")}
              type={["price", "rooms", "ground_area", "house_area"].includes(field) ? "number" : "text"}
              className="w-full border p-2 rounded"
            />
          ))}

          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-1">Description</label>
            <div className="border rounded p-2 min-h-[20vh] max-h-[30vh] overflow-y-auto">
              <EditorContent editor={editor} />
            </div>
          </div>

          <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileSelect} />
          <Button type="button" onClick={() => fileInputRef.current?.click()} variant="outline">
            Browse Images
          </Button>

          <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto mt-2 p-1">
            {draftImages.map((img, index) => {
              const src = img.type === "existing" ? img.url : URL.createObjectURL(img.file);
              return (
                <div
                  key={img.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className="border rounded-lg p-3 bg-gray-50 flex flex-col gap-2 cursor-move"
                >
                  <img src={src} className="w-full h-48 object-cover rounded" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">{img.position === 1 ? "Cover" : "Position"}</span>
                    <input
                      type="number"
                      min={1}
                      value={img.position}
                      onChange={(e) => updatePosition(img.id, Number(e.target.value))}
                      className="border rounded px-2 py-1 w-20"
                    />
                    {img.position !== 1 && (
                      <button type="button" onClick={() => setAsCover(img.id)} className="text-xs text-blue-600">
                        Set as cover
                      </button>
                    )}
                    <button type="button" onClick={() => removeImage(img.id)} className="ml-auto text-red-500 text-sm">
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <Button type="button" onClick={handleSubmit} disabled={isUploading} className="w-full mt-6 py-3 text-lg">
            {isUploading ? "Updating..." : "Update Property"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}