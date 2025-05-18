import { useTheme } from "@app/providers/theme-provider";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@app/components/ui/navigation-menu";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { ShoppingBag, Heart, Search, User, Sun, Moon, X, Package, Tag, Ticket, LayoutDashboard, Percent } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@app/lib/utils";
import { COMPANY, NAVIGATION } from "@shared/constants";
import { ACCOUNT_NAVIGATION } from "@shared/constants/account";
import { useCart } from "@features/cart";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@app/components/ui/dropdown-menu";
import { useState } from "react";
import { useAuth, useAppDispatch } from "@app/hooks/useAppRedux";
import { logout } from "@features/auth/authSlice";
import { UserRole } from "../../../types";

export function MainNavbar() {
    const { theme, setTheme } = useTheme();
    const { itemCount } = useCart();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);

    // Get auth state from Redux
    const { user, isAuthenticated } = useAuth();

    const isAdmin = user?.role === UserRole.ADMIN;

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    return (
        <header className="border-b border-border">
            {/* Only show the login message if not authenticated */}
            {!isAuthenticated && (
                <div className="bg-primary text-primary-foreground text-center py-2 text-sm">
                    <Link to={NAVIGATION.AUTH.MEMBERS.href}>{NAVIGATION.AUTH.MEMBERS.name}</Link>
                </div>
            )}
            <div className="container mx-auto py-4 px-4 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {isAdmin ? (
                                // Admin navigation
                                <>
                                    <NavigationMenuItem>
                                        <Link to="/admin/dashboard" className="text-sm font-medium px-3 flex items-center">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            Dashboard
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Link to="/admin/products" className="text-sm font-medium px-3 flex items-center">
                                            <Package className="mr-2 h-4 w-4" />
                                            Products
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Link to="/admin/categories" className="text-sm font-medium px-3 flex items-center">
                                            <Tag className="mr-2 h-4 w-4" />
                                            Categories
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Link to="/admin/discounts" className="text-sm font-medium px-3 flex items-center">
                                            <Percent className="mr-2 h-4 w-4" />
                                            Discounts
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Link to="/admin/coupons" className="text-sm font-medium px-3 flex items-center">
                                            <Ticket className="mr-2 h-4 w-4" />
                                            Coupons
                                        </Link>
                                    </NavigationMenuItem>
                                </>
                            ) : (
                                // Regular user navigation
                                NAVIGATION.MAIN_CATEGORIES.map((category) => (
                                    <NavigationMenuItem key={category.name}>
                                        <Link to={category.href} className="text-sm font-medium px-3">
                                            {category.name}
                                        </Link>
                                    </NavigationMenuItem>
                                ))
                            )}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <Link to={isAdmin ? "/admin" : "/"} className="absolute left-1/2 transform -translate-x-1/2">
                    <h1 className="text-2xl font-bold tracking-wider">{COMPANY.NAME}</h1>
                </Link>

                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        aria-label="Toggle theme"
                    >
                        {theme === "light" ? (
                            <Moon className="h-5 w-5" />
                        ) : (
                            <Sun className="h-5 w-5" />
                        )}
                    </Button>

                    {/* User menu based on authentication state */}
                    {isAuthenticated ? (
                        <DropdownMenu open={open} onOpenChange={setOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <User className="h-5 w-5" />
                                    <span className="sr-only">User menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[320px] p-0 rounded-lg">
                                <div className="flex items-center justify-between p-6 border-b">
                                    <h2 className="text-xl font-medium tracking-wide">
                                        {user?.firstName} {user?.lastName}
                                    </h2>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setOpen(false)}
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="py-2">
                                    {!isAdmin && (
                                        <>
                                            <DropdownMenuItem asChild className="px-6 py-4 text-base hover:bg-gray-50 hover:text-black focus:bg-gray-50 focus:text-black">
                                                <Link to="/account/membership">
                                                    Membership
                                                </Link>
                                            </DropdownMenuItem>

                                            {/* Menu items from ACCOUNT_NAVIGATION */}
                                            {ACCOUNT_NAVIGATION.slice(0, 3).map((item) => (
                                                <DropdownMenuItem key={item.path} asChild className="px-6 py-4 text-base hover:bg-gray-50 hover:text-black focus:bg-gray-50 focus:text-black">
                                                    <Link to={item.path}>
                                                        {item.label}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}

                                            <DropdownMenuItem asChild className="px-6 py-4 text-base hover:bg-gray-50 hover:text-black focus:bg-gray-50 focus:text-black">
                                                <Link to="/account/shopping-preferences">
                                                    Preferences
                                                </Link>
                                            </DropdownMenuItem>

                                            <DropdownMenuItem asChild className="px-6 py-4 text-base hover:bg-gray-50 hover:text-black focus:bg-gray-50 focus:text-black">
                                                <Link to="/account/referral">
                                                    Refer a Friend
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}

                                    {isAdmin && (
                                        <>
                                            <DropdownMenuItem asChild className="px-6 py-4 text-base hover:bg-gray-50 hover:text-black focus:bg-gray-50 focus:text-black">
                                                <Link to="/admin">
                                                    Admin Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className="px-6 py-4 text-base hover:bg-gray-50 hover:text-black focus:bg-gray-50 focus:text-black">
                                                <Link to="/admin/products">
                                                    Manage Products
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className="px-6 py-4 text-base hover:bg-gray-50 hover:text-black focus:bg-gray-50 focus:text-black">
                                                <Link to="/admin/categories">
                                                    Manage Categories
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className="px-6 py-4 text-base hover:bg-gray-50 hover:text-black focus:bg-gray-50 focus:text-black">
                                                <Link to="/admin/discounts">
                                                    Manage Discounts & Coupons
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className="px-6 py-4 text-base hover:bg-gray-50 hover:text-black focus:bg-gray-50 focus:text-black">
                                                <Link to="/admin/orders">
                                                    Manage Orders
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}

                                    <DropdownMenuItem
                                        className="px-6 py-4 text-base text-red-600 hover:bg-gray-50 hover:text-red-600 focus:bg-gray-50 focus:text-red-600"
                                        onClick={handleLogout}
                                    >
                                        Sign out
                                    </DropdownMenuItem>
                                </div>

                                <div className="p-4 border-t flex justify-center">
                                    <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-none w-full">
                                        <Link to={isAdmin ? "/admin" : "/account"}>
                                            {isAdmin ? "Admin Panel" : "My Account"}
                                        </Link>
                                    </Button>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button variant="ghost" size="icon" asChild>
                            <Link to="/login">
                                <User className="h-5 w-5" />
                            </Link>
                        </Button>
                    )}

                    {/* Only show wishlist and cart for non-admin users */}
                    {!isAdmin && (
                        <>
                            <Button variant="ghost" size="icon" asChild>
                                <Link to={isAuthenticated ? "/account/wishlist" : "/login"}>
                                    <Heart className="h-5 w-5" />
                                </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild className="relative">
                                <Link to="/cart">
                                    <ShoppingBag className="h-5 w-5" />
                                    {itemCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {itemCount > 99 ? '99+' : itemCount}
                                        </span>
                                    )}
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Only show search and subcategories for non-admin users */}
            {!isAdmin && (
                <>
                    <div className="container mx-auto px-4 pb-4">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search"
                                className="w-full pl-10 focus-visible:ring-0"
                            />
                        </div>
                    </div>

                    {/* Secondary navigation for subcategories */}
                    <div className="border-t border-border">
                        <div className="container mx-auto px-4 py-2 overflow-x-auto">
                            <div className="flex space-x-4 items-center whitespace-nowrap">
                                {NAVIGATION.SUBCATEGORIES.MEN.map((category) => (
                                    <Link
                                        key={category.name}
                                        to={category.href}
                                        className={cn(
                                            "text-sm py-1 hover:text-primary transition-colors",
                                            category.highlight && "text-red-500"
                                        )}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
} 