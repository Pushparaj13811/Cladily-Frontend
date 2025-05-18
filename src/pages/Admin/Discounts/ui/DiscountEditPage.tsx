import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarIcon, InfoIcon, Save } from 'lucide-react';
import { z } from 'zod';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Textarea } from '@app/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@app/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@app/components/ui/popover';
import { Calendar } from '@app/components/ui/calendar';
import { Switch } from '@app/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@app/components/ui/alert';
import { useToast } from '@app/hooks/use-toast';
import { DiscountStatus, DiscountType, ApplicabilityScope } from '@shared/types/discount';
import { MOCK_DISCOUNTS } from '@shared/constants/discount';

// Form schema
const discountFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  type: z.nativeEnum(DiscountType),
  value: z.coerce.number().min(0, "Value must be a positive number"),
  applicabilityScope: z.nativeEnum(ApplicabilityScope),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date().optional(),
  status: z.nativeEnum(DiscountStatus),
  priority: z.coerce.number().int().min(1, "Priority must be a positive integer"),
  isAutomaticallyApplied: z.boolean().default(true),
  minimumOrderAmount: z.coerce.number().min(0).optional(),
  buyQuantity: z.coerce.number().int().min(1).optional(),
  getQuantity: z.coerce.number().int().min(1).optional(),
});

type DiscountFormValues = z.infer<typeof discountFormSchema>;

const DiscountEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNewDiscount = id === 'new';

  // State
  const [saving, setSaving] = useState(false);
  
  // Form
  const form = useForm<DiscountFormValues>({
    // Using a more specific type for the resolver
    resolver: zodResolver(discountFormSchema) as Resolver<DiscountFormValues>,
    defaultValues: {
      name: '',
      description: '',
      type: DiscountType.PERCENTAGE,
      value: 0,
      applicabilityScope: ApplicabilityScope.ALL_PRODUCTS,
      startDate: new Date(),
      status: DiscountStatus.INACTIVE,
      priority: 1,
      isAutomaticallyApplied: true,
      minimumOrderAmount: 0,
      buyQuantity: 2,
      getQuantity: 1,
    },
  });

  // Fetch discount data
  useEffect(() => {
    if (isNewDiscount) return;

    // This would be an API call in a real application
    const fetchedDiscount = MOCK_DISCOUNTS.find(d => d.id === id);
    
    if (fetchedDiscount) {
      // Update form values
      const formValues: Partial<DiscountFormValues> = {
        name: fetchedDiscount.name,
        description: fetchedDiscount.description,
        type: fetchedDiscount.type,
        value: fetchedDiscount.value,
        applicabilityScope: fetchedDiscount.applicabilityScope,
        startDate: new Date(fetchedDiscount.startDate),
        status: fetchedDiscount.status,
        priority: fetchedDiscount.priority,
        isAutomaticallyApplied: fetchedDiscount.isAutomaticallyApplied,
        minimumOrderAmount: fetchedDiscount.minimumOrderAmount,
        buyQuantity: fetchedDiscount.buyQuantity,
        getQuantity: fetchedDiscount.getQuantity,
      };
      
      if (fetchedDiscount.endDate) {
        formValues.endDate = new Date(fetchedDiscount.endDate);
      }
      
      form.reset(formValues);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Discount not found",
      });
      navigate('/admin/discounts');
    }
  }, [id, isNewDiscount, form, navigate, toast]);

  // Form submission
  const onSubmit = (values: DiscountFormValues) => {
    setSaving(true);
    
    // This would be an API call in a real application
    setTimeout(() => {
      console.log('Saved discount:', values);
      setSaving(false);
      
      toast({
        title: `Discount ${isNewDiscount ? 'created' : 'updated'}`,
        description: `The discount has been successfully ${isNewDiscount ? 'created' : 'updated'}.`,
      });
      
      navigate('/admin/discounts');
    }, 1000);
  };

  // Handle delete
  const handleDelete = () => {
    // This would be an API call in a real application
    setTimeout(() => {
      toast({
        title: "Discount deleted",
        description: "The discount has been successfully deleted.",
      });
      
      navigate('/admin/discounts');
    }, 500);
  };

  // Current form type value
  const currentType = form.watch('type');
  const currentApplicabilityScope = form.watch('applicabilityScope');

  // Conditional form sections based on discount type
  const renderTypeSpecificFields = () => {
    switch (currentType) {
      case DiscountType.PERCENTAGE:
        return (
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Percentage (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="10" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Enter a percentage value (e.g., 10 for 10% off)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case DiscountType.FIXED_AMOUNT:
        return (
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="100" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Enter a fixed amount to discount (e.g., 100 for ₹100 off)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case DiscountType.BUY_X_GET_Y:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="buyQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buy Quantity (X)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="getQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Get Quantity (Y)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Percentage (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="100" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Percentage discount for the free items (100% for completely free)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
        
      case DiscountType.FREE_SHIPPING:
        return (
          <FormField
            control={form.control}
            name="minimumOrderAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Order Amount (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="1000" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Minimum order amount required for free shipping (0 for no minimum)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {isNewDiscount ? 'Create Discount' : 'Edit Discount'}
          </h1>
          <p className="text-muted-foreground">
            {isNewDiscount ? 'Create a new discount for your store' : 'Edit discount details and settings'}
          </p>
        </div>
        
        {!isNewDiscount && (
          <Button
            variant="outline"
            onClick={handleDelete}
          >
            Delete Discount
          </Button>
        )}
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="basic">
            <TabsList className="mb-6">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="conditions">Conditions & Limits</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Set the basic details for your discount.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Summer Sale 2023" {...field} />
                        </FormControl>
                        <FormDescription>
                          A clear, descriptive name for this discount.
                        </FormDescription>
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
                            placeholder="Get 20% off on all summer products" 
                            className="resize-none" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Internal notes about this discount (not shown to customers).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className="pl-3 text-left font-normal"
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            When the discount will become active.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className="pl-3 text-left font-normal"
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>No end date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            When the discount will expire (optional).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={DiscountStatus.ACTIVE}>Active</SelectItem>
                            <SelectItem value={DiscountStatus.SCHEDULED}>Scheduled</SelectItem>
                            <SelectItem value={DiscountStatus.INACTIVE}>Inactive</SelectItem>
                            <SelectItem value={DiscountStatus.EXPIRED}>Expired</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Control whether this discount is active, scheduled, or inactive.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Discount Type</CardTitle>
                  <CardDescription>
                    Choose how this discount will be applied.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={DiscountType.PERCENTAGE}>Percentage Discount</SelectItem>
                            <SelectItem value={DiscountType.FIXED_AMOUNT}>Fixed Amount Discount</SelectItem>
                            <SelectItem value={DiscountType.BUY_X_GET_Y}>Buy X Get Y Free</SelectItem>
                            <SelectItem value={DiscountType.FREE_SHIPPING}>Free Shipping</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          How the discount amount is calculated.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {renderTypeSpecificFields()}
                  
                  <FormField
                    control={form.control}
                    name="applicabilityScope"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Applies To</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select applicability" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={ApplicabilityScope.ALL_PRODUCTS}>All Products</SelectItem>
                            <SelectItem value={ApplicabilityScope.SPECIFIC_PRODUCTS}>Specific Products</SelectItem>
                            <SelectItem value={ApplicabilityScope.SPECIFIC_CATEGORIES}>Specific Categories</SelectItem>
                            <SelectItem value={ApplicabilityScope.SPECIFIC_COLLECTIONS}>Specific Collections</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose which products this discount applies to.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Product selector would go here for specific products/categories applicability */}
                  {currentApplicabilityScope !== ApplicabilityScope.ALL_PRODUCTS && (
                    <Alert>
                      <InfoIcon className="h-4 w-4" />
                      <AlertTitle>Product Selection</AlertTitle>
                      <AlertDescription>
                        In a real implementation, there would be a product/category selector here.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="conditions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conditions & Limits</CardTitle>
                  <CardDescription>
                    Set additional conditions for when this discount will apply.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="minimumOrderAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Order Amount (₹)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum order amount required for this discount to apply (0 for no minimum).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Additional Conditions</AlertTitle>
                    <AlertDescription>
                      In a real implementation, there would be additional condition options here,
                      such as customer groups, first-time customers, etc.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Configure advanced settings for this discount.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="1" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Higher priority discounts will be applied first if multiple discounts could apply.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isAutomaticallyApplied"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Automatically Apply</FormLabel>
                          <FormDescription>
                            Automatically apply this discount when conditions are met.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <div className="mt-6 flex justify-end space-x-4">
              <Button
                variant="outline" 
                onClick={() => navigate('/admin/discounts')}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isNewDiscount ? 'Create Discount' : 'Save Changes'}
                  </>
                )}
              </Button>
            </div>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};

export default DiscountEditPage; 