import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Mail,
  Search,
  Eye,
  Trash2,
  MailOpen,
  MailCheck,
  Calendar,
  MessageCircle,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import { Navigate, useNavigate } from "react-router-dom";
import {
  useGetContactMessagesQuery,
  useMarkMessageAsReadMutation,
  useDeleteContactMessageMutation,
} from "@/redux-store/services/contactApi";

import { BackNavigation } from "@/config/navigation/BackNavigation";
import { FilterState } from "@/types/contact.types";

const ViewAllMessage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    readStatus: "all",
    sortBy: "newest",
  });
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  // API hooks
  const {
    data: messagesData,
    isLoading,
    error,
    refetch,
  } = useGetContactMessagesQuery({
    page: currentPage,
    limit: 12,
    read:
      filters.readStatus === "all" ? undefined : filters.readStatus === "read",
  });

  const [markMessageAsRead, { isLoading: markingAsRead }] =
    useMarkMessageAsReadMutation();
  const [deleteMessage, { isLoading: deleting }] =
    useDeleteContactMessageMutation();

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  // Filter and sort messages
  const filteredMessages =
    messagesData?.data?.filter((message) => {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch =
        message.name.toLowerCase().includes(searchTerm) ||
        message.email.toLowerCase().includes(searchTerm) ||
        message.subject.toLowerCase().includes(searchTerm) ||
        message.message.toLowerCase().includes(searchTerm);

      return matchesSearch;
    }) || [];

  // Sort messages
  const sortedMessages = [...filteredMessages].sort((a, b) => {
    switch (filters.sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "name":
        return a.name.localeCompare(b.name);
      case "subject":
        return a.subject.localeCompare(b.subject);
      default:
        return 0;
    }
  });

  const handleMarkAsRead = async (
    messageId: string,
    currentReadStatus: boolean
  ) => {
    try {
      await markMessageAsRead({
        id: messageId,
        isRead: !currentReadStatus,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update message status:", error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId).unwrap();
      setSelectedMessages((prev) => prev.filter((id) => id !== messageId));
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleBulkMarkAsRead = async (isRead: boolean) => {
    const promises = selectedMessages.map((messageId) => {
      const message = sortedMessages.find((m) => m._id === messageId);
      if (message && message.isRead !== isRead) {
        return markMessageAsRead({ id: messageId, isRead }).unwrap();
      }
      return Promise.resolve();
    });

    try {
      await Promise.all(promises);
      setSelectedMessages([]);
    } catch (error) {
      console.error("Failed to bulk update messages:", error);
    }
  };

  const handleBulkDelete = async () => {
    const promises = selectedMessages.map((messageId) =>
      deleteMessage(messageId).unwrap()
    );

    try {
      await Promise.all(promises);
      setSelectedMessages([]);
    } catch (error) {
      console.error("Failed to bulk delete messages:", error);
    }
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === sortedMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(sortedMessages.map((m) => m._id));
    }
  };

  const handleViewMessage = (messageId: string) => {
    navigate(`/admin/messages/${messageId}`);
  };

  const getStatusColor = (isRead: boolean) => {
    return isRead ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getTotalPages = () => {
    return messagesData?.pagination?.pages || 1;
  };

  if (isLoading && currentPage === 1) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 animate-spin text-[#FF9933] mx-auto mb-4' />
          <p className='text-gray-600'>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackNavigation />

      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100'>
        <div className='container mx-auto px-4 py-6'>
          {/* Filters and Actions Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white rounded-lg shadow-sm border p-4 mb-6'
          >
            <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
              {/* Search and Filters */}
              <div className='flex flex-col sm:flex-row gap-3 flex-1'>
                <div className='relative flex-1 max-w-md'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                  <Input
                    placeholder='Search messages...'
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                    className='pl-10'
                  />
                </div>

                <div className='flex gap-2'>
                  <Select
                    value={filters.readStatus}
                    onValueChange={(value: "all" | "read" | "unread") =>
                      setFilters((prev) => ({ ...prev, readStatus: value }))
                    }
                  >
                    <SelectTrigger className='w-32'>
                      <SelectValue placeholder='Status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All</SelectItem>
                      <SelectItem value='unread'>Unread</SelectItem>
                      <SelectItem value='read'>Read</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.sortBy}
                    onValueChange={(
                      value: "newest" | "oldest" | "name" | "subject"
                    ) => setFilters((prev) => ({ ...prev, sortBy: value }))}
                  >
                    <SelectTrigger className='w-32'>
                      <SelectValue placeholder='Sort by' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='newest'>Newest</SelectItem>
                      <SelectItem value='oldest'>Oldest</SelectItem>
                      <SelectItem value='name'>Name</SelectItem>
                      <SelectItem value='subject'>Subject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedMessages.length > 0 && (
                <div className='flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200'>
                  <span className='text-sm text-blue-800 font-medium'>
                    {selectedMessages.length} selected
                  </span>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handleBulkMarkAsRead(true)}
                    disabled={markingAsRead}
                    className='text-xs'
                  >
                    Mark Read
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handleBulkMarkAsRead(false)}
                    disabled={markingAsRead}
                    className='text-xs'
                  >
                    Mark Unread
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size='sm'
                        variant='destructive'
                        disabled={deleting}
                        className='text-xs'
                      >
                        <Trash2 className='w-3 h-3 mr-1' />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete Selected Messages
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete{" "}
                          {selectedMessages.length} selected messages? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleBulkDelete}
                          className='bg-red-600 hover:bg-red-700'
                        >
                          Delete Messages
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </motion.div>

          {/* Messages Grid */}
          {error ? (
            <Card className='text-center py-12'>
              <CardContent>
                <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Failed to load messages
                </h3>
                <p className='text-gray-600 mb-4'>
                  There was an error loading the messages. Please try again.
                </p>
                <Button onClick={refetch} variant='outline'>
                  <RefreshCw className='w-4 h-4 mr-2' />
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : sortedMessages.length === 0 ? (
            <Card className='text-center py-12'>
              <CardContent>
                <MessageCircle className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  {filters.search || filters.readStatus !== "all"
                    ? "No messages found"
                    : "No messages yet"}
                </h3>
                <p className='text-gray-600 mb-4'>
                  {filters.search || filters.readStatus !== "all"
                    ? "Try adjusting your search criteria or filters."
                    : "Messages from your contact form will appear here."}
                </p>
                {(filters.search || filters.readStatus !== "all") && (
                  <Button
                    variant='outline'
                    onClick={() =>
                      setFilters({
                        search: "",
                        readStatus: "all",
                        sortBy: "newest",
                      })
                    }
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Select All Checkbox */}
              <div className='flex items-center gap-3 mb-4 px-2'>
                <input
                  type='checkbox'
                  checked={
                    selectedMessages.length === sortedMessages.length &&
                    sortedMessages.length > 0
                  }
                  onChange={handleSelectAll}
                  className='rounded border-gray-300 text-[#FF9933] focus:ring-[#FF9933]'
                />
                <span className='text-sm text-gray-600'>
                  Select all ({sortedMessages.length} messages)
                </span>
              </div>

              {/* Messages List */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='grid gap-4'
              >
                {sortedMessages.map((message, index) => (
                  <motion.div
                    key={message._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`hover:shadow-md transition-all duration-200 ${
                        !message.isRead
                          ? "ring-2 ring-[#FF9933]/20 bg-orange-50/30"
                          : "hover:bg-slate-50/50"
                      } ${
                        selectedMessages.includes(message._id)
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                    >
                      <CardContent className='p-4'>
                        <div className='flex items-start gap-4'>
                          {/* Checkbox */}
                          <input
                            type='checkbox'
                            checked={selectedMessages.includes(message._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedMessages((prev) => [
                                  ...prev,
                                  message._id,
                                ]);
                              } else {
                                setSelectedMessages((prev) =>
                                  prev.filter((id) => id !== message._id)
                                );
                              }
                            }}
                            className='mt-1 rounded border-gray-300 text-[#FF9933] focus:ring-[#FF9933]'
                          />

                          {/* Message Content */}
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-start justify-between gap-4'>
                              <div className='flex-1 min-w-0'>
                                <div className='flex items-center gap-2 mb-2'>
                                  <h3 className='font-semibold text-gray-900 truncate'>
                                    {message.name}
                                  </h3>
                                  <Badge
                                    className={`text-xs ${getStatusColor(
                                      message.isRead
                                    )}`}
                                  >
                                    {message.isRead ? "Read" : "Unread"}
                                  </Badge>
                                  {!message.isRead && (
                                    <div className='w-2 h-2 bg-[#FF9933] rounded-full' />
                                  )}
                                </div>

                                <div className='space-y-1 mb-3'>
                                  <p className='text-sm text-gray-600 flex items-center gap-1'>
                                    <Mail className='w-3 h-3' />
                                    {message.email}
                                  </p>
                                  <p className='font-medium text-gray-900 line-clamp-1'>
                                    Subject: {message.subject}
                                  </p>
                                  <p className='text-sm text-gray-600 line-clamp-2'>
                                    {message.message}
                                  </p>
                                </div>

                                <div className='flex items-center gap-4 text-xs text-gray-500'>
                                  <span className='flex items-center gap-1'>
                                    <Clock className='w-3 h-3' />
                                  </span>
                                  <span className='flex items-center gap-1'>
                                    <Calendar className='w-3 h-3' />
                                    {new Date(
                                      message.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className='flex items-center gap-2'>
                                <Button
                                  size='sm'
                                  variant='outline'
                                  onClick={() => handleViewMessage(message._id)}
                                  className='flex items-center gap-1'
                                >
                                  <Eye className='w-3 h-3' />
                                  View
                                </Button>

                                <Button
                                  size='sm'
                                  variant='ghost'
                                  onClick={() =>
                                    handleMarkAsRead(
                                      message._id,
                                      message.isRead
                                    )
                                  }
                                  disabled={markingAsRead}
                                  className='flex items-center gap-1'
                                >
                                  {markingAsRead ? (
                                    <Loader2 className='w-3 h-3 animate-spin' />
                                  ) : message.isRead ? (
                                    <MailOpen className='w-3 h-3' />
                                  ) : (
                                    <MailCheck className='w-3 h-3' />
                                  )}
                                  {message.isRead ? "Unread" : "Read"}
                                </Button>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size='sm'
                                      variant='ghost'
                                      className='text-red-600 hover:text-red-700 hover:bg-red-50'
                                      disabled={deleting}
                                    >
                                      {deleting ? (
                                        <Loader2 className='w-3 h-3 animate-spin' />
                                      ) : (
                                        <Trash2 className='w-3 h-3' />
                                      )}
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Message
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this
                                        message from {message.name}? This action
                                        cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteMessage(message._id)
                                        }
                                        className='bg-red-600 hover:bg-red-700'
                                      >
                                        Delete Message
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {getTotalPages() > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className='flex items-center justify-between mt-8 bg-white rounded-lg shadow-sm border p-4'
                >
                  <div className='text-sm text-gray-600'>
                    Showing page {currentPage} of {getTotalPages()}(
                    {messagesData?.pagination?.total} total messages)
                  </div>

                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1 || isLoading}
                    >
                      <ChevronLeft className='w-4 h-4' />
                      Previous
                    </Button>

                    <div className='flex items-center gap-1'>
                      {Array.from(
                        { length: Math.min(5, getTotalPages()) },
                        (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "ghost"
                              }
                              size='sm'
                              onClick={() => setCurrentPage(page)}
                              className='w-8 h-8 p-0'
                            >
                              {page}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(getTotalPages(), prev + 1)
                        )
                      }
                      disabled={currentPage === getTotalPages() || isLoading}
                    >
                      Next
                      <ChevronRight className='w-4 h-4' />
                    </Button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewAllMessage;
