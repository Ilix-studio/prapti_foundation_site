import React, { useState, useCallback } from "react";
import { useGoogleReCaptcha } from "@wojtekmaj/react-recaptcha-v3";
import { Header } from "@/mainComponents/Header";
import Footer from "@/mainComponents/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Heart,
  Calendar,
  Clock,
  Star,
  ThumbsUp,
  Users,
  Droplet,
  Paintbrush,
  Camera,
  Car,
  Megaphone,
  BookOpen,
  Check,
  AlertCircle,
  PawPrint,
} from "lucide-react";
import values from "../../assets/values.png";
import { useSubmitVolunteerApplicationMutation } from "@/redux-store/services/volunteerApi";
import toast from "react-hot-toast";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  availability: string;
  interests: string[];
  experience: string;
  reason: string;
}

const VolunteerPage: React.FC = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    availability: "",
    interests: [],
    experience: "",
    reason: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});

  const [submitVolunteerApplication, { isLoading, isSuccess, error }] =
    useSubmitVolunteerApplicationMutation();

  const scrollToForm = () => {
    const formSection = document.getElementById("volunteer-form");
    if (formSection) {
      formSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name as keyof FormData]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name as keyof FormData]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const newInterests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];

      return {
        ...prev,
        interests: newInterests,
      };
    });

    if (validationErrors.interests) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.interests;
        return newErrors;
      });
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Call validateForm inline to avoid stale closure
      const errors: Partial<Record<keyof FormData, string>> = {};

      if (!formData.firstName.trim())
        errors.firstName = "First name is required";
      if (!formData.lastName.trim()) errors.lastName = "Last name is required";
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (
        !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
      ) {
        errors.email = "Invalid email format";
      }
      if (!formData.phone.trim()) {
        errors.phone = "Phone number is required";
      } else if (!/^[\+]?[0-9]{10,15}$/.test(formData.phone)) {
        errors.phone = "Invalid phone number";
      }
      if (!formData.address.trim()) errors.address = "Address is required";
      if (!formData.district.trim()) errors.district = "District is required";
      if (!formData.state.trim()) errors.state = "State is required";
      if (!formData.pincode.trim()) {
        errors.pincode = "Pincode is required";
      } else if (!/^[0-9]{6,7}$/.test(formData.pincode)) {
        errors.pincode = "Invalid pincode";
      }
      if (!formData.availability)
        errors.availability = "Availability is required";
      if (formData.interests.length === 0) {
        errors.interests = "Select at least one interest";
      }
      if (!formData.reason.trim()) errors.reason = "Reason is required";

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        const firstErrorField = Object.keys(errors)[0];
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      if (!executeRecaptcha) {
        toast.error("reCAPTCHA not ready. Please try again.");
        return;
      }

      try {
        const token = await executeRecaptcha("volunteer_application");

        if (!token) {
          toast.error("reCAPTCHA verification failed");
          return;
        }

        await submitVolunteerApplication({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: parseInt(formData.phone.trim(), 10),
          address: formData.address.trim(),
          district: formData.district.trim(),
          state: formData.state.trim(),
          pincode: parseInt(formData.pincode, 10),
          availability: formData.availability,
          interests: formData.interests,
          experience: formData.experience.trim(),
          reason: formData.reason.trim(),
          recaptchaToken: token,
        }).unwrap();

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          district: "",
          state: "",
          pincode: "",
          availability: "",
          interests: [],
          experience: "",
          reason: "",
        });

        toast.success("Application submitted successfully!");

        setTimeout(() => {
          const formSection = document.getElementById("volunteer-form");
          if (formSection) {
            formSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      } catch (err: any) {
        console.error("Submit error:", err);
        toast.error(err?.data?.message || "Submission failed");
      }
    },
    [executeRecaptcha, formData, submitVolunteerApplication]
  );

  const volunteerOpportunities = [
    {
      title: "Dog Walker",
      icon: <PawPrint className='h-6 w-6 text-orange-500' />,
      description:
        "Take dogs for walks and provide exercise and socialization.",
    },
    {
      title: "Kennel Assistant",
      icon: <Droplet className='h-6 w-6 text-orange-500' />,
      description:
        "Help with cleaning, feeding, and maintaining the shelter environment.",
    },
    {
      title: "Groomer",
      icon: <Paintbrush className='h-6 w-6 text-orange-500' />,
      description:
        "Provide grooming services to keep our dogs clean and healthy.",
    },
    {
      title: "Photographer",
      icon: <Camera className='h-6 w-6 text-orange-500' />,
      description:
        "Take photos of our dogs for adoption profiles and marketing materials.",
    },
    {
      title: "Transport Volunteer",
      icon: <Car className='h-6 w-6 text-orange-500' />,
      description:
        "Help transport dogs to vet appointments or adoption events.",
    },
    {
      title: "Social Media Coordinator",
      icon: <Megaphone className='h-6 w-6 text-orange-500' />,
      description: "Create content and manage our social media presence.",
    },
    {
      title: "Event Volunteer",
      icon: <Calendar className='h-6 w-6 text-orange-500' />,
      description:
        "Assist with adoption events, fundraisers, and community outreach.",
    },
    {
      title: "Educational Outreach",
      icon: <BookOpen className='h-6 w-6 text-orange-500' />,
      description:
        "Help conduct educational programs about dog care and welfare.",
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />

      {/* Volunteer Application Form */}
      <section id='volunteer-form' className='py-12 md:py-24'>
        <div className='container px-4 md:px-6'>
          <div className='max-w-3xl mx-auto'>
            <div className='text-center space-y-4 mb-12'>
              <div className='inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm'>
                Get Involved
              </div>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
                Volunteer Application
              </h2>
              <p className='text-gray-500'>
                Fill out the form below to join our volunteer team. We'll
                contact you with next steps.
              </p>
            </div>

            <div className='bg-white rounded-lg shadow-md p-6 md:p-8'>
              {/* Form */}
              <form onSubmit={handleSubmit} className='space-y-8'>
                {/* Personal Information */}
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold border-b pb-2'>
                    Personal Information
                  </h3>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='firstName'>First Name *</Label>
                      <Input
                        id='firstName'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        className={
                          validationErrors.firstName ? "border-red-500" : ""
                        }
                      />
                      {validationErrors.firstName && (
                        <p className='text-sm text-red-500'>
                          {validationErrors.firstName}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='lastName'>Last Name *</Label>
                      <Input
                        id='lastName'
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                        className={
                          validationErrors.lastName ? "border-red-500" : ""
                        }
                      />
                      {validationErrors.lastName && (
                        <p className='text-sm text-red-500'>
                          {validationErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email *</Label>
                      <Input
                        id='email'
                        name='email'
                        type='email'
                        value={formData.email}
                        onChange={handleChange}
                        className={
                          validationErrors.email ? "border-red-500" : ""
                        }
                      />
                      {validationErrors.email && (
                        <p className='text-sm text-red-500'>
                          {validationErrors.email}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='phone'>Phone Number *</Label>
                      <Input
                        id='phone'
                        name='phone'
                        type='tel'
                        value={formData.phone}
                        onChange={handleChange}
                        className={
                          validationErrors.phone ? "border-red-500" : ""
                        }
                      />
                      {validationErrors.phone && (
                        <p className='text-sm text-red-500'>
                          {validationErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='address'>Address *</Label>
                    <Input
                      id='address'
                      name='address'
                      value={formData.address}
                      onChange={handleChange}
                      className={
                        validationErrors.address ? "border-red-500" : ""
                      }
                    />
                    {validationErrors.address && (
                      <p className='text-sm text-red-500'>
                        {validationErrors.address}
                      </p>
                    )}
                  </div>

                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    <div className='space-y-2 col-span-2 md:col-span-1'>
                      <Label htmlFor='district'>District *</Label>
                      <Input
                        id='district'
                        name='district'
                        value={formData.district}
                        onChange={handleChange}
                        className={
                          validationErrors.district ? "border-red-500" : ""
                        }
                      />
                      {validationErrors.district && (
                        <p className='text-sm text-red-500'>
                          {validationErrors.district}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2 col-span-2 md:col-span-1'>
                      <Label htmlFor='state'>State *</Label>
                      <Input
                        id='state'
                        name='state'
                        value={formData.state}
                        onChange={handleChange}
                        className={
                          validationErrors.state ? "border-red-500" : ""
                        }
                      />
                      {validationErrors.state && (
                        <p className='text-sm text-red-500'>
                          {validationErrors.state}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2 col-span-2 md:col-span-2'>
                      <Label htmlFor='pincode'>Pincode *</Label>
                      <Input
                        id='pincode'
                        name='pincode'
                        value={formData.pincode}
                        onChange={handleChange}
                        className={
                          validationErrors.pincode ? "border-red-500" : ""
                        }
                      />
                      {validationErrors.pincode && (
                        <p className='text-sm text-red-500'>
                          {validationErrors.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Volunteer Preferences */}
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold border-b pb-2'>
                    Volunteer Preferences
                  </h3>

                  <div className='space-y-2'>
                    <Label htmlFor='availability'>Availability *</Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value) =>
                        handleSelectChange("availability", value)
                      }
                    >
                      <SelectTrigger
                        className={
                          validationErrors.availability ? "border-red-500" : ""
                        }
                      >
                        <SelectValue placeholder='Select your availability' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='weekdays'>Weekdays</SelectItem>
                        <SelectItem value='weekends'>Weekends</SelectItem>
                        <SelectItem value='evenings'>Evenings</SelectItem>
                        <SelectItem value='flexible'>Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.availability && (
                      <p className='text-sm text-red-500'>
                        {validationErrors.availability}
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label>Areas of Interest (Select all that apply) *</Label>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2'>
                      {volunteerOpportunities.map((opportunity, index) => (
                        <Button
                          key={index}
                          type='button'
                          variant='outline'
                          className={
                            formData.interests.includes(opportunity.title)
                              ? "border-orange-500 bg-orange-50 text-orange-700"
                              : ""
                          }
                          onClick={() => toggleInterest(opportunity.title)}
                        >
                          {opportunity.icon}
                          <span className='ml-2'>{opportunity.title}</span>
                        </Button>
                      ))}
                    </div>
                    {validationErrors.interests && (
                      <p className='text-sm text-red-500'>
                        {validationErrors.interests}
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='experience'>
                      Previous Experience with Dogs (Optional)
                    </Label>
                    <Textarea
                      id='experience'
                      name='experience'
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder='Please describe any previous experience you have with dogs or animal welfare.'
                      rows={3}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='reason'>
                      Why do you want to volunteer with us? *
                    </Label>
                    <Textarea
                      id='reason'
                      name='reason'
                      value={formData.reason}
                      onChange={handleChange}
                      placeholder="Tell us why you're interested in volunteering with Prapti Foundation."
                      rows={4}
                      className={
                        validationErrors.reason ? "border-red-500" : ""
                      }
                    />
                    {validationErrors.reason && (
                      <p className='text-sm text-red-500'>
                        {validationErrors.reason}
                      </p>
                    )}
                  </div>
                </div>

                {/* FAQ Accordion */}
                <Accordion
                  type='single'
                  collapsible
                  className='border rounded-md'
                >
                  <AccordionItem value='item-1'>
                    <AccordionTrigger className='px-4'>
                      What happens after I submit my application?
                    </AccordionTrigger>
                    <AccordionContent className='px-4 text-gray-600'>
                      After you submit your application, our volunteer
                      coordinator will review it and contact you within 1-2
                      weeks. You'll be invited to attend a volunteer orientation
                      where you'll learn more about our organization and the
                      specific roles you're interested in.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value='item-2'>
                    <AccordionTrigger className='px-4'>
                      Is there a minimum time commitment?
                    </AccordionTrigger>
                    <AccordionContent className='px-4 text-gray-600'>
                      We ask for a minimum commitment of 4 hours per month for
                      at least three months. This helps provide consistency for
                      our dogs and allows volunteers to develop relationships
                      with them. However, we understand that schedules can vary
                      and will work with you to find a schedule that works.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value='item-3'>
                    <AccordionTrigger className='px-4'>
                      Do I need prior experience with dogs?
                    </AccordionTrigger>
                    <AccordionContent className='px-4 text-gray-600'>
                      No prior experience is necessary for many of our volunteer
                      roles. We provide training for all volunteers. However,
                      some specialized roles, such as behavioral training, may
                      require previous experience or willingness to complete
                      additional training.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Submit Button */}
                <div className='pt-4'>
                  <Button
                    type='submit'
                    className='w-full bg-orange-500 hover:bg-orange-600'
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className='flex items-center'>
                        <svg
                          className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        Submitting Application...
                      </span>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </form>
              {/* Success Message */}
              {isSuccess && (
                <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start gap-3'>
                  <Check className='h-5 w-5 text-green-500 mt-0.5' />
                  <div>
                    <p className='text-green-600 font-medium'>
                      Application Submitted Successfully!
                    </p>
                    <p className='text-green-600/70 text-sm'>
                      Thank you for your interest in volunteering with Prapti
                      Foundation. We'll review your application and contact you
                      soon.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3'>
                  <AlertCircle className='h-5 w-5 text-red-500 mt-0.5' />
                  <div>
                    <p className='text-red-600 font-medium'>
                      {(error as any)?.data?.message || "Submission failed"}
                    </p>
                    <p className='text-red-600/70 text-sm'>
                      Please check the form and try again.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className='relative py-16 md:py-24 bg-amber-50'>
        <div className='container px-4 md:px-6'>
          <div className='max-w-3xl mx-auto text-center space-y-4'>
            <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl'>
              Volunteer with Us
            </h1>
            <p className='text-gray-500 md:text-xl'>
              Join our team of dedicated volunteers and help make a difference
              in the lives of stray dogs in Golaghat.
            </p>
          </div>
        </div>
      </section>

      {/* Why Volunteer Section */}
      <section className='py-12 md:py-24'>
        <div className='container px-4 md:px-6'>
          <div className='grid gap-12 lg:grid-cols-2 lg:gap-16 items-center'>
            <div className='space-y-4'>
              <div className='inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm'>
                Why Volunteer
              </div>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
                Make a Real Impact
              </h2>
              <div className='space-y-4 text-gray-500'>
                <p>
                  Volunteering with Prapti Foundation is more than just spending
                  time with dogs—it's about transforming lives. Our volunteers
                  are the backbone of our organization, helping us provide
                  essential care, socialization, and love to dogs who have been
                  rescued from difficult situations.
                </p>
                <p>
                  Whether you can give a few hours a week or a few hours a
                  month, your contribution matters. Every moment spent walking,
                  grooming, cleaning, or simply sitting with our dogs helps them
                  heal and prepare for their forever homes.
                </p>
                <p>
                  No special skills are needed—just a compassionate heart and
                  willingness to help. We provide all necessary training and
                  support to ensure both you and our dogs have a positive
                  experience.
                </p>
              </div>
              <Button
                onClick={scrollToForm}
                className='bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md transition-colors duration-200'
              >
                Fill The Form
              </Button>
            </div>
            <div className='relative rounded-lg overflow-hidden'>
              <img
                src={values}
                alt='Volunteers working with dogs'
                className='w-full h-full object-cover'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Benefits */}
      <section className='py-12 md:py-24'>
        <div className='container px-4 md:px-6'>
          <div className='text-center space-y-4 max-w-3xl mx-auto mb-12'>
            <div className='inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm'>
              Benefits
            </div>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
              Why Volunteer With Us
            </h2>
            <p className='text-gray-500'>
              Volunteering with Prapti Foundation offers many rewards beyond
              helping dogs.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='bg-white p-6 rounded-lg shadow-sm space-y-3'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500'>
                <Heart className='h-6 w-6' />
              </div>
              <h3 className='text-xl font-semibold'>Make a Difference</h3>
              <p className='text-gray-500'>
                Directly impact the lives of dogs in need and help them find
                loving homes.
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm space-y-3'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500'>
                <Users className='h-6 w-6' />
              </div>
              <h3 className='text-xl font-semibold'>Join a Community</h3>
              <p className='text-gray-500'>
                Become part of a dedicated team of animal lovers who share your
                passion.
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm space-y-3'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500'>
                <Star className='h-6 w-6' />
              </div>
              <h3 className='text-xl font-semibold'>Develop Skills</h3>
              <p className='text-gray-500'>
                Gain valuable experience in animal care, event planning, or
                social media management.
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm space-y-3'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500'>
                <ThumbsUp className='h-6 w-6' />
              </div>
              <h3 className='text-xl font-semibold'>Feel Good</h3>
              <p className='text-gray-500'>
                Experience the joy and satisfaction that comes from helping
                animals in need.
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm space-y-3'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500'>
                <Clock className='h-6 w-6' />
              </div>
              <h3 className='text-xl font-semibold'>Flexible Schedule</h3>
              <p className='text-gray-500'>
                Choose volunteer opportunities that fit your availability and
                lifestyle.
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm space-y-3'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500'>
                <Calendar className='h-6 w-6' />
              </div>
              <h3 className='text-xl font-semibold'>Special Events</h3>
              <p className='text-gray-500'>
                Participate in adoption events, fundraisers, and community
                outreach programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VolunteerPage;
