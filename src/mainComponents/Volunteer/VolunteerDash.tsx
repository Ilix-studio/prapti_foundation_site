import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetVolunteerApplicationsQuery,
  useDeleteVolunteerApplicationMutation,
  useMarkVolunteerAsReadMutation,
} from "../../redux-store/services/volunteerApi";
import * as XLSX from "xlsx";
import {
  Eye,
  Trash2,
  Users,
  AlertCircle,
  Loader2,
  MapPin,
  Download,
  Search,
  Bell,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { BackNavigation } from "@/config/navigation/BackNavigation";
import { Badge } from "@/components/ui/badge";

const VolunteerDash = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );
  const [markAsRead] = useMarkVolunteerAsReadMutation();
  const [isDeletingVolunteer, setIsDeletingVolunteer] = useState(false);
  const [deletingVolunteerId, setDeletingVolunteerId] = useState<string | null>(
    null,
  );
  const [volunteerDeleteError, setVolunteerDeleteError] = useState<
    string | null
  >(null);

  const itemsPerPage = 10;

  // Status configuration for volunteer applications
  const statusConfig = {
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800",
    },
    approved: {
      label: "Approved",
      className: "bg-green-100 text-green-800",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-800",
    },
  };

  // API hooks
  const {
    data: volunteerData,
    isLoading: volunteersLoading,
    error: volunteersError,
    refetch: refetchVolunteers,
  } = useGetVolunteerApplicationsQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const [deleteVolunteerApplication] = useDeleteVolunteerApplicationMutation();

  // Handler functions
  const handleVolunteerById = async (id: string, isRead: boolean) => {
    if (!isRead) {
      try {
        await markAsRead(id).unwrap();
      } catch {
        // non-critical — navigate regardless
      }
    }
    navigate(`/admin/volunteer/${id}`);
  };

  const handleVolunteerDeleteClick = (id: string) => {
    setShowDeleteConfirm(id);
    setVolunteerDeleteError(null);
  };

  const handleVolunteerDeleteCancel = () => {
    setShowDeleteConfirm(null);
    setVolunteerDeleteError(null);
  };

  const handleVolunteerDeleteConfirm = async (id: string) => {
    setIsDeletingVolunteer(true);
    setDeletingVolunteerId(id);
    setVolunteerDeleteError(null);

    try {
      await deleteVolunteerApplication(id).unwrap();
      setShowDeleteConfirm(null);
      refetchVolunteers();
    } catch (error: any) {
      setVolunteerDeleteError(
        error?.data?.message || "Failed to delete volunteer application",
      );
    } finally {
      setIsDeletingVolunteer(false);
      setDeletingVolunteerId(null);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Replace handleExportData function
  const handleExportData = () => {
    if (!filteredVolunteers || filteredVolunteers.length === 0) {
      alert("No data to export");
      return;
    }

    // Format data for Excel
    const exportData = filteredVolunteers.map((volunteer, index) => ({
      "S.No": index + 1,
      "First Name": volunteer.firstName,
      "Last Name": volunteer.lastName,
      Email: volunteer.email,
      Phone: volunteer.phone,
      District: volunteer.district,
      State: volunteer.state,
      Pincode: volunteer.pincode,
      Address: volunteer.address || "",
      Interests: volunteer.interests?.join(", ") || "",
      Experience: volunteer.experience || "",
      Availability: volunteer.availability || "",
      "Submitted At": new Date(volunteer.submittedAt).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Volunteers");

    // Set column widths
    const columnWidths = [
      { wch: 6 }, // S.No
      { wch: 15 }, // First Name
      { wch: 15 }, // Last Name
      { wch: 25 }, // Email
      { wch: 15 }, // Phone
      { wch: 15 }, // District
      { wch: 15 }, // State
      { wch: 10 }, // Pincode
      { wch: 30 }, // Address
      { wch: 30 }, // Interests
      { wch: 20 }, // Experience
      { wch: 30 }, // Why Volunteer
      { wch: 20 }, // Availability
      { wch: 20 }, // Submitted At
    ];
    worksheet["!cols"] = columnWidths;

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `volunteer_applications_${timestamp}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);
  };

  // Filter volunteers based on search and status
  const filteredVolunteers =
    volunteerData?.data?.filter((volunteer) => {
      const matchesSearch =
        `${volunteer.firstName} ${volunteer.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.state.toLowerCase().includes(searchTerm.toLowerCase());

      // Add status filtering logic here if needed
      const matchesStatus = statusFilter === "all" || true; // Implement status logic

      return matchesSearch && matchesStatus;
    }) || [];

  // Pagination calculations
  const totalItems = volunteerData?.pagination?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Statistics for dashboard cards
  const stats = {
    total: totalItems,
    unread: volunteerData?.data?.filter((v) => !v.isRead).length || 0,
    pending:
      volunteerData?.data?.filter((v) => v.status === "pending").length || 0,
    approved:
      volunteerData?.data?.filter((v) => v.status === "approved").length || 0,
  };

  return (
    <>
      <BackNavigation />
      <div className='container mx-auto p-6 space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 flex items-center gap-3'>
              Volunteer Applications
            </h1>
            <p className='text-gray-600 mt-1'>
              Manage and review volunteer applications
            </p>
          </div>
          <div className='flex gap-3'>
            <Button
              variant='outline'
              onClick={handleExportData}
              className='flex items-center gap-2'
            >
              <Download className='h-4 w-4' />
              Export Data
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Total Applications
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {stats.total}
                  </p>
                </div>
                <div className='h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <Users className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>Unread</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {stats.unread}
                  </p>
                </div>
                <div className='h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center'>
                  <Bell className='h-6 w-6 text-orange-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Pending Review
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {stats.pending}
                  </p>
                </div>
                <div className='h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center'>
                  <Clock className='h-6 w-6 text-yellow-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>Approved</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {stats.approved}
                  </p>
                </div>
                <div className='h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center'>
                  <CheckCircle2 className='h-6 w-6 text-green-600' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Section */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg font-semibold'>
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='flex-1'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <Input
                    placeholder='Search by name, email, or location...'
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className='pl-10'
                  />
                </div>
              </div>
              <div className='w-full sm:w-48'>
                <Select
                  value={statusFilter}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Filter by status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Applications</SelectItem>
                    <SelectItem value='pending'>Pending</SelectItem>
                    <SelectItem value='approved'>Approved</SelectItem>
                    <SelectItem value='rejected'>Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {volunteerDeleteError && (
          <div className='p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 flex items-center gap-3'>
            <AlertCircle className='h-5 w-5 ' />
            <span>{volunteerDeleteError}</span>
          </div>
        )}

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg font-semibold'>
                Volunteer Applications
              </CardTitle>
              <div className='text-sm text-gray-500'>
                Showing {startItem}-{endItem} of {totalItems} applications
              </div>
            </div>
          </CardHeader>
          <CardContent className='p-0'>
            {volunteersLoading ? (
              <div className='p-12 text-center text-gray-500 flex justify-center items-center'>
                <Loader2 className='h-6 w-6 animate-spin mr-3' />
                Loading applications...
              </div>
            ) : volunteersError ? (
              <div className='p-12 text-center text-red-500 flex justify-center items-center'>
                <AlertCircle className='h-6 w-6 mr-3' />
                Error loading volunteer applications
              </div>
            ) : filteredVolunteers.length > 0 ? (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50 border-b border-gray-200'>
                    <tr>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                        Volunteer
                      </th>

                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                        Location
                      </th>

                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                        Submitted
                      </th>
                      <th className='px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {filteredVolunteers.map((volunteer) => (
                      <tr
                        key={volunteer._id}
                        className='hover:bg-gray-50 transition-colors'
                      >
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div className='h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center'>
                              <span className='text-sm font-semibold text-orange-700'>
                                {volunteer.firstName.charAt(0)}
                                {volunteer.lastName.charAt(0)}
                              </span>
                            </div>
                            <div className='ml-4'>
                              <div className='text-sm font-semibold text-gray-900'>
                                {volunteer.firstName} {volunteer.lastName}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-900 flex items-center gap-2'>
                            <MapPin className='h-4 w-4 text-gray-400' />
                            {volunteer.district}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {volunteer.state} - {volunteer.pincode}
                          </div>
                        </td>

                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-900'>
                            {new Date(volunteer.submittedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {new Date(volunteer.submittedAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          {showDeleteConfirm === volunteer._id ? (
                            <div className='flex justify-end gap-2'>
                              <span className='text-sm text-gray-600 mr-2 self-center'>
                                Confirm delete?
                              </span>
                              <Button
                                variant='outline'
                                size='sm'
                                className='text-red-600 border-red-300 hover:bg-red-50'
                                onClick={() =>
                                  handleVolunteerDeleteConfirm(volunteer._id)
                                }
                                disabled={
                                  isDeletingVolunteer &&
                                  deletingVolunteerId === volunteer._id
                                }
                              >
                                {isDeletingVolunteer &&
                                deletingVolunteerId === volunteer._id ? (
                                  <Loader2 className='h-4 w-4 animate-spin mr-1' />
                                ) : null}
                                Yes
                              </Button>
                              <Button
                                variant='outline'
                                size='sm'
                                className='text-gray-600 border-gray-300 hover:bg-gray-50'
                                onClick={handleVolunteerDeleteCancel}
                                disabled={
                                  isDeletingVolunteer &&
                                  deletingVolunteerId === volunteer._id
                                }
                              >
                                No
                              </Button>
                            </div>
                          ) : (
                            <div className='flex justify-end gap-2'>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                                onClick={() =>
                                  handleVolunteerById(
                                    volunteer._id,
                                    volunteer.isRead,
                                  )
                                }
                              >
                                <Eye className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-red-600 hover:text-red-800 hover:bg-red-50'
                                onClick={() =>
                                  handleVolunteerDeleteClick(volunteer._id)
                                }
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                          )}
                        </td>
                        {/* Status */}
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <Badge
                            className={`border text-xs font-medium ${statusConfig[volunteer.status as keyof typeof statusConfig]?.className || "bg-gray-100 text-gray-800"}`}
                          >
                            {statusConfig[
                              volunteer.status as keyof typeof statusConfig
                            ]?.label || "Unknown"}
                          </Badge>

                          {volunteer.status === "approved" &&
                            volunteer.approvedAt && (
                              <p className='text-xs text-gray-400 mt-1'>
                                {new Date(
                                  volunteer.approvedAt,
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            )}

                          {volunteer.status === "rejected" && (
                            <>
                              {volunteer.rejectedAt && (
                                <p className='text-xs text-gray-400 mt-1'>
                                  {new Date(
                                    volunteer.rejectedAt,
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              )}
                              {volunteer.rejectionReason && (
                                <p
                                  className='text-xs text-red-400 mt-0.5 max-w-[140px] truncate'
                                  title={volunteer.rejectionReason}
                                >
                                  {volunteer.rejectionReason}
                                </p>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className='p-12 text-center text-gray-500'>
                <Users className='h-12 w-12 mx-auto mb-4 text-gray-300' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  No volunteer applications found
                </h3>
                <p className='text-gray-500 mb-6'>
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "No volunteer applications have been submitted yet."}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Link to='/volunteer'>
                    <Button className='bg-orange-500 hover:bg-orange-600'>
                      View Application Form
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex items-center justify-between'>
            <div className='text-sm text-gray-700'>
              Showing {startItem} to {endItem} of {totalItems} results
            </div>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber =
                  currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (pageNumber > totalPages) return null;

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size='sm'
                    onClick={() => setCurrentPage(pageNumber)}
                    className={
                      currentPage === pageNumber
                        ? "bg-orange-500 hover:bg-orange-600"
                        : ""
                    }
                  >
                    {pageNumber}
                  </Button>
                );
              })}

              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VolunteerDash;
