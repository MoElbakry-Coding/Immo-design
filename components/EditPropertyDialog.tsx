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

// ----------- @dnd-kit imports -----------
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

// ----------- Types -----------
type ExistingImage = { id: string; type: "existing"; url: string; position: number };
type NewImage = { id: string; type: "new"; file: File; position: number };
type ImageItem = ExistingImage | NewImage;

// ----------- Sortable Image Component -----------
function SortableImage({
  img,
  children,
}: {
  img: ImageItem;
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

// ----------- Main Component -----------
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
    (record.images || []).map((img: any, i: number) => ({
      id: crypto.randomUUID(),
      type: "existing" as const,
      url: typeof img === "string" ? img : img.url,
      position: i + 1,
    }))
  );
  const [isUploading, setIsUploading] = useState(false);
  const [newFiles, setNewFiles] = useState<FileList | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const normalize = (items: ImageItem[]) =>
    [...items].map((img, i) => ({ ...img, position: i + 1 }));

  // ----------- TipTap Editor -----------
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

  // ----------- File Handling -----------
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
      normalize(prev.map(img =>
        img.id === id
          ? { ...img, position: 1 }
          : { ...img }
      ))
    );
  };

  // ----------- Drag & Drop Setup -----------
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setDraftImages((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);

      // Normalize positions after drag
      return normalize(newItems);
    });
  };

  // ----------- Input Change -----------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ----------- Submit -----------
  const handleSubmit = async () => {
    setIsUploading(true);
    try {
      const imageObjects: { url: string; position: number }[] = [];

      for (const img of draftImages) {
        if (img.type === "existing") imageObjects.push({ url: img.url, position: img.position });
        else if (img.type === "new" && newFiles) {
          const file = img.file;
          const path = `properties/${Date.now()}-${file.name}`;
          await supabase.storage.from("properties").upload(path, file);
          const { data } = supabase.storage.from("properties").getPublicUrl(path);
          imageObjects.push({ url: data.publicUrl, position: img.position });
        }
      }

      // Sort by position before saving
      const sortedImages = imageObjects.sort((a, b) => a.position - b.position);

      await supabase
        .from("properties")
        .update({ ...form, images: sortedImages })
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

          {/* ----------- Drag & Drop Images ----------- */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={draftImages.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto mt-2 p-1">
                {draftImages.map((img, index) => {
                  const src = img.type === "existing" ? img.url : URL.createObjectURL(img.file);

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

          <Button type="button" onClick={handleSubmit} disabled={isUploading} className="w-full mt-6 py-3 text-lg">
            {isUploading ? "Updating..." : "Update Property"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
