"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { XMarkIcon, FilmIcon, GlobeAltIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Bed, Ruler, Home, MapPin, Tag } from "lucide-react";

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location_city: string;
  location_address: string;
  property_type: string;
  rooms: number;
  ground_area: number;
  house_area: number;
  status?: string;
  country: string;
  images: string[];
}

export default function RealEstatePage() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [groundFilter, setGroundFilter] = useState<[number, number] | null>(null);
  const [houseFilter, setHouseFilter] = useState<[number, number] | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // ✅ Search bar
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // ✅ Fetch all properties once
  useEffect(() => {
      fetch("/api/properties")
        .then((res) => res.json())
        .then((data: Property[]) => {
          const sorted = [...data].sort((a, b) => a.id - b.id);
          setAllProperties(sorted);

          const uniqueCountries = Array.from(
            new Set(sorted.map((p) => p.country?.trim()).filter(Boolean))
          );
          setCountries(uniqueCountries);

          // ✅ Auto-select country if only one exists
          if (uniqueCountries.length === 1) {
            setSelectedCountry(uniqueCountries[0]);
          }

          setLoading(false);
        })
        .catch((err) => console.error("Failed to fetch properties:", err));
    }, []);

  // ✅ Filter by country
  useEffect(() => {
    if (!selectedCountry) return;

    const countryData = allProperties.filter(
      (p) => p.country?.toLowerCase() === selectedCountry.toLowerCase()
    );

    setProperties(countryData);
    setFiltered(countryData);

    const types = Array.from(new Set(countryData.map((p) => p.property_type)));
    setTypeOptions(types);
  }, [selectedCountry, allProperties]);

  // ✅ Apply filters + search
  useEffect(() => {
    let temp = [...properties];

    if (typeFilter.length > 0) temp = temp.filter((p) => typeFilter.includes(p.property_type));
    if (groundFilter) {
      const [min, max] = groundFilter;
      temp = temp.filter((p) => p.ground_area >= min && p.ground_area <= max);
    }
    if (houseFilter) {
      const [min, max] = houseFilter;
      temp = temp.filter((p) => p.house_area >= min && p.house_area <= max);
    }

    // ✅ Search filter (title, city, address)
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      temp = temp.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location_city.toLowerCase().includes(q) ||
          p.location_address.toLowerCase().includes(q)
      );
    }

    temp.sort((a, b) => a.id - b.id);
    setFiltered(temp);
  }, [typeFilter, groundFilter, houseFilter, searchTerm, properties]);

  const clearFilters = () => {
    setTypeFilter([]);
    setGroundFilter(null);
    setHouseFilter(null);
    setSearchTerm("");
  };

  // ✅ Country selector
  if (!selectedCountry) {
    if (loading)
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      );

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* ✅ Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover filter blur-md scale-105"
        src="/hero-video.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* ✅ Semi-transparent overlay for readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* ✅ Centered Glass Card */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <div className="bg-white/30 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/40 text-center max-w-lg w-full animate-fadeIn">
          <GlobeAltIcon className="w-16 h-16 text-blue-600 mx-auto mb-4 drop-shadow-md" />
          <h1 className="text-3xl font-extrabold text-white mb-6 drop-shadow-sm">
            Choose Your Country
          </h1>

          {countries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c)}
                  className="px-6 py-3 bg-gradient-to-br from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-semibold shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  {c}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-100">No countries available.</p>
          )}
        </div>
      </div>
    </div>
  );
}



  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  const groundOptions: [string, [number, number]][] = [
    ["0 - 200m²", [0, 200]],
    ["200 - 500m²", [200, 500]],
    ["500 - 1000m²", [500, 1000]],
    ["über 1000m²", [1000, 999999]],
  ];

  const houseOptions: [string, [number, number]][] = [
    ["20 - 45m²", [20, 45]],
    ["45 - 65m²", [45, 65]],
    ["65 - 85m²", [65, 85]],
    ["über 85m²", [85, 9999]],
  ];

  const FilterContent = () => (
    <div className="p-6 w-80 max-w-full overflow-y-auto lg:h-auto">
      <div className="flex justify-between items-center mb-6 lg:hidden">
        <h2 className="text-2xl font-semibold text-gray-700">Filters</h2>
        <button onClick={() => setShowMobileFilters(false)}>
          <XMarkIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Property Type */}
      <div className="mb-6 bg-white shadow-2xl rounded-3xl p-6 border border-gray-200">
        <p className="font-semibold mb-2 text-gray-600">Immobilientyp</p>
        <div className="flex flex-col gap-2">
          {typeOptions.map((t) => (
            <label key={t} className="inline-flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                type="checkbox"
                value={t}
                checked={typeFilter.includes(t)}
                onChange={(e) => {
                  if (e.target.checked) setTypeFilter([...typeFilter, t]);
                  else setTypeFilter(typeFilter.filter((x) => x !== t));
                }}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              {t}
            </label>
          ))}
        </div>
      </div>

      {/* Ground Area */}
      <div className="mb-6 bg-white shadow-2xl rounded-3xl p-6 border border-gray-200">
        <p className="font-semibold mb-2 text-gray-600">Grundfläche</p>
        <select
          value={groundFilter ? groundFilter.join("-") : ""}
          onChange={(e) => {
            const val = e.target.value;
            setGroundFilter(val ? (val.split("-").map(Number) as [number, number]) : null);
          }}
          className="border rounded px-4 py-2 cursor-pointer w-full"
        >
          <option value="">alles anzeigen</option>
          {groundOptions.map(([label, range]) => (
            <option key={label} value={range.join("-")}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* House Area */}
      <div className="mb-6 bg-white shadow-2xl rounded-3xl p-6 border border-gray-200">
        <p className="font-semibold mb-2 text-gray-600">Wohnfläche</p>
        <select
          value={houseFilter ? houseFilter.join("-") : ""}
          onChange={(e) => {
            const val = e.target.value;
            setHouseFilter(val ? (val.split("-").map(Number) as [number, number]) : null);
          }}
          className="border rounded px-4 py-2 cursor-pointer w-full"
        >
          <option value="">alles anzeigen</option>
          {houseOptions.map(([label, range]) => (
            <option key={label} value={range.join("-")}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={clearFilters}
        className="mt-4 w-full px-4 py-2 rounded-xl border bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition cursor-pointer"
      >
        Filter zurücksetzen
      </button>
    </div>
  );

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center sm:text-left">
          Properties in {selectedCountry}
        </h1>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* ✅ Search Bar */}
          <div className="relative w-full sm:w-72">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by title, city, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {countries.length > 1 && (
  <button
    onClick={() => setSelectedCountry(null)}
    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-xl font-medium text-gray-700 whitespace-nowrap cursor-pointer"
  >
    Change Country
  </button>
)}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block lg:w-1/4">
          <FilterContent />
        </div>

        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black opacity-40"
              onClick={() => setShowMobileFilters(false)}
            ></div>
            <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-2xl rounded-l-3xl overflow-y-auto">
              <FilterContent />
            </div>
          </div>
        )}

        {/* Property Cards */}
        <div className="items-stretch lg:w-3/4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8 p-4">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-600 col-span-full mt-16">
              No properties found in {selectedCountry}.
            </div>
          ) : (
            filtered.map((p) => (
              <Link key={p.id} href={`/realestate/${p.id}`}>
                <div className="h-full sm:w-50 md:w-50 lg:w-70 xl:w-100 P-5 rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                  <div className="relative">
                    <img
                      src={p.images?.[0] || "/placeholder.jpg"}
                      alt={p.title}
                      className="w-full h-52 object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md flex items-center gap-1">
                      <Tag size={16} />
                      €{p.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-5">
                      {p.title}
                    </h2>
                    <p className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <MapPin size={16} className="text-blue-600" />
                      {p.location_city}, {p.location_address}
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Home size={16} className="text-blue-600" />
                        <span>{p.property_type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Ruler size={16} className="text-blue-600" />
                        <span>{p.ground_area} m²</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Home size={16} className="text-blue-600" />
                        <span>{p.house_area} m²</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bed size={16} className="text-blue-600" />
                        <span>{p.rooms} Rooms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
