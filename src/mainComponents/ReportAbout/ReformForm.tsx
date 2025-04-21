import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "../Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

export default function ReportPage() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-1'>
        <section className='w-full py-12 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center mb-8'>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
                  Report an Injured or Abused Dog
                </h1>
                <p className='max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Help us rescue dogs in need. Your report can save a life.
                </p>
              </div>
            </div>

            <Card className='max-w-3xl mx-auto'>
              <CardHeader>
                <CardTitle>Report Form</CardTitle>
                <CardDescription>
                  Please provide as much detail as possible about the dog and
                  its situation. All reports are confidential.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className='space-y-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='location'>Location</Label>
                    <Input
                      id='location'
                      placeholder='Where is the dog located? Please be as specific as possible.'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='description'>Description of the dog</Label>
                    <Textarea
                      id='description'
                      placeholder='Breed (if known), color, size, distinctive features, etc.'
                      className='min-h-[80px]'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='condition'>Condition of the dog</Label>
                    <Textarea
                      id='condition'
                      placeholder="Describe the dog's condition and any injuries or signs of abuse you've observed."
                      className='min-h-[100px]'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='situation'>Situation details</Label>
                    <Textarea
                      id='situation'
                      placeholder='Explain the circumstances. Is the dog a stray? Is it currently in danger? How long has it been in this condition?'
                      className='min-h-[100px]'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='photo'>Upload photos (if available)</Label>
                    <Input id='photo' type='file' multiple accept='image/*' />
                    <p className='text-xs text-gray-500'>
                      Photos can help us identify the dog and assess its
                      condition.
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Label>Your contact information</Label>
                    <p className='text-sm text-gray-500 mb-2'>
                      This information is optional but helpful if we need
                      additional details.
                    </p>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <Input placeholder='Your name (optional)' />
                      <Input type='email' placeholder='Your email (optional)' />
                      <Input
                        type='tel'
                        placeholder='Your phone number (optional)'
                        className='sm:col-span-2'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label>Is this an emergency?</Label>
                    <div className='flex items-center space-x-2'>
                      <Checkbox id='emergency' />
                      <label
                        htmlFor='emergency'
                        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                      >
                        Yes, this dog needs immediate help
                      </label>
                    </div>
                    <p className='text-sm text-red-500'>
                      For emergencies, please also call our rescue hotline at
                      (555) 911-DOGS
                    </p>
                  </div>
                </form>
              </CardContent>
              <CardFooter className='flex justify-between border-t p-6'>
                <Button variant='outline'>Clear Form</Button>
                <Button className='bg-orange-500 hover:bg-orange-600'>
                  Submit Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
      <footer className='flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6'>
        <p className='text-xs text-gray-500'>
          © 2023 PawsHome Shelter. All rights reserved.
        </p>
        <nav className='sm:ml-auto flex gap-4 sm:gap-6'>
          <Link className='text-xs hover:underline underline-offset-4' to='#'>
            Terms of Service
          </Link>
          <Link className='text-xs hover:underline underline-offset-4' to='#'>
            Privacy
          </Link>
          <Link
            className='text-xs hover:underline underline-offset-4'
            to='/contact'
          >
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  );
}
