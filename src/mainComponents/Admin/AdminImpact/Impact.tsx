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
    } catch (error: any) {
      toast.error(error || "Failed to create record");
    }
  };

  const handleEdit = (impact: TotalImpact) => {
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
    } catch (error: any) {
      toast.error(error || "Failed to update record");
    }
  };

  const handleDelete = async () => {
    if (!selectedImpact) return;

    try {
      await deleteImpact(selectedImpact._id).unwrap();
      toast.success("Record deleted successfully");
      setShowDeleteDialog(false);
      setSelectedImpact(null);
    } catch (error: any) {
      toast.error(error || "Failed to delete record");
    }
  };

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <BackNavigation />
        <div className='max-w-6xl mx-auto mt-8'>
          <Card className='border-red-200'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-2 text-red-600'>
                <AlertCircle className='w-5 h-5' />
                <p>Failed to load impact data</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-8'
      >
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          Total Impact stats
        </h1>
        <p className='text-gray-600'>Manage foundation impact records</p>
      </motion.div>

      {/* Statistics Cards */}
      {statsData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'
        >
          <Card className='bg-white  border-l-4 border-l-orange-500'>
            <CardContent className='p-6'>
              <div className='flex items-center'>
                <Heart className='w-8 h-8 text-orange-600' />
                <div className='ml-4'>
                  <p className='text-2xl font-bold text-orange-600'>
                    {statsData.data.totalDogsRescued}
                  </p>
                  <p className='text-xs text-gray-600'>Total Dogs Rescued</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white  border-l-4 border-l-orange-500'>
            <CardContent className='p-6'>
              <div className='flex items-center'>
                <Home className='w-8 h-8 text-green-600' />
                <div className='ml-4'>
                  <p className='text-2xl font-bold text-green-600'>
                    {statsData.data.totalDogsAdopted}
                  </p>
                  <p className='text-xs text-gray-600'>Total Dogs Adopted</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white  border-l-4 border-l-orange-500'>
            <CardContent className='p-6'>
              <div className='flex items-center'>
                <Users className='w-8 h-8 text-blue-600' />
                <div className='ml-4'>
                  <p className='text-2xl font-bold text-blue-600'>
                    {statsData.data.totalVolunteers}
                  </p>
                  <p className='text-xs text-gray-600'>Total Volunteers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white  border-l-4 border-l-orange-500'>
            <CardContent className='p-6'>
              <div className='flex items-center'>
                <TrendingUp className='w-8 h-8 text-purple-600' />
                <div className='ml-4'>
                  <p className='text-2xl font-bold text-purple-600'>
                    {statsData.data.avgAdoptionRate.toFixed(1)}%
                  </p>
                  <p className='text-xs text-gray-600'>Avg Adoption Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Actions */}
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold text-gray-900'>Impact Records</h2>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className='bg-gray-600 hover:bg-blue-700'
        >
          <Plus className='w-4 h-4 mr-2' />
          Add Record
        </Button>
      </div>

      {/* Records Table */}
      <Card>
        <CardContent className='p-0'>
          {isLoading ? (
            <div className='flex items-center justify-center p-8'>
              <Loader2 className='w-6 h-6 animate-spin' />
              <span className='ml-2'>Loading records...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dogs Rescued</TableHead>
                  <TableHead>Dogs Adopted</TableHead>
                  <TableHead>Volunteers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {impactData?.data.map((impact) => (
                  <TableRow key={impact._id}>
                    <TableCell>{impact.dogsRescued}</TableCell>
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
                      <div className='flex gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleEdit(impact)}
                        >
                          <Edit2 className='w-4 h-4' />
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            setSelectedImpact(impact);
                            setShowDeleteDialog(true);
                          }}
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

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Impact Record</DialogTitle>
            <DialogDescription>
              Add a new total impact record for the foundation
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <Label htmlFor='dogsRescued'>Dogs Rescued</Label>
                <Input
                  id='dogsRescued'
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
                <Label htmlFor='dogsAdopted'>Dogs Adopted</Label>
                <Input
                  id='dogsAdopted'
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
                <Label htmlFor='volunteers'>Volunteers</Label>
                <Input
                  id='volunteers'
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
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowCreateDialog(false)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Impact Record</DialogTitle>
            <DialogDescription>
              Update the impact record details
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <Label htmlFor='edit-dogsRescued'>Dogs Rescued</Label>
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
                <Label htmlFor='edit-dogsAdopted'>Dogs Adopted</Label>
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
                <Label htmlFor='edit-volunteers'>Volunteers</Label>
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
            <Button variant='outline' onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Update
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
