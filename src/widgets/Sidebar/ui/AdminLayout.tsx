import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    ShoppingBag,
    Users,
    Package,
    TagIcon,
    BarChart3,
    Settings,
    Menu,
    X,
    LogOut,
    Home,
    Bell,
    Search,
    ChevronDown
} from 'lucide-react';
import { cn } from '@app/lib/utils';
import { Button } from '@app/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@app/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Input } from '@app/components/ui/input';
import { Badge } from '@app/components/ui/badge';
import { useAppDispatch, useAuth } from '@app/hooks/useAppRedux';
import { logout } from '@features/auth/authSlice';
interface AdminLayoutProps {
    children: React.ReactNode;
}

type NavItem = {
    title: string;
    href: string;
    icon: React.ReactNode;
    badge?: number;
    active?: boolean;
    submenu?: { title: string; href: string }[];
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState<string | null>(null);
    const { user, isAuthenticated } = useAuth();
    const dispatch = useAppDispatch();
    // Navigation items with their routes
    const navItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
            icon: <BarChart3 className="h-5 w-5" />,
            active: location.pathname === '/admin/dashboard',
        },
        {
            title: 'Products',
            href: '/admin/products',
            icon: <Package className="h-5 w-5" />,
            active: location.pathname.includes('/admin/products'),
            submenu: [
                { title: 'All Products', href: '/admin/products' },
                { title: 'Add New', href: '/admin/products/new' },
                { title: 'Categories', href: '/admin/categories' },
            ],
        },
        {
            title: 'Orders',
            href: '/admin/orders',
            icon: <ShoppingBag className="h-5 w-5" />,
            badge: 5,
            active: location.pathname.includes('/admin/orders'),
        },
        {
            title: 'Customers',
            href: '/admin/customers',
            icon: <Users className="h-5 w-5" />,
            active: location.pathname.includes('/admin/customers'),
        },
        {
            title: 'Discounts',
            href: '/admin/discounts',
            icon: <TagIcon className="h-5 w-5" />,
            active: location.pathname.includes('/admin/discounts'),
            submenu: [
                { title: 'Discount Codes', href: '/admin/discounts' },
                { title: 'Coupons', href: '/admin/coupons' },
            ],
        },
        {
            title: 'Settings',
            href: '/admin/settings',
            icon: <Settings className="h-5 w-5" />,
            active: location.pathname.includes('/admin/settings'),
        },
    ];

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleSubmenu = (title: string) => {
        if (isSubmenuOpen === title) {
            setIsSubmenuOpen(null);
        } else {
            setIsSubmenuOpen(title);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white transition-all duration-300 ease-in-out",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full",
                    "lg:relative lg:translate-x-0"
                )}
            >
                {/* Logo */}
                <div className="h-16 flex items-center gap-2 px-4 border-b">
                    <Link to="/admin/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                            <span className="text-white font-bold">C</span>
                        </div>
                        <span className="font-semibold text-lg">Cladily Admin</span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto lg:hidden"
                        onClick={toggleSidebar}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="p-2 overflow-y-auto h-[calc(100vh-4rem)]">
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <div key={item.title}>
                                {item.submenu ? (
                                    <div className="space-y-1">
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "w-full justify-between text-muted-foreground hover:text-foreground hover:bg-muted",
                                                item.active && "bg-muted text-foreground font-medium",
                                            )}
                                            onClick={() => toggleSubmenu(item.title)}
                                        >
                                            <div className="flex items-center">
                                                {item.icon}
                                                <span className="ml-3 text-sm">{item.title}</span>
                                            </div>
                                            <ChevronDown
                                                className={cn(
                                                    "h-4 w-4 transition-transform",
                                                    isSubmenuOpen === item.title && "rotate-180"
                                                )}
                                            />
                                        </Button>
                                        {isSubmenuOpen === item.title && (
                                            <div className="pl-9 space-y-1">
                                                {item.submenu.map((subItem) => (
                                                    <Link
                                                        key={subItem.title}
                                                        to={subItem.href}
                                                        className={cn(
                                                            "block px-3 py-2 rounded-md text-sm hover:bg-muted",
                                                            location.pathname === subItem.href && "bg-muted font-medium"
                                                        )}
                                                    >
                                                        {subItem.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted",
                                            item.active && "bg-muted text-foreground font-medium",
                                        )}
                                        onClick={() => navigate(item.href)}
                                    >
                                        {item.icon}
                                        <span className="ml-3 text-sm">{item.title}</span>
                                        {item.badge && (
                                            <Badge className="ml-auto bg-primary text-white">{item.badge}</Badge>
                                        )}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="border-t mt-6 pt-6">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted"
                            onClick={() => navigate('/')}
                        >
                            <Home className="h-5 w-5" />
                            <span className="ml-3 text-sm">Visit Store</span>
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="ml-3 text-sm">Logout</span>
                        </Button>
                    </div>
                </nav>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b bg-white flex items-center px-4 sticky top-0 z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="mr-2 lg:hidden"
                        onClick={toggleSidebar}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <div className="flex-1 flex items-center ml-auto gap-2">
                        <div className={cn("transition-all duration-300", isSearchOpen ? "w-80" : "w-0 opacity-0 md:w-64 md:opacity-100")}>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    placeholder="Search..."
                                    className="pl-9 h-9 focus:ring-primary w-full bg-gray-50"
                                />
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="max-h-96 overflow-y-auto">
                                    <div className="py-2 px-3 hover:bg-muted cursor-pointer">
                                        <p className="text-sm font-medium">New order received</p>
                                        <p className="text-xs text-muted-foreground">Order #12345 - $120.00</p>
                                        <p className="text-xs text-muted-foreground mt-1">10 minutes ago</p>
                                    </div>
                                    <div className="py-2 px-3 hover:bg-muted cursor-pointer">
                                        <p className="text-sm font-medium">Product inventory low</p>
                                        <p className="text-xs text-muted-foreground">Summer T-shirt - 3 items left</p>
                                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer text-center">
                                    <span className="text-primary text-sm mx-auto">View all notifications</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2 pl-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                                        <AvatarFallback>AD</AvatarFallback>
                                    </Avatar>
                                    {isAuthenticated ? (
                                        <div className="hidden md:block text-left">
                                            <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                                        </div>
                                    ) : (
                                        <div className="hidden md:block text-left">
                                            <p className="text-sm font-medium">Admin User</p>
                                            <p className="text-xs text-muted-foreground">admin@cladily.com</p>
                                        </div>
                                    )}
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate('/auth/logout')}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 pb-10">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout; 