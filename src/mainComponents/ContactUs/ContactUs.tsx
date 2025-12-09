import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSendContactMessageMutation } from "@/redux-store/services/contactApi";
import { useRecaptchaV2 } from "@/hooks/useRecaptchaV2";
import toast from "react-hot-toast";
import Footer from "../Footer";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactUs: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sendContactMessage, { isLoading, isSuccess, error }] =
    useSendContactMessageMutation();

  const { containerRef, render, reset, getToken } = useRecaptchaV2();
  const isDevelopment = import.meta.env.VITE_NODE_ENV === "development";

  // Initialize reCAPTCHA
  useEffect(() => {
    if (!isDevelopment) {
      const timer = setTimeout(() => {
        render(
          undefined,
          () => toast.error("reCAPTCHA expired, please try again"),
          () => toast.error("reCAPTCHA error, please reload")
        );
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [render, isDevelopment]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      return;
    }

    let recaptchaToken: string | null = null;

    if (!isDevelopment) {
      recaptchaToken = getToken();
      if (!recaptchaToken) {
        toast.error("Please complete the reCAPTCHA verification");
        return;
      }
    }

    try {
      await sendContactMessage({
        ...formData,
        recaptchaToken: recaptchaToken || "dev-bypass",
      }).unwrap();

      setFormData({ name: "", email: "", subject: "", message: "" });
      if (!isDevelopment) reset();
    } catch (err) {
      console.error("Failed to send message:", err);
      if (!isDevelopment) reset();
    }
  };

  const getErrorMessage = () => {
    if (error) {
      if ("data" in error) {
        return (error.data as any)?.message || "Failed to send message";
      }
      return "Network error. Please try again.";
    }
    return "";
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = async () => {
    const shareData = {
      title: "Contact Prapti Foundation",
      text: "Get in touch with Prapti Foundation - helping stray dogs in Golaghat, Assam",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <>
      {/* Custom Header */}
      <header className='sticky top-0 z-50 bg-white border-b shadow-sm'>
        <div className='container mx-auto px-4 py-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleBack}
                className='hover:bg-orange-50'
              >
                <ArrowLeft className='h-5 w-5 text-orange-600' />
                <span className='sr-only'>Go back</span>
              </Button>
              <div>
                <h1 className='text-xl font-semibold text-gray-900'>
                  Contact Us
                </h1>
                <p className='text-sm text-gray-500'>
                  Get in touch with our team
                </p>
              </div>
            </div>

            <Button
              variant='outline'
              size='sm'
              onClick={handleShare}
              className='border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300'
            >
              <Share2 className='h-4 w-4 mr-2' />
              Share
            </Button>
          </div>
        </div>
      </header>

      <section className='w-full py-12 md:py-24 lg:py-32 bg-gray-50'>
        <div className='container px-4 md:px-6'>
          <div className='grid gap-12 lg:grid-cols-2 lg:gap-16'>
            {/* Left Column - Contact Information */}
            <div className='space-y-8'>
              <div className='space-y-4'>
                <Badge className='bg-green-100 text-green-700 border-green-200 hover:bg-green-200'>
                  Get in Touch
                </Badge>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                  Connect With Us
                </h2>
                <p className='text-gray-600 text-lg'>
                  Have questions or suggestions? Reach out to our office. We're
                  here to listen and assist.
                </p>
              </div>

              {/* Contact Details */}
              <div className='space-y-6'>
                <div className='flex items-start gap-4 p-4 rounded-lg bg-white shadow-sm border'>
                  <div className='p-2 rounded-full bg-orange-100'>
                    <Mail className='h-5 w-5 text-orange-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>Email</h3>
                    <p className='text-gray-600'>
                      contact@prapti-foundation.com
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4 p-4 rounded-lg bg-white shadow-sm border'>
                  <div className='p-2 rounded-full bg-orange-100'>
                    <Phone className='h-5 w-5 text-orange-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>Phone</h3>
                    <p className='text-gray-600'>+91 98765 43210</p>
                  </div>
                </div>

                <div className='flex items-start gap-4 p-4 rounded-lg bg-white shadow-sm border'>
                  <div className='p-2 rounded-full bg-orange-100'>
                    <MapPin className='h-5 w-5 text-orange-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      Office Address
                    </h3>
                    <p className='text-gray-600'>Golaghat, Assam, India.</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className='flex gap-4'>
                <Button
                  variant='outline'
                  size='icon'
                  className='rounded-full border-orange-200 hover:bg-orange-50 hover:border-orange-300'
                >
                  <Facebook className='h-4 w-4 text-orange-600' />
                  <span className='sr-only'>Facebook</span>
                </Button>
                <Button
                  variant='outline'
                  size='icon'
                  className='rounded-full border-orange-200 hover:bg-orange-50 hover:border-orange-300'
                >
                  <Twitter className='h-4 w-4 text-orange-600' />
                  <span className='sr-only'>Twitter</span>
                </Button>
                <Button
                  variant='outline'
                  size='icon'
                  className='rounded-full border-orange-200 hover:bg-orange-50 hover:border-orange-300'
                >
                  <Instagram className='h-4 w-4 text-orange-600' />
                  <span className='sr-only'>Instagram</span>
                </Button>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className='bg-white rounded-2xl shadow-lg p-6 md:p-8'>
              <div className='space-y-6'>
                <h3 className='text-2xl font-bold text-gray-900'>
                  Send a Message
                </h3>

                {/* Success Message */}
                {isSuccess && (
                  <div className='text-center py-4'>
                    <CheckCircle className='h-12 w-12 text-green-500 mx-auto mb-3' />
                    <h4 className='text-lg font-semibold text-gray-900 mb-2'>
                      Message Sent Successfully!
                    </h4>
                    <p className='text-gray-600'>
                      Thank you for contacting us. We'll get back to you soon.
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className='p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3'>
                    <AlertCircle className='h-5 w-5 text-red-500 mt-0.5' />
                    <div>
                      <p className='text-red-600 font-medium'>
                        Failed to send message
                      </p>
                      <p className='text-red-600/70 text-sm'>
                        {getErrorMessage()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='name'>Name *</Label>
                      <Input
                        id='name'
                        name='name'
                        placeholder='Your name'
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        className='border-gray-200 focus:border-orange-300 focus:ring-orange-200'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email *</Label>
                      <Input
                        id='email'
                        name='email'
                        type='email'
                        placeholder='Your email'
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        className='border-gray-200 focus:border-orange-300 focus:ring-orange-200'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='subject'>Subject *</Label>
                    <Input
                      id='subject'
                      name='subject'
                      placeholder='Message subject'
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className='border-gray-200 focus:border-orange-300 focus:ring-orange-200'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='message'>Message *</Label>
                    <Textarea
                      id='message'
                      name='message'
                      placeholder='Your message'
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      disabled={isLoading}
                      className='border-gray-200 focus:border-orange-300 focus:ring-orange-200 resize-none'
                    />
                  </div>

                  {/* reCAPTCHA - production only */}
                  {!isDevelopment && (
                    <div className='flex justify-center py-2'>
                      <div ref={containerRef} />
                    </div>
                  )}

                  {/* Development indicator */}
                  {isDevelopment && (
                    <div className='text-sm text-yellow-600 bg-yellow-50 p-3 rounded border border-yellow-200'>
                      <strong>Development Mode:</strong> reCAPTCHA bypassed
                    </div>
                  )}

                  <Button
                    type='submit'
                    className='w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-medium'
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Sending Message...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ContactUs;
