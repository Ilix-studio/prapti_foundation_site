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
} from "lucide-react";

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after success
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
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
                  <p className='text-gray-600'>contact@prapti-foundation.com</p>
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
                  <p className='text-gray-600'>Golaghat, Assam , India.</p>
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

              {isSubmitted ? (
                <div className='text-center py-8'>
                  <CheckCircle className='h-16 w-16 text-green-500 mx-auto mb-4' />
                  <h4 className='text-xl font-semibold text-gray-900 mb-2'>
                    Message Sent!
                  </h4>
                  <p className='text-gray-600'>
                    Thank you for contacting us. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='name'>Name</Label>
                      <Input
                        id='name'
                        name='name'
                        placeholder='Your name'
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className='border-gray-200 focus:border-orange-300 focus:ring-orange-200'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input
                        id='email'
                        name='email'
                        type='email'
                        placeholder='Your email'
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className='border-gray-200 focus:border-orange-300 focus:ring-orange-200'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='subject'>Subject</Label>
                    <Input
                      id='subject'
                      name='subject'
                      placeholder='Message subject'
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className='border-gray-200 focus:border-orange-300 focus:ring-orange-200'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='message'>Message</Label>
                    <Textarea
                      id='message'
                      name='message'
                      placeholder='Your message'
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className='border-gray-200 focus:border-orange-300 focus:ring-orange-200 resize-none'
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className='w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-medium'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Sending Message...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
