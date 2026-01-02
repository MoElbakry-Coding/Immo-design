"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react"; // ✅ clean modern icons


interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location_city: string;
  location_address: string;
  property_type: string;
  rooms: number;
  ground_area: number;
  house_area: number;
  images: string[];
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function PropertyDetails({ params }: Props) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch property
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { id } = await params;
        const res = await fetch(`/api/properties/${id}`);
        const data: Property = await res.json();
        setProperty(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [params]);

  // Auto-slide
  useEffect(() => {
    if (!property) return;
    intervalRef.current = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % property.images.length);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [property]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  if (!property) return <div className="text-center py-20">Property not found.</div>;

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 pb-16">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Info Card */}
        <div className="lg:w-1/3">
          <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">{property.title}</h1>
            <p className="text-gray-500 mb-6">
              {property.location_city}, {property.location_address}
            </p>

            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">💰 Preis:</span>{" "}
                <span className="text-blue-600 text-xl font-bold">
                  €{property.price.toLocaleString()}
                </span>
              </p>
              <p>
                <span className="font-semibold">🏡 Immobilientyp:</span> {property.property_type}
              </p>
              <p>
                <span className="font-semibold">🛏️ Zimmer:</span> {property.rooms}
              </p>
              <p>
                <span className="font-semibold">🌳 Grundfläche:</span> {property.ground_area} m²
              </p>
              <p>
                <span className="font-semibold">🏠 Wohnfläche:</span> {property.house_area} m²
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Gallery + Description */}
        <div className="lg:w-2/3 flex flex-col gap-6">
        {/* Image Slider */}
        <div
          className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-xl bg-gray-100"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={property.images[currentImage]}
              alt={`${property.title} ${currentImage + 1}`}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -100) {
                  setCurrentImage((prev) => (prev + 1) % property.images.length); // swipe left
                } else if (info.offset.x > 100) {
                  setCurrentImage(
                    (prev) => (prev - 1 + property.images.length) % property.images.length
                  ); // swipe right
                }
              }}
            />
          </AnimatePresence>

          {/* Sleek Arrows */}
          <button
            onClick={() =>
              setCurrentImage(
                (prev) => (prev - 1 + property.images.length) % property.images.length
              )
            }
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 text-gray-700 rounded-full shadow-lg p-2 hover:bg-white transition cursor-pointer"
          >
            <ChevronLeft size={28} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setCurrentImage((prev) => (prev + 1) % property.images.length)}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 text-gray-700 rounded-full shadow-lg p-2 hover:bg-white transition cursor-pointer"
          >
            <ChevronRight size={28} strokeWidth={2.5} />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 w-full flex justify-center gap-2">
            {property.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`w-3 h-3 rounded-full transition ${
                  idx === currentImage ? "bg-blue-500 scale-110" : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
          {/* Thumbnails */}
          <div className="flex mt-4 gap-3 overflow-x-auto pb-2">
            {property.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className={`w-24 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${
                  idx === currentImage ? "border-blue-500 shadow-md" : "border-gray-200"
                } hover:border-blue-400`}
                onClick={() => setCurrentImage(idx)}
              />
            ))}
          </div>

          {/* Description */}
          <div className="prose max-w-full">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">Beschreibung</h2>
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: property.description.replace(/\n/g, "<br />"),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
