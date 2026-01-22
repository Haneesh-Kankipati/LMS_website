import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaPlus, FaTrash, FaDownload } from "react-icons/fa";
import { useAuth } from "../../context/authContext";

const Gallery = () => {
  const { user } = useAuth();
  const isAdmin = user?.name === "Admin";

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  /* =========================
     Fetch Images
  ========================= */
  const getImages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:3000/api/gallery",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setImages(res.data.images);
      }
    } catch (err) {
      alert("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     Upload Images (Admin)
  ========================= */
  const uploadImages = async (files) => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) =>
      formData.append("images", file)
    );

    try {
      await axios.post(
        "http://localhost:3000/api/gallery/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      getImages();
    } catch (err) {
      alert("Upload failed");
    }
  };

  /* =========================
     Delete Image (Admin)
  ========================= */
  const deleteImage = async (filename) => {

    try {
      await axios.delete(
        `http://localhost:3000/api/gallery/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      getImages();
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* =========================
     Download Image (All Users)
  ========================= */
  const downloadImage = async (url) => {
    try {
      const res = await axios.get(`http://localhost:3000${url}`, {
        responseType: "blob",
      });

      const blob = res.data;
      const blobUrl = URL.createObjectURL(blob);
      const filename = url.split("/").pop();

      const newWindow = window.open("", "_blank");
      if (!newWindow) {
        alert("Popup blocked. Please allow popups for this site to download the image.");
        URL.revokeObjectURL(blobUrl);
        return;
      }

      const safeBlobUrl = JSON.stringify(blobUrl);
      const safeFilename = JSON.stringify(filename);

      const html = `<!doctype html>
      <html>
      <head><meta charset="utf-8"><title>Download ${filename}</title></head>
      <body style="margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#111;color:#fff;">
        <img src=${safeBlobUrl} style="max-width:100%;height:auto;" />
        <script>
          (function(){
            try {
              var a = document.createElement('a');
              a.href = ${safeBlobUrl};
              a.download = ${safeFilename};
              document.body.appendChild(a);
              a.click();
              a.remove();
            } catch(e) { console.error(e); }
          })();
        </script>
      </body>
      </html>`;

      newWindow.document.write(html);
      newWindow.document.close();

      // Revoke the object URL after some time to free memory
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  useEffect(() => {
    getImages();
  }, []);

  return (
    <div className="relative p-5">
      <h2 className="text-2xl font-bold mb-4">Gallery</h2>

      <div className="h-[70vh] overflow-y-auto border rounded-lg p-4 bg-gray-50">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : images.length === 0 ? (
          <p className="text-center text-gray-500">
            No images uploaded yet
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, index) => {
              const filename = img.url.split("/").pop();

              return (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden shadow bg-white"
                >
                  <img
                    src={`http://localhost:3000${img.url}`}
                    alt="Gallery"
                    className="w-full h-auto object-contain"
                    loading="lazy"
                  />

                  {/* Download Button - available to all users */}
                  <button
                    onClick={() => downloadImage(img.url)}
                    className="absolute top-2 left-2 bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                    title="Download image"
                  >
                    <FaDownload size={14} />
                  </button>

                  {/* Admin Delete Button */}
                  {isAdmin && (
                    <button
                      onClick={() => deleteImage(filename)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                      title="Delete image"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload (Admin Only) */}
      {isAdmin && (
        <>
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              uploadImages(e.target.files);
              e.target.value = null;
            }}
          />

          <button
            onClick={() => fileInputRef.current.click()}
            className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
            title="Add Images"
          >
            <FaPlus size={20} />
          </button>
        </>
      )}
    </div>
  );
};

export default Gallery;
