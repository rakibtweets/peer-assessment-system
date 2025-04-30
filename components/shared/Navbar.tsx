import { Award } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToogle';

const Navbar = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Peer Assessment</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
export default Navbar;
