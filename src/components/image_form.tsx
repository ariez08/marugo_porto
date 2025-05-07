import React, { useState, useEffect } from "react";
import { fetchCategories, uploadImage, Category } from "../Api";

const ImageUploadForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [categoryID, setCategoryID] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories using the API function
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    loadCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && !["image/png", "image/jpeg"].includes(selectedFile.type)) {
      alert("Invalid file type. Please select a PNG or JPG file.");
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a valid file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category_id", categoryID);
    formData.append("description", description);
    formData.append("image", file);

    try {
      const response = await uploadImage(formData);
      alert(response.message);
      setName("");
      setCategoryID("");
      setDescription("");
      setFile(null);
    } catch (error) {
      alert("Failed to upload image.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-xs"
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-400">
          Category
        </label>
        <select
          id="category"
          value={categoryID}
          onChange={(e) => setCategoryID(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-xs"
          required
        >
          <option value="">Select image category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-400">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-xs"
        ></textarea>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-400">
          Image
        </label>
        <input
          id="image"
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray file:mr-4 file:rounded-sm file:border-0 file:bg-gray-100 file:py-2 file:px-4 file:text-sm file:font-medium file:text-gray-300 hover:file:bg-gray-200 file:cursor-pointer"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue text-black rounded-md focus:outline-hidden focus:ring-2"
      >
        Upload Image
      </button>
    </form>
  );
};

export default ImageUploadForm;
