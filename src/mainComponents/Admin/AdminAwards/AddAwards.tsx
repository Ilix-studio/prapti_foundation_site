import {
  useUploadAwardMutation,
  useUploadMultipleAwardsMutation,
} from "@/redux-store/services/awardApi";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { BackNavigation } from "@/config/navigation/BackNavigation";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
} from "@/redux-store/services/categoryApi";
import { Category } from "@/types/category.types";

interface FilePreview {
  file: File;
  preview: string;
  altText: string;
}

export default function AddAwards() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
  const [uploadMode, setUploadMode] = useState<"single" | "multiple">("single");
  const [error, setError] = useState<string | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [uploadAward, { isLoading: uploadingSingle }] =
    useUploadAwardMutation();
  const [uploadMultipleAwards, { isLoading: uploadingMultiple }] =
    useUploadMultipleAwardsMutation();
  const [createCategory, { isLoading: creatingCategory }] =
    useCreateCategoryMutation();

  const isUploading = uploadingSingle || uploadingMultiple;

  // Fetch all categories and filter for award type only
  const { data: allCategories = [] } = useGetAllCategoriesQuery();

  const awardCategories = useMemo(
    () => allCategories.filter((cat: Category) => cat.type === "award"),
    [allCategories]
  );

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const handleFileSelect = useCallback(
    (files: FileList) => {
      const newFiles: FilePreview[] = [];

      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const preview = URL.createObjectURL(file);
          newFiles.push({
            file,
            preview,
            altText: form.title || file.name.split(".")[0],
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
    [uploadMode, form.title]
  );

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

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index].preview);
      return updated;
    });
  };

  const updateAltText = (index: number, altText: string) => {
    setSelectedFiles((prev) =>
      prev.map((file, i) => (i === index ? { ...file, altText } : file))
    );
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Please enter a category name");
      return;
    }

    try {
      const result = await createCategory({
        name: newCategoryName.trim(),
        type: "award",
      }).unwrap();

      setNewCategoryName("");
      setShowAddCategory(false);
      setForm((prev) => ({ ...prev, category: result._id }));
      toast.success("Category created successfully");
    } catch (err: any) {
      setError(
        err?.data?.message || err?.message || "Failed to create category"
      );
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      if (!form.title.trim() || !form.description.trim() || !form.category) {
        setError("All fields are required");
        return;
      }

      if (selectedFiles.length === 0) {
        setError("Please select at least one image");
        return;
      }

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);

      if (uploadMode === "single") {
        formData.append("alt", selectedFiles[0].altText);
        formData.append("image", selectedFiles[0].file);
        await uploadAward(formData).unwrap();
      } else {
        selectedFiles.forEach((file, index) => {
          formData.append("images", file.file);
          formData.append(`altTexts[${index}]`, file.altText);
        });
        await uploadMultipleAwards(formData).unwrap();
      }

      toast.success("Award created successfully");

      setForm({
        title: "",
        description: "",
        category: "",
      });
      setSelectedFiles([]);

      setTimeout(() => navigate("/admin/awardDash"), 1500);
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || "Failed to create award. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error creating award:", err);
    }
  }

  return (
    <>
      <BackNavigation />
      <div className='min-h-screen bg-gray-50'>
        <div className='bg-white'>
          <div className='container mx-auto px-4 py-4 flex'>
            <div className='flex items-center gap-2'>
              <h1 className='text-2xl font-bold'>Add New Award</h1>
            </div>
          </div>
        </div>

        <main className='container mx-auto px-4 py-8'>
          <div className='max-w-3xl mx-auto bg-white rounded-lg shadow p-6'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {error && (
                <div className='bg-red-50 text-red-500 p-3 rounded-md text-sm'>
                  {error}
                </div>
              )}

              <div className='space-y-2'>
                <Label htmlFor='title'>Title *</Label>
                <Input
                  id='title'
                  name='title'
                  value={form.title}
                  onChange={handleChange}
                  placeholder='Enter award title'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Description *</Label>
                <Textarea
                  id='description'
                  name='description'
                  value={form.description}
                  onChange={handleChange}
                  placeholder='Enter award description'
                  rows={4}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='category'>Category *</Label>
                <div className='flex gap-2'>
                  <select
                    id='category'
                    name='category'
                    value={form.category}
                    onChange={handleChange}
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500'
                    required
                  >
                    <option value=''>Select a category</option>
                    {awardCategories.map((cat: Category) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setShowAddCategory(!showAddCategory)}
                    className='whitespace-nowrap'
                  >
                    + New
                  </Button>
                </div>

                {showAddCategory && (
                  <div className='flex gap-2 mt-2'>
                    <Input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder='Enter new category name'
                    />
                    <Button
                      type='button'
                      onClick={handleCreateCategory}
                      disabled={creatingCategory}
                    >
                      {creatingCategory ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Creating...
                        </>
                      ) : (
                        "Create"
                      )}
                    </Button>
                  </div>
                )}
              </div>

              <div className='space-y-2'>
                <Label>Upload Mode *</Label>
                <div className='flex gap-4'>
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      value='single'
                      checked={uploadMode === "single"}
                      onChange={(e) =>
                        setUploadMode(e.target.value as "single" | "multiple")
                      }
                    />
                    <span className='text-sm'>Single Image</span>
                  </label>
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      value='multiple'
                      checked={uploadMode === "multiple"}
                      onChange={(e) =>
                        setUploadMode(e.target.value as "single" | "multiple")
                      }
                    />
                    <span className='text-sm'>Multiple Images</span>
                  </label>
                </div>
              </div>

              <div className='space-y-2'>
                <Label>Images *</Label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 transition-colors'
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className='h-8 w-8 text-gray-400 mx-auto mb-2' />
                  <p className='text-sm text-gray-600'>
                    Drag and drop images here or click to select
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>
                    {uploadMode === "single"
                      ? "Single image allowed"
                      : "Up to 10 images allowed"}
                  </p>
                  <input
                    ref={fileInputRef}
                    type='file'
                    multiple={uploadMode === "multiple"}
                    accept='image/*'
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFileSelect(e.target.files);
                      }
                    }}
                    className='hidden'
                  />
                </div>

                {selectedFiles.length > 0 && (
                  <div className='space-y-3 mt-4'>
                    <p className='text-sm font-medium'>
                      Selected Images ({selectedFiles.length})
                    </p>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className='relative bg-gray-100 rounded-lg overflow-hidden'
                        >
                          <img
                            src={file.preview}
                            alt={file.altText}
                            className='w-full h-32 object-cover'
                          />
                          <div className='absolute top-2 right-2'>
                            <Button
                              type='button'
                              size='sm'
                              variant='destructive'
                              onClick={() => removeFile(index)}
                              className='h-6 w-6 p-0'
                            >
                              <X className='h-4 w-4' />
                            </Button>
                          </div>
                          <input
                            type='text'
                            value={file.altText}
                            onChange={(e) =>
                              updateAltText(index, e.target.value)
                            }
                            placeholder='Alt text'
                            className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 placeholder-gray-300'
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className='flex justify-end gap-3 pt-4 border-t'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => navigate("/admin/awardDash")}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className='mr-2 h-4 w-4' />
                      Create Award
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
