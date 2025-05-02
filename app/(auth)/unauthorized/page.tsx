import Link from 'next/link';
import { Shield, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center  p-4">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full ">
        <Shield className="h-12 w-12 text-red-600" />
      </div>
      <h1 className="mb-2 text-3xl font-bold">Access Denied</h1>
      <p className="mb-6 max-w-md text-center text-muted-foreground">
        You do not have permission to access this page. Please contact an
        administrator if you believe this is an error.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
