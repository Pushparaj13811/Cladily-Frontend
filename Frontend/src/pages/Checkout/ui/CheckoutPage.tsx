import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@features/cart';
import { AddressDetails, CheckoutStep, PaymentMethod, ShippingMethod } from '@shared/types';
import { formatCurrency } from '@shared/utils/format';
import { useToast } from '@app/hooks/use-toast';
import CheckoutSteps from './components/CheckoutSteps';
import ShippingForm from './components/ShippingForm';
import ShippingMethodForm from './components/ShippingMethodForm';
import PaymentForm from './components/PaymentForm';
import OrderSummary from './components/OrderSummary';

// Define the payment form values type
type PaymentFormValues = {
  type: 'card' | 'upi' | 'cod';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  upiId?: string;
};

// Tax rate (10%)
const TAX_RATE = 0.1;

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, totalPrice, clearCart } = useCart();
  
  // Checkout state
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.Shipping);
  const [shippingAddress, setShippingAddress] = useState<AddressDetails | null>(null);
  const [billingAddress, setBillingAddress] = useState<AddressDetails | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  
  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      toast({
        title: "Your cart is empty",
        description: "Please add some items to your cart before checking out.",
      });
    }
  }, [items, navigate, toast]);
  
  // Calculate order summary
  const subtotal = totalPrice;
  const shipping = shippingMethod?.price || 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (data: AddressDetails & { sameAsBilling: boolean }) => {
    const { sameAsBilling, ...addressData } = data;
    setShippingAddress(addressData);
    
    if (sameAsBilling) {
      setBillingAddress(addressData);
    }
    
    setCurrentStep(CheckoutStep.Payment);
  };

  const handleShippingMethodSubmit = (data: { shippingMethod: ShippingMethod }) => {
    setShippingMethod(data.shippingMethod);
    setCurrentStep(CheckoutStep.Payment);
  };
  
  const handlePaymentSubmit = (data: PaymentFormValues) => {
    console.log("Payment submission received:", data);
    // Ensure data has the expected shape of PaymentMethod
    const paymentData: PaymentMethod = {
      type: data.type,
      cardNumber: data.cardNumber,
      cardExpiry: data.cardExpiry,
      cardCvc: data.cardCvc,
      upiId: data.upiId
    };
    
    setPaymentMethod(paymentData);
    
    // Force step change after a short delay to ensure state updates
    setTimeout(() => {
      setCurrentStep(CheckoutStep.Review);
      console.log("Current step set to:", CheckoutStep.Review);
    }, 100);
  };
  
  const handlePlaceOrder = () => {
    // Here you would typically make an API call to create the order
    // For now, we'll just simulate it
    
    // Generate a random order ID
    const orderId = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Show success toast
    toast({
      title: "Order placed successfully!",
      description: `Thank you for your order. Your order number is #${orderId}`,
    });
    
    // Clear cart
    clearCart();
    
    // Navigate to thank you page with order details
    navigate('/thank-you', { 
      state: { 
        orderId,
        total 
      } 
    });
  };
  
  // Render current step
  const renderStep = () => {
    console.log("Rendering step:", currentStep);
    
    switch (currentStep) {
      case CheckoutStep.Shipping:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <ShippingForm onSubmit={handleShippingSubmit} />
            </div>
            
            {shippingAddress && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
                <ShippingMethodForm 
                  onSubmit={handleShippingMethodSubmit} 
                  orderAmount={subtotal}
                />
              </div>
            )}
          </div>
        );
        
      case CheckoutStep.Payment:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <PaymentForm onSubmit={handlePaymentSubmit} />
          </div>
        );
        
      case CheckoutStep.Review:
        console.log("Rendering review step with payment method:", paymentMethod);
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    {shippingAddress && (
                      <address className="not-italic text-sm text-muted-foreground">
                        {shippingAddress.firstName} {shippingAddress.lastName}<br />
                        {shippingAddress.addressLine1}<br />
                        {shippingAddress.addressLine2 && <>{shippingAddress.addressLine2}<br /></>}
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}<br />
                        {shippingAddress.country}<br />
                        {shippingAddress.phone}
                      </address>
                    )}
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Billing Address</h3>
                    {billingAddress && (
                      <address className="not-italic text-sm text-muted-foreground">
                        {billingAddress.firstName} {billingAddress.lastName}<br />
                        {billingAddress.addressLine1}<br />
                        {billingAddress.addressLine2 && <>{billingAddress.addressLine2}<br /></>}
                        {billingAddress.city}, {billingAddress.state} {billingAddress.postalCode}<br />
                        {billingAddress.country}<br />
                        {billingAddress.phone}
                      </address>
                    )}
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Shipping Method</h3>
                    {shippingMethod && (
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">{shippingMethod.name}</p>
                        <p>{shippingMethod.description}</p>
                        <p className="mt-1">
                          {shippingMethod.price === 0 
                            ? "Free" 
                            : formatCurrency(shippingMethod.price)
                          }
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    {paymentMethod && (
                      <div className="text-sm text-muted-foreground">
                        {paymentMethod.type === 'card' && (
                          <>
                            <p className="font-medium text-foreground">Credit/Debit Card</p>
                            <p>Card ending in {paymentMethod.cardNumber?.slice(-4)}</p>
                            <p>Expires {paymentMethod.cardExpiry}</p>
                          </>
                        )}
                        
                        {paymentMethod.type === 'upi' && (
                          <>
                            <p className="font-medium text-foreground">UPI</p>
                            <p>{paymentMethod.upiId}</p>
                          </>
                        )}
                        
                        {paymentMethod.type === 'cod' && (
                          <p className="font-medium text-foreground">Cash on Delivery</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <OrderSummary 
                    items={items}
                    subtotal={subtotal}
                    shipping={shipping}
                    tax={tax}
                    total={total}
                    isEditable={false}
                  />
                  
                  <button 
                    className="w-full mt-6 py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium"
                    onClick={handlePlaceOrder}
                  >
                    Place Order - {formatCurrency(total)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {/* Checkout steps indicator */}
      <CheckoutSteps currentStep={currentStep} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {renderStep()}
        </div>
        
        {/* Only show order summary on shipping and payment steps */}
        {currentStep !== CheckoutStep.Review && (
          <div className="lg:col-span-1">
            <OrderSummary 
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage; 