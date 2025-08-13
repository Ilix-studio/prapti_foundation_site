import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetVolunteerApplicationsQuery,
  useDeleteVolunteerApplicationMutation,
} from "../../redux-store/services/volunteerApi";
import {
  Eye,
  Trash2,
  Users,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Calendar,
  MapPin,
  Mail,
  Download,
  Plus,
  Search,
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
import { Badge } from "@/components/ui/badge";
import Footer from "../Footer";

const VolunteerDash = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [isDeletingVolunteer, setIsDeletingVolunteer] = useState(false);
  const [deletingVolunteerId, setDeletingVolunteerId] = useState<string | null>(
    null
  );
  const [volunteerDeleteError, setVolunteerDeleteError] = useState<
    string | null
  >(null);

  const itemsPerPage = 10;

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
  const handleVolunteerById = (id: string) => {
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
        error?.data?.message || "Failed to delete volunteer application"
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

  const handleExportData = () => {
    // TODO: Implement CSV export functionality
    console.log("Export volunteer data");
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
    recent:
      volunteerData?.data?.filter((v) => {
        const submittedDate = new Date(v.submittedAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return submittedDate >= weekAgo;
      }).length || 0,
    pending: totalItems, // Assuming all are pending for now
    approved: 0, // TODO: Implement status tracking
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8 max-w-7xl'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-4'>
              <Link to='/admin/dashboard'>
                <Button variant='outline' size='sm'>
                  <ArrowLeft className='h-4 w-4 mr-2' />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-3'>
                  <Users className='h-8 w-8 text-orange-500' />
                  Volunteer Applications
                </h1>
                <p className='text-gray-600 mt-1'>
                  Manage and review volunteer applications
                </p>
              </div>
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
              <Link to='/volunteer'>
                <Button className='bg-orange-500 hover:bg-orange-600 flex items-center gap-2'>
                  <Plus className='h-4 w-4' />
                  View Application Form
                </Button>
              </Link>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
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
                    <p className='text-sm font-medium text-gray-600'>
                      This Week
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {stats.recent}
                    </p>
                  </div>
                  <div className='h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center'>
                    <Calendar className='h-6 w-6 text-green-600' />
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
                  <div className='h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center'>
                    <AlertCircle className='h-6 w-6 text-orange-600' />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Approved
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {stats.approved}
                    </p>
                  </div>
                  <div className='h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                    <Users className='h-6 w-6 text-purple-600' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filter Section */}
        <Card className='mb-6'>
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
          <div className='mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 flex items-center gap-3'>
            <AlertCircle className='h-5 w-5 flex-shrink-0' />
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
                        Contact
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                        Location
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                        Interests
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
                            <Mail className='h-4 w-4 text-gray-400' />
                            {volunteer.email}
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
                        <td className='px-6 py-4'>
                          <div className='flex flex-wrap gap-1 max-w-48'>
                            {volunteer.interests
                              .slice(0, 2)
                              .map((interest, index) => (
                                <Badge
                                  key={index}
                                  variant='secondary'
                                  className='text-xs bg-orange-100 text-orange-700 hover:bg-orange-200'
                                >
                                  {interest}
                                </Badge>
                              ))}
                            {volunteer.interests.length > 2 && (
                              <Badge variant='outline' className='text-xs'>
                                +{volunteer.interests.length - 2} more
                              </Badge>
                            )}
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
                              }
                            )}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {new Date(volunteer.submittedAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
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
                                  handleVolunteerById(volunteer._id)
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
          <div className='mt-6 flex items-center justify-between'>
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

      <Footer />
    </div>
  );
};

export default VolunteerDash;
