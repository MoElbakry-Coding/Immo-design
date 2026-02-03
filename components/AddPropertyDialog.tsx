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

// ---------------- DnD-kit ----------------
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ---------------- Types ----------------
type FormFields = {
  title: string;
  description: string;
  price: string;
  location_city: string;
  location_address: string;
  property_type: string;
  rooms: string;
  ground_area: string;
  house_area: string;
  country: string;
};

type NewImage = { id: string; type: "new"; file: File; position: number };

// ---------------- Sortable Image ----------------
function SortableImage({
  img,
  children,
}: {
  img: NewImage;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: img.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border rounded-lg p-3 bg-gray-50 flex flex-col gap-2 cursor-grab active:cursor-grabbing"
    >
      {children}
    </div>
  );
}

// ---------------- Main Component ----------------
export default function AddPropertyDialog({ onRecordAdded }: { onRecordAdded: () => void }) {
  const [form, setForm] = useState<FormFields>({
    title: "",
    description: "",
    price: "",
    location_city: "",
    location_address: "",
    property_type: "",
    rooms: "",
    ground_area: "",
    house_area: "",
    country: "Austria",
  });

  const [draftImages, setDraftImages] = useState<NewImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // ---------------- TipTap Editor ----------------
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image,
    ],
    content: form.description,
    immediatelyRender: true,
    onUpdate: ({ editor }) => setForm(prev => ({ ...prev, description: editor.getHTML() })),
  });

  // ---------------- Helpers ----------------
  const normalize = (items: NewImage[]) =>
    [...items].map((img, i) => ({ ...img, position: i + 1 }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const key = e.target.name as keyof FormFields;
    setForm({ ...form, [key]: e.target.value });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setDraftImages(prev =>
      normalize([
        ...prev,
        ...Array.from(files).map((file, i) => ({
          id: crypto.randomUUID(),
          type: "new" as const, // ✅ Type-safe
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
      normalize(prev.map(img => (img.id === id ? { ...img, position: 1 } : img)))
    );
  };

  // ---------------- DnD Kit Setup ----------------
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setDraftImages(items => {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      return normalize(newItems);
    });
  };

  // ---------------- Submit ----------------
  const handleSubmit = async () => {
    if (draftImages.length === 0) return alert("Please add at least one image");
    setIsUploading(true);
    let uploaded = 0;
    const imagesToSave: { url: string; position: number }[] = [];

    try {
      for (const img of draftImages) {
        const file = img.file;
        const filePath = `properties/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage.from("properties").upload(filePath, file);
        if (error) { alert(`Failed to upload ${file.name}`); continue; }
        const { data } = supabase.storage.from("properties").getPublicUrl(filePath);
        imagesToSave.push({ url: data.publicUrl, position: img.position });
        uploaded++;
        setUploadProgress(Math.round((uploaded / draftImages.length) * 100));
      }

      const { error } = await supabase.from("properties").insert([{
        ...form,
        price: Number(form.price),
        rooms: Number(form.rooms),
        ground_area: Number(form.ground_area),
        house_area: Number(form.house_area),
        images: imagesToSave
          .sort((a, b) => a.position - b.position)
          .map(img => img.url),
      }]);

      if (error) alert("Failed to add property: " + error.message);
      else {
        onRecordAdded();
        setForm({
          title: "", description: "", price: "", location_city: "", location_address: "",
          property_type: "", rooms: "", ground_area: "", house_area: "", country: "",
        });
        setDraftImages([]);
        editor?.commands.clearContent();
      }
    } catch (err) {
      alert("Unexpected error"); console.error(err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);

      setIsOpen(false);
      window.location.reload();
    }
  };

  // ---------------- UI ----------------
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Property</Button>
      </DialogTrigger>
      <DialogContent className="max-w-full w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
        </DialogHeader>

        <form className="space-y-3 flex flex-col">
          {Object.keys(form)
            .filter(field => field !== "country")
            .map((field) => (
              <input
                key={field}
                name={field}
                type={["price", "rooms", "ground_area", "house_area"].includes(field) ? "number" : "text"}
                placeholder={field.replace("_", " ")}
                value={form[field as keyof FormFields]}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            ))}

          {/* Rich Text Editor */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-1">Description</label>
            <div className="border rounded p-2 min-h-[20vh] max-h-[30vh] overflow-y-auto">
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* File Upload */}
          <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileSelect} />
          <Button type="button" onClick={() => fileInputRef.current?.click()} variant="outline">Browse Images</Button>

          {/* Drag & Drop Images */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={draftImages.map(i => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto mt-2 p-1">
                {draftImages.map((img, index) => {
                  const src = URL.createObjectURL(img.file);
                  return (
                    <SortableImage key={img.id} img={img}>
                      <img src={src} className="w-full h-48 object-cover rounded" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">
                          {index === 0 ? "Cover" : `Position ${index + 1}`}
                        </span>
                        {index !== 0 && (
                          <button type="button" onClick={() => setAsCover(img.id)} className="text-xs text-blue-600">
                            Set as cover
                          </button>
                        )}
                        <button type="button" onClick={() => removeImage(img.id)} className="ml-auto text-red-500 text-sm">
                          Remove
                        </button>
                      </div>
                    </SortableImage>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>

          {/* Progress Bar */}
          {isUploading && (
            <div className="w-full bg-gray-200 rounded h-2">
              <div className="bg-blue-500 h-2 rounded" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}

          <Button type="button" onClick={handleSubmit} className="w-full" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}