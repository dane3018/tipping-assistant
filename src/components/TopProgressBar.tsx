'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Customize the bar style (optional)
import '@/styles/nprogress-custom.css'; // optional override

NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
}
