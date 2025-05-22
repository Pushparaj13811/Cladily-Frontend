import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Textarea } from '@app/components/ui/textarea';
import { useToast } from '@app/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@app/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@app/components/ui/alert-dialog';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@app/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@app/components/ui/form';
import {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    type Department,
    type DepartmentFormData,
} from '@features/dashboard/departmentAPI';
import { OptimizedImage } from '../../../../components/ui/optimized-image';

// Helper function to generate slug
const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

// Form schema
const departmentSchema = z.object({
    name: z.string().min(2, { message: 'Department name must be at least 2 characters' }),
    slug: z.string().min(2, { message: 'Slug must be at least 2 characters' }),
    description: z.string().optional(),
    image: z.instanceof(File).optional(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

// Add type for API error
interface ApiError {
    response?: {
        data?: {
            message: string;
        };
    };
}

const DepartmentPage: React.FC = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { toast } = useToast();

    const form = useForm<DepartmentFormValues>({
        resolver: zodResolver(departmentSchema),
        defaultValues: {
            name: '',
            slug: '',
            description: '',
        },
    });

    // Watch name field to update slug
    const name = form.watch('name');
    useEffect(() => {
        if (name && !selectedDepartment) {
            form.setValue('slug', generateSlug(name));
        }
    }, [name, form, selectedDepartment]);

    // Load departments
    const loadDepartments = async () => {
        try {
            setIsLoading(true);
            const data = await getAllDepartments();
            setDepartments(data);
        } catch (err: unknown) {
            const error = err as ApiError;
            console.error('Failed to load departments:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to load departments',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDepartments();
    }, []);

    // Handle image preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('image', file, { shouldValidate: true });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const onSubmit = async (data: DepartmentFormValues) => {
        try {
            setIsLoading(true);
            const formData: DepartmentFormData = {
                name: data.name,
                slug: data.slug,
                description: data.description,
                image: data.image,
            };

            if (selectedDepartment) {
                await updateDepartment(selectedDepartment.id, formData);
                toast({
                    title: 'Success',
                    description: 'Department updated successfully',
                });
            } else {
                await createDepartment(formData);
                toast({
                    title: 'Success',
                    description: 'Department created successfully',
                });
            }

            setIsDialogOpen(false);
            form.reset();
            setImagePreview(null);
            setSelectedDepartment(null);
            loadDepartments();
        } catch (err: unknown) {
            const error = err as ApiError;
            console.error('Failed to save department:', error);
            const errorMessage = error.response?.data?.message || 'Failed to save department';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle department deletion
    const handleDelete = async () => {
        if (!selectedDepartment) return;

        try {
            setIsLoading(true);
            await deleteDepartment(selectedDepartment.id);
            toast({
                title: 'Success',
                description: 'Department deleted successfully',
            });
            setIsDeleteDialogOpen(false);
            setSelectedDepartment(null);
            loadDepartments();
        } catch (err: unknown) {
            const error = err as ApiError;
            console.error('Failed to delete department:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete department';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Open edit dialog
    const handleEdit = (department: Department) => {
        setSelectedDepartment(department);
        form.reset({
            name: department.name,
            slug: department.slug,
            description: department.description || '',
        });
        setImagePreview(null);
        setIsDialogOpen(true);
    };

    // Open delete dialog
    const handleDeleteClick = (department: Department) => {
        setSelectedDepartment(department);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="p-6 w-full">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl mb-4 font-bold">Departments</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => {
                            setSelectedDepartment(null);
                            form.reset();
                            setImagePreview(null);
                        }}
                        className="bg-primary hover:bg-primary/90 mb-4 text-white"
                        >
                            <Plus className="mr-2h-4 w-4" />
                            Add Department
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {selectedDepartment ? 'Edit Department' : 'Add Department'}
                            </DialogTitle>
                            <DialogDescription>
                                {selectedDepartment
                                    ? 'Update the department details below'
                                    : 'Fill in the department details below'}
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Department name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="department-slug" 
                                                    {...field} 
                                                    disabled={!selectedDepartment}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Department description"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Image</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center gap-4">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                    {imagePreview && (
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="w-20 h-20 object-cover rounded"
                                                        />
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? 'Saving...' : selectedDepartment ? 'Update' : 'Create'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((department) => (
                    <Card key={department.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{department.name}</CardTitle>
                                    {department.description && (
                                        <CardDescription>{department.description}</CardDescription>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(department)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteClick(department)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {department.imageId ? (
                                <OptimizedImage
                                    publicId={department.imageId}
                                    alt={department.name}
                                    width={400}
                                    height={192}
                                    className="rounded-md"
                                />
                            ) : (
                                <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center">
                                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            department and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default DepartmentPage; 