'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { LayoutDashboardIcon, LogOutIcon, UserCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';

const ProfileAvatar = () => {
  const { user, isLoading, logout } = useAuth();

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="size-8 rounded-full">
              {isLoading ? (
                <Skeleton className="size-8 rounded-full" />
              ) : (
                <Avatar className="size-8 ">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {user.isAdmin && (
                <DropdownMenuItem asChild>
                  <Link className="cursor-pointer" href="/admin">
                    <LayoutDashboardIcon
                      className="mr-2 size-4"
                      aria-hidden="true"
                    />
                    Admin
                    <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex w-full cursor-pointer items-center justify-between outline-none hover:rounded-none hover:outline-none"
              asChild
            >
              <Button
                onClick={logout}
                className="flex w-full cursor-pointer items-center justify-between outline-none hover:rounded-none hover:outline-none"
                variant="ghost"
              >
                <LogOutIcon className="mr-2 size-4" aria-hidden="true" />
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button size="sm">
          <Link href="/sign-in">
            Sign In
            <span className="sr-only">Sign In</span>
          </Link>
        </Button>
      )}
    </>
  );
};
export default ProfileAvatar;
