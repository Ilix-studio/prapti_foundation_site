import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  User,
  Loader2,
  AlertCircle,
  Hash,
} from "lucide-react";
import { useGetVolunteerApplicationByIdQuery } from "@/redux-store/services/volunteerApi";

import Footer from "../Footer";

const VolunteerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetVolunteerApplicationByIdQuery(id!);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin mr-2' />
        <span>Loading volunteer details...</span>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <AlertCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <h2 className='text-xl font-semibold mb-2'>Application Not Found</h2>
          <p className='text-gray-600 mb-4'>
            The volunteer application could not be loaded.
          </p>
          <Link to='/admin/dashboard'>
            <Button>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const volunteer = data.data;

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4 max-w-4xl'>
        <div className='mb-6'>
          <Link to='/admin/dashboard'>
            <Button variant='outline' className='mb-4'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className='text-3xl font-bold flex items-center gap-2'>
            <Hash className='h-8 w-8 text-orange-500' />
            Volunteer Application
          </h1>
          <p className='text-gray-600'>
            Submitted on {new Date(volunteer.submittedAt).toLocaleDateString()}
          </p>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Personal Information */}
          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <User className='h-5 w-5' />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Full Name
                  </label>
                  <p className='text-lg font-semibold'>
                    {volunteer.firstName} {volunteer.lastName}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Availability
                  </label>
                  <p className='text-lg capitalize'>{volunteer.availability}</p>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex items-center gap-2'>
                  <Mail className='h-4 w-4 text-gray-400' />
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Email
                    </label>
                    <p>{volunteer.email}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Phone className='h-4 w-4 text-gray-400' />
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Phone
                    </label>
                    <p>{volunteer.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Clock className='h-5 w-5' />
                Application Summary
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-gray-400' />
                <div>
                  <p className='text-sm text-gray-500'>Submitted</p>
                  <p className='font-medium'>
                    {new Date(volunteer.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <p className='text-sm text-gray-500 mb-2'>Areas of Interest</p>
                <p className='font-medium'>
                  {volunteer.interests.length} selected
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Address */}
        <Card className='mt-6'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MapPin className='h-5 w-5' />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div className='md:col-span-4'>
                <label className='text-sm font-medium text-gray-500'>
                  Street Address
                </label>
                <p>{volunteer.address}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-500'>
                  District
                </label>
                <p>{volunteer.district}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-500'>
                  State
                </label>
                <p>{volunteer.state}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Pincode
                </label>
                <p>{volunteer.pincode}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interests */}
        <Card className='mt-6'>
          <CardHeader>
            <CardTitle>Areas of Interest</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {volunteer.interests.map((interest) => (
                <Badge
                  key={interest}
                  className='bg-orange-100 text-orange-800 px-3 py-1'
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Experience & Reason */}
        <div className='grid gap-6 lg:grid-cols-2 mt-6'>
          {volunteer.experience && (
            <Card>
              <CardHeader>
                <CardTitle>Previous Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-700 whitespace-pre-wrap'>
                  {volunteer.experience}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Why They Want to Volunteer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-700 whitespace-pre-wrap'>
                {volunteer.reason}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <br />
      <Footer />
    </div>
  );
};

export default VolunteerDetail;
