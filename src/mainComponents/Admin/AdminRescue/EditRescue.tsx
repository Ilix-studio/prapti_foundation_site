import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import {
  useGetRescuePostByIdQuery,
  useUpdateRescuePostMutation,
} from "@/redux-store/services/rescueApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, Loader2, AlertCircle, Upload, X } from "lucide-react";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import { BackNavigation } from "@/config/navigation/BackNavigation";
import toast from "react-hot-toast";

interface RescueFormData {
  title: string;
  description: string;
}

interface ImageState {
  type: "before" | "after";
  currentUrl: string;
  newFile: File | null;
  newPreview: string;
}

const EditRescue = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<RescueFormData>({
    title: "",
    description: "",
  });

  const [beforeImage, setBeforeImage] = useState<ImageState>({
    type: "before",
    currentUrl: "",
    newFile: null,
    newPreview: "",
  });

  const [afterImage, setAfterImage] = useState<ImageState>({
    type: "after",
    currentUrl: "",
    newFile: null,
    newPreview: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  if (!id) {
    return <Navigate to='/admin/rescueDashboard' />;
  }

  const {
    data: rescueData,
    isLoading: loadingRescue,
    error: rescueError,
  } = useGetRescuePostByIdQuery(id);

  const [updateRescuePost, { isLoading: updating }] =
    useUpdateRescuePostMutation();

  useEffect(() => {
    if (rescueData?.data) {
      setFormData({
        title: rescueData.data.title,
        description: rescueData.data.description,
      });
      setBeforeImage((prev) => ({
        ...prev,
        currentUrl: rescueData.data.beforeImage,
      }));
      setAfterImage((prev) => ({
        ...prev,
        currentUrl: rescueData.data.afterImage,
      }));
    }
  }, [rescueData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
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

    if (type === "before") {
      if (beforeImage.newPreview) URL.revokeObjectURL(beforeImage.newPreview);
      setBeforeImage((prev) => ({
        ...prev,
        newFile: file,
        newPreview: preview,
      }));
    } else {
      if (afterImage.newPreview) URL.revokeObjectURL(afterImage.newPreview);
      setAfterImage((prev) => ({
        ...prev,
        newFile: file,
        newPreview: preview,
      }));
    }

    setHasChanges(true);
    setErrors((prev) => ({ ...prev, [type]: "" }));
  };

  const removeNewImage = (type: "before" | "after") => {
    if (type === "before") {
      if (beforeImage.newPreview) URL.revokeObjectURL(beforeImage.newPreview);
      setBeforeImage((prev) => ({
        ...prev,
        newFile: null,
        newPreview: "",
      }));
      if (beforeInputRef.current) beforeInputRef.current.value = "";
    } else {
      if (afterImage.newPreview) URL.revokeObjectURL(afterImage.newPreview);
      setAfterImage((prev) => ({
        ...prev,
        newFile: null,
        newPreview: "",
      }));
      if (afterInputRef.current) afterInputRef.current.value = "";
    }
    setHasChanges(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all errors");
      return;
    }

    try {
      // Update text fields first (if no images changed)
      if (!beforeImage.newFile && !afterImage.newFile) {
        const updateFormData = new FormData();
        updateFormData.append("title", formData.title.trim());
        updateFormData.append("description", formData.description.trim());

        await updateRescuePost({ id: id!, formData: updateFormData }).unwrap();
      }

      // Update before image
      if (beforeImage.newFile) {
        const beforeFormData = new FormData();
        beforeFormData.append("title", formData.title.trim());
        beforeFormData.append("description", formData.description.trim());
        beforeFormData.append("imageAction", "add");
        beforeFormData.append("imageType", "before");
        beforeFormData.append("image", beforeImage.newFile);

        await updateRescuePost({ id: id!, formData: beforeFormData }).unwrap();
      }

      // Update after image
      if (afterImage.newFile) {
        const afterFormData = new FormData();
        afterFormData.append("title", formData.title.trim());
        afterFormData.append("description", formData.description.trim());
        afterFormData.append("imageAction", "add");
        afterFormData.append("imageType", "after");
        afterFormData.append("image", afterImage.newFile);

        await updateRescuePost({ id: id!, formData: afterFormData }).unwrap();
      }

      toast.success("Rescue post updated successfully!");
      navigate("/admin/rescueDashboard");
    } catch (error: any) {
      console.error("Failed to update rescue post:", error);
      const errorMessage =
        error?.data?.message || "Failed to update rescue post";
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm("Discard changes?")) {
        navigate("/admin/rescueDashboard");
      }
    } else {
      navigate("/admin/rescueDashboard");
    }
  };

  if (loadingRescue) {
    return (
      <div className='container mx-auto p-6 max-w-4xl'>
        <Skeleton className='h-8 w-48 mb-6' />
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-32' />
          </CardHeader>
          <CardContent className='space-y-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-32 w-full' />
            <Skeleton className='h-48 w-full' />
            <Skeleton className='h-48 w-full' />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (rescueError) {
    return (
      <div className='container mx-auto p-6 max-w-4xl'>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Failed to load rescue post. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <BackNavigation />
      <div className='container mx-auto p-6 max-w-4xl'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-2xl font-bold mb-6'>Edit Rescue Post</h2>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {errors.submit && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            {/* Title */}
            <div>
              <Label htmlFor='title'>
                Title <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='title'
                name='title'
                value={formData.title}
                onChange={handleChange}
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
                value={formData.description}
                onChange={handleChange}
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
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Before Image</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Current Image */}
                <div>
                  <Label className='text-sm text-gray-600 mb-2 block'>
                    Current Image
                  </Label>
                  <img
                    src={beforeImage.currentUrl}
                    alt='Current before'
                    className='w-full h-64 object-cover rounded-lg'
                  />
                </div>

                {/* New Image Upload */}
                <div>
                  <Label className='text-sm text-gray-600 mb-2 block'>
                    Replace Image (Optional)
                  </Label>
                  <input
                    ref={beforeInputRef}
                    type='file'
                    accept='image/*'
                    onChange={(e) => handleImageSelect(e, "before")}
                    className='hidden'
                    id='before-input'
                  />
                  {!beforeImage.newPreview ? (
                    <label htmlFor='before-input'>
                      <div className='border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-gray-400'>
                        <Upload className='mx-auto h-8 w-8 text-gray-400' />
                        <p className='text-sm text-gray-600 mt-2'>
                          Click to upload new before image
                        </p>
                      </div>
                    </label>
                  ) : (
                    <div className='relative'>
                      <img
                        src={beforeImage.newPreview}
                        alt='New before preview'
                        className='w-full h-64 object-cover rounded-lg'
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='icon'
                        className='absolute top-2 right-2'
                        onClick={() => removeNewImage("before")}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  )}
                  {errors.before && (
                    <p className='text-red-500 text-sm mt-1'>{errors.before}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* After Image */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>After Image</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Current Image */}
                <div>
                  <Label className='text-sm text-gray-600 mb-2 block'>
                    Current Image
                  </Label>
                  <img
                    src={afterImage.currentUrl}
                    alt='Current after'
                    className='w-full h-64 object-cover rounded-lg'
                  />
                </div>

                {/* New Image Upload */}
                <div>
                  <Label className='text-sm text-gray-600 mb-2 block'>
                    Replace Image (Optional)
                  </Label>
                  <input
                    ref={afterInputRef}
                    type='file'
                    accept='image/*'
                    onChange={(e) => handleImageSelect(e, "after")}
                    className='hidden'
                    id='after-input'
                  />
                  {!afterImage.newPreview ? (
                    <label htmlFor='after-input'>
                      <div className='border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-gray-400'>
                        <Upload className='mx-auto h-8 w-8 text-gray-400' />
                        <p className='text-sm text-gray-600 mt-2'>
                          Click to upload new after image
                        </p>
                      </div>
                    </label>
                  ) : (
                    <div className='relative'>
                      <img
                        src={afterImage.newPreview}
                        alt='New after preview'
                        className='w-full h-64 object-cover rounded-lg'
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='icon'
                        className='absolute top-2 right-2'
                        onClick={() => removeNewImage("after")}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  )}
                  {errors.after && (
                    <p className='text-red-500 text-sm mt-1'>{errors.after}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className='p-4 space-y-3'>
                <Button
                  type='submit'
                  className='w-full bg-orange-500 hover:bg-orange-600'
                  disabled={updating || !hasChanges}
                >
                  {updating ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className='mr-2 h-4 w-4' />
                      Save Changes
                    </>
                  )}
                </Button>

                <Button
                  type='button'
                  variant='outline'
                  onClick={handleCancel}
                  disabled={updating}
                  className='w-full'
                >
                  Cancel
                </Button>

                {hasChanges && (
                  <p className='text-sm text-amber-600 text-center'>
                    You have unsaved changes
                  </p>
                )}
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditRescue;
