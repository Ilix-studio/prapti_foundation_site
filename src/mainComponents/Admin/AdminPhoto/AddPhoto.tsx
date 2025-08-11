import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  ImagePlus,
  Plus,
  Loader2,
  Calendar,
  MapPin,
  FileText,
  Tag,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

// Import API hooks
import {
  useUploadPhotoMutation,
  useUploadMultiplePhotosMutation,
} from "../../../redux-store/services/photoApi";
import {
  useGetCategoriesByTypeQuery,
  useCreateCategoryMutation,
} from "../../../redux-store/services/categoryApi";
import {
  MultiplePhotosUploadData,
  SinglePhotoUploadData,
  FilePreview,
  PhotoFormData,
  UploadMode,
  isUploadResponse,
} from "@/types/photo.types";
import { BackNavigation } from "@/config/navigation/BackNavigation";

const AddPhoto: React.FC = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState<PhotoFormData>({
    title: "",
    category: "",
    date: "",
    location: "",
    description: "",
    altText: "", // For single photo
  });

  // File handling
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
  const [uploadMode, setUploadMode] = useState<UploadMode>("single");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category management
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // API hooks
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesByTypeQuery("photo");
  const [uploadPhoto, { isLoading: uploadingSingle }] =
    useUploadPhotoMutation();
  const [uploadMultiplePhotos, { isLoading: uploadingMultiple }] =
    useUploadMultiplePhotosMutation();
  const [createCategory, { isLoading: creatingCategory }] =
    useCreateCategoryMutation();

  const isUploading = uploadingSingle || uploadingMultiple;

  // Debug logging
  console.log("Categories from API:", categories);
  console.log("Categories loading:", categoriesLoading);
  console.log("Categories error:", categoriesError);
  console.log("Form data category:", formData.category);

  // Check if categories are properly loaded
  const selectedCategory = categories.find(
    (cat) => cat._id === formData.category
  );
  console.log("Selected category object:", selectedCategory);

  // Handle file selection
  const handleFileSelect = useCallback(
    (files: FileList) => {
      const newFiles: FilePreview[] = [];

      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const preview = URL.createObjectURL(file);
          newFiles.push({
            file,
            preview,
            altText: formData.title || file.name.split(".")[0],
          });
        } else {
          toast.error(`${file.name} is not a valid image file`);
        }
      });

      if (uploadMode === "single" && newFiles.length > 1) {
        toast.error("Single mode: Only one file allowed");
        return;
      }

      if (newFiles.length > 10) {
        toast.error("Maximum 10 files allowed");
        return;
      }

      setSelectedFiles((prev) => [...prev, ...newFiles]);
    },
    [uploadMode, formData.title]
  );

  // Handle drag & drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files);
      }
    },
    [handleFileSelect]
  );

  // Remove file
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // Clean up object URL
      URL.revokeObjectURL(prev[index].preview);
      return updated;
    });
  };

  // Update alt text for specific file
  const updateAltText = (index: number, altText: string) => {
    setSelectedFiles((prev) =>
      prev.map((file, i) => (i === index ? { ...file, altText } : file))
    );
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Create new category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const result = await createCategory({
        name: newCategoryName.trim(),
        type: "photo",
      }).unwrap();

      console.log("Created category:", result);
      toast.success("Category created successfully");
      setNewCategoryName("");
      setShowAddCategory(false);

      // Auto-select the newly created category
      setFormData((prev) => ({ ...prev, category: result._id }));
    } catch (error: any) {
      console.error("Create category error:", error);
      toast.error(
        error?.data?.message || error?.message || "Failed to create category"
      );
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    // DEBUG: Log all the data being sent
    console.log("=== DEBUGGING FORM SUBMISSION ===");
    console.log("Form data:", formData);
    console.log("Selected files:", selectedFiles);
    console.log("Selected category ID:", formData.category);
    console.log("Category type:", typeof formData.category);
    console.log("All categories:", categories);
    console.log("Selected category object:", selectedCategory);

    try {
      if (uploadMode === "single") {
        const uploadData: SinglePhotoUploadData = {
          title: formData.title,
          category: formData.category, // This should be the ObjectId
          date: formData.date || undefined,
          location: formData.location || undefined,
          description: formData.description || undefined,
          alt: selectedFiles[0].altText || formData.title,
        };

        console.log("Single upload data being sent:", uploadData);

        const result = await uploadPhoto({
          file: selectedFiles[0].file,
          data: uploadData,
        }).unwrap();

        console.log("Upload result:", result);
        toast.success("Photo uploaded successfully!");
      } else {
        const uploadData: MultiplePhotosUploadData = {
          title: formData.title,
          category: formData.category, // This should be the ObjectId
          date: formData.date || undefined,
          location: formData.location || undefined,
          description: formData.description || undefined,
          altTexts: selectedFiles.map((f) => f.altText),
        };

        console.log("Multiple upload data being sent:", uploadData);

        const result = await uploadMultiplePhotos({
          files: selectedFiles.map((f) => f.file),
          data: uploadData,
        }).unwrap();

        console.log("Upload result:", result);

        // Check if the response has the expected structure
        if (isUploadResponse(result.data)) {
          toast.success(
            `${result.data.imagesCount} photos uploaded successfully!`
          );
        } else {
          toast.success("Photos uploaded successfully!");
        }
      }

      // Clean up and navigate
      selectedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
      navigate("/admin/photoDashboard");
    } catch (error: any) {
      console.error("Upload error:", error);
      console.error("Error details:", {
        message: error?.message,
        data: error?.data,
        status: error?.status,
      });
      toast.error(error?.data?.message || error?.message || "Upload failed");
    }
  };

  // Show loading state while categories are loading
  if (categoriesLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 flex items-center justify-center'>
        <div className='flex items-center gap-2'>
          <Loader2 className='w-6 h-6 animate-spin' />
          <span>Loading categories...</span>
        </div>
      </div>
    );
  }

  // Show error state if categories failed to load
  if (categoriesError) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>Failed to load categories</p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackNavigation />

      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-2'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden'>
            {/* Header */}
            <div className='bg-gradient-to-r from-[#ffffff] to-[#ffffff] p-5'>
              <h1 className='text-2xl font-bold text-black flex items-center gap-2'>
                <ImagePlus className='w-6 h-6' />
                Add New Photo{uploadMode === "multiple" ? "s" : ""}
              </h1>
              <p className='text-black/90 mt-1'>
                Upload and manage your photo gallery
              </p>
            </div>

            <form onSubmit={handleSubmit} className='p-6 space-y-6'>
              {/* Upload Mode Toggle */}
              <div className='flex gap-2 p-1 bg-gray-100 rounded-lg w-fit'>
                <button
                  type='button'
                  onClick={() => {
                    setUploadMode("single");
                    setSelectedFiles([]);
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    uploadMode === "single"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Single Photo
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setUploadMode("multiple");
                    setSelectedFiles([]);
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    uploadMode === "multiple"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Multiple Photos
                </button>
              </div>

              {/* File Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#FF9933] transition-colors'
              >
                <Upload className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <div className='space-y-2'>
                  <p className='text-lg font-medium text-gray-700'>
                    Drop images here or click to upload
                  </p>
                  <p className='text-sm text-gray-500'>
                    {uploadMode === "single"
                      ? "Only One Image can be select"
                      : "Select up to 10 images"}
                  </p>
                  <button
                    type='button'
                    onClick={() => fileInputRef.current?.click()}
                    className='inline-flex items-center gap-2 px-4 py-2 bg-[#FF9933] text-white rounded-lg hover:bg-[#e8842e] transition-colors'
                  >
                    <ImagePlus className='w-4 h-4' />
                    Choose Files
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  multiple={uploadMode === "multiple"}
                  onChange={(e) =>
                    e.target.files && handleFileSelect(e.target.files)
                  }
                  className='hidden'
                />
              </div>

              {/* File Previews */}
              {selectedFiles.length > 0 && (
                <div className='space-y-4'>
                  <h3 className='font-medium text-gray-900'>Selected Images</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className='relative group bg-gray-50 rounded-lg overflow-hidden'
                      >
                        <img
                          src={file.preview}
                          alt={file.altText}
                          className='w-full h-32 object-cover'
                        />
                        <button
                          type='button'
                          onClick={() => removeFile(index)}
                          className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                        >
                          <X className='w-4 h-4' />
                        </button>
                        <div className='p-3'>
                          <input
                            type='text'
                            value={file.altText}
                            onChange={(e) =>
                              updateAltText(index, e.target.value)
                            }
                            placeholder='Alt text'
                            className='w-full text-xs border rounded px-2 py-1 focus:ring-1 focus:ring-[#FF9933] focus:border-[#FF9933]'
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Title */}
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <FileText className='w-4 h-4 inline mr-1' />
                    Title *
                  </label>
                  <input
                    type='text'
                    name='title'
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9933] focus:border-transparent'
                    placeholder='Enter photo title'
                  />
                </div>

                {/* Category with Add Button */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <Tag className='w-4 h-4 inline mr-1' />
                    Category *
                  </label>
                  <div className='flex gap-2'>
                    <select
                      name='category'
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      disabled={categoriesLoading}
                      className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9933] focus:border-transparent'
                    >
                      <option value=''>Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type='button'
                      onClick={() => setShowAddCategory(!showAddCategory)}
                      className='px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1'
                      title='Add new category'
                    >
                      <Plus className='w-4 h-4' />
                    </button>
                  </div>

                  {/* Add Category Input */}
                  {showAddCategory && (
                    <div className='mt-2 p-3 bg-gray-50 rounded-lg border'>
                      <div className='flex gap-2'>
                        <input
                          type='text'
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder='Enter category name'
                          className='flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500'
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleCreateCategory()
                          }
                        />
                        <button
                          type='button'
                          onClick={handleCreateCategory}
                          disabled={creatingCategory}
                          className='px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1'
                        >
                          {creatingCategory ? (
                            <Loader2 className='w-4 h-4 animate-spin' />
                          ) : (
                            <Check className='w-4 h-4' />
                          )}
                        </button>
                        <button
                          type='button'
                          onClick={() => {
                            setShowAddCategory(false);
                            setNewCategoryName("");
                          }}
                          className='px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors'
                        >
                          <X className='w-4 h-4' />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <Calendar className='w-4 h-4 inline mr-1' />
                    Date
                  </label>
                  <input
                    type='date'
                    name='date'
                    value={formData.date}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9933] focus:border-transparent'
                  />
                </div>

                {/* Location */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <MapPin className='w-4 h-4 inline mr-1' />
                    Location
                  </label>
                  <input
                    type='text'
                    name='location'
                    value={formData.location}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9933] focus:border-transparent'
                    placeholder='Enter location'
                  />
                </div>

                {/* Description */}
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Description
                  </label>
                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9933] focus:border-transparent'
                    placeholder='Enter description (optional)'
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className='flex flex-col sm:flex-row gap-3 pt-6 border-t'>
                <button
                  type='submit'
                  disabled={isUploading || selectedFiles.length === 0}
                  className='flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isUploading ? (
                    <>
                      <Loader2 className='w-5 h-5 animate-spin' />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className='w-5 h-5' />
                      Upload {uploadMode === "multiple" ? "Photos" : "Photo"}
                    </>
                  )}
                </button>

                <button
                  type='button'
                  onClick={() => navigate("/admin/photoDashboard")}
                  className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPhoto;
