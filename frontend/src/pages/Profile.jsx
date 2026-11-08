import React, { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiCamera,
  FiEdit3,
  FiSave,
  FiX,
  FiLogOut,
  FiShield,
  FiCheckCircle,
  FiLoader,
} from "react-icons/fi";

const Profile = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [userData, setUserData] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const res = await axios.get(`${backendUrl}/api/user/users/${userId}`);

        if (res.data.success) {
          setUserData(res.data.user);
          setUpdatedData(res.data.user);
        } else {
          toast.error(res.data.message || "Failed to load profile");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  // Input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUpdatedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image upload and preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    setProfilePicFile(file);

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;

    setUpdatedData((prev) => ({
      ...prev,
      profilePic: previewUrl,
    }));
  };

  // Clear temporary image preview
  const clearImagePreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setProfilePicFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Save profile
  const handleSave = async () => {
    if (!userData?._id) {
      toast.error("User not loaded yet");
      return;
    }

    if (!updatedData.name?.trim() || !updatedData.email?.trim()) {
      toast.error("Name and email are required");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = updatedData.profilePic;

      // Upload image to Cloudinary
      if (profilePicFile) {
        const fd = new FormData();
        fd.append("file", profilePicFile);
        fd.append("upload_preset", "unsigned_upload");

        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dkfxlw36y/image/upload",
          fd,
        );

        imageUrl = uploadRes.data.secure_url;
      }

      // Update user profile
      const res = await axios.put(
        `${backendUrl}/api/user/update/${userData._id}`,
        {
          name: updatedData.name,
          email: updatedData.email,
          profilePic: imageUrl,
        },
      );

      if (res.data.success) {
        setUserData(res.data.user);
        setUpdatedData(res.data.user);
        setEditMode(false);
        setProfilePicFile(null);
        clearImagePreview();

        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    clearImagePreview();
    setUpdatedData(userData);
    setEditMode(false);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 bg-white">
        <FiLoader className="animate-spin text-orange-500" size={32} />
        <p className="text-sm text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-white">
        <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-4">
          <FiUser size={30} />
        </div>

        <h2 className="text-xl font-bold text-gray-900">Profile unavailable</h2>

        <p className="text-sm text-gray-500 mt-2">
          Please log in to view your profile information.
        </p>

        <button
          onClick={() => (window.location.href = "/login")}
          className="mt-6 px-7 py-3 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const avatarUrl =
    updatedData.profilePic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userData.name || "User",
    )}&background=f97316&color=fff&size=256`;

  return (
    <main className="min-h-screen bg-gray-50 py-10 sm:py-14 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Page heading */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[3px] text-orange-500 mb-2">
            BaltiMart Account
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Manage your personal information and account details.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Profile header */}
          <div className="h-32 sm:h-40 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 relative">
            <div className="absolute inset-0 opacity-10">
              <div className="w-48 h-48 border-[25px] border-white rounded-full absolute -top-20 -right-10" />
              <div className="w-32 h-32 border-[18px] border-white rounded-full absolute top-16 right-40" />
            </div>
          </div>

          <div className="px-5 sm:px-8 pb-8">
            {/* Avatar and account heading */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 -mt-14 relative">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="relative w-fit">
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md bg-white"
                  />

                  {editMode && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center border-2 border-white shadow-md hover:bg-orange-600 transition"
                      title="Change profile picture"
                    >
                      <FiCamera size={17} />
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="sm:pb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {userData.name}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1 break-all">
                    {userData.email}
                  </p>

                  <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-green-600">
                    <FiCheckCircle size={14} />
                    Active Account
                  </div>
                </div>
              </div>

              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition shadow-sm"
                >
                  <FiEdit3 size={16} />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Profile form */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Personal Information
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    Your account details
                  </p>
                </div>

                {editMode && (
                  <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
                    Editing
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>

                  <div className="relative">
                    <FiUser
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={17}
                    />

                    <input
                      type="text"
                      name="name"
                      value={updatedData.name || ""}
                      disabled={!editMode || saving}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      autoComplete="name"
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border text-sm outline-none transition ${
                        editMode
                          ? "border-orange-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>

                  <div className="relative">
                    <FiMail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={17}
                    />

                    <input
                      type="email"
                      name="email"
                      value={updatedData.email || ""}
                      disabled={!editMode || saving}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      autoComplete="email"
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border text-sm outline-none transition ${
                        editMode
                          ? "border-orange-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>
                </div>

                {/* User ID */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    User ID
                  </label>

                  <div className="relative">
                    <FiShield
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={17}
                    />

                    <input
                      type="text"
                      disabled
                      value={userData._id}
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-9 pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
              <button
                onClick={handleLogout}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition disabled:opacity-50"
              >
                <FiLogOut size={17} />
                Logout
              </button>

              {editMode && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    <FiX size={17} />
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-7 py-3 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <FiLoader className="animate-spin" size={17} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave size={17} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Your BaltiMart account information is managed securely.
        </p>
      </div>
    </main>
  );
};

export default Profile;
