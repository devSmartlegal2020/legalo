import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  Mail,
  Clock,
  UserX,
  CheckCircle,
  FileDown,
} from 'lucide-react';
import { newsletterAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

interface Subscriber {
  _id: string;
  email: string;
  name?: string;
  status: 'pending' | 'confirmed' | 'unsubscribed';
  signupSource?: string;
  subscribedAt: string;
  confirmedAt?: string;
  unsubscribedAt?: string;
}

interface Stats {
  total: number;
  confirmed: number;
  pending: number;
  unsubscribed: number;
}

const NewsletterSubscribers = () => {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    confirmed: 0,
    pending: 0,
    unsubscribed: 0,
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'delete' | 'confirm' | null>(null);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
  });
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const signupSources = [
    'ebook_page',
    'blog_section',
    'footer',
    'popup',
    'event_page',
    'landing_page',
    'other',
  ];

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchData();
      fetchStats();
    }
  }, [authLoading, isAuthenticated, page, limit, search, statusFilter, sourceFilter]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setSelectedIds([]);

      const params: any = {
        page,
        limit,
      };

      if (search.trim()) {
        params.search = search.trim();
      }
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (sourceFilter !== 'all') {
        params.signupSource = sourceFilter;
      }

      const response = await newsletterAPI.getAllSubscribers(params);
      setSubscribers(response.data.data.subscribers);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
      toast.error('Failed to load subscribers');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await newsletterAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await newsletterAPI.deleteSubscriber(deleteId);
      toast.success('Subscriber deleted successfully');

      if (subscribers.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchData();
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to delete subscriber:', error);
      toast.error('Failed to delete subscriber');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await newsletterAPI.updateSubscriber(id, { status: 'confirmed' });
      toast.success('Subscriber confirmed successfully');
      fetchData();
      fetchStats();
    } catch (error) {
      console.error('Failed to confirm subscriber:', error);
      toast.error('Failed to confirm subscriber');
    }
  };

  const handleUpdate = async () => {
    if (!editingSubscriber) return;

    try {
      setIsUpdating(true);
      await newsletterAPI.updateSubscriber(editingSubscriber._id, {
        name: editingSubscriber.name,
        status: editingSubscriber.status,
      });
      toast.success('Subscriber updated successfully');
      setEditingSubscriber(null);
      fetchData();
      fetchStats();
    } catch (error) {
      console.error('Failed to update subscriber:', error);
      toast.error('Failed to update subscriber');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const response = await newsletterAPI.exportSubscribers(
        statusFilter !== 'all' ? statusFilter : undefined
      );

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Subscribers exported successfully');
    } catch (error) {
      console.error('Failed to export subscribers:', error);
      toast.error('Failed to export subscribers');
    } finally {
      setIsExporting(false);
    }
  };

  // Bulk action handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(subscribers.map((sub) => sub._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectSubscriber = (subscriberId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, subscriberId]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== subscriberId));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      setIsBulkProcessing(true);
      const response = await newsletterAPI.bulkDeleteSubscribers(selectedIds);
      const deletedCount = response.data.data.deletedCount;

      toast.success(`${deletedCount} subscriber(s) deleted successfully`);
      setSelectedIds([]);

      const remainingOnPage = subscribers.length - selectedIds.length;
      if (remainingOnPage === 0 && page > 1) {
        setPage(page - 1);
      } else {
        fetchData();
        fetchStats();
      }
    } catch (error: any) {
      console.error('Failed to bulk delete subscribers:', error);
      toast.error(error.response?.data?.message || 'Failed to delete subscribers');
    } finally {
      setIsBulkProcessing(false);
      setBulkAction(null);
    }
  };

  const handleBulkConfirm = async () => {
    if (selectedIds.length === 0) return;

    try {
      setIsBulkProcessing(true);
      let confirmedCount = 0;

      // Process sequentially to avoid overwhelming the server
      for (const id of selectedIds) {
        const subscriber = subscribers.find((s) => s._id === id);
        if (subscriber && subscriber.status === 'pending') {
          await newsletterAPI.updateSubscriber(id, { status: 'confirmed' });
          confirmedCount++;
        }
      }

      toast.success(`${confirmedCount} subscriber(s) confirmed successfully`);
      setSelectedIds([]);
      fetchData();
      fetchStats();
    } catch (error: any) {
      console.error('Failed to bulk confirm subscribers:', error);
      toast.error(error.response?.data?.message || 'Failed to confirm subscribers');
    } finally {
      setIsBulkProcessing(false);
      setBulkAction(null);
    }
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  // Pagination helpers
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: string) => {
    setLimit(parseInt(newLimit));
    setPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.pages;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, pagination.total);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600">Pending</Badge>;
      case 'unsubscribed':
        return <Badge variant="outline" className="text-gray-500">Unsubscribed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatSource = (source?: string) => {
    if (!source) return 'Unknown';
    return source
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
          <p className="text-gray-500 mt-1">Manage your newsletter subscribers</p>
        </div>
        <Button onClick={handleExport} disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4 mr-2" />
          )}
          Export CSV
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Subscribers</p>
              <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold">{stats.confirmed.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold">{stats.pending.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <UserX className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Unsubscribed</p>
              <p className="text-2xl font-bold">{stats.unsubscribed.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sourceFilter}
          onValueChange={(value) => {
            setSourceFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {signupSources.map((source) => (
              <SelectItem key={source} value={source}>
                {formatSource(source)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={limit.toString()} onValueChange={handleLimitChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="10 per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
            <SelectItem value="100">100 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        {selectedIds.length > 0 && (
          <div className="bg-muted/50 p-3 border-b flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedIds.length} subscriber{selectedIds.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkAction('confirm')}
                disabled={isBulkProcessing}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setBulkAction('delete')}
                disabled={isBulkProcessing}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                disabled={isBulkProcessing}
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    subscribers.length > 0 && selectedIds.length === subscribers.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Subscribed Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : subscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No subscribers found
                </TableCell>
              </TableRow>
            ) : (
              subscribers.map((subscriber) => (
                <TableRow key={subscriber._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(subscriber._id)}
                      onCheckedChange={(checked) =>
                        handleSelectSubscriber(subscriber._id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{subscriber.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{subscriber.name || '-'}</TableCell>
                  <TableCell>{getStatusBadge(subscriber.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {formatSource(subscriber.signupSource)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(subscriber.subscribedAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="flex items-center"
                          onClick={() => setEditingSubscriber(subscriber)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {subscriber.status === 'pending' && (
                          <DropdownMenuItem
                            className="flex items-center text-green-600"
                            onClick={() => handleConfirm(subscriber._id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirm
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeleteId(subscriber._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {!isLoading && pagination.total > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {startItem}-{endItem} of {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={page === 1 || isLoading}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNum, index) =>
                  pageNum === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(pageNum as number)}
                      disabled={isLoading}
                      className="min-w-[40px]"
                    >
                      {pageNum}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pagination.pages || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.pages)}
                disabled={page === pagination.pages || isLoading}
              >
                Last
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the subscriber.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={bulkAction === 'delete'} onOpenChange={() => setBulkAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedIds.length} subscriber{selectedIds.length !== 1 ? 's' : ''}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedIds.length} subscriber
              {selectedIds.length !== 1 ? 's' : ''}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isBulkProcessing}
            >
              {isBulkProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete {selectedIds.length} Subscriber{selectedIds.length !== 1 ? 's' : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Confirm Confirmation */}
      <AlertDialog open={bulkAction === 'confirm'} onOpenChange={() => setBulkAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm {selectedIds.length} subscriber{selectedIds.length !== 1 ? 's' : ''}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will confirm {selectedIds.length} pending subscriber{selectedIds.length !== 1 ? 's' : ''} and allow them to receive newsletters.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkConfirm}
              className="bg-green-600 hover:bg-green-700"
              disabled={isBulkProcessing}
            >
              {isBulkProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Confirm {selectedIds.length} Subscriber{selectedIds.length !== 1 ? 's' : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingSubscriber} onOpenChange={() => setEditingSubscriber(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscriber</DialogTitle>
            <DialogDescription>Update subscriber information</DialogDescription>
          </DialogHeader>
          {editingSubscriber && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={editingSubscriber.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editingSubscriber.name || ''}
                  onChange={(e) =>
                    setEditingSubscriber({ ...editingSubscriber, name: e.target.value })
                  }
                  placeholder="Subscriber name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editingSubscriber.status}
                  onValueChange={(value: 'pending' | 'confirmed' | 'unsubscribed') =>
                    setEditingSubscriber({ ...editingSubscriber, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSubscriber(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsletterSubscribers;
