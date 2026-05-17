import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  BarChart,
} from 'lucide-react';
import { ebookAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface Ebook {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  pages: number;
  coverColor: string;
  iconName: string;
  downloadType: 'upload' | 'external';
  externalUrl?: string;
  fileUrl?: string;
  downloadCount: number;
  status: 'draft' | 'published';
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

interface DownloadRecord {
  _id: string;
  ebookId: string;
  ebookTitle: string;
  email: string;
  name?: string;
  company?: string;
  ipAddress?: string;
  userAgent?: string;
  downloadedAt: string;
}

const EbookList = () => {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'delete' | null>(null);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
  });
  
  // Downloads dialog state
  const [viewDownloadsId, setViewDownloadsId] = useState<string | null>(null);
  const [viewDownloadsTitle, setViewDownloadsTitle] = useState<string>('');
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [isLoadingDownloads, setIsLoadingDownloads] = useState(false);
  const [downloadsPage, setDownloadsPage] = useState(1);
  const [downloadsLimit] = useState(10);
  const [downloadsPagination, setDownloadsPagination] = useState({
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchData();
    }
  }, [authLoading, isAuthenticated, page, limit, search, statusFilter]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setSelectedIds([]); // Clear selection on data fetch
      
      const params: any = {
        page,
        limit,
      };
      
      // Add filters if set
      if (search.trim()) {
        params.search = search.trim();
      }
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response = await ebookAPI.getAll(params);
      
      setEbooks(response.data.data.ebooks);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Failed to fetch e-books:', error);
      toast.error('Failed to load e-books');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDownloads = async (ebookId: string, ebookTitle: string) => {
    try {
      setIsLoadingDownloads(true);
      setViewDownloadsId(ebookId);
      setViewDownloadsTitle(ebookTitle);
      
      const response = await ebookAPI.getAllDownloads({
        page: downloadsPage,
        limit: downloadsLimit,
        ebookId: ebookId,
      });
      
      setDownloads(response.data.data.downloads);
      setDownloadsPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Failed to fetch downloads:', error);
      toast.error('Failed to load download records');
    } finally {
      setIsLoadingDownloads(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await ebookAPI.delete(deleteId);
      toast.success('E-book deleted successfully');
      
      // Refetch data to update pagination
      if (ebooks.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete e-book:', error);
      toast.error('Failed to delete e-book');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Bulk action handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(ebooks.map((ebook) => ebook._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectEbook = (ebookId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, ebookId]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== ebookId));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      setIsBulkProcessing(true);
      const response = await ebookAPI.bulkDelete(selectedIds);
      const deletedCount = response.data.data.deletedCount;
      
      toast.success(`${deletedCount} e-book(s) deleted successfully`);
      setSelectedIds([]);
      
      // Refetch to update pagination and data
      const remainingOnPage = ebooks.length - selectedIds.length;
      if (remainingOnPage === 0 && page > 1) {
        setPage(page - 1);
      } else {
        fetchData();
      }
    } catch (error: any) {
      console.error('Failed to bulk delete e-books:', error);
      toast.error(error.response?.data?.message || 'Failed to delete e-books');
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
    setPage(1); // Reset to page 1 when changing limit
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">E-books</h1>
          <p className="text-gray-500 mt-1">Manage your e-books and digital resources</p>
        </div>
        <Button asChild>
          <Link to="/admin/ebooks/new">
            <Plus className="h-4 w-4 mr-2" />
            New E-book
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search e-books..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to page 1 on search
            }}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={(value) => {
          setStatusFilter(value);
          setPage(1); // Reset to page 1 on filter change
        }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
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
              {selectedIds.length} e-book{selectedIds.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
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
                    ebooks.length > 0 &&
                    selectedIds.length === ebooks.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Pages</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead>Status</TableHead>
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
            ) : ebooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No e-books found
                </TableCell>
              </TableRow>
            ) : (
              ebooks.map((ebook) => (
                <TableRow key={ebook._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(ebook._id)}
                      onCheckedChange={(checked) =>
                        handleSelectEbook(ebook._id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{ebook.title}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Created {formatDate(ebook.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {ebook.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span>{ebook.pages} pages</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{ebook.downloadCount.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={ebook.status === 'published' ? 'default' : 'secondary'}
                    >
                      {ebook.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
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
                          onClick={() => fetchDownloads(ebook._id, ebook.title)}
                        >
                          <BarChart className="h-4 w-4 mr-2" />
                          View Downloads
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/ebook/${ebook.slug}`}
                            target="_blank"
                            className="flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/admin/ebooks/edit/${ebook._id}`}
                            className="flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeleteId(ebook._id)}
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
                {getPageNumbers().map((pageNum, index) => (
                  pageNum === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">...</span>
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
                ))}
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
              This action cannot be undone. This will permanently delete the e-book and all its download records.
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
            <AlertDialogTitle>Delete {selectedIds.length} e-book{selectedIds.length !== 1 ? 's' : ''}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedIds.length} e-book{selectedIds.length !== 1 ? 's' : ''} from your site.
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
              Delete {selectedIds.length} E-book{selectedIds.length !== 1 ? 's' : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Downloads Dialog */}
      <AlertDialog open={!!viewDownloadsId} onOpenChange={() => setViewDownloadsId(null)}>
        <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download Records
            </AlertDialogTitle>
            <AlertDialogDescription>
              Viewing downloads for "{viewDownloadsTitle}"
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="flex-1 overflow-auto my-4">
            {isLoadingDownloads ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : downloads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No download records found for this e-book
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downloads.map((download) => (
                    <TableRow key={download._id}>
                      <TableCell>{formatDate(download.downloadedAt)}</TableCell>
                      <TableCell>{download.name || '-'}</TableCell>
                      <TableCell>{download.email}</TableCell>
                      <TableCell>{download.company || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          
          {downloadsPagination.total > downloadsLimit && (
            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((downloadsPage - 1) * downloadsLimit) + 1}-{Math.min(downloadsPage * downloadsLimit, downloadsPagination.total)} of {downloadsPagination.total} downloads
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDownloadsPage(p => p - 1)}
                  disabled={downloadsPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {downloadsPage} of {downloadsPagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDownloadsPage(p => p + 1)}
                  disabled={downloadsPage === downloadsPagination.pages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EbookList;
