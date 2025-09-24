"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaPlus,
  FaBlog,
  FaVideo,
  FaImages,
  FaQuoteRight,
  FaRegEdit,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import "./navbar.css"; // Corrected import name
import { MdDashboardCustomize } from "react-icons/md";

const menuItems = [
  { name: "Dashboard", icon: MdDashboardCustomize, href: "/" },
  { name: "Create Blog", icon: FaPlus, href: "/create" },
  { name: "Manage Blog", icon: FaBlog, href: "/manage" },
  { name: "Manage Video Gallery", icon: FaVideo, href: "/manage-video" },
  { name: "Manage Photo Gallery", icon: FaImages, href: "/manage-photo" },
  { name: "Testimonials", icon: FaQuoteRight, href: "/create-testimonial" },
  { name: "Manage Testimonials", icon: FaRegEdit, href: "/manage-testimonial" },
];

export default function DashboardNavbar() {
  const [selected, setSelected] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false); // State to control mobile menu

  return (
    <>
      {/* HAMBURGER MENU ICON - Shows only on mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="menu-toggle"
          aria-label="Open sidebar"
        >
          <FaBars className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* OVERLAY - Dims the background when the menu is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <div
        className={`sidebar h-full flex flex-col fixed inset-y-0 left-0 z-40 w-64
                   transform transition-transform duration-300 ease-in-out
                   ${isOpen ? "translate-x-0" : "-translate-x-full"}
                   md:relative md:translate-x-0`}
      >
        {/* Logo and Close Button for Mobile */}
        <div className="flex items-center justify-between mb-8 flex-shrink-0">
          <div className="logo">
            <Image
              src="/logo.jpeg"
              alt="Logo"
              width={128}
              height={64}
              className="w-32 h-auto object-contain"
              priority
            />
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 text-gray-700 hover:text-white hover:bg-[#FF9100] rounded-full"
            aria-label="Close sidebar"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar menu */}
        <nav className="flex-1 flex flex-col space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                setSelected(item.name);
                setIsOpen(false); // Close menu on navigation
              }}
              className={`sidebar-item group ${
                selected === item.name ? "sidebar-item-selected" : ""
              }`}
            >
              <item.icon className="sidebar-icon" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}