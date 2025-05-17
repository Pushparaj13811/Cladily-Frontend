import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import Footer from "./components/layout/Footer";
import { ThemeProvider } from "./components/providers/theme-provider";
import { ScrollArea } from "./components/ui/scroll-area";
import "@/styles/globals.css";

export default function Layout() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="cladily-theme">
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <ScrollArea className="flex-1">
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </ScrollArea>
      </div>
    </ThemeProvider>
  );
} 