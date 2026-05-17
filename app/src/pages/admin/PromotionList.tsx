import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  ChevronLeft,
  ChevronRight,
  Gift,
  Megaphone,
  Target,
} from 'lucide-react';
import { promotionAPI, API_BASE_URL } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface Promotion {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    code?: string;
  };
  startDate: string;
  endDate: string;
  priority: number;
  showInPopup: boolean;
  targetPages?: string[];
  targetCategories?: string[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
}

const PromotionList = () => {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchPromotions();
    }
  }, [authLoading, isAuthenticated, page, limit, search, statusFilter]);

  const fetchPromotions = async () => {
    try {
      setIsLoading(true);

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

      const response = await promotionAPI.getAll(params);

      setPromotions(response.data.data.promotions);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
      toast.error('Failed to load promotions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await promotionAPI.delete(deleteId);
      toast.success('Promotion deleted successfully');

      if (promotions.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchPromotions();
      }
    } catch (error) {
      console.error('Failed to delete promotion:', error);
      toast.error('Failed to delete promotion');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDiscount = (discount: Promotion['discount']) => {
    if (!discount) return '-';
    if (discount.type === 'percentage') {
      return `${discount.value}% OFF`;
    }
    return `Rp ${discount.value.toLocaleString()}`;
  };

  const isActive = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Promotions</h1>
          <p className="text-gray-500 mt-1">Manage your promotional offers and campaigns</p>
        </div>
        <Button asChild>
          <Link to="/admin/promotions/new">
            <Plus className="h-4 w-4 mr-2" />
            New Promotion
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search promotions..."
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
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
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
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Promotion</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : promotions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No promotions found
                </TableCell>
              </TableRow>
            ) : (
              promotions.map((promo) => (
                <TableRow key={promo._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={`${API_BASE_URL}${promo.image}`}
                        alt={promo.title}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.png';
                        }}
                      />
                      <div>
                        <div className="font-medium">{promo.title}</div>
                        {promo.subtitle && (
                          <div className="text-sm text-gray-500">{promo.subtitle}</div>
                        )}
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {promo.showInPopup && (
                            <Badge variant="secondary" className="text-xs">
                              <Megaphone className="h-3 w-3 mr-1" />
                              Popup
                            </Badge>
                          )}
                          {promo.showInPopup && ((promo.targetPages?.length || 0) > 0 || (promo.targetCategories?.length || 0) > 0) && (
                            <Badge variant="outline" className="text-xs">
                              <Target className="h-3 w-3 mr-1" />
                              Targeted
                            </Badge>
                          )}
                          {promo.discount?.code && (
                            <Badge variant="outline" className="text-xs">
                              <Gift className="h-3 w-3 mr-1" />
                              {promo.discount.code}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                    </div>
                    {isActive(promo.startDate, promo.endDate) ? (
                      <Badge variant="default" className="mt-1 text-xs">Active</Badge>
                    ) : (
                      <Badge variant="secondary" className="mt-1 text-xs">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDiscount(promo.discount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{promo.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        promo.status === 'published'
                          ? 'default'
                          : promo.status === 'draft'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {promo.status}
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
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/promo/${promo.slug}`}
                            target="_blank"
                            className="flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/admin/promotions/edit/${promo._id}`}
                            className="flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeleteId(promo._id)}
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
              This action cannot be undone. This will permanently delete the promotion.
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
    </div>
  );
};

export default PromotionList;
