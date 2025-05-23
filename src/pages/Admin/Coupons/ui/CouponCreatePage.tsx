import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, InfoIcon, Save, Sparkles, TicketIcon } from 'lucide-react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@app/components/ui/tooltip';
import { Calendar } from '@app/components/ui/calendar';
import { Switch } from '@app/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@app/components/ui/alert';
import { useToast } from '@app/hooks/use-toast';
import { DiscountStatus, CouponType, ApplicabilityScope } from '@shared/types/discount';

/**
 * Generate a random coupon code
 */
const generateCouponCode = (): string => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  
  // Generate a 10-character code
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

// Form schema
const couponFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  code: z.string().min(4, "Code must be at least 4 characters").toUpperCase(),
  type: z.nativeEnum(CouponType),
  value: z.coerce.number().min(0, "Value must be a positive number"),
  applicabilityScope: z.nativeEnum(ApplicabilityScope),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date().optional(),
  status: z.nativeEnum(DiscountStatus),
  priority: z.coerce.number().int().min(1, "Priority must be a positive integer"),
  isAutomaticallyApplied: z.boolean().default(false),
  isOneTimeUse: z.boolean().default(false),
  customerUsageLimit: z.coerce.number().int().min(0).optional(),
  minimumOrderAmount: z.coerce.number().min(0).optional(),
});

type CouponFormValues = z.infer<typeof couponFormSchema>;

const CouponCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State
  const [saving, setSaving] = useState(false);
  
  // Form
  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema) as Resolver<CouponFormValues>,
    defaultValues: {
      name: '',
      description: '',
      code: generateCouponCode(),
      type: CouponType.PERCENTAGE,
      value: 10,
      applicabilityScope: ApplicabilityScope.ALL_PRODUCTS,
      startDate: new Date(),
      status: DiscountStatus.INACTIVE,
      priority: 1,
      isAutomaticallyApplied: false,
      isOneTimeUse: false,
      customerUsageLimit: 1,
      minimumOrderAmount: 0,
    },
  });

  // Generate new code
  const handleGenerateCode = () => {
    const newCode = generateCouponCode();
    form.setValue('code', newCode);
  };

  // Form submission
  const onSubmit = (values: CouponFormValues) => {
    setSaving(true);
    
    // This would be an API call in a real application
    setTimeout(() => {
      console.log('Saved coupon:', values);
      setSaving(false);
      
      toast({
        title: "Coupon created",
        description: "The coupon has been successfully created."
      });
      
      navigate('/admin/coupons');
    }, 1000);
  };

  // Current form values
  const currentType = form.watch('type');
  const currentApplicabilityScope = form.watch('applicabilityScope');
  const isOneTimeUse = form.watch('isOneTimeUse');

  // Conditional form sections based on coupon type
  const renderTypeSpecificFields = () => {
    switch (currentType) {
      case CouponType.PERCENTAGE:
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
        
      case CouponType.FIXED_AMOUNT:
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
        
      case CouponType.FREE_SHIPPING:
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
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Create Coupon</h1>
          <p className="text-muted-foreground">
            Create a new coupon code for your store
          </p>
        </div>
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
                    Set the basic details for your coupon.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coupon Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Summer Sale 20% Off" {...field} />
                        </FormControl>
                        <FormDescription>
                          A clear, descriptive name for this coupon.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coupon Code</FormLabel>
                        <div className="flex space-x-2">
                          <FormControl>
                            <Input 
                              placeholder="SUMMER20" 
                              {...field} 
                              onChange={e => field.onChange(e.target.value.toUpperCase())}
                              className="font-mono"
                            />
                          </FormControl>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={handleGenerateCode}
                                >
                                  <Sparkles className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Generate random code</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <FormDescription>
                          The coupon code customers will enter at checkout.
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
                            placeholder="20% off your first purchase" 
                            className="resize-none" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Internal notes about this coupon (not shown to customers).
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
                            When the coupon will become active.
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
                            When the coupon will expire (optional).
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
                          Control whether this coupon is active, scheduled, or inactive.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Coupon Type</CardTitle>
                  <CardDescription>
                    Choose how this coupon will be applied.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coupon Type</FormLabel>
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
                            <SelectItem value={CouponType.PERCENTAGE}>Percentage Discount</SelectItem>
                            <SelectItem value={CouponType.FIXED_AMOUNT}>Fixed Amount Discount</SelectItem>
                            <SelectItem value={CouponType.FREE_SHIPPING}>Free Shipping</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          How the coupon discount is calculated.
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
                          Choose which products this coupon applies to.
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
                    Set additional conditions for when this coupon will apply.
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
                          Minimum order amount required for this coupon to apply (0 for no minimum).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isOneTimeUse"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">One-Time Use</FormLabel>
                          <FormDescription>
                            Each customer can use this coupon only once.
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
                  
                  {!isOneTimeUse && (
                    <FormField
                      control={form.control}
                      name="customerUsageLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usage Limit Per Customer</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="1" 
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value))}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum number of times each customer can use this coupon (0 for unlimited).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
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
                    Configure advanced settings for this coupon.
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
                          Higher priority coupons will be applied first if multiple coupons could apply.
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
                            Automatically apply this coupon when conditions are met, without requiring a code.
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
                  
                  <Alert>
                    <TicketIcon className="h-4 w-4" />
                    <AlertTitle>Coupon Usage Statistics</AlertTitle>
                    <AlertDescription>
                      <p>Statistics will be available after the coupon is created.</p>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
            
            <div className="mt-6 flex justify-end space-x-4">
              <Button
                variant="outline" 
                onClick={() => navigate('/admin/coupons')}
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
                    Create Coupon
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

export default CouponCreatePage; 