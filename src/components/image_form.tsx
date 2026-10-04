import React, { useState, useEffect } from "react";
import { fetchCategories, uploadImage, Category } from "../Api";
import CapsuleButton from "./capsule_button";
interface ImageUploadFormProps {
  onSuccess?: () => void;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState<string>("");
  const [categoryID, setCategoryID] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err: unknown) {
        console.error("Failed to load categories:", err);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setError(null);

    if (selectedFile && !["image/png", "image/jpeg", "image/webp"].includes(selectedFile.type)) {
      setError("Hanya format PNG, JPG, dan WebP yang didukung.");
      return;
    }

    setFile(selectedFile);
    if (!name && selectedFile) {
      setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Silakan pilih file gambar.");
      return;
    }

    if (!categoryID) {
      setError("Silakan pilih kategori gambar.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("category_id", categoryID);
    formData.append("description", description.trim());
    formData.append("image", file);

    try {
      setLoading(true);
      setError(null);
      const response = await uploadImage(formData);
      setSuccess(response.message || "Gambar berhasil di-upload!");
      setName("");
      setCategoryID("");
      setDescription("");
      setFile(null);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal meng-upload gambar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-desc">
      {error && (
        <div className="p-3 bg-red/10 border border-red rounded-xl text-red text-sm font-bold">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green/10 border border-green rounded-xl text-green text-sm font-bold">
          {success}
        </div>
      )}

      <div>
        <label htmlFor="modal_name" className="block text-sm font-bold text-black-100 mb-1">
          Judul Ilustrasi
        </label>
        <input
          id="modal_name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama gambar..."
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue shadow-inner"
          required
        />
      </div>

      <div>
        <label htmlFor="modal_category" className="block text-sm font-bold text-black-100 mb-1">
          Kategori
        </label>
        <select
          id="modal_category"
          value={categoryID}
          onChange={(e) => setCategoryID(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue shadow-inner bg-white"
          required
        >
          <option value="">Pilih Kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="modal_description" className="block text-sm font-bold text-black-100 mb-1">
          Deskripsi
        </label>
        <textarea
          id="modal_description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi singkat..."
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue shadow-inner resize-none"
        />
      </div>

      <div>
        <label htmlFor="modal_image" className="block text-sm font-bold text-black-100 mb-1">
          File Gambar (PNG, JPG, WebP)
        </label>
        <input
          id="modal_image"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue file:text-white hover:file:bg-opacity-80 cursor-pointer"
          required={!file}
        />
        {previewUrl && (
          <div className="mt-2 p-2 border border-gray-200 rounded-xl bg-gray-50 flex items-center gap-3">
            <img src={previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded-lg border" />
            <span className="text-xs text-gray-500 truncate">{file?.name}</span>
          </div>
        )}
      </div>

      <CapsuleButton
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-200 hover:bg-yellow-100"
        containerClassName="w-full"
      >
        {loading ? "Mengupload..." : "Upload Gambar"}
      </CapsuleButton>
    </form>
  );
};

export default ImageUploadForm;
