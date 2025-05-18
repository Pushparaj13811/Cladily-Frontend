import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import AccountLayout from '../../ui/AccountLayout';
import { Button } from '@app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/components/ui/tabs';

const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const hasOrders = false;

  return (
    <AccountLayout>
      <div>
        <h2 className="text-2xl font-medium mb-6">Orders and Returns</h2>
        
        <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 border-b w-full justify-start space-x-8 rounded-none bg-transparent p-0">
            <TabsTrigger 
              value="orders" 
              className="rounded-none bg-transparent px-0 py-2 text-lg data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="returns" 
              className="rounded-none bg-transparent px-0 py-2 text-lg data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
            >
              Returns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="pt-4">
            <p className="text-sm mb-8">
              Track your orders, request a return or check your order history
            </p>

            {hasOrders ? (
              <div>
                {/* Order list would go here */}
                <p>Your orders will appear here</p>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mb-4 flex justify-center">
                  <ShoppingBag size={48} />
                </div>
                <h3 className="text-xl font-medium mb-2">You currently have no orders</h3>
                <p className="text-gray-600 mb-6">When you've placed an order, you'll find all the details here</p>
                <Button asChild className="bg-black text-white rounded-none hover:bg-gray-800">
                  <Link to="/products">Shop New In</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="returns" className="pt-4">
            <p className="text-sm mb-8">
              View your return history
            </p>

            <div className="text-center py-16">
              <div className="mb-4 flex justify-center">
                <ShoppingBag size={48} />
              </div>
              <h3 className="text-xl font-medium mb-2">You currently have no returns</h3>
              <p className="text-gray-600 mb-6">When you've returned an item, you'll find all the details here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AccountLayout>
  );
};

export default OrdersPage; 