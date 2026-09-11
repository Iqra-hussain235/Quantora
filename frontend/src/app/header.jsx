"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "@/config/redux/action/authAction";
import { updateBusiness, getBusinesses } from "@/config/redux/action/bussinessAction";

export default function Header() {
  const router = useRouter();
  const businesses = useSelector((state) => state.business?.businesses || []);
  const dispatch = useDispatch();

  const [profileOpen, setProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const authUser = useSelector((state) => state.auth?.user);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");

  const firstBusiness = businesses[0];
  const [businessName, setBusinessName] = useState("");

  // sync state when data loads
  useEffect(() => {
    setProfileName(authUser?.name || "");
    setProfileEmail(authUser?.email || "");
  }, [authUser]);

  useEffect(() => {
    setBusinessName(firstBusiness?.businessName || "");
  }, [firstBusiness]);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleSaveProfile = async () => {
    if (authUser) {
      await dispatch(updateProfile({ name: profileName, email: profileEmail }));
    }
    if (firstBusiness?._id) {
      await dispatch(updateBusiness({ id: firstBusiness._id, data: { businessName } }));
      await dispatch(getBusinesses());
    }
    setIsEditing(false);
    setProfileOpen(false);
  };

  return (
    <header className="bg-white border-b border-blue-900/20 shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push("/")}>
        <img src="/images/logo.png" alt="Quantora Logo" className="h-10 w-10 rounded-full border-2 border-blue-900" />
        <h1 className="font-bold text-2xl text-blue-900 tracking-wide"
          onClick={() => router.push("/")}>Quantora</h1>
      </div>
      <nav>
        <div className="relative">
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-semibold cursor-pointer"
          >
            {authUser?.name ? authUser.name.charAt(0).toUpperCase() : "I"}
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg p-4 z-20">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">My Profile</h3>
                <button
                  onClick={() => setIsEditing((e) => !e)}
                  className="text-xs text-blue-600"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                    placeholder="Name"
                  />
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                    placeholder="Business Name"
                  />
                  <button
                    onClick={handleSaveProfile}
                    className="w-full bg-green-600 text-white p-2 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Name:</span> {profileName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {profileEmail}
                  </p>
                  <p>
                    <span className="font-medium">Business:</span> {businessName || "Not set"}
                  </p>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="mt-3 w-full bg-red-600 text-white p-2 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}