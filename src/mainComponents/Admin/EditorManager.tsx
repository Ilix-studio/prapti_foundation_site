import React, { useState } from "react";
import {
  useGetEditorsQuery,
  useCreateEditorMutation,
  useToggleEditorStatusMutation,
  useDeleteEditorMutation,
  useResendEditorCredentialsMutation,
} from "@/redux-store/services/editorApi";
import { Editor } from "@/types/editor.types";
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
  Trash2,
  Loader2,
  AlertCircle,
  Mail,
  Users,
  KeyRound,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { BackNavigation } from "@/config/navigation/BackNavigation";

// Mirrors backend email validation; avoids a round-trip for obvious mistakes.
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const NAME_MAX = 50;

interface CreateFormData {
  name: string;
  email: string;
}

const EMPTY_FORM: CreateFormData = { name: "", email: "" };

const EditorManager: React.FC = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResendDialog, setShowResendDialog] = useState(false);
  const [selectedEditor, setSelectedEditor] = useState<Editor | null>(null);
  const [formData, setFormData] = useState<CreateFormData>(EMPTY_FORM);

  // Per-row pending tracking so one mutation doesn't lock the whole table.
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);

  const {
    data: editors = [],
    isLoading,
    isError,
    refetch,
  } = useGetEditorsQuery();
  const [createEditor, { isLoading: isCreating }] = useCreateEditorMutation();
  const [toggleStatus] = useToggleEditorStatusMutation();
  const [deleteEditor, { isLoading: isDeleting }] = useDeleteEditorMutation();
  const [resendCredentials, { isLoading: isResending }] =
    useResendEditorCredentialsMutation();

  const resetForm = () => setFormData(EMPTY_FORM);

  const validateForm = (): string | null => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    if (!name) return "Name is required";
    if (name.length > NAME_MAX)
      return `Name cannot exceed ${NAME_MAX} characters`;
    if (!email) return "Email is required";
    if (!EMAIL_REGEX.test(email)) return "Please enter a valid email";
    return null;
  };

  const handleCreate = async () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    try {
      const res = await createEditor({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
      }).unwrap();
      toast.success(res.message || "Editor created. Credentials emailed.");
      setShowCreateDialog(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create editor");
    }
  };

  const handleToggle = async (editor: Editor) => {
    setPendingToggleId(editor._id);
    try {
      const res = await toggleStatus(editor._id).unwrap();
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update status");
    } finally {
      setPendingToggleId(null);
    }
  };

  const handleResendConfirm = async () => {
    if (!selectedEditor) return;
    try {
      const res = await resendCredentials(selectedEditor._id).unwrap();
      toast.success(res.message || "New credentials sent");
    } catch (err: any) {
      toast.error(err?.message || "Failed to resend credentials");
    } finally {
      setShowResendDialog(false);
      setSelectedEditor(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEditor) return;
    try {
      const res = await deleteEditor(selectedEditor._id).unwrap();
      toast.success(res.message || "Editor deleted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete editor");
    } finally {
      setShowDeleteDialog(false);
      setSelectedEditor(null);
    }
  };

  return (
    <>
      <BackNavigation />
      <div className='container mx-auto px-4 py-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-2'>
            <Users className='w-6 h-6 text-[#FF9933]' />
            <h1 className='text-2xl font-bold'>Manage Editors</h1>
            <Badge variant='outline' className='ml-2'>
              {editors.length}
            </Badge>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowCreateDialog(true);
            }}
            className='bg-[#FF9933] hover:bg-[#FF9933]/90'
          >
            <Plus className='w-4 h-4 mr-2' />
            Add Editor
          </Button>
        </div>

        {/* States */}
        {isLoading ? (
          <div className='flex items-center justify-center py-16'>
            <Loader2 className='w-6 h-6 animate-spin text-[#FF9933]' />
          </div>
        ) : isError ? (
          <Card>
            <CardContent className='flex flex-col items-center gap-3 py-12'>
              <AlertCircle className='w-8 h-8 text-red-500' />
              <p className='text-muted-foreground'>Failed to load editors.</p>
              <Button variant='outline' onClick={() => refetch()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : editors.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center gap-2 py-12'>
              <Users className='w-8 h-8 text-muted-foreground' />
              <p className='text-muted-foreground'>No editors yet.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className='p-0'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editors.map((editor) => (
                    <TableRow key={editor._id}>
                      <TableCell className='font-medium'>
                        {editor.name}
                      </TableCell>
                      <TableCell>{editor.email}</TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Switch
                            checked={editor.isActive}
                            disabled={pendingToggleId === editor._id}
                            onCheckedChange={() => handleToggle(editor)}
                          />
                          <Badge
                            variant={editor.isActive ? "default" : "secondary"}
                          >
                            {editor.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              setSelectedEditor(editor);
                              setShowResendDialog(true);
                            }}
                          >
                            <KeyRound className='w-4 h-4 mr-1' />
                            Resend
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            className='text-red-600 hover:text-red-700'
                            onClick={() => {
                              setSelectedEditor(editor);
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
            </CardContent>
          </Card>
        )}

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Editor</DialogTitle>
              <DialogDescription>
                A secure password is generated automatically and emailed to the
                editor.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='editor-name'>Name *</Label>
                <Input
                  id='editor-name'
                  placeholder='Full name'
                  value={formData.name}
                  maxLength={NAME_MAX}
                  className='mt-2'
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor='editor-email'>Email *</Label>
                <Input
                  id='editor-email'
                  type='email'
                  placeholder='editor@example.com'
                  value={formData.email}
                  className='mt-2'
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter className='mt-6'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setShowCreateDialog(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type='button'
                onClick={handleCreate}
                disabled={isCreating}
                className='bg-[#FF9933] hover:bg-[#FF9933]/90'
              >
                {isCreating && (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                )}
                <Mail className='w-4 h-4 mr-2' />
                Create & Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Resend Confirmation */}
        <AlertDialog open={showResendDialog} onOpenChange={setShowResendDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Resend Credentials</AlertDialogTitle>
              <AlertDialogDescription>
                This generates a <strong>new password</strong> for{" "}
                <strong>{selectedEditor?.email}</strong> and invalidates the old
                one. Continue?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedEditor(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleResendConfirm}
                disabled={isResending}
                className='bg-[#FF9933] hover:bg-[#FF9933]/90'
              >
                {isResending && (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                )}
                Resend
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Confirmation */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Editor</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <strong>{selectedEditor?.name}</strong> ({selectedEditor?.email}
                )? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedEditor(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className='bg-red-600 hover:bg-red-700'
              >
                {isDeleting && (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                )}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default EditorManager;
