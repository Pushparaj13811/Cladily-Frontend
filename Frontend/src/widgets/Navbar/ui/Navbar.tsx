import { useTheme } from "@app/providers/theme-provider";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@app/components/ui/navigation-menu";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { ShoppingBag, Heart, Search, User, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@app/lib/utils";
import { COMPANY, NAVIGATION } from "@shared/constants";
import { useCart } from "@features/cart";

export function MainNavbar() {
    const { theme, setTheme } = useTheme();
    const { itemCount } = useCart();

    return (
        <header className="border-b border-border">
            <div className="bg-primary text-primary-foreground text-center py-2 text-sm">
                <Link to={NAVIGATION.AUTH.MEMBERS.href}>{NAVIGATION.AUTH.MEMBERS.name}</Link>
            </div>
            <div className="container mx-auto py-4 px-4 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {NAVIGATION.MAIN_CATEGORIES.map((category) => (
                                <NavigationMenuItem key={category.name}>
                                    <Link to={category.href} className="text-sm font-medium px-3">
                                        {category.name}
                                    </Link>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
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
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/login">
                            <User className="h-5 w-5" />
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Heart className="h-5 w-5" />
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
                </div>
            </div>

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
        </header>
    );
} 