import { Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { ThemeProvider } from "./components/providers/theme-provider";
import "./styles/globals.css";

export default function MainLayout() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="cladily-theme">
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
} 