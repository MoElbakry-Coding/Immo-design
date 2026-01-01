"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import AddPropertyDialog from "@/components/AddPropertyDialog";
import EditPropertyDialog from "@/components/EditPropertyDialog";

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location_city: string;
  location_address: string;
  country: string; // added country
  property_type: string;
  rooms: number;
  ground_area: number;
  house_area: number;
  images: string[];
}

export default function DashboardPage() {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCredentials = async () => {
      const cookies = document.cookie.split(";").map((c) => c.trim());
      const hasSecret = cookies.some((c) => c.startsWith("dashboard_secret="));

      if (hasSecret) {
        setAuthorized(true);
        setChecking(false);
        return;
      }

      const secret = prompt("Enter dashboard credentials:");
      if (!secret) {
        setChecking(false);
        return;
      }

      const res = await fetch("/api/set-dashboard-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });

      if (res.ok) {
        setAuthorized(true);
      } else {
        alert("Incorrect credentials!");
      }
      setChecking(false);
    };

    checkCredentials();
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("properties").select("*");

      if (error) {
        console.error("Error fetching properties:", error);
      } else {
        setProperties(data as Property[]);
      }
      setLoading(false);
    };

    if (authorized) fetchProperties();
  }, [authorized]);

  const deleteProperty = async (id: string) => {
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) {
      console.error("Error deleting property:", error);
    } else {
      setProperties((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (checking)
    return <p className="text-center mt-10">Checking credentials...</p>;

  if (!authorized)
    return (
      <p className="text-center mt-10 text-red-500">Unauthorized!</p>
    );

  return (
    <div className="container mx-auto px-4 py-10 pt-20">
      <h1 className="text-2xl font-bold m-6">Dashboard</h1>

      <Tabs defaultValue="properties">
        <TabsList className="flex justify-center mb-6 gap-4 p-2">
          <TabsTrigger value="properties">Properties</TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <div className="flex flex-wrap gap-4 mb-4 items-center">
            <AddPropertyDialog onRecordAdded={() => { }} />
          </div>

          {loading ? (
            <p>Loading properties...</p>
          ) : properties.length === 0 ? (
            <p>No properties found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow rounded-lg border flex-row">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">Title</th>
                    <th className="px-4 py-2 border">Price</th>
                    <th className="px-4 py-2 border">City</th>
                    <th className="px-4 py-2 border">Country</th>
                    <th className="px-4 py-2 border">Address</th>
                    <th className="px-4 py-2 border">Type</th>
                    <th className="px-4 py-2 border">Rooms</th>
                    <th className="px-4 py-2 border">Ground Area</th>
                    <th className="px-4 py-2 border">House Area</th>
                    <th className="px-4 py-2 border">Images</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{p.title}</td>
                      <td className="px-4 py-2 border">{p.price}</td>
                      <td className="px-4 py-2 border">{p.location_city}</td>
                      <td className="px-4 py-2 border">{p.country}</td>
                      <td className="px-4 py-2 border">{p.location_address}</td>
                      <td className="px-4 py-2 border">{p.property_type}</td>
                      <td className="px-4 py-2 border">{p.rooms}</td>
                      <td className="px-4 py-2 border">{p.ground_area}</td>
                      <td className="px-4 py-2 border">{p.house_area}</td>
                      <td className="px-4 py-2 border">
                        {p.images?.length > 0 ? (
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          "No image"
                        )}
                      </td>
                      <td className="px-4 py-4 border flex flex-row gap-2">
                        <EditPropertyDialog
                          record={p}
                          onRecordUpdated={() => { }}
                        />
                        <Button
                          variant="destructive"
                          className="ml-0 md:ml-2 cursor-pointer hover:scale-105 transition"
                          onClick={() => deleteProperty(p.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}