import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShippingMethod } from '@shared/types';
import { Button } from '@app/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@app/components/ui/form';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@app/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@app/components/ui/radio-group';
import { Truck, Zap, Clock } from 'lucide-react';

// Shipping method options
const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Delivery in 5-7 business days',
    price: 0,
    estimatedDelivery: '5-7 business days',
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: 'Delivery in 2-3 business days',
    price: 199,
    estimatedDelivery: '2-3 business days',
  },
  {
    id: 'priority',
    name: 'Priority Shipping',
    description: 'Delivery in 1 business day',
    price: 499,
    estimatedDelivery: 'Next business day',
  },
];

const shippingMethodSchema = z.object({
  shippingMethodId: z.string(),
});

type ShippingMethodFormValues = z.infer<typeof shippingMethodSchema>;

interface ShippingMethodFormProps {
  onSubmit: (data: { shippingMethod: ShippingMethod }) => void;
  defaultValue?: string;
  orderAmount?: number;
}

const ShippingMethodForm: React.FC<ShippingMethodFormProps> = ({
  onSubmit,
  defaultValue = 'standard',
  orderAmount = 0,
}) => {
  const form = useForm<ShippingMethodFormValues>({
    resolver: zodResolver(shippingMethodSchema),
    defaultValues: {
      shippingMethodId: defaultValue,
    },
  });

  const handleSubmit = (data: ShippingMethodFormValues) => {
    const selectedMethod = SHIPPING_METHODS.find(method => method.id === data.shippingMethodId);
    if (selectedMethod) {
      onSubmit({ shippingMethod: selectedMethod });
    }
  };

  // Free shipping for orders over ₹5000
  const hasFreeShipping = orderAmount >= 5000;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="shippingMethodId"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Select Shipping Method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-4"
                >
                  {SHIPPING_METHODS.map(method => {
                    // Apply free shipping to standard if order is above threshold
                    const displayPrice = method.id === 'standard' && hasFreeShipping 
                      ? 0 
                      : method.price;
                    
                    const displayLabel = displayPrice === 0 
                      ? 'Free' 
                      : `₹${displayPrice}`;

                    let icon;
                    switch (method.id) {
                      case 'standard':
                        icon = <Truck className="h-5 w-5" />;
                        break;
                      case 'express':
                        icon = <Clock className="h-5 w-5" />;
                        break;
                      case 'priority':
                        icon = <Zap className="h-5 w-5" />;
                        break;
                      default:
                        icon = <Truck className="h-5 w-5" />;
                    }

                    return (
                      <Card 
                        key={method.id}
                        className={`cursor-pointer ${field.value === method.id ? 'border-primary' : ''}`}
                      >
                        <CardHeader className="p-4 pb-2 flex flex-row items-center space-x-3">
                          <div className="flex items-center justify-center">
                            <RadioGroupItem value={method.id} id={method.id} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base">{method.name}</CardTitle>
                            <CardDescription className="text-xs">{method.description}</CardDescription>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-semibold">{displayLabel}</span>
                            <span className="text-xs text-muted-foreground">{method.estimatedDelivery}</span>
                          </div>
                          <div className="ml-2 text-muted-foreground">
                            {icon}
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {hasFreeShipping && (
          <div className="rounded-md border p-3 bg-green-50 text-green-700 border-green-200">
            <p className="text-sm font-medium">You've qualified for free standard shipping!</p>
          </div>
        )}

        <Button type="submit" className="w-full">Continue to Payment</Button>
      </form>
    </Form>
  );
};

export default ShippingMethodForm; 