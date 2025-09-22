'use client';
import { useEffect, useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { Toaster, toast } from "sonner";
import Topbar from "@/components/topbar/Topbar";
import Link from "next/link";
import "./globals.css";
import { MdDashboardCustomize } from "react-icons/md";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testimonialRes, photoRes, videoRes, blogRes] = await Promise.all([
          fetch("https://nortway.mrshakil.com/api/testimonial/"),
          fetch("https://nortway.mrshakil.com/api/gallery/photo/"),
          fetch("https://nortway.mrshakil.com/api/gallery/video/"),
          fetch("https://nortway.mrshakil.com/api/blogs/blog/"),
        ]);

        const [testimonialData, photoData, videoData, blogData] = await Promise.all([
          testimonialRes.json(),
          photoRes.json(),
          videoRes.json(),
          blogRes.json(),
        ]);

        setTestimonials(testimonialData.slice(-3).reverse());
        setPhotos(photoData.slice(-3).reverse());
        setVideos(videoData.slice(-3).reverse());
        setBlogs(blogData.slice(-3).reverse());
      } catch (err) {
        toast.error("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="loading-text">Loading dashboard...</p>;
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <Topbar textTopbar="Dashboard" topBarIcon={MdDashboardCustomize} />

      <div className="container">
        {/* Testimonials */}
        <section className="section">
          <h2 className="section-title">Latest Testimonials</h2>
          <div className="grid">
            {testimonials.map((t) => (
              <div key={t.id} className="card">
                <p className="card-title">{t.name}</p>
                <p className="card-subtitle">{t.designation}</p>
                {t.video?.url && (
                  <video controls className="video">
                    <source src={t.video.url} type="video/mp4" />
                  </video>
                )}
              </div>
            ))}
          </div>
          <Link href="/manage-testimonial" className="view-more">
            View All
          </Link>
        </section>

        {/* Photos */}
        <section className="section">
          <h2 className="section-title">Recent Photos</h2>
          <div className="grid">
            {photos.map((p) => (
              <div key={p.id} className="card">
                <img src={p.photo} alt={p.title || "Photo"} className="photo" />
                <p className="card-subtitle">{p.title}</p>
              </div>
            ))}
          </div>
          <Link href="/manage-photos" className="view-more">
            View All
          </Link>
        </section>

        {/* Videos */}
        <section className="section">
          <h2 className="section-title">Recent Videos</h2>
          <div className="grid">
            {videos.map((v) => (
              <div key={v.id} className="card">
                <video controls className="video">
                  <source src={v.video_url} type="video/mp4" />
                </video>
                <p className="card-subtitle">{v.title}</p>
              </div>
            ))}
          </div>
          <Link href="/manage-videos" className="view-more">
            View All
          </Link>
        </section>

        {/* Blogs */}
        
        <section className="section">
          <h2 className="section-title">Recent Blogs</h2>
          <div className="grid">
            {blogs.map((b) => (
              <div key={b.id} className="card blog-card">
                {b.thumbnail && (
                  <img
                    src={b.thumbnail}
                    alt={b.title}
                    className="blog-thumbnail"
                  />
                )}
                <div className="card-body">
                  <p className="card-title">{b.title}</p>
                  <p className="card-subtitle">By {b.author}</p>
                  <p className="card-desc">
                    {b.content.length > 80
                      ? b.content.substring(0, 80) + "..."
                      : b.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/manage-blogs" className="view-more">
            View All
          </Link>
        </section>

      </div>
    </>
  );
}
