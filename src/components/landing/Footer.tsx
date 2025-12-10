import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">Learn2Master</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Uganda's leading AI-powered e-learning platform for A-Level students,
              aligned with the NCDC Competence-Based Curriculum.
            </p>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Kampala, Uganda
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                hello@learn2master.ug
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +256 700 000 000
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="font-display font-semibold mb-4">Subjects</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/subjects/math" className="hover:text-primary-foreground transition-colors">Mathematics</Link></li>
              <li><Link to="/subjects/physics" className="hover:text-primary-foreground transition-colors">Physics</Link></li>
              <li><Link to="/subjects/chemistry" className="hover:text-primary-foreground transition-colors">Chemistry</Link></li>
              <li><Link to="/subjects/biology" className="hover:text-primary-foreground transition-colors">Biology</Link></li>
              <li><Link to="/subjects/economics" className="hover:text-primary-foreground transition-colors">Economics</Link></li>
              <li><Link to="/subjects" className="hover:text-primary-foreground transition-colors">View All →</Link></li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="font-display font-semibold mb-4">For Users</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/students" className="hover:text-primary-foreground transition-colors">For Students</Link></li>
              <li><Link to="/teachers" className="hover:text-primary-foreground transition-colors">For Teachers</Link></li>
              <li><Link to="/schools" className="hover:text-primary-foreground transition-colors">For Schools</Link></li>

              <li><Link to="/pricing" className="hover:text-primary-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/help" className="hover:text-primary-foreground transition-colors">Help Center</Link></li>
              <li><Link to="/blog" className="hover:text-primary-foreground transition-colors">Blog</Link></li>
              <li><Link to="/community" className="hover:text-primary-foreground transition-colors">Community</Link></li>
              <li><Link to="/about" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} Learn2Master. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/50">
            <Link to="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
