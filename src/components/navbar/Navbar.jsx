'use client'
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FaPlus,
  FaBlog,
  FaVideo,
  FaImages,
  FaQuoteRight,
  FaRegEdit,
} from "react-icons/fa";

import { MdDashboardCustomize } from "react-icons/md";
import "./navbar.css";
import { IoMdClose } from "react-icons/io";
const menuItems = [
  { name: "Dashboard", icon: MdDashboardCustomize, href: "/" },
  { name: "Create Blog", icon: FaPlus, href: "/create" },
  { name: "Manage Blog", icon: FaBlog, href: "/manage" },
  { name: "Manage Video Gallery", icon: FaVideo, href: "/manage-video" },
  { name: "Manage Photo Gallery", icon: FaImages, href: "/manage-photo" },
  { name: "Testimonials", icon: FaQuoteRight, href: "/create-testimonial" },
  { name: "Manage Testimonials", icon: FaRegEdit, href: "/manage-testimonial" },
];

export default function DashboardNavbar({ open, setOpen, handleLogout }) {
  const pathname = usePathname(); // Next.js hook to get current route

  return (
    <>
      {/* SIDEBAR */}
      <div
        className={`sidebar fixed md:static top-0 left-0 h-full w-64 transform transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo & Close button */}
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
            onClick={() => setOpen(false)}
            className="md:hidden p-2 text-gray-700 hover:text-white hover:bg-[#FF9100] rounded-full"
            aria-label="Close sidebar"
          >
            <IoMdClose className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar menu */}
        <nav className="flex-1 flex flex-col space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)} // close mobile menu
              className={`sidebar-item group ${
                pathname === item.href ? "sidebar-item-selected" : ""
              }`}
            >
              <item.icon className="sidebar-icon" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile actions */}
        <div className="mt-auto flex flex-col gap-3 sm:hidden px-4 pb-6">
          <Link
            href="/changepassword"
            className="btn-primary justify-center"
            onClick={() => setOpen(false)}
          >
            <span>Change Password</span>
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setOpen(false);
            }}
            className="btn-danger justify-center"
          >
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 md:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
