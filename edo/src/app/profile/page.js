"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { authAPI, userAPI, storeUser } from "@/utils/api.js";
import Modal from "@/partials/Modal.jsx";

const mockProfile = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+1 555-123-4567",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
};

const mockProperties = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    price: 2500,
    location: "123 Main St, Downtown",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    features: ["Parking", "Gym", "Pool"],
    description:
      "Beautiful modern apartment in the heart of downtown with amazing city views.",
  },
  {
    id: 2,
    title: "Spacious Family Home",
    price: 4500,
    location: "456 Oak Ave, Suburbs",
    type: "house",
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
    features: ["Garden", "Garage", "Fireplace"],
    description:
      "Perfect family home with a large backyard and modern amenities.",
  },
  {
    id: 3,
    title: "Luxury Waterfront Condo",
    price: 3800,
    location: "789 Harbor Blvd, Waterfront",
    type: "condo",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
    features: ["Water View", "Balcony", "Concierge"],
    description:
      "Stunning waterfront condo with panoramic views and luxury finishes.",
  },
];

const mockActivity = [
  {
    id: 1,
    action: 'Bookmarked "Modern Downtown Apartment"',
    date: "2024-06-01",
  },
  { id: 2, action: "Updated profile information", date: "2024-05-28" },
  { id: 3, action: 'Bookmarked "Luxury Waterfront Condo"', date: "2024-05-20" },
];

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [message, setMessage] = useState("");
  const [bookmarkedProperties, setBookmarkedProperties] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const fileInputRef = React.useRef(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await authAPI.getCurrentUser();
        setProfile(user);
        setForm({
          name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          email: user.email || "",
          phone: user.phone || "",
          avatar: user.profile_image || "",
        });
        setImageFile(null);
      } catch (err) {
        setMessage("Failed to load profile.");
      }
    };
    fetchProfile();
  }, [loading]);

  const handleAvatarEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      setForm({ ...form, avatar: file });
      setImageFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(profile?.profile_image || "");
        setImageFile(null);
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    setMessage("");
    try {
      // Split name into first and last
      const [first_name, ...rest] = form.name.trim().split(" ");
      const last_name = rest.join(" ");
      let data;
      if (imageFile) {
        data = new FormData();
        data.append("first_name", first_name);
        data.append("last_name", last_name);
        data.append("email", form.email);
        data.append("phone", form.phone);
        data.append("profile_image", imageFile);
      } else {
        data = {
          first_name,
          last_name,
          email: form.email,
          phone: form.phone,
        };
      }
      await userAPI.updateUser("me", data);
      // Fetch updated profile and update state
      const updatedUser = await authAPI.getCurrentUser();
      setProfile(updatedUser);
      setForm({
        name: `${updatedUser.first_name || ""} ${
          updatedUser.last_name || ""
        }`.trim(),
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        avatar: updatedUser.profile_image_url || "",
      });
      setImagePreview("");
      setEditing(false);
      setImageFile(null);
      setLoading(false);
      setMessage("Profile updated!");
      // Store updated user in localStorage for global access
      storeUser(updatedUser);
      window.dispatchEvent(new Event("user-updated"));
    } catch (err) {
      if (
        err &&
        err.response &&
        err.response.profile_image &&
        err.response.profile_image.some((msg) =>
          msg.includes("Upload a valid image")
        )
      ) {
        setMessage(
          "Invalid file type. Please upload a valid image (JPEG, PNG, GIF, BMP, or WEBP)."
        );
      } else {
        setMessage("Failed to update profile.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarkedProperties");
    if (savedBookmarks) {
      const ids = JSON.parse(savedBookmarks);
      setBookmarkedProperties(
        mockProperties
          .filter((p) => ids.includes(p.id))
          .map((p) => ({ ...p, isBookmarked: true }))
      );
    }
  }, []);

  // Drag logic for image preview
  const handleDragStart = (e) => {
    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    setDragStart({
      x: clientX - dragOffset.x,
      y: clientY - dragOffset.y,
    });
  };
  const handleDrag = (e) => {
    if (!dragStart) return;
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    setDragOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };
  const handleDragEnd = () => {
    setDragStart(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdfa] via-[#e0f7fa] to-white py-12 px-4 sm:px-8 flex items-center justify-center relative overflow-x-hidden">
      {/* Decorative Accent */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0d9488]/10 rounded-full z-0" />
      <button
        className="absolute top-4 left-4 flex items-center text-[#0d9488] hover:underline z-50 bg-white/90 px-3 py-1 rounded"
        onClick={() => router.back()}
        type="button"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 z-10 mx-auto">
        <div className="col-span-1 flex flex-col">
          <h1 className="text-3xl font-extrabold mb-8 text-gray-900 text-center tracking-tight">
            My Profile
          </h1>
          <div className="flex flex-col items-center mb-8">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleChange}
            />
            <div
              className="relative w-28 h-28 rounded-full border-4 border-[#0d9488] shadow-lg overflow-hidden mb-3 group cursor-pointer"
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
            >
              {profile?.profile_image_url || profile?.avatar ? (
                <img
                  src={profile.profile_image_url || profile.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    setProfile((p) => ({
                      ...p,
                      profile_image_url: "",
                      avatar: "",
                    }));
                  }}
                />
              ) : (
                <span className="text-4xl font-bold text-[#0d9488] flex items-center justify-center w-full h-full bg-white">
                  {profile?.first_name
                    ? profile.first_name.charAt(0).toUpperCase()
                    : profile?.name
                    ? profile.name.charAt(0).toUpperCase()
                    : "U"}
                </span>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Pencil className="h-7 w-7 text-white" />
              </div>
            </div>
            {/* Remove Photo Button */}
            {(profile?.profile_image_url || profile?.avatar) && (
              <button
                className="text-xs text-red-600 font-semibold hover:underline focus:outline-none mb-2"
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();
                  setLoading(true);
                  setMessage("");
                  try {
                    // Use FormData to allow null for image
                    const data = new FormData();
                    data.append("profile_image", ""); // Django treats empty string as remove
                    await userAPI.updateUser("me", data);
                    // Fetch updated profile and update state
                    const updatedUser = await authAPI.getCurrentUser();
                    setProfile(updatedUser);
                    setForm({
                      name: `${updatedUser.first_name || ""} ${
                        updatedUser.last_name || ""
                      }`.trim(),
                      email: updatedUser.email || "",
                      phone: updatedUser.phone || "",
                      avatar: updatedUser.profile_image_url || "",
                    });
                    setImagePreview("");
                    setImageFile(null);
                    setLoading(false);
                    setMessage("Profile photo removed.");
                    storeUser(updatedUser);
                    window.dispatchEvent(new Event("user-updated"));
                  } catch (err) {
                    setMessage("Failed to remove profile photo.");
                    setLoading(false);
                  }
                }}
              >
                Remove Photo
              </button>
            )}
            <button
              className="text-sm text-[#0d9488] font-semibold hover:underline focus:outline-none"
              onClick={() => setEditing((v) => !v)}
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2 border-b pb-1">
              Personal Info
            </h2>
            {editing ? (
              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0d9488] focus:border-[#0d9488] shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0d9488] focus:border-[#0d9488] shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0d9488] focus:border-[#0d9488] shadow-sm"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-[#0d9488] text-white rounded-lg font-semibold hover:bg-[#0f766e] transition-colors shadow"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors shadow"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 text-base">
                <div>
                  <span className="font-semibold text-gray-700">Name:</span>{" "}
                  {profile?.name ||
                    `${profile?.first_name || ""} ${
                      profile?.last_name || ""
                    }`.trim()}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Email:</span>{" "}
                  {profile?.email}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Phone:</span>{" "}
                  {profile?.phone}
                </div>
              </div>
            )}
          </div>
          {message && (
            <div className="mt-4 text-green-700 bg-green-100 border border-green-200 rounded-lg px-4 py-2 text-center font-medium shadow">
              {message}
            </div>
          )}
        </div>
        <div className="col-span-1 flex flex-col gap-8">
          <div>
            <Link
              href="/bookmarks"
              className="inline-block w-full text-center py-3 px-6 bg-[#0d9488] text-white font-semibold rounded-lg shadow hover:bg-[#0f766e] transition-colors text-base"
            >
              Saved Bookings
            </Link>
          </div>
          <div>
            <Link
              href="/reviews"
              className="inline-block w-full text-center py-3 px-6 bg-[#f5f5f7] text-[#0d9488] font-semibold rounded-lg shadow hover:bg-[#e0f2f1] transition-colors text-base border border-[#0d9488]"
            >
              Reviews
            </Link>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Recent Activity
            </h2>
            <ul className="divide-y divide-gray-100 bg-gray-50 rounded-lg shadow-sm">
              {mockActivity.map((activity) => (
                <li
                  key={activity.id}
                  className="px-4 py-3 text-sm flex justify-between items-center"
                >
                  <span>{activity.action}</span>
                  <span className="text-gray-400 text-xs">{activity.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isImageModalOpen || !!imagePreview}
        onClose={() => {
          setIsImageModalOpen(false);
          setImagePreview("");
        }}
      >
        <div className="flex flex-col items-center">
          <div
            className="relative w-48 h-48 bg-gray-100 overflow-hidden rounded-full border-4 border-[#0d9488] cursor-grab"
            style={{ touchAction: "none" }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDrag}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDrag}
            onTouchEnd={handleDragEnd}
          >
            {(imagePreview ||
              profile?.profile_image_url ||
              profile?.avatar) && (
              <img
                src={
                  imagePreview || profile?.profile_image_url || profile?.avatar
                }
                alt="Preview"
                className="select-none pointer-events-none"
                draggable={false}
                style={{
                  position: "absolute",
                  left: dragOffset.x,
                  top: dragOffset.y,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  userSelect: "none",
                }}
              />
            )}
          </div>
          {/* Remove Photo Button in Modal */}
          {(profile?.profile_image_url || profile?.avatar) && (
            <button
              className="mt-2 text-xs text-red-600 font-semibold hover:underline focus:outline-none"
              type="button"
              onClick={async (e) => {
                e.stopPropagation();
                setLoading(true);
                setMessage("");
                try {
                  const data = new FormData();
                  data.append("profile_image", "");
                  await userAPI.updateUser("me", data);
                  const updatedUser = await authAPI.getCurrentUser();
                  setProfile(updatedUser);
                  setForm({
                    name: `${updatedUser.first_name || ""} ${
                      updatedUser.last_name || ""
                    }`.trim(),
                    email: updatedUser.email || "",
                    phone: updatedUser.phone || "",
                    avatar: updatedUser.profile_image_url || "",
                  });
                  setImagePreview("");
                  setImageFile(null);
                  setIsImageModalOpen(false);
                  setLoading(false);
                  setMessage("Profile photo removed.");
                  storeUser(updatedUser);
                  window.dispatchEvent(new Event("user-updated"));
                } catch (err) {
                  setMessage("Failed to remove profile photo.");
                  setLoading(false);
                }
              }}
            >
              Remove Photo
            </button>
          )}
          <div className="mt-4 flex gap-3">
            <button
              className="py-2 px-4 bg-[#0d9488] text-white rounded-lg font-semibold hover:bg-[#0f766e] transition-colors shadow"
              onClick={async () => {
                // Save both image and info fields
                if (!profile) return;
                setLoading(true);
                setMessage("");
                try {
                  // Split name into first and last
                  const [first_name, ...rest] = form.name.trim().split(" ");
                  const last_name = rest.join(" ");
                  let data;
                  if (imageFile) {
                    data = new FormData();
                    data.append("first_name", first_name);
                    data.append("last_name", last_name);
                    data.append("email", form.email);
                    data.append("phone", form.phone);
                    data.append("profile_image", imageFile);
                  } else {
                    data = {
                      first_name,
                      last_name,
                      email: form.email,
                      phone: form.phone,
                    };
                  }
                  await userAPI.updateUser("me", data);
                  // Fetch updated profile and update state
                  const updatedUser = await authAPI.getCurrentUser();
                  setProfile(updatedUser);
                  setForm({
                    name: `${updatedUser.first_name || ""} ${
                      updatedUser.last_name || ""
                    }`.trim(),
                    email: updatedUser.email || "",
                    phone: updatedUser.phone || "",
                    avatar: updatedUser.profile_image_url || "",
                  });
                  setImagePreview("");
                  setEditing(false);
                  setImageFile(null);
                  setIsImageModalOpen(false);
                  setLoading(false);
                  setMessage("Profile updated!");
                  // Store updated user in localStorage for global access
                  storeUser(updatedUser);
                  window.dispatchEvent(new Event("user-updated"));
                } catch (err) {
                  // Check for invalid image error from backend
                  if (
                    err &&
                    err.response &&
                    err.response.profile_image &&
                    err.response.profile_image.some((msg) =>
                      msg.includes("Upload a valid image")
                    )
                  ) {
                    setMessage(
                      "Invalid file type. Please upload a valid image (JPEG, PNG, GIF, BMP, or WEBP)."
                    );
                  } else {
                    setMessage("Failed to update profile.");
                  }
                  setLoading(false);
                }
              }}
            >
              Save
            </button>
            <button
              className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors shadow"
              onClick={() => {
                setIsImageModalOpen(false);
                setImagePreview("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
