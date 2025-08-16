import React, { useState } from "react";

import {
  TestimonialCreateRequest,
  WriteTestimonialProps,
} from "@/types/testimonial.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Send, Loader2 } from "lucide-react";
import { useCreateTestimonialMutation } from "@/redux-store/services/testimonialApi";
import Footer from "../Footer";
import { Header } from "../Header";

const WriteTestimonial: React.FC<WriteTestimonialProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [createTestimonial, { isLoading, isSuccess, error }] =
    useCreateTestimonialMutation();

  const [formData, setFormData] = useState<TestimonialCreateRequest>({
    quote: "",
    name: "",
    profession: "",
    rate: 0,
  });

  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [errors, setErrors] = useState<Partial<TestimonialCreateRequest>>({});

  const validateForm = () => {
    const newErrors: Partial<TestimonialCreateRequest> = {};

    if (!formData.quote.trim()) {
      newErrors.quote = "Quote is required";
    } else if (formData.quote.trim().length < 10) {
      newErrors.quote = "Quote must be at least 10 characters";
    } else if (formData.quote.trim().length > 1000) {
      newErrors.quote = "Quote cannot exceed 1000 characters";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Name cannot exceed 100 characters";
    }

    if (!formData.profession.trim()) {
      newErrors.profession = "Profession is required";
    } else if (formData.profession.trim().length < 2) {
      newErrors.profession = "Profession must be at least 2 characters";
    } else if (formData.profession.trim().length > 150) {
      newErrors.profession = "Profession cannot exceed 150 characters";
    }

    if (formData.rate === 0) {
      newErrors.rate = 1; // Use 1 as error indicator
    } else if (formData.rate < 1 || formData.rate > 5) {
      newErrors.rate = 1;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createTestimonial(formData).unwrap();
      // Reset form
      setFormData({ quote: "", name: "", profession: "", rate: 0 });
      setErrors({});
      onSuccess?.();
    } catch (err) {
      console.error("Failed to create testimonial:", err);
    }
  };

  const handleInputChange = (
    field: keyof TestimonialCreateRequest,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (hoveredStar || formData.rate);

      return (
        <button
          key={index}
          type='button'
          className={`text-2xl transition-colors duration-200 ${
            isFilled ? "text-yellow-400" : "text-gray-300"
          } hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded`}
          onClick={() => handleInputChange("rate", starValue)}
          onMouseEnter={() => setHoveredStar(starValue)}
          onMouseLeave={() => setHoveredStar(0)}
          aria-label={`Rate ${starValue} star${starValue !== 1 ? "s" : ""}`}
        >
          <Star className={`w-6 h-6 ${isFilled ? "fill-current" : ""}`} />
        </button>
      );
    });
  };

  return (
    <>
      <Header />
      <Card className='max-w-2xl mx-auto'>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-bold text-gray-900 dark:text-white'>
            Share Your Experience
          </CardTitle>
          <p className='text-center text-gray-600 dark:text-gray-300'>
            Help others by sharing your testimonial
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Quote Field */}
            <div className='space-y-2'>
              <Label htmlFor='quote' className='text-sm font-medium'>
                Your Testimonial <span className='text-red-500'>*</span>
              </Label>
              <Textarea
                id='quote'
                placeholder='Share your experience with us...'
                value={formData.quote}
                onChange={(e) => handleInputChange("quote", e.target.value)}
                className={`min-h-[120px] ${
                  errors.quote ? "border-red-500" : ""
                }`}
                maxLength={1000}
              />
              {errors.quote && (
                <p className='text-sm text-red-500'>{errors.quote}</p>
              )}
              <p className='text-xs text-gray-500'>
                {formData.quote.length}/1000 characters
              </p>
            </div>

            {/* Name Field */}
            <div className='space-y-2'>
              <Label htmlFor='name' className='text-sm font-medium'>
                Your Name <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='name'
                type='text'
                placeholder='Enter your full name'
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
                maxLength={100}
              />
              {errors.name && (
                <p className='text-sm text-red-500'>{errors.name}</p>
              )}
            </div>

            {/* Profession Field */}
            <div className='space-y-2'>
              <Label htmlFor='profession' className='text-sm font-medium'>
                Your Profession <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='profession'
                type='text'
                placeholder='e.g., Software Engineer, Teacher, Student'
                value={formData.profession}
                onChange={(e) =>
                  handleInputChange("profession", e.target.value)
                }
                className={errors.profession ? "border-red-500" : ""}
                maxLength={150}
              />
              {errors.profession && (
                <p className='text-sm text-red-500'>{errors.profession}</p>
              )}
            </div>

            {/* Rating Field */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>
                Your Rating <span className='text-red-500'>*</span>
              </Label>
              <div className='flex items-center gap-1'>
                {renderStars()}
                {formData.rate > 0 && (
                  <span className='ml-2 text-sm text-gray-600 dark:text-gray-400'>
                    {formData.rate} star{formData.rate !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {errors.rate && (
                <p className='text-sm text-red-500'>Please select a rating</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
                <p className='text-sm text-red-600'>
                  {"data" in error &&
                  error.data &&
                  typeof error.data === "object" &&
                  "message" in error.data
                    ? String(error.data.message)
                    : "Failed to submit testimonial. Please try again."}
                </p>
              </div>
            )}

            {/* Success Message */}
            {isSuccess && (
              <div className='p-3 bg-green-50 border border-green-200 rounded-md'>
                <p className='text-sm text-green-600'>
                  Thank you! Your testimonial has been submitted successfully.
                  It will appear on our website within the next 4 hours after
                  review.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex gap-3 pt-4'>
              <Button
                type='submit'
                disabled={isLoading}
                className='flex-1 bg-gray-600 hover:bg-orange-500 text-white'
              >
                {isLoading ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className='w-4 h-4 mr-2' />
                    Submit Testimonial
                  </>
                )}
              </Button>

              {onCancel && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={onCancel}
                  disabled={isLoading}
                  className='px-6'
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <Footer />
    </>
  );
};

export default WriteTestimonial;
