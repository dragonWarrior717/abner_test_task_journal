'use client'; // Add if using hooks like useState for mobile menu

import React, { useState } from 'react'; // Import useState
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Button } from '../ui/button'; // For FAB
import { PenSquare } from 'lucide-react'; // For FAB
import { BackToTop } from './BackToTop';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  // State for mobile sidebar might be needed if Header doesn't manage it
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <Sidebar
        // Pass mobile state if needed:
        // isMobileMenuOpen={isMobileMenuOpen}
        // setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      {/* Mobile Sidebar (Drawer - could be part of Sidebar component conditionally rendered) */}
      {/* Or handled by a separate MobileNav component */}

      <main className="flex-1 overflow-auto flex flex-col">
        {/* Header needs to handle mobile menu toggle */}
        <Header
          // Pass mobile menu toggle handlers if needed
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <div className="flex-1 p-6 pt-0 lg:pt-6 overflow-auto pb-20 lg:pb-6"> {/* Adjust padding, add bottom padding for FAB */}
          {children}
        </div>
      </main>

      {/* Floating Action Button (FAB) for New Entry on smaller screens */}
      <div className="fixed bottom-6 right-6 z-30 lg:hidden"> {/* Show only on smaller screens */}
        <Button
          size="lg"
          variant="default"
          className="rounded-full shadow-lg w-14 h-14 p-0"
        >
          <PenSquare size={24} />
          <span className="sr-only">New Entry</span>
        </Button>
      </div>

      {/* Back to Top Button */}
      <BackToTop />

      {/* You would also need a drawer/modal for the mobile navigation items triggered by the Header */}
    </div>
  );
} 