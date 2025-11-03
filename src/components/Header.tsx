import {
  Bell,
  User,
  Edit3,
  LogOut,
  Menu,
  Home,
  ClipboardList,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/axios";
import type { UserData } from "../interfaces/common";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useAuthStore } from "../store/authStore";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [notifications, setNotifications] = useState<
    { id: number; text: string }[]
  >([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/sales/user`);
        const data = (res.data as { data: any }).data;
        setUser({
          name: data.name,
          email: data.email,
          designation_label: data.designation_label,
        });
      } catch {
        console.error("Failed to load user data");
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await api.get(`/notifications`);
        const data = (res.data as { data: any[] }).data;
        setNotifications(
          data.map((n, idx) => ({
            id: idx,
            text: n.message || "New notification",
          }))
        );
      } catch {
        setNotifications([]);
      }
    };

    fetchUser();
    fetchNotifications();
  }, []);

  const handleLogout = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await api.post("/sales/user/log-out");
          const success = (res.data as { success: boolean }).success;

          if (success) {
            logout();
            navigate("/login");
            toast.success("You have been logged out.");
          }
        } catch (err) {
          console.error("Logout failed:", err);
          toast.error("Failed to log out. Please try again.");
        }
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setOpenNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutsideMenu = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".menu-dropdown")) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => document.removeEventListener("mousedown", handleClickOutsideMenu);
  }, []);

  return (
    <header
      // Minimal soft gradient
      className="w-full flex items-center justify-between bg-gradient-to-r from-indigo-100 via-purple-100 to-blue-100 px-8 py-3 border-b border-gray-200 shadow-sm transition-all duration-300"


      // className="w-full flex items-center justify-between bg-white px-8 py-3 border-b border-gray-200 shadow-sm transition-all duration-300"
    >
      <div className="flex items-center px-3 py-2 w-1/3 relative">
        <Menu
          size={24}
          className={`cursor-pointer text-gray-700 transition-transform duration-200 ${
            openMenu ? "scale-110 rotate-90 text-blue-900" : "scale-100"
          }`}
          onClick={() => setOpenMenu(!openMenu)}
          aria-label="Toggle menu"
        />

        {openMenu && (
          <div
            className="absolute left-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-100 menu-dropdown transition-opacity duration-200 ease-in-out"
          >
            <div className="flex flex-col p-2">
              <Link to="/dashboard" className="hover:bg-gray-100">
                <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700">
                  <Home size={16} /> Dashboard
                </button>
              </Link>

              <Link to="#" className="hover:bg-gray-100">
                <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700">
                  <ClipboardList size={16} /> Reports
                </button>
              </Link>
            </div>
          </div>
        )}

        <h1 className="flex items-center gap-2 text-lg font-bold text-blue-900 ml-4 select-none">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-10 h-10 object-contain"
            draggable={false}
          />
          <span className="text-gray-700">SS ENTERPRISES</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div
          ref={notificationRef}
          className="relative cursor-pointer"
          onClick={() => setOpenNotifications(!openNotifications)}
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell
            className="text-gray-600 hover:text-blue-700 transition-colors duration-200"
            size={22}
          />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {notifications.length}
            </span>
          )}

          {openNotifications && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-fadeInDown">
              {notifications.length ? (
                <ul className="max-h-48 overflow-y-auto p-2 space-y-1">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className="px-3 py-2 rounded-md hover:bg-blue-50 cursor-pointer text-gray-700 text-sm"
                    >
                      {n.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500 italic">
                  You're all caught up!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <div
          ref={dropdownRef}
          className="flex items-center cursor-pointer relative"
          onClick={() => setOpen(!open)}
          title="User Profile"
          aria-label="User Profile menu toggle"
        >
          <User className="w-8 h-8 rounded-full border-2 border-gray-600 text-gray-600 hover:border-blue-700 transition-colors duration-200" />

          {open && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-fadeInDown transition-all duration-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800">
                  Hello, <span className="capitalize">{user?.name || "Guest"}</span>!
                </p>
                <p className="text-xs text-gray-500">{user?.designation_label || "No email"}</p>
              </div>

              <div className="flex flex-col p-2">
                <Link to="/profile/edit" className="hover:bg-gray-100">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700">
                    <User size={16} /> Profile
                  </button>
                </Link>
                <Link to="/profile/change-password" className="hover:bg-gray-100">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700">
                    <Edit3 size={16} /> Change Password
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-50 text-sm text-red-600"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
