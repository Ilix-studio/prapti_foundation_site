import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Mail,
  User,
  Calendar,
  Loader2,
  AlertCircle,
  MailOpen,
  Trash2,
} from "lucide-react";
import {
  useGetContactMessageByIdQuery,
  useMarkMessageAsReadMutation,
  useDeleteContactMessageMutation,
} from "@/redux-store/services/contactApi";

const ViewMessage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetContactMessageByIdQuery(id!);
  const [markAsRead] = useMarkMessageAsReadMutation();
  const [deleteMessage, { isLoading: isDeleting }] =
    useDeleteContactMessageMutation();

  const handleToggleReadStatus = async () => {
    if (data?.data) {
      try {
        await markAsRead({
          id: data.data._id,
          isRead: !data.data.isRead,
        }).unwrap();
      } catch (err) {
        console.error("Failed to update read status:", err);
      }
    }
  };

  const handleDelete = async () => {
    if (
      data?.data &&
      window.confirm("Are you sure you want to delete this message?")
    ) {
      try {
        await deleteMessage(data.data._id).unwrap();
        navigate("/admin/dashboard");
      } catch (err) {
        console.error("Failed to delete message:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin mr-2' />
        <span>Loading message...</span>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <AlertCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <h2 className='text-xl font-semibold mb-2'>Message Not Found</h2>
          <p className='text-gray-600 mb-4'>The message could not be loaded.</p>
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

  const message = data.data;

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4 max-w-4xl'>
        {/* Header */}
        <div className='mb-6'>
          <Link to='/admin/dashboard'>
            <Button variant='outline' className='mb-4'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Dashboard
            </Button>
          </Link>

          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-bold flex items-center gap-2'>
              <Mail className='h-8 w-8 text-orange-500' />
              Contact Message
            </h1>

            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                onClick={handleToggleReadStatus}
                className={message.isRead ? "text-gray-600" : "text-blue-600"}
              >
                {message.isRead ? (
                  <>
                    <MailOpen className='h-4 w-4 mr-2' />
                    Mark Unread
                  </>
                ) : (
                  <>
                    <Mail className='h-4 w-4 mr-2' />
                    Mark Read
                  </>
                )}
              </Button>

              <Button
                variant='destructive'
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className='h-4 w-4 animate-spin mr-2' />
                ) : (
                  <Trash2 className='h-4 w-4 mr-2' />
                )}
                Delete
              </Button>
            </div>
          </div>

          <div className='flex items-center gap-2 mt-2'>
            <Badge variant={message.isRead ? "secondary" : "default"}>
              {message.isRead ? "Read" : "Unread"}
            </Badge>
            <span className='text-gray-500'>
              Received on {new Date(message.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Message Details */}
        <div className='grid gap-6'>
          {/* Sender Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <User className='h-5 w-5' />
                Sender Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Name
                  </label>
                  <p className='text-lg font-semibold'>{message.name}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Email
                  </label>
                  <p className='text-lg'>
                    <a
                      href={`mailto:${message.email}`}
                      className='text-blue-600 hover:underline'
                    >
                      {message.email}
                    </a>
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-2 text-sm text-gray-500'>
                <Calendar className='h-4 w-4' />
                <span>
                  Sent on {new Date(message.createdAt).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Subject */}
          <Card>
            <CardHeader>
              <CardTitle>Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-lg font-medium'>{message.subject}</p>
            </CardContent>
          </Card>

          {/* Message Content */}
          <Card>
            <CardHeader>
              <CardTitle>Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='prose max-w-none'>
                <p className='text-gray-700 whitespace-pre-wrap leading-relaxed'>
                  {message.message}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Reply */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Reply</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-600 mb-4'>
                Reply directly via email or use your preferred email client.
              </p>
              <Button
                className='bg-orange-500 hover:bg-orange-600'
                onClick={() =>
                  window.open(
                    `mailto:${message.email}?subject=Re: ${message.subject}`
                  )
                }
              >
                <Mail className='h-4 w-4 mr-2' />
                Reply via Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewMessage;
