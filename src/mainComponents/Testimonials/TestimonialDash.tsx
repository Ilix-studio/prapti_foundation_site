// src/components/admin/TestimonialDash.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  useGetTestimonialsQuery,
  useGetTestimonialStatsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} from "@/redux-store/services/testimonialApi";
import { ITestimonial } from "@/types/testimonial.types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  MessageSquare,
  Users,
  TrendingUp,
  Loader2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { BackNavigation } from "@/config/navigation/BackNavigation";

interface FormData {
  quote: string;
  name: string;
  profession: string;
  rate: number;
}

const TestimonialDash: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<ITestimonial | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  const [formData, setFormData] = useState<FormData>({
    quote: "",
    name: "",
    profession: "",
    rate: 0,
  });

  // API Hooks
  const {
    data: testimonialsData,
    isLoading,
    error,
    refetch,
  } = useGetTestimonialsQuery({
    page: currentPage,
    limit: 10,
  });

  const { data: statsData } = useGetTestimonialStatsQuery();

  const [createTestimonial, { isLoading: isCreating }] =
    useCreateTestimonialMutation();
  const [updateTestimonial, { isLoading: isUpdating }] =
    useUpdateTestimonialMutation();
  const [deleteTestimonial, { isLoading: isDeleting }] =
    useDeleteTestimonialMutation();

  // Reset form
  const resetForm = () => {
    setFormData({
      quote: "",
      name: "",
      profession: "",
      rate: 0,
    });
    setIsActive(true);
    setHoveredStar(0);
  };

  // Handle Create
  const handleCreate = async () => {
    if (
      !formData.quote.trim() ||
      !formData.name.trim() ||
      !formData.profession.trim() ||
      formData.rate === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createTestimonial({
        quote: formData.quote.trim(),
        name: formData.name.trim(),
        profession: formData.profession.trim(),
        rate: formData.rate,
      }).unwrap();

      toast.success("Testimonial created successfully");
      setShowCreateDialog(false);
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Failed to create testimonial");
      console.error("Create error:", error);
    }
  };

  // Handle Edit
  const openEditDialog = (testimonial: ITestimonial) => {
    setSelectedTestimonial(testimonial);
    setFormData({
      quote: testimonial.quote,
      name: testimonial.name,
      profession: testimonial.profession,
      rate: testimonial.rate,
    });
    setIsActive(testimonial.isActive);
    setShowEditDialog(true);
  };

  const handleUpdate = async () => {
    if (!selectedTestimonial) return;

    if (
      !formData.quote.trim() ||
      !formData.name.trim() ||
      !formData.profession.trim() ||
      formData.rate === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await updateTestimonial({
        id: selectedTestimonial.id,
        data: {
          quote: formData.quote.trim(),
          name: formData.name.trim(),
          profession: formData.profession.trim(),
          rate: formData.rate,
          isActive,
        },
      }).unwrap();

      toast.success("Testimonial updated successfully");
      setShowEditDialog(false);
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Failed to update testimonial");
      console.error("Update error:", error);
    }
  };

  // Handle Delete
  const openDeleteDialog = (testimonial: ITestimonial) => {
    setSelectedTestimonial(testimonial);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedTestimonial) return;

    try {
      await deleteTestimonial(selectedTestimonial.id).unwrap();
      toast.success("Testimonial deleted successfully");
      setShowDeleteDialog(false);
      refetch();
    } catch (error) {
      toast.error("Failed to delete testimonial");
      console.error("Delete error:", error);
    }
  };

  // Handle View
  const openViewDialog = (testimonial: ITestimonial) => {
    setSelectedTestimonial(testimonial);
    setShowViewDialog(true);
  };

  // Star Rating Component
  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = interactive
        ? starValue <= (hoveredStar || formData.rate)
        : starValue <= rating;

      return (
        <button
          key={index}
          type='button'
          disabled={!interactive}
          className={`${interactive ? "cursor-pointer" : "cursor-default"} ${
            isFilled ? "text-yellow-400" : "text-gray-300"
          } ${interactive ? "hover:text-yellow-400" : ""}`}
          onClick={
            interactive
              ? () => setFormData((prev) => ({ ...prev, rate: starValue }))
              : undefined
          }
          onMouseEnter={
            interactive ? () => setHoveredStar(starValue) : undefined
          }
          onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
        >
          <Star className={`w-4 h-4 ${isFilled ? "fill-current" : ""}`} />
        </button>
      );
    });
  };

  // Statistics Cards
  const statsCards = [
    {
      title: "Total Testimonials",
      value: statsData?.data.total || 0,
      icon: MessageSquare,
      color: "bg-blue-500",
    },
    {
      title: "Active Testimonials",
      value: statsData?.data.active || 0,
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Average Rating",
      value: statsData?.data.ratings.averageRating
        ? statsData.data.ratings.averageRating.toFixed(1)
        : "0.0",
      icon: Star,
      color: "bg-yellow-500",
    },
    {
      title: "Recent (30 days)",
      value: statsData?.data.recentlyAdded || 0,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  if (error) {
    return (
      <div className='container mx-auto p-6'>
        <BackNavigation />
        <div className='flex items-center justify-center h-64'>
          <div className='text-center'>
            <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Error Loading Testimonials
            </h3>
            <p className='text-gray-600 mb-4'>
              Failed to load testimonial data. Please try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackNavigation />
      <div className='container mx-auto p-6 space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Testimonial Management
            </h1>
            <p className='text-gray-600'>
              Manage visitors testimonials and reviews
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} disabled>
            <Plus className='w-4 h-4 mr-2' />
            Add Testimonial
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className='p-6'>
                  <div className='flex items-center'>
                    <div className={`${stat.color} p-2 rounded-lg`}>
                      <stat.icon className='w-4 h-4 text-white' />
                    </div>
                    <div className='ml-4'>
                      <p className='text-sm font-medium text-gray-600'>
                        {stat.title}
                      </p>
                      <p className='text-1xl font-bold text-gray-900'>
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Table */}
        <Card>
          <CardContent className='p-0'>
            {isLoading ? (
              <div className='flex items-center justify-center h-64'>
                <Loader2 className='w-8 h-8 animate-spin' />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Profession</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonialsData?.data.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell className='font-medium'>
                        {testimonial.name}
                      </TableCell>
                      <TableCell>{testimonial.profession}</TableCell>
                      <TableCell>
                        <div className='flex items-center gap-1'>
                          {renderStars(testimonial.rate)}
                          <span className='ml-1 text-sm text-gray-600'>
                            ({testimonial.rate})
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            testimonial.isActive ? "default" : "secondary"
                          }
                        >
                          {testimonial.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => openViewDialog(testimonial)}
                          >
                            <Eye className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => openEditDialog(testimonial)}
                          >
                            <Edit2 className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => openDeleteDialog(testimonial)}
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {testimonialsData?.pagination &&
          testimonialsData.pagination.totalPages > 1 && (
            <div className='flex justify-center gap-2'>
              <Button
                variant='outline'
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span className='flex items-center px-4'>
                Page {currentPage} of {testimonialsData.pagination.totalPages}
              </span>
              <Button
                variant='outline'
                disabled={
                  currentPage === testimonialsData.pagination.totalPages
                }
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Create New Testimonial</DialogTitle>
            <DialogDescription>
              Add a new testimonial to showcase customer feedback.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='create-quote'>Quote *</Label>
              <Textarea
                id='create-quote'
                placeholder='Enter testimonial quote...'
                value={formData.quote}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, quote: e.target.value }))
                }
                className='min-h-[100px]'
                maxLength={1000}
              />
              <p className='text-xs text-gray-500 mt-1'>
                {formData.quote.length}/1000 characters
              </p>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='create-name'>Name *</Label>
                <Input
                  id='create-name'
                  placeholder='Enter customer name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor='create-profession'>Profession *</Label>
                <Input
                  id='create-profession'
                  placeholder='Enter profession'
                  value={formData.profession}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profession: e.target.value,
                    }))
                  }
                  maxLength={150}
                />
              </div>
            </div>
            <div>
              <Label>Rating *</Label>
              <div className='flex items-center gap-1 mt-2'>
                {renderStars(formData.rate, true)}
                {formData.rate > 0 && (
                  <span className='ml-2 text-sm text-gray-600'>
                    {formData.rate} star{formData.rate !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setShowCreateDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
            <DialogDescription>
              Update testimonial information and settings.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='edit-quote'>Quote *</Label>
              <Textarea
                id='edit-quote'
                placeholder='Enter testimonial quote...'
                value={formData.quote}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, quote: e.target.value }))
                }
                className='min-h-[100px]'
                maxLength={1000}
              />
              <p className='text-xs text-gray-500 mt-1'>
                {formData.quote.length}/1000 characters
              </p>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='edit-name'>Name *</Label>
                <Input
                  id='edit-name'
                  placeholder='Enter customer name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor='edit-profession'>Profession *</Label>
                <Input
                  id='edit-profession'
                  placeholder='Enter profession'
                  value={formData.profession}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profession: e.target.value,
                    }))
                  }
                  maxLength={150}
                />
              </div>
            </div>
            <div>
              <Label>Rating *</Label>
              <div className='flex items-center gap-1 mt-2'>
                {renderStars(formData.rate, true)}
                {formData.rate > 0 && (
                  <span className='ml-2 text-sm text-gray-600'>
                    {formData.rate} star{formData.rate !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                id='isActive'
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor='isActive'>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setShowEditDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>View Testimonial</DialogTitle>
            <DialogDescription>
              Testimonial details and information
            </DialogDescription>
          </DialogHeader>
          {selectedTestimonial && (
            <div className='space-y-4'>
              <div>
                <Label className='text-sm font-medium text-gray-600'>
                  Quote
                </Label>
                <div className='mt-1 p-3 bg-gray-50 rounded-md'>
                  <p className='text-gray-900'>"{selectedTestimonial.quote}"</p>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Name
                  </Label>
                  <p className='text-gray-900 font-medium'>
                    {selectedTestimonial.name}
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Profession
                  </Label>
                  <p className='text-gray-900'>
                    {selectedTestimonial.profession}
                  </p>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Rating
                  </Label>
                  <div className='flex items-center gap-1 mt-1'>
                    {renderStars(selectedTestimonial.rate)}
                    <span className='ml-1 text-sm text-gray-600'>
                      ({selectedTestimonial.rate}/5)
                    </span>
                  </div>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Status
                  </Label>
                  <Badge
                    variant={
                      selectedTestimonial.isActive ? "default" : "secondary"
                    }
                    className='mt-1'
                  >
                    {selectedTestimonial.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Created
                  </Label>
                  <p className='text-gray-900'>
                    {new Date(selectedTestimonial.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Updated
                  </Label>
                  <p className='text-gray-900'>
                    {new Date(selectedTestimonial.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this testimonial? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className='bg-red-600 hover:bg-red-700'
            >
              {isDeleting && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TestimonialDash;
