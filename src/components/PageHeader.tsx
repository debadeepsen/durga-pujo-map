'use client';

import Link from "next/link"
import { usePathname } from "next/navigation";

export const PageHeader = () => {
  const pathname = usePathname();
  const isAboutPage = pathname === '/about';
  const linkText = isAboutPage ? 'Home' : 'About';
  const linkHref = isAboutPage ? '/' : '/about';

  return (
    <div className='flex flex-1 items-center border-b border-zinc-600/50 z-10'>
      <h1 className='text-xl font-semibold h-[48px] flex flex-1 items-center pl-12 relative -top-[1px]'>
        Durga Puja Pandals Map
      </h1>


      {/* About link on top-right */}
      <nav className="pr-12">
        <Link
          href={linkHref}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          {linkText}
        </Link>
      </nav>
    </div>


  )
}
