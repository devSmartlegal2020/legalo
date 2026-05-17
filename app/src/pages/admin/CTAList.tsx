import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
  MoreVertical,
  Edit,
  Trash2,
  Loader2,
  Megaphone,
} from 'lucide-react';
import { ctaAPI, type CTA } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const CTAList = () => {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [ctas, setCTAs] = useState<CTA[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchCTAs();
    }
  }, [authLoading, isAuthenticated]);

  const fetchCTAs = async () => {
    try {
      setIsLoading(true);
      const response = await ctaAPI.getAll();
      setCTAs(response.data.data.ctas);
    } catch (error) {
      console.error('Failed to fetch CTAs:', error);
      toast.error('Failed to load CTAs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await ctaAPI.delete(deleteId);
      toast.success('CTA deleted successfully');
      fetchCTAs();
    } catch (error) {
      console.error('Failed to delete CTA:', error);
      toast.error('Failed to delete CTA');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleToggleStatus = async (cta: CTA) => {
    try {
      await ctaAPI.toggleStatus(cta._id);
      toast.success(`CTA ${cta.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchCTAs();
    } catch (error) {
      console.error('Failed to toggle CTA status:', error);
      toast.error('Failed to update CTA status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CTAs</h1>
          <p className="text-gray-500 mt-1">Manage call-to-action blocks for blog posts</p>
        </div>
        <Button asChild>
          <Link to="/admin/ctas/new">
            <Plus className="h-4 w-4 mr-2" />
            New CTA
          </Link>
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Button</TableHead>
              <TableHead>Colors</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : ctas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No CTAs found
                </TableCell>
              </TableRow>
            ) : (
              ctas.map((cta) => (
                <TableRow key={cta._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg shrink-0"
                        style={{ backgroundColor: cta.backgroundColor }}
                      />
                      <div>
                        <div className="font-medium">{cta.title}</div>
                        <div
                          className="text-sm text-gray-500 line-clamp-1 max-w-md"
                          dangerouslySetInnerHTML={{ __html: cta.description }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{cta.buttonText}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{cta.buttonUrl}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: cta.backgroundColor }}
                        title="Background"
                      />
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: cta.buttonBackgroundColor }}
                        title="Button BG"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={cta.isActive ? 'default' : 'secondary'}
                    >
                      {cta.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(cta)}
                        title={cta.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <Megaphone className={`h-4 w-4 ${cta.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/admin/ctas/edit/${cta._id}`}
                              className="flex items-center"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeleteId(cta._id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the CTA.
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

export default CTAList;
