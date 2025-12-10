import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Subjects', href: '/subjects' },
  { name: 'For Students', href: '/students' },
  { name: 'For Teachers', href: '/teachers' },
  { name: 'For Schools', href: '/schools' },
  { name: 'Pricing', href: '/pricing' },
];

export const Navbar = ({ variant = 'default' }: { variant?: 'default' | 'transparent' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isTransparent = variant === 'transparent';

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isTransparent
          ? "bg-transparent"
          : "bg-background/95 backdrop-blur-lg border-b border-border shadow-sm"
      )}
    >
      <div className="container px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center",
              isTransparent ? "bg-primary-foreground/10 backdrop-blur-sm" : "gradient-primary"
            )}>
              <BookOpen className={cn(
                "w-5 h-5",
                isTransparent ? "text-primary-foreground" : "text-primary-foreground"
              )} />
            </div>
            <span className={cn(
              "font-display font-bold text-xl",
              isTransparent ? "text-primary-foreground" : "text-foreground"
            )}>
              Learn2Master
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors animated-underline",
                  isTransparent
                    ? "text-primary-foreground/80 hover:text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  location.pathname === link.href && (isTransparent ? "text-primary-foreground" : "text-foreground")
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              asChild
              variant={isTransparent ? "hero-outline" : "ghost"}
              size="sm"
            >
              <Link to="/login">Log In</Link>
            </Button>
            <Button
              asChild
              variant={isTransparent ? "accent" : "default"}
              size="sm"
            >
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className={cn("w-6 h-6", isTransparent ? "text-primary-foreground" : "text-foreground")} />
            ) : (
              <Menu className={cn("w-6 h-6", isTransparent ? "text-primary-foreground" : "text-foreground")} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border animate-slide-down">
          <div className="container px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block py-2 text-foreground font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/dashboard">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
