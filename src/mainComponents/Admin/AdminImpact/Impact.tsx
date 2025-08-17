// src/components/admin/TotalImpactDashboard.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  useUpdateTotalImpactMutation,
  useGetAllTotalImpactQuery,
  useGetImpactStatisticsQuery,
  useCreateTotalImpactMutation,
  useDeleteTotalImpactMutation,
} from "@/redux-store/services/impactApi";
import { TotalImpact, CreateTotalImpactRequest } from "@/types/Impact.types";
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
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  Heart,
  Home,
  TrendingUp,
  Loader2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { BackNavigation } from "@/config/navigation/BackNavigation";

interface FormData {
  dogsRescued: string;
  dogsAdopted: string;
  volunteers: string;
}

const TotalImpactDashboard: React.FC = () => {
  const [currentPage] = useState(1);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedImpact, setSelectedImpact] = useState<TotalImpact | null>(
    null
  );
  const [formData, setFormData] = useState<FormData>({
    dogsRescued: "",
    dogsAdopted: "",
    volunteers: "",
  });
  const [isActive, setIsActive] = useState(true);

  // API hooks
  const {
    data: impactData,
    isLoading,
    error,
    refetch,
  } = useGetAllTotalImpactQuery({
    page: currentPage,
    limit: 10,
  });

  const { data: statsData } = useGetImpactStatisticsQuery();

  const [createImpact, { isLoading: isCreating }] =
    useCreateTotalImpactMutation();
  const [updateImpact, { isLoading: isUpdating }] =
    useUpdateTotalImpactMutation();
  const [deleteImpact, { isLoading: isDeleting }] =
    useDeleteTotalImpactMutation();

  const resetForm = () => {
    setFormData({
      dogsRescued: "",
      dogsAdopted: "",
      volunteers: "",
    });
    setIsActive(true);
  };

  const validateForm = (): boolean => {
    const rescued = parseInt(formData.dogsRescued);
    const adopted = parseInt(formData.dogsAdopted);
    const volunteers = parseInt(formData.volunteers);

    if (isNaN(rescued) || rescued < 0) {
      toast.error("Dogs rescued must be a valid non-negative number");
      return false;
    }
    if (isNaN(adopted) || adopted < 0) {
      toast.error("Dogs adopted must be a valid non-negative number");
      return false;
    }
    if (isNaN(volunteers) || volunteers < 0) {
      toast.error("Volunteers must be a valid non-negative number");
      return false;
    }
    if (adopted > rescued) {
      toast.error("Dogs adopted cannot exceed dogs rescued");
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      const data: CreateTotalImpactRequest = {
        dogsRescued: parseInt(formData.dogsRescued),
        dogsAdopted: parseInt(formData.dogsAdopted),
        volunteers: parseInt(formData.volunteers),
      };

      await createImpact(data).unwrap();
      toast.success("Total impact record created successfully");
      setShowCreateDialog(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create record");
    }
  };

  const openEditDialog = (impact: TotalImpact) => {
    setSelectedImpact(impact);
    setFormData({
      dogsRescued: impact.dogsRescued.toString(),
      dogsAdopted: impact.dogsAdopted.toString(),
      volunteers: impact.volunteers.toString(),
    });
    setIsActive(impact.isActive);
    setShowEditDialog(true);
  };

  const handleUpdate = async () => {
    if (!selectedImpact || !validateForm()) return;

    try {
      await updateImpact({
        id: selectedImpact._id,
        data: {
          dogsRescued: parseInt(formData.dogsRescued),
          dogsAdopted: parseInt(formData.dogsAdopted),
          volunteers: parseInt(formData.volunteers),
          isActive,
        },
      }).unwrap();
      toast.success("Record updated successfully");
      setShowEditDialog(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update record");
    }
  };

  const openDeleteDialog = (impact: TotalImpact) => {
    setSelectedImpact(impact);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedImpact) return;

    try {
      await deleteImpact(selectedImpact._id).unwrap();
      toast.success("Record deleted successfully");
      setShowDeleteDialog(false);
      setSelectedImpact(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete record");
    }
  };

  const openViewDialog = (impact: TotalImpact) => {
    setSelectedImpact(impact);
    setShowViewDialog(true);
  };

  // Statistics cards data
  const statsCards = [
    {
      title: "Total Dogs Rescued",
      value: statsData?.data.totalDogsRescued || 0,
      icon: Heart,
      color: "bg-orange-500",
    },
    {
      title: "Total Dogs Adopted",
      value: statsData?.data.totalDogsAdopted || 0,
      icon: Home,
      color: "bg-green-500",
    },
    {
      title: "Total Volunteers",
      value: statsData?.data.totalVolunteers || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Avg Adoption Rate",
      value: statsData?.data.avgAdoptionRate
        ? `${statsData.data.avgAdoptionRate.toFixed(1)}%`
        : "0.0%",
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
              Error Loading Impact Data
            </h3>
            <p className='text-gray-600 mb-4'>
              Failed to load impact data. Please try again.
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
              Total Impact Management
            </h1>
            <p className='text-gray-600'>
              Manage foundation impact records and statistics
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className='w-4 h-4 mr-2' />
            Add Record
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
                      <p className='text-xl font-bold text-gray-900'>
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Records Table */}
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
                    <TableHead>Dogs Rescued</TableHead>
                    <TableHead>Dogs Adopted</TableHead>
                    <TableHead>Volunteers</TableHead>
                    <TableHead>Adoption Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {impactData?.data.map((impact) => (
                    <TableRow key={impact._id}>
                      <TableCell className='font-medium'>
                        {impact.dogsRescued}
                      </TableCell>
                      <TableCell>{impact.dogsAdopted}</TableCell>
                      <TableCell>{impact.volunteers}</TableCell>
                      <TableCell>{impact.adoptionRate}%</TableCell>
                      <TableCell>
                        <Badge
                          variant={impact.isActive ? "default" : "secondary"}
                        >
                          {impact.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(impact.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => openViewDialog(impact)}
                          >
                            <Eye className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => openEditDialog(impact)}
                          >
                            <Edit2 className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => openDeleteDialog(impact)}
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
        {/* {impactData?.pagination && impactData.pagination.totalPages > 1 && (
          <div className='flex justify-center gap-2'>
            <Button
              variant='outline'
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span className='flex items-center px-4'>
              Page {currentPage} of {impactData.pagination.totalPages}
            </span>
            <Button
              variant='outline'
              disabled={currentPage === impactData.pagination.totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )} */}
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Create Impact Record</DialogTitle>
            <DialogDescription>
              Add a new total impact record for the foundation.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <Label htmlFor='create-dogsRescued'>Dogs Rescued *</Label>
                <Input
                  id='create-dogsRescued'
                  type='number'
                  min='0'
                  placeholder='Enter number'
                  value={formData.dogsRescued}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dogsRescued: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor='create-dogsAdopted'>Dogs Adopted *</Label>
                <Input
                  id='create-dogsAdopted'
                  type='number'
                  min='0'
                  placeholder='Enter number'
                  value={formData.dogsAdopted}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dogsAdopted: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor='create-volunteers'>Volunteers *</Label>
                <Input
                  id='create-volunteers'
                  type='number'
                  min='0'
                  placeholder='Enter number'
                  value={formData.volunteers}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      volunteers: e.target.value,
                    }))
                  }
                />
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
            <DialogTitle>Edit Impact Record</DialogTitle>
            <DialogDescription>
              Update the impact record details and settings.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <Label htmlFor='edit-dogsRescued'>Dogs Rescued *</Label>
                <Input
                  id='edit-dogsRescued'
                  type='number'
                  min='0'
                  value={formData.dogsRescued}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dogsRescued: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor='edit-dogsAdopted'>Dogs Adopted *</Label>
                <Input
                  id='edit-dogsAdopted'
                  type='number'
                  min='0'
                  value={formData.dogsAdopted}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dogsAdopted: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor='edit-volunteers'>Volunteers *</Label>
                <Input
                  id='edit-volunteers'
                  type='number'
                  min='0'
                  value={formData.volunteers}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      volunteers: e.target.value,
                    }))
                  }
                />
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
            <DialogTitle>View Impact Record</DialogTitle>
            <DialogDescription>
              Impact record details and statistics
            </DialogDescription>
          </DialogHeader>
          {selectedImpact && (
            <div className='space-y-4'>
              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Dogs Rescued
                  </Label>
                  <p className='text-2xl font-bold text-orange-600'>
                    {selectedImpact.dogsRescued}
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Dogs Adopted
                  </Label>
                  <p className='text-2xl font-bold text-green-600'>
                    {selectedImpact.dogsAdopted}
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Volunteers
                  </Label>
                  <p className='text-2xl font-bold text-blue-600'>
                    {selectedImpact.volunteers}
                  </p>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Adoption Rate
                  </Label>
                  <p className='text-xl font-bold text-purple-600'>
                    {selectedImpact.adoptionRate}%
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Status
                  </Label>
                  <Badge
                    variant={selectedImpact.isActive ? "default" : "secondary"}
                    className='mt-1'
                  >
                    {selectedImpact.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Created
                  </Label>
                  <p className='text-gray-900'>
                    {new Date(selectedImpact.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>
                    Updated
                  </Label>
                  <p className='text-gray-900'>
                    {new Date(selectedImpact.updatedAt).toLocaleString()}
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
            <AlertDialogTitle>Delete Impact Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this impact record? This action
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

export default TotalImpactDashboard;
