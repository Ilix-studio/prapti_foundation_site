import React, { useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  CreditCard,
  DollarSign,
  Landmark,
  Repeat,
  Gift,
  Briefcase,
  ShoppingBag,
  Coffee,
  Check,
} from "lucide-react";

const PreSupport = () => {
  const [donationAmount, setDonationAmount] = useState<string>("100");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [donationSuccessful, setDonationSuccessful] = useState<boolean>(false);

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would process the payment
    // For this demo, we'll just show a success message
    setDonationSuccessful(true);

    // Reset the success message after 5 seconds
    setTimeout(() => {
      setDonationSuccessful(false);
    }, 5000);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className='relative py-16 md:py-24 bg-amber-50'>
        <div className='container px-4 md:px-6'>
          <div className='max-w-3xl mx-auto text-center space-y-4'>
            <motion.h1
              className='text-4xl font-bold tracking-tighter sm:text-5xl'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Support Our Cause
            </motion.h1>
            <p className='text-gray-500 md:text-xl'>
              Your generosity helps us provide shelter, food, and medical care
              to dogs in need.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className='py-12 md:py-24'>
        <div className='container px-4 md:px-6'>
          <div className='grid gap-12 lg:grid-cols-2 lg:gap-16 items-start'>
            {/* Left Side - Ways to Support */}
            <div className='space-y-8'>
              <div className='space-y-4'>
                <div className='inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm'>
                  Why Support Us
                </div>
                <h2 className='text-3xl font-bold tracking-tighter'>
                  Your Support Makes a Difference
                </h2>
                <p className='text-gray-500'>
                  The Prapti Foundation relies on generous donations from people
                  like you to continue our work rescuing and caring for stray
                  dogs in Golaghat. Every contribution, no matter the size,
                  makes a real difference in a dog's life.
                </p>
              </div>

              <div className='space-y-6'>
                <h3 className='text-2xl font-semibold'>Ways You Can Help</h3>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='bg-white p-6 rounded-lg border shadow-sm'>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='p-2 rounded-full bg-orange-100'>
                        <DollarSign className='h-5 w-5 text-orange-500' />
                      </div>
                      <h4 className='font-semibold'>One-time Donation</h4>
                    </div>
                    <p className='text-sm text-gray-500'>
                      Make a one-time contribution to help with immediate needs.
                    </p>
                  </div>

                  <div className='bg-white p-6 rounded-lg border shadow-sm'>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='p-2 rounded-full bg-orange-100'>
                        <Repeat className='h-5 w-5 text-orange-500' />
                      </div>
                      <h4 className='font-semibold'>Monthly Giving</h4>
                    </div>
                    <p className='text-sm text-gray-500'>
                      Become a sustaining supporter with a recurring monthly
                      donation.
                    </p>
                  </div>

                  <div className='bg-white p-6 rounded-lg border shadow-sm'>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='p-2 rounded-full bg-orange-100'>
                        <ShoppingBag className='h-5 w-5 text-orange-500' />
                      </div>
                      <h4 className='font-semibold'>In-kind Donations</h4>
                    </div>
                    <p className='text-sm text-gray-500'>
                      Donate food, bedding, toys, and other supplies our dogs
                      need.
                    </p>
                  </div>

                  <div className='bg-white p-6 rounded-lg border shadow-sm'>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='p-2 rounded-full bg-orange-100'>
                        <Gift className='h-5 w-5 text-orange-500' />
                      </div>
                      <h4 className='font-semibold'>Legacy Giving</h4>
                    </div>
                    <p className='text-sm text-gray-500'>
                      Make a lasting impact by including us in your estate
                      planning.
                    </p>
                  </div>

                  <div className='bg-white p-6 rounded-lg border shadow-sm'>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='p-2 rounded-full bg-orange-100'>
                        <Briefcase className='h-5 w-5 text-orange-500' />
                      </div>
                      <h4 className='font-semibold'>Corporate Sponsorship</h4>
                    </div>
                    <p className='text-sm text-gray-500'>
                      Partner with us to make a difference while showcasing your
                      company's values.
                    </p>
                  </div>

                  <div className='bg-white p-6 rounded-lg border shadow-sm'>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='p-2 rounded-full bg-orange-100'>
                        <Coffee className='h-5 w-5 text-orange-500' />
                      </div>
                      <h4 className='font-semibold'>Fundraise For Us</h4>
                    </div>
                    <p className='text-sm text-gray-500'>
                      Host your own fundraiser or event to support our dogs.
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-orange-50 p-6 rounded-lg space-y-4'>
                <h3 className='text-xl font-semibold'>
                  How Your Donation Helps
                </h3>
                <ul className='space-y-2'>
                  <li className='flex items-start gap-2'>
                    <Check className='h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5' />
                    <span>₹500 provides a week of food for one dog</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <Check className='h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5' />
                    <span>₹1,000 covers basic vaccinations</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <Check className='h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5' />
                    <span>₹2,500 helps provide emergency medical care</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <Check className='h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5' />
                    <span>
                      ₹5,000 sponsors a dog's complete care for a month
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <Check className='h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5' />
                    <span>₹10,000 helps us improve shelter facilities</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Side - Donation Form */}
            <div className='bg-white p-8 rounded-lg border shadow-sm'>
              <div className='space-y-6'>
                <div className='text-center'>
                  <h3 className='text-2xl font-semibold'>Make a Donation</h3>
                  <p className='text-gray-500'>
                    Support our dogs with a contribution today
                  </p>
                </div>

                <Tabs defaultValue='one-time' className='w-full'>
                  <TabsList className='grid w-full grid-cols-2 mb-4'>
                    <TabsTrigger value='one-time'>One-time</TabsTrigger>
                    <TabsTrigger value='monthly'>Monthly</TabsTrigger>
                  </TabsList>

                  <TabsContent value='one-time'>
                    <form onSubmit={handleDonationSubmit} className='space-y-6'>
                      {/* Donation Amount */}
                      <div className='space-y-4'>
                        <Label htmlFor='amount'>Select Donation Amount</Label>
                        <div className='grid grid-cols-3 gap-2'>
                          {["100", "500", "1000", "2500", "5000", "10000"].map(
                            (amount) => (
                              <Button
                                key={amount}
                                type='button'
                                variant={
                                  donationAmount === amount
                                    ? "default"
                                    : "outline"
                                }
                                className={
                                  donationAmount === amount
                                    ? "bg-orange-500 hover:bg-orange-600"
                                    : ""
                                }
                                onClick={() => {
                                  setDonationAmount(amount);
                                  setCustomAmount("");
                                }}
                              >
                                ₹{amount}
                              </Button>
                            )
                          )}
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='customAmount'>Custom Amount</Label>
                          <div className='relative'>
                            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
                              ₹
                            </span>
                            <Input
                              id='customAmount'
                              type='number'
                              placeholder='Enter amount'
                              className='pl-8'
                              value={customAmount}
                              onChange={(e) => {
                                setCustomAmount(e.target.value);
                                setDonationAmount("custom");
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Personal Information */}
                      <div className='space-y-4'>
                        <h4 className='text-lg font-medium'>
                          Personal Information
                        </h4>
                        <div className='grid gap-4 sm:grid-cols-2'>
                          <div className='space-y-2'>
                            <Label htmlFor='firstName'>First Name</Label>
                            <Input id='firstName' required />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='lastName'>Last Name</Label>
                            <Input id='lastName' required />
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='email'>Email</Label>
                          <Input id='email' type='email' required />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='phone'>Phone (Optional)</Label>
                          <Input id='phone' type='tel' />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='message'>Message (Optional)</Label>
                          <Textarea
                            id='message'
                            placeholder="Share why you're supporting us..."
                          />
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className='space-y-4'>
                        <h4 className='text-lg font-medium'>Payment Method</h4>
                        <RadioGroup
                          value={paymentMethod}
                          onValueChange={setPaymentMethod}
                          className='space-y-3'
                        >
                          <div className='flex items-center space-x-2 border p-3 rounded-md'>
                            <RadioGroupItem value='card' id='card' />
                            <Label
                              htmlFor='card'
                              className='flex items-center gap-2 cursor-pointer'
                            >
                              <CreditCard className='h-4 w-4' />
                              Credit/Debit Card
                            </Label>
                          </div>
                          <div className='flex items-center space-x-2 border p-3 rounded-md'>
                            <RadioGroupItem value='upi' id='upi' />
                            <Label
                              htmlFor='upi'
                              className='flex items-center gap-2 cursor-pointer'
                            >
                              <DollarSign className='h-4 w-4' />
                              UPI
                            </Label>
                          </div>
                          <div className='flex items-center space-x-2 border p-3 rounded-md'>
                            <RadioGroupItem value='bank' id='bank' />
                            <Label
                              htmlFor='bank'
                              className='flex items-center gap-2 cursor-pointer'
                            >
                              <Landmark className='h-4 w-4' />
                              Bank Transfer
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Payment Details */}
                      {paymentMethod === "card" && (
                        <div className='space-y-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='cardNumber'>Card Number</Label>
                            <Input
                              id='cardNumber'
                              placeholder='1234 5678 9012 3456'
                            />
                          </div>
                          <div className='grid gap-4 sm:grid-cols-3'>
                            <div className='space-y-2'>
                              <Label htmlFor='expMonth'>Expiry Month</Label>
                              <Input id='expMonth' placeholder='MM' />
                            </div>
                            <div className='space-y-2'>
                              <Label htmlFor='expYear'>Expiry Year</Label>
                              <Input id='expYear' placeholder='YY' />
                            </div>
                            <div className='space-y-2'>
                              <Label htmlFor='cvv'>CVV</Label>
                              <Input id='cvv' placeholder='123' />
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === "upi" && (
                        <div className='space-y-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='upiId'>UPI ID</Label>
                            <Input id='upiId' placeholder='yourname@upi' />
                          </div>
                        </div>
                      )}

                      {paymentMethod === "bank" && (
                        <div className='bg-gray-50 p-4 rounded-md space-y-2'>
                          <p className='font-medium'>Bank Account Details:</p>
                          <p className='text-sm'>
                            Account Name: Prapti Foundation
                          </p>
                          <p className='text-sm'>Account Number: 1234567890</p>
                          <p className='text-sm'>IFSC Code: ABCD0001234</p>
                          <p className='text-sm'>
                            Bank: Sample Bank, Golaghat Branch
                          </p>
                          <div className='space-y-2 mt-4'>
                            <Label htmlFor='transactionId'>
                              Transaction Reference (Optional)
                            </Label>
                            <Input
                              id='transactionId'
                              placeholder='Enter your transaction reference'
                            />
                          </div>
                        </div>
                      )}

                      {/* Success Message */}
                      {donationSuccessful && (
                        <div className='bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2'>
                          <Check className='h-5 w-5' />
                          <span>
                            Thank you for your donation! We've sent a
                            confirmation to your email.
                          </span>
                        </div>
                      )}

                      {/* Submit Button */}
                      <Button
                        type='submit'
                        className='w-full bg-orange-500 hover:bg-orange-600'
                      >
                        <Heart className='mr-2 h-4 w-4' />
                        Complete Donation
                      </Button>

                      <p className='text-xs text-gray-500 text-center'>
                        Your donation is tax-deductible. A receipt will be
                        emailed to you for tax purposes.
                      </p>
                    </form>
                  </TabsContent>

                  <TabsContent value='monthly'>
                    <form onSubmit={handleDonationSubmit} className='space-y-6'>
                      {/* Monthly Donation Amount */}
                      <div className='space-y-4'>
                        <Label htmlFor='amount'>
                          Select Monthly Donation Amount
                        </Label>
                        <div className='grid grid-cols-3 gap-2'>
                          {["100", "500", "1000", "2500", "5000"].map(
                            (amount) => (
                              <Button
                                key={amount}
                                type='button'
                                variant={
                                  donationAmount === amount
                                    ? "default"
                                    : "outline"
                                }
                                className={
                                  donationAmount === amount
                                    ? "bg-orange-500 hover:bg-orange-600"
                                    : ""
                                }
                                onClick={() => {
                                  setDonationAmount(amount);
                                  setCustomAmount("");
                                }}
                              >
                                ₹{amount}
                              </Button>
                            )
                          )}
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='customAmount'>Custom Amount</Label>
                          <div className='relative'>
                            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
                              ₹
                            </span>
                            <Input
                              id='customAmount'
                              type='number'
                              placeholder='Enter amount'
                              className='pl-8'
                              value={customAmount}
                              onChange={(e) => {
                                setCustomAmount(e.target.value);
                                setDonationAmount("custom");
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Personal Information */}
                      <div className='space-y-4'>
                        <h4 className='text-lg font-medium'>
                          Personal Information
                        </h4>
                        <div className='grid gap-4 sm:grid-cols-2'>
                          <div className='space-y-2'>
                            <Label htmlFor='firstName'>First Name</Label>
                            <Input id='firstName' required />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='lastName'>Last Name</Label>
                            <Input id='lastName' required />
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='email'>Email</Label>
                          <Input id='email' type='email' required />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='phone'>Phone (Optional)</Label>
                          <Input id='phone' type='tel' />
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className='space-y-4'>
                        <h4 className='text-lg font-medium'>Payment Method</h4>
                        <RadioGroup
                          value={paymentMethod}
                          onValueChange={setPaymentMethod}
                          className='space-y-3'
                        >
                          <div className='flex items-center space-x-2 border p-3 rounded-md'>
                            <RadioGroupItem value='card' id='card-monthly' />
                            <Label
                              htmlFor='card-monthly'
                              className='flex items-center gap-2 cursor-pointer'
                            >
                              <CreditCard className='h-4 w-4' />
                              Credit/Debit Card
                            </Label>
                          </div>
                          <div className='flex items-center space-x-2 border p-3 rounded-md'>
                            <RadioGroupItem value='upi' id='upi-monthly' />
                            <Label
                              htmlFor='upi-monthly'
                              className='flex items-center gap-2 cursor-pointer'
                            >
                              <DollarSign className='h-4 w-4' />
                              UPI Autopay
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Payment Details */}
                      {paymentMethod === "card" && (
                        <div className='space-y-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='cardNumber'>Card Number</Label>
                            <Input
                              id='cardNumber'
                              placeholder='1234 5678 9012 3456'
                            />
                          </div>
                          <div className='grid gap-4 sm:grid-cols-3'>
                            <div className='space-y-2'>
                              <Label htmlFor='expMonth'>Expiry Month</Label>
                              <Input id='expMonth' placeholder='MM' />
                            </div>
                            <div className='space-y-2'>
                              <Label htmlFor='expYear'>Expiry Year</Label>
                              <Input id='expYear' placeholder='YY' />
                            </div>
                            <div className='space-y-2'>
                              <Label htmlFor='cvv'>CVV</Label>
                              <Input id='cvv' placeholder='123' />
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === "upi" && (
                        <div className='space-y-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='upiId'>UPI ID</Label>
                            <Input id='upiId' placeholder='yourname@upi' />
                          </div>
                        </div>
                      )}

                      {/* Success Message */}
                      {donationSuccessful && (
                        <div className='bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2'>
                          <Check className='h-5 w-5' />
                          <span>
                            Thank you for your monthly donation commitment!
                            We've sent a confirmation to your email.
                          </span>
                        </div>
                      )}

                      {/* Submit Button */}
                      <Button
                        type='submit'
                        className='w-full bg-orange-500 hover:bg-orange-600'
                      >
                        <Repeat className='mr-2 h-4 w-4' />
                        Set Up Monthly Donation
                      </Button>

                      <p className='text-xs text-gray-500 text-center'>
                        You can cancel your monthly donation at any time by
                        contacting us.
                      </p>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Ways to Support */}
      <section className='py-12 md:py-24 bg-gray-50'>
        <div className='container px-4 md:px-6'>
          <div className='text-center space-y-4 max-w-3xl mx-auto mb-12'>
            <div className='inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm'>
              More Ways to Help
            </div>
            <h2 className='text-3xl font-bold tracking-tighter'>
              Beyond Donations
            </h2>
            <p className='text-gray-500'>
              There are many ways to support our mission beyond financial
              contributions.
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-3'>
            <div className='bg-white p-6 rounded-lg shadow-sm space-y-3'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500'>
                <Gift className='h-6 w-6' />
              </div>
              <h3 className='text-xl font-semibold'>Sponsor a Dog</h3>
              <p className='text-gray-500'>
                Sponsor a specific dog at our shelter, covering their food,
                medical care, and other needs.
              </p>
              <Button
                variant='outline'
                className='border-orange-500 text-orange-500 hover:bg-orange-50'
              >
                Learn More
              </Button>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm space-y-3'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500'>
                <ShoppingBag className='h-6 w-6' />
              </div>
              <h3 className='text-xl font-semibold'>Donate Supplies</h3>
              <p className='text-gray-500'>
                Contribute dog food, bedding, toys, cleaning supplies, and other
                items our shelter needs.
              </p>
              <Button
                variant='outline'
                className='border-orange-500 text-orange-500 hover:bg-orange-50'
              >
                See Our Wishlist
              </Button>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm space-y-3'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500'>
                <Briefcase className='h-6 w-6' />
              </div>
              <h3 className='text-xl font-semibold'>Corporate Partnership</h3>
              <p className='text-gray-500'>
                Partner with Prapti Foundation as part of your company's CSR
                initiatives.
              </p>
              <Button
                variant='outline'
                className='border-orange-500 text-orange-500 hover:bg-orange-50'
              >
                Partner With Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='py-12 md:py-24'>
        <div className='container px-4 md:px-6'>
          <div className='text-center space-y-4 max-w-3xl mx-auto mb-12'>
            <div className='inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm'>
              From Our Supporters
            </div>
            <h2 className='text-3xl font-bold tracking-tighter'>
              Why People Support Us
            </h2>
            <p className='text-gray-500'>
              Hear from people who have contributed to our mission.
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            <div className='bg-white p-6 rounded-lg shadow-sm space-y-4'>
              <p className='italic text-gray-600'>
                "I donate monthly to Prapti Foundation because I've seen
                firsthand the incredible difference they make in these dogs'
                lives. Every rupee goes directly to helping animals in need."
              </p>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full overflow-hidden bg-gray-200'>
                  <img
                    src='/placeholder.svg?height=40&width=40'
                    alt='Supporter'
                  />
                </div>
                <div>
                  <p className='font-medium'>Anjali Sharma</p>
                  <p className='text-sm text-gray-500'>
                    Monthly Donor since 2020
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm space-y-4'>
              <p className='italic text-gray-600'>
                "As a local business owner, partnering with Prapti Foundation
                has been rewarding. We sponsor their adoption events and help
                promote their work. It's a win-win for everyone."
              </p>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full overflow-hidden bg-gray-200'>
                  <img
                    src='/placeholder.svg?height=40&width=40'
                    alt='Supporter'
                  />
                </div>
                <div>
                  <p className='font-medium'>Vikram Patel</p>
                  <p className='text-sm text-gray-500'>Corporate Partner</p>
                </div>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm space-y-4'>
              <p className='italic text-gray-600'>
                "I couldn't adopt due to my travel schedule, but sponsoring a
                dog gives me the joy of knowing I'm helping a specific animal. I
                receive updates about my sponsored dog regularly."
              </p>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full overflow-hidden bg-gray-200'>
                  <img
                    src='/placeholder.svg?height=40&width=40'
                    alt='Supporter'
                  />
                </div>
                <div>
                  <p className='font-medium'>Ravi Khanna</p>
                  <p className='text-sm text-gray-500'>Dog Sponsor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className='py-12 md:py-24 bg-amber-50'>
        <div className='container px-4 md:px-6'>
          <div className='text-center space-y-4 max-w-3xl mx-auto mb-12'>
            <div className='inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm'>
              Frequently Asked Questions
            </div>
            <h2 className='text-3xl font-bold tracking-tighter'>
              Common Questions
            </h2>
            <p className='text-gray-500'>
              Find answers to common questions about donating to Prapti
              Foundation.
            </p>
          </div>

          <div className='max-w-3xl mx-auto space-y-6'>
            <div className='bg-white p-6 rounded-lg shadow-sm space-y-2'>
              <h3 className='text-lg font-semibold'>
                Is my donation tax-deductible?
              </h3>
              <p className='text-gray-500'>
                Yes, Prapti Foundation is a registered non-profit organization,
                and all donations are tax-deductible under Section 80G of the
                Income Tax Act. You will receive a receipt for your donation
                that you can use for tax purposes.
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm space-y-2'>
              <h3 className='text-lg font-semibold'>
                How is my donation used?
              </h3>
              <p className='text-gray-500'>
                Your donation directly supports our mission to rescue,
                rehabilitate, and rehome dogs in need. Funds are used for food,
                medical care, shelter maintenance, vaccination programs,
                sterilization, and adoption initiatives.
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm space-y-2'>
              <h3 className='text-lg font-semibold'>
                Can I specify how my donation is used?
              </h3>
              <p className='text-gray-500'>
                Yes, you can designate your donation for a specific purpose,
                such as medical care, food, or shelter improvements. Just
                include a note with your donation or select the appropriate
                option on our online donation form.
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm space-y-2'>
              <h3 className='text-lg font-semibold'>
                How do I cancel or modify my monthly donation?
              </h3>
              <p className='text-gray-500'>
                You can cancel or modify your monthly donation at any time by
                contacting our donor support team at
                donations@praptifoundation.org or by calling us at
                +91-123-456-7890.
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm space-y-2'>
              <h3 className='text-lg font-semibold'>
                Can I donate if I live outside India?
              </h3>
              <p className='text-gray-500'>
                Yes, we accept international donations through our website. You
                can use a credit card or PayPal for international transactions.
                Please note that tax benefits may vary depending on your
                country's laws.
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm space-y-2'>
              <h3 className='text-lg font-semibold'>
                Do you accept donations of goods?
              </h3>
              <p className='text-gray-500'>
                Yes, we gladly accept donations of dog food, blankets, towels,
                toys, cleaning supplies, and other items our shelter needs.
                Please check our wishlist or contact us for current needs before
                dropping off items.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className='py-12 md:py-24 bg-gray-900 text-white'>
        <div className='container px-4 md:px-6 text-center'>
          <div className='max-w-3xl mx-auto space-y-6'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
              Every Contribution Makes a Difference
            </h2>
            <p className='text-gray-300 md:text-xl'>
              Join our community of supporters and help us continue our mission
              to rescue and care for dogs in need.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PreSupport;
