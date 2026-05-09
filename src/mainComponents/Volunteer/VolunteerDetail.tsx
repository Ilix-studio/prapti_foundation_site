import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  useGetVolunteerApplicationByIdQuery,
  useApproveVolunteerApplicationMutation,
  useRejectVolunteerApplicationMutation,
} from "@/redux-store/services/volunteerApi";
import { BackNavigation } from "@/config/navigation/BackNavigation";
import { VolunteerStatus } from "@/types/volunteer.types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<
  VolunteerStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
  approved: {
    label: "Approved",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

const VolunteerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useGetVolunteerApplicationByIdQuery(id!);
  const [approveVolunteer, { isLoading: isApproving }] =
    useApproveVolunteerApplicationMutation();
  const [rejectVolunteer, { isLoading: isRejecting }] =
    useRejectVolunteerApplicationMutation();

  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const handleApprove = async () => {
    setActionError(null);
    try {
      await approveVolunteer(id!).unwrap();
    } catch (err: any) {
      setActionError(err?.data?.message || "Failed to approve volunteer");
    }
  };

  const handleRejectConfirm = async () => {
    setActionError(null);
    try {
      await rejectVolunteer({
        id: id!,
        reason: rejectReason.trim() || undefined,
      }).unwrap();
      setShowRejectInput(false);
      setRejectReason("");
    } catch (err: any) {
      setActionError(err?.data?.message || "Failed to reject volunteer");
    }
  };

  const handleRejectCancel = () => {
    setShowRejectInput(false);
    setRejectReason("");
    setActionError(null);
  };

  if (isLoading) {
    return (
      <div className='container mx-auto p-6'>
        <BackNavigation />
        <div className='flex items-center justify-center h-64'>
          <div className='flex items-center space-x-3'>
            <Loader2 className='h-8 w-8 animate-spin text-orange-500' />
            <span className='text-gray-700 font-medium'>
              Loading volunteer details...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className='container mx-auto p-6'>
        <BackNavigation />
        <div className='flex items-center justify-center h-64'>
          <div className='text-center max-w-md'>
            <AlertCircle className='h-16 w-16 text-red-500 mx-auto mb-6' />
            <h2 className='text-2xl font-semibold text-gray-900 mb-3'>
              Application Not Found
            </h2>
          </div>
        </div>
      </div>
    );
  }

  const volunteer = data.data;
  const statusCfg = STATUS_BADGE[volunteer.status ?? "pending"];

  return (
    <>
      <BackNavigation />
      <div className='container mx-auto p-6 space-y-6'>
        {/* Header */}
        <div className='flex items-center space-x-3'>
          <Hash className='h-8 w-8 text-orange-500' />
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Volunteer Application
            </h1>
            <p className='text-gray-600'>
              Submitted on{" "}
              {new Date(volunteer.submittedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-12'>
          {/* Main Content */}
          <div className='lg:col-span-8 space-y-6'>
            {/* Personal Information */}
            <Card className='shadow-sm border-0 bg-white'>
              <CardHeader>
                <CardTitle className='flex items-center gap-3 text-lg text-gray-900'>
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
              <CardHeader>
                <CardTitle className='flex items-center gap-3 text-lg text-gray-900'>
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
              <CardHeader>
                <CardTitle className='text-lg text-gray-900'>
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
            <div className='space-y-6'>
              {volunteer.experience && (
                <Card className='shadow-sm border-0 bg-white'>
                  <CardHeader>
                    <CardTitle className='text-lg text-gray-900'>
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
                <CardHeader>
                  <CardTitle className='text-lg text-gray-900'>
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
          <div className='lg:col-span-4 space-y-4'>
            {/* Application Summary */}
            <Card className='shadow-sm border-0 bg-white sticky top-8'>
              <CardHeader>
                <CardTitle className='flex items-center gap-3 text-lg text-gray-900'>
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
                        },
                      )}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {new Date(volunteer.submittedAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
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

            {/* Status & Actions Card */}
            <Card className='shadow-sm border-0 bg-white'>
              <CardHeader>
                <CardTitle className='text-lg text-gray-900'>
                  Application Status
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Current status */}
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-500'>Current:</span>
                  <Badge
                    className={`border text-xs font-medium ${statusCfg.className}`}
                  >
                    {statusCfg.label}
                  </Badge>
                </div>

                {/* Approved timestamp */}
                {volunteer.status === "approved" && volunteer.approvedAt && (
                  <p className='text-xs text-gray-500'>
                    Approved on{" "}
                    {new Date(volunteer.approvedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </p>
                )}

                {/* Rejected timestamp + reason */}
                {volunteer.status === "rejected" && (
                  <div className='space-y-1'>
                    {volunteer.rejectedAt && (
                      <p className='text-xs text-gray-500'>
                        Rejected on{" "}
                        {new Date(volunteer.rejectedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    )}
                    {volunteer.rejectionReason && (
                      <p className='text-xs text-red-500 italic'>
                        Reason: {volunteer.rejectionReason}
                      </p>
                    )}
                  </div>
                )}

                {/* Error */}
                {actionError && (
                  <div className='flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg'>
                    <AlertCircle className='h-4 w-4 text-red-500 ' />
                    <p className='text-xs text-red-600'>{actionError}</p>
                  </div>
                )}

                {/* Approve button — hidden when already approved */}
                {volunteer.status !== "approved" && (
                  <Button
                    className='w-full bg-green-600 hover:bg-green-700 text-white'
                    onClick={handleApprove}
                    disabled={isApproving || isRejecting}
                  >
                    {isApproving ? (
                      <Loader2 className='h-4 w-4 animate-spin mr-2' />
                    ) : (
                      <CheckCircle className='h-4 w-4 mr-2' />
                    )}
                    Approve & Notify
                  </Button>
                )}

                {/* Reject button — hidden when already rejected */}
                {volunteer.status !== "rejected" && !showRejectInput && (
                  <Button
                    variant='outline'
                    className='w-full text-red-600 border-red-300 hover:bg-red-50'
                    onClick={() => setShowRejectInput(true)}
                    disabled={isApproving}
                  >
                    <XCircle className='h-4 w-4 mr-2' />
                    Reject
                  </Button>
                )}

                {/* Reject input */}
                {showRejectInput && (
                  <div className='space-y-2'>
                    <Input
                      placeholder='Rejection reason (optional)'
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      maxLength={500}
                      className='text-sm'
                    />
                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex-1 text-red-600 border-red-300 hover:bg-red-50'
                        onClick={handleRejectConfirm}
                        disabled={isRejecting}
                      >
                        {isRejecting && (
                          <Loader2 className='h-4 w-4 animate-spin mr-1' />
                        )}
                        Confirm
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex-1'
                        onClick={handleRejectCancel}
                        disabled={isRejecting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default VolunteerDetail;
