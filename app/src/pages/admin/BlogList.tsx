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
  Archive,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { blogAPI, categoryAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'scheduled';
  views: number;
  createdAt: string;
  scheduledPublishAt?: string;
  category: { _id: string; name: string; slug: string };
  author: { name: string };
  isFeatured: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const BlogList = () => {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'delete' | 'archive' | null>(null);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchData();
    }
  }, [authLoading, isAuthenticated, page, limit, search, statusFilter, categoryFilter]);

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
      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }
      
      const [blogsResponse, categoriesResponse] = await Promise.all([
        blogAPI.getAll(params),
        categoryAPI.getAll(),
      ]);
      
      setBlogs(blogsResponse.data.data.blogs);
      setPagination(blogsResponse.data.data.pagination);
      setCategories(categoriesResponse.data.data.categories);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await blogAPI.delete(deleteId);
      toast.success('Blog deleted successfully');
      
      // Refetch data to update pagination
      if (blogs.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete blog:', error);
      toast.error('Failed to delete blog');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Bulk action handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(blogs.map((blog) => blog._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectBlog = (blogId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, blogId]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== blogId));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      setIsBulkProcessing(true);
      const response = await blogAPI.bulkDelete(selectedIds);
      const deletedCount = response.data.data.deletedCount;
      
      toast.success(`${deletedCount} blog(s) deleted successfully`);
      setSelectedIds([]);
      
      // Refetch to update pagination and data
      const remainingOnPage = blogs.length - selectedIds.length;
      if (remainingOnPage === 0 && page > 1) {
        setPage(page - 1);
      } else {
        fetchData();
      }
    } catch (error: any) {
      console.error('Failed to bulk delete blogs:', error);
      toast.error(error.response?.data?.message || 'Failed to delete blogs');
    } finally {
      setIsBulkProcessing(false);
      setBulkAction(null);
    }
  };

  const handleBulkArchive = async () => {
    if (selectedIds.length === 0) return;

    try {
      setIsBulkProcessing(true);
      const response = await blogAPI.bulkArchive(selectedIds);
      const archivedCount = response.data.data.archivedCount;
      
      toast.success(`${archivedCount} blog(s) archived successfully`);
      setSelectedIds([]);
      
      // Refetch to get updated data
      fetchData();
    } catch (error: any) {
      console.error('Failed to bulk archive blogs:', error);
      toast.error(error.response?.data?.message || 'Failed to archive blogs');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blogs</h1>
          <p className="text-gray-500 mt-1">Manage your blog posts</p>
        </div>
        <Button asChild>
          <Link to="/admin/blogs/new">
            <Plus className="h-4 w-4 mr-2" />
            New Blog
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search blogs..."
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
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={(value) => {
          setCategoryFilter(value);
          setPage(1); // Reset to page 1 on filter change
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
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
              {selectedIds.length} post{selectedIds.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkAction('archive')}
                disabled={isBulkProcessing}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive
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
                    blogs.length > 0 &&
                    selectedIds.length === blogs.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No blogs found
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(blog._id)}
                      onCheckedChange={(checked) =>
                        handleSelectBlog(blog._id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{blog.title}</div>
                    {blog.isFeatured && (
                      <Badge variant="secondary" className="mt-1">Featured</Badge>
                    )}
                  </TableCell>
                  <TableCell>{blog.category?.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        blog.status === 'published'
                          ? 'default'
                          : blog.status === 'scheduled'
                          ? 'outline'
                          : 'secondary'
                      }
                      className={
                        blog.status === 'scheduled'
                          ? 'border-blue-500 text-blue-600 hover:bg-blue-50'
                          : undefined
                      }
                    >
                      {blog.status === 'scheduled' && blog.scheduledPublishAt
                        ? `Scheduled · ${new Date(blog.scheduledPublishAt).toLocaleDateString()}`
                        : blog.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{blog.views.toLocaleString()}</TableCell>
                  <TableCell>{blog.author?.name}</TableCell>
                  <TableCell>
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/artikel/${blog.slug}`}
                            target="_blank"
                            className="flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/admin/blogs/edit/${blog._id}`}
                            className="flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeleteId(blog._id)}
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
              This action cannot be undone. This will permanently delete the blog post.
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
            <AlertDialogTitle>Delete {selectedIds.length} blog post{selectedIds.length !== 1 ? 's' : ''}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedIds.length} blog post{selectedIds.length !== 1 ? 's' : ''} from your site.
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
              Delete {selectedIds.length} Post{selectedIds.length !== 1 ? 's' : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Archive Confirmation */}
      <AlertDialog open={bulkAction === 'archive'} onOpenChange={() => setBulkAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive {selectedIds.length} blog post{selectedIds.length !== 1 ? 's' : ''}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will change the status of {selectedIds.length} blog post{selectedIds.length !== 1 ? 's' : ''} to draft and remove them from featured. You can re-publish them anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkArchive}
              className="bg-orange-600 hover:bg-orange-700"
              disabled={isBulkProcessing}
            >
              {isBulkProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Archive className="h-4 w-4 mr-2" />
              )}
              Archive {selectedIds.length} Post{selectedIds.length !== 1 ? 's' : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogList;
