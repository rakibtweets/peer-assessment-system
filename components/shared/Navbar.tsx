import { Award } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToogle';
import ProfileAvatar from './PofileAvatar';

const Navbar = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Peer Assessment</span>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <ThemeToggle />
          <ProfileAvatar />
        </div>
      </div>
    </header>
  );
};
export default Navbar;
