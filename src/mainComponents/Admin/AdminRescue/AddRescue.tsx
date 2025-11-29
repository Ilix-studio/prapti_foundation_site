import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateRescuePostMutation } from "@/redux-store/services/rescueApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X, Save } from "lucide-react";
import toast from "react-hot-toast";
import { BackNavigation } from "@/config/navigation/BackNavigation";

interface ImagePreview {
  file: File | null;
  preview: string;
}

export default function AddRescue() {
  const navigate = useNavigate();
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [beforeImage, setBeforeImage] = useState<ImagePreview>({
    file: null,
    preview: "",
  });

  const [afterImage, setAfterImage] = useState<ImagePreview>({
    file: null,
    preview: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createRescuePost, { isLoading }] = useCreateRescuePostMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "before" | "after"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        [type]: "Please select an image file",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [type]: "Image size must be less than 5MB",
      }));
      return;
    }

    const preview = URL.createObjectURL(file);
    const imageState = { file, preview };

    if (type === "before") {
      if (beforeImage.preview) URL.revokeObjectURL(beforeImage.preview);
      setBeforeImage(imageState);
      setErrors((prev) => ({ ...prev, before: "" }));
    } else {
      if (afterImage.preview) URL.revokeObjectURL(afterImage.preview);
      setAfterImage(imageState);
      setErrors((prev) => ({ ...prev, after: "" }));
    }
  };

  const removeImage = (type: "before" | "after") => {
    if (type === "before") {
      if (beforeImage.preview) URL.revokeObjectURL(beforeImage.preview);
      setBeforeImage({ file: null, preview: "" });
      if (beforeInputRef.current) beforeInputRef.current.value = "";
    } else {
      if (afterImage.preview) URL.revokeObjectURL(afterImage.preview);
      setAfterImage({ file: null, preview: "" });
      if (afterInputRef.current) afterInputRef.current.value = "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!beforeImage.file) {
      newErrors.before = "Before image is required";
    }

    if (!afterImage.file) {
      newErrors.after = "After image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("description", form.description.trim());
    formData.append("beforeImage", beforeImage.file!);
    formData.append("afterImage", afterImage.file!);

    try {
      await createRescuePost(formData).unwrap();
      toast.success("Rescue post created successfully!");
      navigate("/admin/rescueDash");
    } catch (error: any) {
      console.error("Failed to create rescue post:", error);
      toast.error(error?.data?.message || "Failed to create rescue post");
    }
  };

  const handleCancel = () => {
    if (form.title || form.description || beforeImage.file || afterImage.file) {
      if (window.confirm("Discard changes?")) {
        navigate("/admin/rescueDash");
      }
    } else {
      navigate("/admin/rescueDash");
    }
  };

  return (
    <>
      <BackNavigation />

      <div className='container mx-auto p-6 max-w-4xl'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-2xl font-bold mb-6'>Add Rescue Post</h2>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Title */}
            <div>
              <Label htmlFor='title'>
                Title <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='title'
                name='title'
                value={form.title}
                onChange={handleChange}
                placeholder='Enter rescue post title'
                className={errors.title ? "border-red-500" : ""}
                maxLength={200}
              />
              {errors.title && (
                <p className='text-red-500 text-sm mt-1'>{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor='description'>
                Description <span className='text-red-500'>*</span>
              </Label>
              <Textarea
                id='description'
                name='description'
                value={form.description}
                onChange={handleChange}
                placeholder='Describe the rescue story...'
                rows={6}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.description}
                </p>
              )}
            </div>

            {/* Before Image */}
            <div>
              <Label>
                Before Image <span className='text-red-500'>*</span>
              </Label>
              <div className='mt-2'>
                <input
                  ref={beforeInputRef}
                  type='file'
                  accept='image/*'
                  onChange={(e) => handleImageSelect(e, "before")}
                  className='hidden'
                  id='before-image-input'
                />
                {!beforeImage.preview ? (
                  <label htmlFor='before-image-input'>
                    <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors'>
                      <Upload className='mx-auto h-12 w-12 text-gray-400' />
                      <p className='mt-2 text-sm text-gray-600'>
                        Click to upload before image
                      </p>
                      <p className='text-xs text-gray-500 mt-1'>
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className='relative'>
                    <img
                      src={beforeImage.preview}
                      alt='Before preview'
                      className='w-full h-64 object-cover rounded-lg'
                    />
                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
                      className='absolute top-2 right-2'
                      onClick={() => removeImage("before")}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                )}
                {errors.before && (
                  <p className='text-red-500 text-sm mt-1'>{errors.before}</p>
                )}
              </div>
            </div>

            {/* After Image */}
            <div>
              <Label>
                After Image <span className='text-red-500'>*</span>
              </Label>
              <div className='mt-2'>
                <input
                  ref={afterInputRef}
                  type='file'
                  accept='image/*'
                  onChange={(e) => handleImageSelect(e, "after")}
                  className='hidden'
                  id='after-image-input'
                />
                {!afterImage.preview ? (
                  <label htmlFor='after-image-input'>
                    <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors'>
                      <Upload className='mx-auto h-12 w-12 text-gray-400' />
                      <p className='mt-2 text-sm text-gray-600'>
                        Click to upload after image
                      </p>
                      <p className='text-xs text-gray-500 mt-1'>
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className='relative'>
                    <img
                      src={afterImage.preview}
                      alt='After preview'
                      className='w-full h-64 object-cover rounded-lg'
                    />
                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
                      className='absolute top-2 right-2'
                      onClick={() => removeImage("after")}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                )}
                {errors.after && (
                  <p className='text-red-500 text-sm mt-1'>{errors.after}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className='flex gap-4 pt-4'>
              <Button type='submit' disabled={isLoading} className='flex-1'>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className='mr-2 h-4 w-4' />
                    Create Rescue Post
                  </>
                )}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
