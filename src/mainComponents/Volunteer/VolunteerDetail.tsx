import React from "react";
import { useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
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

import { BackNavigation } from "@/config/navigation/BackNavigation";

const VolunteerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetVolunteerApplicationByIdQuery(id!);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='flex items-center space-x-3'>
          <Loader2 className='h-8 w-8 animate-spin text-orange-500' />
          <span className='text-gray-700 font-medium'>
            Loading volunteer details...
          </span>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center max-w-md'>
          <AlertCircle className='h-16 w-16 text-red-500 mx-auto mb-6' />
          <h2 className='text-2xl font-semibold text-gray-900 mb-3'>
            Application Not Found
          </h2>
        </div>
      </div>
    );
  }

  const volunteer = data.data;

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8 max-w-6xl'>
        {/* Header Section */}
        <div className='mb-8 space-y-4'>
          <BackNavigation />
          <div className='flex items-center space-x-3'>
            <Hash className='h-8 w-8 text-orange-500' />
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                Volunteer Application
              </h1>
              <p className='text-gray-600 mt-1'>
                Submitted on{" "}
                {new Date(volunteer.submittedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className='grid gap-8 lg:grid-cols-12'>
          {/* Main Content */}
          <div className='lg:col-span-8 space-y-8'>
            {/* Personal Information */}
            <Card className='shadow-sm border-0 bg-white'>
              <CardHeader className='pb-6'>
                <CardTitle className='flex items-center gap-3 text-xl text-gray-900'>
                  <User className='h-6 w-6 text-orange-500' />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
                      Full Name
                    </label>
                    <p className='text-xl font-semibold text-gray-900'>
                      {volunteer.firstName} {volunteer.lastName}
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
                      Availability
                    </label>
                    <p className='text-lg capitalize text-gray-700'>
                      {volunteer.availability}
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100'>
                  <div className='flex items-start gap-3'>
                    <Mail className='h-5 w-5 text-gray-400 mt-1' />
                    <div className='space-y-1'>
                      <label className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
                        Email Address
                      </label>
                      <p className='text-gray-700 break-all'>
                        {volunteer.email}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <Phone className='h-5 w-5 text-gray-400 mt-1' />
                    <div className='space-y-1'>
                      <label className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
                        Phone Number
                      </label>
                      <p className='text-gray-700'>{volunteer.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card className='shadow-sm border-0 bg-white'>
              <CardHeader className='pb-6'>
                <CardTitle className='flex items-center gap-3 text-xl text-gray-900'>
                  <MapPin className='h-6 w-6 text-orange-500' />
                  Address Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-6'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
                      Street Address
                    </label>
                    <p className='text-gray-700 leading-relaxed'>
                      {volunteer.address}
                    </p>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
                        District
                      </label>
                      <p className='text-gray-700'>{volunteer.district}</p>
                    </div>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
                        State
                      </label>
                      <p className='text-gray-700'>{volunteer.state}</p>
                    </div>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
                        Pincode
                      </label>
                      <p className='text-gray-700 font-mono'>
                        {volunteer.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card className='shadow-sm border-0 bg-white'>
              <CardHeader className='pb-6'>
                <CardTitle className='text-xl text-gray-900'>
                  Areas of Interest
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-3'>
                  {volunteer.interests.map((interest) => (
                    <Badge
                      key={interest}
                      className='bg-orange-50 text-orange-700 border border-orange-200 px-4 py-2 text-sm font-medium hover:bg-orange-100 transition-colors'
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience & Reason */}
            <div className='grid gap-8 lg:grid-cols-1'>
              {volunteer.experience && (
                <Card className='shadow-sm border-0 bg-white'>
                  <CardHeader className='pb-6'>
                    <CardTitle className='text-xl text-gray-900'>
                      Previous Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
                      {volunteer.experience}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card className='shadow-sm border-0 bg-white'>
                <CardHeader className='pb-6'>
                  <CardTitle className='text-xl text-gray-900'>
                    Motivation to Volunteer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
                    {volunteer.reason}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-4'>
            <Card className='shadow-sm border-0 bg-white sticky top-8'>
              <CardHeader className='pb-6'>
                <CardTitle className='flex items-center gap-3 text-xl text-gray-900'>
                  <Clock className='h-6 w-6 text-orange-500' />
                  Application Summary
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='flex items-start gap-3 p-4 bg-gray-50 rounded-lg'>
                  <Calendar className='h-5 w-5 text-gray-400 mt-1' />
                  <div className='space-y-1'>
                    <p className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
                      Submitted
                    </p>
                    <p className='font-semibold text-gray-900'>
                      {new Date(volunteer.submittedAt).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {new Date(volunteer.submittedAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>

                <div className='p-4 bg-orange-50 border border-orange-200 rounded-lg'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium text-orange-700 uppercase tracking-wide'>
                      Areas of Interest
                    </p>
                    <p className='text-2xl font-bold text-orange-800'>
                      {volunteer.interests.length}
                    </p>
                    <p className='text-sm text-orange-600'>
                      {volunteer.interests.length === 1
                        ? "Area selected"
                        : "Areas selected"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDetail;
