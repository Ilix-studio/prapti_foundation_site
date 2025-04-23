import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PawPrint, Check, AlertCircle } from "lucide-react";
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
import { Header } from "@/mainComponents/Header";
import Footer from "@/mainComponents/Footer";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  housingType: string;
  hasYard: string;
  hasChildren: string;
  hasPets: string;
  otherPets: string;
  workHours: string;
  experience: string;
  preferredDog: string;
  reason: string;
}

const AdoptionForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    housingType: "",
    hasYard: "",
    hasChildren: "",
    hasPets: "",
    otherPets: "",
    workHours: "",
    experience: "",
    preferredDog: "",
    reason: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validate form data
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone
    ) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      // In a real app, you would submit the form data to your backend here
      console.log("Form submitted:", formData);

      // Automatically redirect after successful submission
      setTimeout(() => {
        navigate("/adoption-success");
      }, 3000);
    }, 1500);
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />

      <main className='flex-1 bg-amber-50'>
        {/* Hero Banner */}
        <section className='relative py-12 md:py-16 bg-orange-200'>
          <div className='container px-4 md:px-6 text-center'>
            <motion.h1
              className='text-3xl md:text-4xl font-bold text-white mb-4'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Adopt a Dog
            </motion.h1>
            <motion.p
              className='max-w-2xl mx-auto text-white/90 text-lg'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Complete this application to begin your journey of giving a loving
              home to one of our rescued dogs.
            </motion.p>
          </div>
        </section>

        {/* If success, show success message */}
        {success ? (
          <section className='container px-4 md:px-6 py-12'>
            <div className='max-w-3xl mx-auto p-8 rounded-lg bg-white shadow-md'>
              <div className='text-center'>
                <div className='bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
                  <Check className='h-8 w-8 text-green-600' />
                </div>
                <h2 className='text-2xl font-bold mb-4'>
                  Application Submitted!
                </h2>
                <p className='mb-6'>
                  Thank you for your interest in adopting a dog from Prapti
                  Foundation. We have received your application and will review
                  it shortly. Our team will contact you within 2-3 business days
                  to discuss the next steps.
                </p>
                <p className='text-gray-500 mb-6'>
                  You will be redirected to the homepage shortly...
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className='bg-orange-500 hover:bg-orange-600'
                >
                  Return to Homepage
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <section className='container px-4 md:px-6 py-12'>
            <div className='max-w-3xl mx-auto'>
              <div className='bg-white rounded-lg shadow-md p-6 md:p-8'>
                {/* Form Introduction */}
                <div className='mb-8 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left'>
                  <PawPrint className='h-12 w-12 text-orange-500' />
                  <div>
                    <h2 className='text-2xl font-bold'>Adoption Application</h2>
                    <p className='text-gray-500'>
                      Please provide accurate information to help us find the
                      perfect match for you and our dogs.
                    </p>
                  </div>
                </div>

                {/* Error message if needed */}
                {error && (
                  <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3'>
                    <AlertCircle className='h-5 w-5 text-red-500 mt-0.5' />
                    <div>
                      <p className='text-red-600 font-medium'>{error}</p>
                      <p className='text-red-600/70 text-sm'>
                        Please check the form and try again.
                      </p>
                    </div>
                  </div>
                )}

                {/* Adoption Form */}
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
                          required
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='lastName'>Last Name *</Label>
                        <Input
                          id='lastName'
                          name='lastName'
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
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
                          required
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='phone'>Phone Number *</Label>
                        <Input
                          id='phone'
                          name='phone'
                          type='tel'
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='address'>Address *</Label>
                      <Input
                        id='address'
                        name='address'
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                      <div className='space-y-2 col-span-2 md:col-span-1'>
                        <Label htmlFor='city'>City *</Label>
                        <Input
                          id='city'
                          name='city'
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className='space-y-2 col-span-2 md:col-span-1'>
                        <Label htmlFor='state'>State *</Label>
                        <Input
                          id='state'
                          name='state'
                          value={formData.state}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className='space-y-2 col-span-2 md:col-span-2'>
                        <Label htmlFor='zip'>Zip Code *</Label>
                        <Input
                          id='zip'
                          name='zip'
                          value={formData.zip}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Living Situation */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold border-b pb-2'>
                      Living Situation
                    </h3>

                    <div className='space-y-2'>
                      <Label htmlFor='housingType'>Type of Housing *</Label>
                      <Select
                        value={formData.housingType}
                        onValueChange={(value) =>
                          handleSelectChange("housingType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select housing type' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='house'>House</SelectItem>
                          <SelectItem value='apartment'>Apartment</SelectItem>
                          <SelectItem value='condo'>Condominium</SelectItem>
                          <SelectItem value='mobile'>Mobile Home</SelectItem>
                          <SelectItem value='other'>Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='hasYard'>
                        Do you have a fenced yard? *
                      </Label>
                      <Select
                        value={formData.hasYard}
                        onValueChange={(value) =>
                          handleSelectChange("hasYard", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select an option' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='yes'>Yes</SelectItem>
                          <SelectItem value='no'>No</SelectItem>
                          <SelectItem value='partial'>
                            Partially fenced
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='hasChildren'>
                        Do you have children? *
                      </Label>
                      <Select
                        value={formData.hasChildren}
                        onValueChange={(value) =>
                          handleSelectChange("hasChildren", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select an option' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='yes-under5'>
                            Yes, under 5 years old
                          </SelectItem>
                          <SelectItem value='yes-5to12'>
                            Yes, 5-12 years old
                          </SelectItem>
                          <SelectItem value='yes-teens'>
                            Yes, teenagers
                          </SelectItem>
                          <SelectItem value='no'>No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='hasPets'>Do you have other pets? *</Label>
                      <Select
                        value={formData.hasPets}
                        onValueChange={(value) =>
                          handleSelectChange("hasPets", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select an option' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='yes'>Yes</SelectItem>
                          <SelectItem value='no'>No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.hasPets === "yes" && (
                      <div className='space-y-2'>
                        <Label htmlFor='otherPets'>
                          Please describe your other pets
                        </Label>
                        <Textarea
                          id='otherPets'
                          name='otherPets'
                          value={formData.otherPets}
                          onChange={handleChange}
                          placeholder='Type, age, temperament of your current pets'
                        />
                      </div>
                    )}

                    <div className='space-y-2'>
                      <Label htmlFor='workHours'>
                        How many hours will the dog be alone each day? *
                      </Label>
                      <Select
                        value={formData.workHours}
                        onValueChange={(value) =>
                          handleSelectChange("workHours", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select an option' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='0-2'>0-2 hours</SelectItem>
                          <SelectItem value='3-5'>3-5 hours</SelectItem>
                          <SelectItem value='6-8'>6-8 hours</SelectItem>
                          <SelectItem value='8+'>More than 8 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Experience & Preferences */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold border-b pb-2'>
                      Experience & Preferences
                    </h3>

                    <div className='space-y-2'>
                      <Label htmlFor='experience'>
                        Previous dog ownership experience *
                      </Label>
                      <Select
                        value={formData.experience}
                        onValueChange={(value) =>
                          handleSelectChange("experience", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select your experience level' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='first-time'>
                            First-time dog owner
                          </SelectItem>
                          <SelectItem value='some'>Some experience</SelectItem>
                          <SelectItem value='experienced'>
                            Experienced dog owner
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='preferredDog'>
                        Preferred dog type (if any)
                      </Label>
                      <Input
                        id='preferredDog'
                        name='preferredDog'
                        value={formData.preferredDog}
                        onChange={handleChange}
                        placeholder='Age, size, breed, energy level, etc.'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='reason'>
                        Why do you want to adopt a dog? *
                      </Label>
                      <Textarea
                        id='reason'
                        name='reason'
                        value={formData.reason}
                        onChange={handleChange}
                        placeholder='Please share your reasons for wanting to adopt'
                        required
                      />
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
                        What happens after I submit?
                      </AccordionTrigger>
                      <AccordionContent className='px-4 text-gray-600'>
                        After you submit your application, our team will review
                        it within 2-3 business days. If your application is
                        approved, we'll contact you to schedule a meet-and-greet
                        with dogs that match your preferences and living
                        situation.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value='item-2'>
                      <AccordionTrigger className='px-4'>
                        Is there an adoption fee?
                      </AccordionTrigger>
                      <AccordionContent className='px-4 text-gray-600'>
                        Yes, there is an adoption fee of ₹2,000 which helps
                        cover the cost of vaccinations, spaying/neutering,
                        microchipping, and general care while the dog was in our
                        shelter. This fee helps ensure that you're committed to
                        providing a good home for the dog.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value='item-3'>
                      <AccordionTrigger className='px-4'>
                        Can I meet the dog before adopting?
                      </AccordionTrigger>
                      <AccordionContent className='px-4 text-gray-600'>
                        Absolutely! We encourage multiple visits to ensure the
                        dog is a good match for your family. You can spend time
                        getting to know the dog at our shelter, and in some
                        cases, we may arrange a home visit as well.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Submit button */}
                  <div className='pt-4'>
                    <Button
                      type='submit'
                      className='w-full bg-orange-500 hover:bg-orange-600'
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
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
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdoptionForm;
