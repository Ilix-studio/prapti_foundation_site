import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "../Header";
import { Button } from "@/components/ui/button";
import Footer from "../Footer";
import { AlertTriangle, Phone, MessageCircle } from "lucide-react";

const ReportPage: React.FC = () => {
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
                <CardTitle>Contact Our Rescue Team</CardTitle>
                <CardDescription>
                  Please contact us immediately if you see a dog in distress.
                  Our team is available 24/7 to respond to emergency situations.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='bg-amber-50 p-6 rounded-lg border border-amber-200'>
                  <div className='flex flex-col md:flex-row items-center gap-4 text-center md:text-left'>
                    <div className='bg-amber-100 p-3 rounded-full'>
                      <AlertTriangle className='h-8 w-8 text-amber-600' />
                    </div>
                    <div>
                      <h3 className='text-lg font-medium mb-1'>
                        Emergency Response
                      </h3>
                      <p className='text-gray-600'>
                        For urgent situations where a dog's life is in immediate
                        danger, please call our emergency hotline.
                      </p>
                    </div>
                  </div>
                </div>

                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='bg-white p-6 rounded-lg border shadow-sm text-center'>
                    <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500 mb-4'>
                      <Phone className='h-6 w-6' />
                    </div>
                    <h3 className='text-xl font-semibold'>Call Our Hotline</h3>
                    <p className='text-gray-500 mb-4'>
                      Our rescue team is available 24/7 for emergency situations
                    </p>
                    <a href='tel:+915551234567'>
                      <Button className='bg-orange-500 hover:bg-orange-600 w-full'>
                        +91 555-123-4567
                      </Button>
                    </a>
                  </div>

                  <div className='bg-white p-6 rounded-lg border shadow-sm text-center'>
                    <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mb-4'>
                      <MessageCircle className='h-6 w-6' />
                    </div>
                    <h3 className='text-xl font-semibold'>WhatsApp Us</h3>
                    <p className='text-gray-500 mb-4'>
                      Send details and photos via WhatsApp for quick response
                    </p>
                    <a
                      href='https://wa.me/915551234567'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Button className='bg-green-500 hover:bg-green-600 w-full'>
                        Contact on WhatsApp
                      </Button>
                    </a>
                  </div>
                </div>

                <div className='bg-blue-50 p-6 rounded-lg border border-blue-200'>
                  <h3 className='font-medium mb-2'>
                    What information to provide:
                  </h3>
                  <ul className='space-y-2 list-disc pl-5 text-gray-700'>
                    <li>Precise location of the dog</li>
                    <li>
                      Description of the dog (color, breed if known, size)
                    </li>
                    <li>Description of injuries or condition</li>
                    <li>How long the dog has been there (if known)</li>
                    <li>Photos of the dog (if possible and safe to take)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
export default ReportPage;
