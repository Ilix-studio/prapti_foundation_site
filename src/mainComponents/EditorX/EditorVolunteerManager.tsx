import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  useGetVolunteerApplicationsQuery,
  useGetVolunteerApplicationByIdQuery,
  useApproveVolunteerApplicationMutation,
  useRejectVolunteerApplicationMutation,
  useMarkVolunteerAsReadMutation,
  useDeleteVolunteerApplicationMutation,
} from "@/redux-store/services/volunteerApi";
import { useLogoutEditorMutation } from "@/redux-store/services/editorApi";
import { Volunteer, VolunteerStatus } from "@/types/volunteer.types";
import {
  selectAuth,
  selectIsAdmin,
  selectIsEditor,
} from "@/redux-store/slices/authSlice";
import { Card, CardContent } from "@/components/ui/card";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Eye,
  Trash2,
  Loader2,
  AlertCircle,
  ArrowLeft,
  LogOut,
  Search,
  Download,
  Bell,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import { toast } from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

const STATUS_BADGE: Record<VolunteerStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const EditorVolunteerManager: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);
  const isEditor = useSelector(selectIsEditor);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | VolunteerStatus>(
    "all",
  );

  const [detailId, setDetailId] = useState<string | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Volunteer | null>(null);

  const {
    data: listResp,
    isLoading,
    error,
  } = useGetVolunteerApplicationsQuery({ page, limit: ITEMS_PER_PAGE });

  const { data: detailResp, isLoading: detailLoading } =
    useGetVolunteerApplicationByIdQuery(detailId!, { skip: !detailId });

  const [approve, { isLoading: isApproving }] =
    useApproveVolunteerApplicationMutation();
  const [reject, { isLoading: isRejecting }] =
    useRejectVolunteerApplicationMutation();
  const [markRead] = useMarkVolunteerAsReadMutation();
  const [deleteApplication, { isLoading: isDeleting }] =
    useDeleteVolunteerApplicationMutation();
  const [logoutEditor, { isLoading: isLoggingOut }] = useLogoutEditorMutation();

  const handleLogout = async () => {
    try {
      await logoutEditor().unwrap();
    } catch {
      // best-effort; auth cleared by slice regardless
    } finally {
      navigate("/editor/login", { replace: true });
    }
  };

  const volunteers: Volunteer[] = listResp?.data ?? [];
  const pagination = listResp?.pagination;

  // Client-side search/filter over the current page.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return volunteers.filter((v) => {
      const matchesStatus = statusFilter === "all" || v.status === statusFilter;
      if (!matchesStatus) return false;
      if (!q) return true;
      const haystack =
        `${v.firstName} ${v.lastName} ${v.email} ${v.district} ${v.state}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [volunteers, search, statusFilter]);

  const detail = detailResp?.data;

  const openDetail = (v: Volunteer) => {
    setDetailId(v._id);
    // Auto mark-read on open if unread (fire-and-forget; tag invalidation refreshes).
    if (!v.isRead) {
      markRead(v._id)
        .unwrap()
        .catch(() => {
          /* non-blocking */
        });
    }
  };

  const closeDetail = () => {
    setDetailId(null);
    setShowReject(false);
    setRejectReason("");
  };

  const handleApprove = async () => {
    if (!detailId) return;
    try {
      const res = await approve(detailId).unwrap();
      toast.success(res.message || "Volunteer approved");
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Failed to approve");
    }
  };

  const handleReject = async () => {
    if (!detailId) return;
    try {
      const res = await reject({
        id: detailId,
        reason: rejectReason.trim() || undefined,
      }).unwrap();
      toast.success(res.message || "Volunteer rejected");
      setShowReject(false);
      setRejectReason("");
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Failed to reject");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteApplication(deleteTarget._id).unwrap();
      toast.success(res.message || "Application deleted");
      if (detailId === deleteTarget._id) closeDetail();
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Failed to delete");
    } finally {
      setDeleteTarget(null);
    }
  };

  const exportToExcel = () => {
    if (volunteers.length === 0) {
      toast.error("Nothing to export on this page");
      return;
    }
    const rows = volunteers.map((v) => ({
      Name: `${v.firstName} ${v.lastName}`,
      Email: v.email,
      Phone: v.phone,
      Address: v.address,
      District: v.district,
      State: v.state,
      Pincode: v.pincode,
      Availability: v.availability,
      Interests: v.interests.join(", "),
      Experience: v.experience ?? "",
      Reason: v.reason,
      Status: v.status,
      SubmittedAt: formatDate(v.submittedAt),
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Volunteers");
    XLSX.writeFile(workbook, `volunteers-page-${page}.xlsx`);
  };

  const TopBar = (
    <div className='sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm'>
      <div className='container mx-auto px-4 sm:px-6'>
        <div className='flex items-center justify-between h-16'>
          <Button
            variant='ghost'
            onClick={() => navigate(-1)}
            className='flex items-center gap-2 hover:bg-[#FF9933]/10'
          >
            <ArrowLeft className='w-5 h-5' />
            <span className='font-medium hidden sm:inline'>Back</span>
          </Button>
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant='ghost'
            size='sm'
            className='text-red-600 hover:text-red-700 hover:bg-red-50'
          >
            {isLoggingOut ? (
              <Loader2 className='w-4 h-4 mr-2 animate-spin' />
            ) : (
              <LogOut className='w-4 h-4 mr-2' />
            )}
            <span className='hidden sm:inline'>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated || (!isEditor && !isAdmin)) {
    return (
      <div className='container mx-auto p-6'>
        {TopBar}
        <Alert className='max-w-md mx-auto mt-8'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Editor access required.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      {TopBar}
      <div className='container mx-auto px-4 py-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6 flex-wrap gap-3'>
          <div className='flex items-center gap-2'>
            <Users className='w-6 h-6 text-[#FF9933]' />
            <h1 className='text-2xl font-bold'>Volunteer Applications</h1>
            <Badge variant='outline' className='ml-2'>
              {pagination?.total ?? volunteers.length}
            </Badge>
          </div>
          <Button
            variant='outline'
            onClick={exportToExcel}
            className='flex items-center gap-2'
          >
            <Download className='w-4 h-4' />
            Export Page
          </Button>
        </div>

        {/* Filters */}
        <div className='flex items-center gap-3 mb-6 flex-wrap'>
          <div className='relative flex-1 min-w-[220px]'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <Input
              className='pl-9'
              placeholder='Search name, email, district...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className='rounded-md border border-input bg-background px-3 py-2 text-sm'
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | VolunteerStatus)
            }
          >
            <option value='all'>All statuses</option>
            <option value='pending'>Pending</option>
            <option value='approved'>Approved</option>
            <option value='rejected'>Rejected</option>
          </select>
        </div>

        {/* States */}
        {isLoading ? (
          <div className='flex items-center justify-center py-16'>
            <Loader2 className='w-6 h-6 animate-spin text-[#FF9933]' />
          </div>
        ) : error ? (
          <Card>
            <CardContent className='flex flex-col items-center gap-3 py-12'>
              <AlertCircle className='w-8 h-8 text-red-500' />
              <p className='text-muted-foreground'>
                Failed to load applications.
              </p>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center gap-2 py-12'>
              <Users className='w-8 h-8 text-muted-foreground' />
              <p className='text-muted-foreground'>
                No applications match your filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-3'>
            {filtered.map((v) => (
              <Card key={v._id} className='overflow-hidden'>
                <CardContent className='p-4 flex items-center justify-between gap-4 flex-wrap'>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <h3 className='font-semibold truncate'>
                        {v.firstName} {v.lastName}
                      </h3>
                      {!v.isRead && (
                        <Badge className='bg-[#FF9933]/10 text-[#FF9933] border-[#FF9933]/20'>
                          <Bell className='w-3 h-3 mr-1' />
                          New
                        </Badge>
                      )}
                      <Badge
                        variant='outline'
                        className={STATUS_BADGE[v.status]}
                      >
                        {v.status}
                      </Badge>
                    </div>
                    <div className='mt-1 text-sm text-muted-foreground flex items-center gap-4 flex-wrap'>
                      <span className='flex items-center gap-1 truncate'>
                        <Mail className='w-3 h-3' />
                        {v.email}
                      </span>
                      <span className='flex items-center gap-1'>
                        <MapPin className='w-3 h-3' />
                        {v.district}, {v.state}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Calendar className='w-3 h-3' />
                        {formatDate(v.submittedAt)}
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => openDetail(v)}
                    >
                      <Eye className='w-4 h-4 mr-1' />
                      View
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-red-600 hover:text-red-700'
                      onClick={() => setDeleteTarget(v)}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className='flex items-center justify-center gap-3 mt-6'>
            <Button
              variant='outline'
              size='sm'
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className='text-sm text-muted-foreground'>
              Page {pagination.current} of {pagination.pages}
            </span>
            <Button
              variant='outline'
              size='sm'
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog
          open={!!detailId}
          onOpenChange={(o) => {
            if (!o) closeDetail();
          }}
        >
          <DialogContent className='max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Volunteer Application</DialogTitle>
              <DialogDescription>
                Review the application and take action.
              </DialogDescription>
            </DialogHeader>

            {detailLoading ? (
              <div className='flex items-center justify-center py-12'>
                <Loader2 className='w-6 h-6 animate-spin text-[#FF9933]' />
              </div>
            ) : !detail ? (
              <Alert>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>Application not found.</AlertDescription>
              </Alert>
            ) : (
              <div className='space-y-4'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <h3 className='text-lg font-semibold'>
                    {detail.firstName} {detail.lastName}
                  </h3>
                  <Badge
                    variant='outline'
                    className={STATUS_BADGE[detail.status]}
                  >
                    {detail.status}
                  </Badge>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
                  <div className='flex items-center gap-2'>
                    <Mail className='w-4 h-4 text-muted-foreground' />
                    {detail.email}
                  </div>
                  <div className='flex items-center gap-2'>
                    <Phone className='w-4 h-4 text-muted-foreground' />
                    {detail.phone}
                  </div>
                  <div className='flex items-center gap-2 sm:col-span-2'>
                    <MapPin className='w-4 h-4 text-muted-foreground' />
                    {detail.address}, {detail.district}, {detail.state} -{" "}
                    {detail.pincode}
                  </div>
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4 text-muted-foreground' />
                    Submitted {formatDate(detail.submittedAt)}
                  </div>
                  <div>
                    <span className='text-muted-foreground'>
                      Availability:{" "}
                    </span>
                    {detail.availability}
                  </div>
                </div>

                <div>
                  <p className='text-sm font-medium mb-1'>Interests</p>
                  <div className='flex flex-wrap gap-2'>
                    {detail.interests.length > 0 ? (
                      detail.interests.map((i) => (
                        <Badge key={i} variant='secondary'>
                          {i}
                        </Badge>
                      ))
                    ) : (
                      <span className='text-sm text-muted-foreground'>—</span>
                    )}
                  </div>
                </div>

                {detail.experience && (
                  <div>
                    <p className='text-sm font-medium mb-1'>Experience</p>
                    <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
                      {detail.experience}
                    </p>
                  </div>
                )}

                <div>
                  <p className='text-sm font-medium mb-1'>
                    Reason for volunteering
                  </p>
                  <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
                    {detail.reason}
                  </p>
                </div>

                {detail.status === "rejected" && detail.rejectionReason && (
                  <Alert>
                    <XCircle className='h-4 w-4' />
                    <AlertDescription>
                      Rejected: {detail.rejectionReason}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Reject reason input */}
                {showReject && (
                  <div>
                    <p className='text-sm font-medium mb-1'>
                      Rejection reason (optional)
                    </p>
                    <Textarea
                      rows={3}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder='Shared with the applicant if your email template includes it.'
                    />
                  </div>
                )}
              </div>
            )}

            <DialogFooter className='mt-4 flex-col sm:flex-row gap-2'>
              {detail && detail.status !== "approved" && (
                <Button
                  onClick={handleApprove}
                  disabled={isApproving || isRejecting}
                  className='bg-green-600 hover:bg-green-700'
                >
                  {isApproving ? (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  ) : (
                    <CheckCircle2 className='w-4 h-4 mr-2' />
                  )}
                  Approve
                </Button>
              )}
              {detail && detail.status !== "rejected" && !showReject && (
                <Button
                  variant='outline'
                  onClick={() => setShowReject(true)}
                  disabled={isApproving || isRejecting}
                  className='text-red-600 hover:text-red-700'
                >
                  <XCircle className='w-4 h-4 mr-2' />
                  Reject
                </Button>
              )}
              {detail && showReject && (
                <Button
                  onClick={handleReject}
                  disabled={isRejecting}
                  className='bg-red-600 hover:bg-red-700'
                >
                  {isRejecting && (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  )}
                  Confirm Reject
                </Button>
              )}
              <Button variant='outline' onClick={closeDetail}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog
          open={!!deleteTarget}
          onOpenChange={(o) => {
            if (!o) setDeleteTarget(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Application</AlertDialogTitle>
              <AlertDialogDescription>
                Delete the application from{" "}
                <strong>
                  {deleteTarget?.firstName} {deleteTarget?.lastName}
                </strong>
                ? This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
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

export default EditorVolunteerManager;
