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
} from "react-icons/fa";
import "./navbar.css";
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

  return (
    <div className="sidebar h-full flex flex-col">
      {/* Logo */}
      <div className="logo mb-8 flex-shrink-0 text-center">
        <Image
          src="/logo.jpeg"
          alt="Logo"
          width={128}
          height={64}
          className="w-32 h-auto object-contain"
          priority
        />
      </div>

      {/* Sidebar menu */}
      <nav className="flex-1 flex flex-col space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setSelected(item.name)}
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
  );
}
