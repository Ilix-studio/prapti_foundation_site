import React, { useState } from "react";
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
} from "lucide-react";
import { useSendContactMessageMutation } from "@/redux-store/services/contactApi";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const SmallContactSec = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sendContactMessage, { isLoading, isSuccess, error }] =
    useSendContactMessageMutation();

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

    try {
      await sendContactMessage(formData).unwrap();
      // Reset form on success
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      // Error is handled by RTK Query
      console.error("Failed to send message:", err);
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

  return (
    <>
      {/* contact section  */}
      <section
        className='w-full py-12 md:py-24 lg:py-32 bg-gray-50'
        id='contact'
      >
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
            </div>

            {/* Right Column - Contact Form */}
            <div className='space-y-6'>
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
        </div>
      </section>

      {/* Map Section */}
      <section className='w-full py-12 md:py-16'>
        <div className='container px-4 md:px-6'>
          <div className='bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row min-h-[400px]'>
            <div className='p-6 md:p-8 flex-1 flex flex-col justify-center space-y-6'>
              <div className='space-y-4'>
                <h3 className='text-2xl md:text-3xl font-bold text-gray-900'>
                  Find Us Here
                </h3>
                <p className='text-gray-600 text-base md:text-lg'>
                  Visit our office in Golaghat, Assam
                </p>
              </div>

              <div className='flex items-center gap-3 text-orange-600'>
                <div className='p-2 rounded-full bg-orange-100'>
                  <MapPin className='h-5 w-5' />
                </div>
                <span className='font-medium'>View on Map</span>
                <svg
                  className='h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
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
            <div className='flex-1 min-h-[300px] md:min-h-[400px] relative'>
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230070.3027768717!2d93.77686299999999!3d26.1628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3744e91a4c23e5b9%3A0x2b64c8b0e4b8f0c9!2sGolaghat%2C%20Assam!5e0!3m2!1sen!2sin!4v1680000000000'
                width='100%'
                height='100%'
                style={{ border: 0 }}
                allowFullScreen={false}
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                title='Prapti Foundation Office Location'
                className='absolute inset-0'
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SmallContactSec;
