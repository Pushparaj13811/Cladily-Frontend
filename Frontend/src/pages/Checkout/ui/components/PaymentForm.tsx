import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PaymentMethod } from '@shared/types';
import { Button } from '@app/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@app/components/ui/form';
import { Input } from '@app/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@app/components/ui/radio-group';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@app/components/ui/card';
import { CreditCard, Banknote, Truck } from 'lucide-react';

const paymentSchema = z.object({
  type: z.enum(['card', 'upi', 'cod']),
  cardNumber: z.string().optional().refine((val) => {
    if (val === undefined) return true;
    return /^\d{16}$/.test(val.replace(/\s/g, ''));
  }, { message: 'Invalid card number' }),
  cardExpiry: z.string().optional().refine((val) => {
    if (val === undefined) return true;
    return /^(0[1-9]|1[0-2])\/\d{2}$/.test(val);
  }, { message: 'Invalid expiry date (MM/YY)' }),
  cardCvc: z.string().optional().refine((val) => {
    if (val === undefined) return true;
    return /^\d{3,4}$/.test(val);
  }, { message: 'Invalid CVC' }),
  upiId: z.string().optional().refine((val) => {
    if (val === undefined) return true;
    return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/.test(val);
  }, { message: 'Invalid UPI ID' }),
}).refine((data) => {
  if (data.type === 'card') {
    return !!data.cardNumber && !!data.cardExpiry && !!data.cardCvc;
  } else if (data.type === 'upi') {
    return !!data.upiId;
  }
  return true;
}, { 
  message: "Please fill in all required fields for the selected payment method",
  path: ["type"]
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  onSubmit: (data: PaymentFormValues) => void;
  defaultValues?: Partial<PaymentMethod>;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  onSubmit, 
  defaultValues 
}) => {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      type: defaultValues?.type || 'card',
      cardNumber: defaultValues?.cardNumber || '',
      cardExpiry: defaultValues?.cardExpiry || '',
      cardCvc: defaultValues?.cardCvc || '',
      upiId: defaultValues?.upiId || '',
    },
  });

  const paymentType = form.watch('type');

  const handleSubmit = (data: PaymentFormValues) => {
    console.log("Payment form submitted with data:", data);
    
    // Ensure data is valid before passing it to parent
    const isCardValid = data.type !== 'card' || (!!data.cardNumber && !!data.cardExpiry && !!data.cardCvc);
    const isUpiValid = data.type !== 'upi' || !!data.upiId;
    
    if (isCardValid && isUpiValid) {
      console.log("Payment data valid, calling parent onSubmit");
      onSubmit(data);
    } else {
      console.error("Payment validation failed");
      // Form validation should prevent this, but just in case
      form.setError("type", { 
        type: "manual", 
        message: "Please fill in all required fields for the selected payment method" 
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Select Payment Method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <Card className={`cursor-pointer ${field.value === 'card' ? 'border-primary' : ''}`}>
                    <CardHeader className="p-4 pb-2 flex flex-row items-center space-x-3">
                      <div className="flex items-center justify-center">
                        <RadioGroupItem value="card" id="card" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Credit/Debit Card</CardTitle>
                      </div>
                      <CreditCard className="ml-auto h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <CardDescription>Pay securely with your card</CardDescription>
                    </CardContent>
                  </Card>
                  
                  <Card className={`cursor-pointer ${field.value === 'upi' ? 'border-primary' : ''}`}>
                    <CardHeader className="p-4 pb-2 flex flex-row items-center space-x-3">
                      <div className="flex items-center justify-center">
                        <RadioGroupItem value="upi" id="upi" />
                      </div>
                      <div>
                        <CardTitle className="text-base">UPI</CardTitle>
                      </div>
                      <Banknote className="ml-auto h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <CardDescription>Pay using any UPI app</CardDescription>
                    </CardContent>
                  </Card>
                  
                  <Card className={`cursor-pointer ${field.value === 'cod' ? 'border-primary' : ''}`}>
                    <CardHeader className="p-4 pb-2 flex flex-row items-center space-x-3">
                      <div className="flex items-center justify-center">
                        <RadioGroupItem value="cod" id="cod" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Cash on Delivery</CardTitle>
                      </div>
                      <Truck className="ml-auto h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <CardDescription>Pay when you receive your items</CardDescription>
                    </CardContent>
                  </Card>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {paymentType === 'card' && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="1234 5678 9012 3456" 
                      {...field} 
                      maxLength={19}
                      onChange={(e) => {
                        // Format card number with spaces
                        const value = e.target.value.replace(/\s/g, '');
                        const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
                        field.onChange(formattedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cardExpiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="MM/YY" 
                        {...field}
                        maxLength={5}
                        onChange={(e) => {
                          // Format expiry date with slash
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length > 2) {
                            field.onChange(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
                          } else {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cardCvc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVC</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123" 
                        {...field}
                        maxLength={4}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {paymentType === 'upi' && (
          <FormField
            control={form.control}
            name="upiId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UPI ID</FormLabel>
                <FormControl>
                  <Input placeholder="yourname@upi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {paymentType === 'cod' && (
          <div className="rounded-md border p-4 bg-muted/20">
            <p className="text-sm">
              Cash on Delivery is available for this order. You'll need to pay ₹500 as an advance payment, which will be adjusted in the final amount.
            </p>
          </div>
        )}

        <Button type="submit" className="w-full">Continue to Review</Button>
      </form>
    </Form>
  );
};

export default PaymentForm; 