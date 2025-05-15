
import { Plane } from 'lucide-react';
import Link from 'next/link';

export function Logo({ size = 'default' }: { size?: 'default' | 'small' }) {
  const iconSize = size === 'small' ? 'h-5 w-5' : 'h-7 w-7';
  const textSize = size === 'small' ? 'text-lg' : 'text-2xl';

  return (
    <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
      <Plane className={iconSize} aria-hidden="true" />
      <span className={`${textSize} font-bold`}>RoamEasy</span>
    </Link>
  );
}
