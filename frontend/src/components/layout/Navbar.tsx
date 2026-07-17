'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';


const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  {
    href: '/services',
    label: 'Services',
    children: [
      { href: '/services#recruitment', label: 'Recruitment' },
      { href: '/services#staffing', label: 'Staffing' },
      { href: '/services#executive-search', label: 'Executive Search' },
      { href: '/services#hr-consulting', label: 'HR Consulting' },
      { href: '/services#payroll', label: 'Payroll' },
      { href: '/services#bulk-hiring', label: 'Bulk Hiring' },
    ],
  },
  { href: '/jobs', label: 'Jobs' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];


export default function Navbar() {

  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);


  useEffect(() => {

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      );
    };

  }, []);



  useEffect(() => {

    setMobileOpen(false);
    setDropdown(null);

  }, [pathname]);



  const active = (href: string) => {

    if (href === '/') {
      return pathname === '/';
    }

    return pathname.startsWith(href);

  };



  return (

<header
className={cn(
"fixed top-0 left-0 right-0 z-50 transition-all duration-300",
scrolled
? "bg-[#0a1628]/95 backdrop-blur-xl shadow-xl"
: "bg-transparent"
)}
>


<nav className="container-custom">

<div className="h-20 flex items-center justify-between">


{/* LOGO */}

<Link
href="/"
className="flex items-center gap-3"
>

<div className="relative w-14 h-14">

<Image
src="/assets/logo.png"
alt="Recluta Logo"
fill
priority
className="object-contain"
/>

</div>


<div>

<h1 className="
font-display
font-bold
text-xl
leading-none
text-white
">
RECLUTA
</h1>


<p className="
text-[10px]
tracking-[0.25em]
uppercase
text-cyan-300
mt-1
">
Talent Management
</p>

</div>


</Link>





{/* DESKTOP NAV */}

<div className="hidden lg:flex items-center gap-2">


{
navLinks.map(item => (

item.children ? (

<div
key={item.href}
className="relative"
>


<button

onClick={() =>
setDropdown(
dropdown === item.href
? null
: item.href
)
}

className={cn(
"flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition",
"text-gray-200 hover:text-cyan-400",
active(item.href) && "text-cyan-400"
)}

>

{item.label}

<ChevronDown
className={cn(
"w-4 h-4 transition-transform",
dropdown === item.href && "rotate-180"
)}
/>

</button>



<AnimatePresence>

{
dropdown === item.href && (

<motion.div

initial={{
opacity:0,
y:10
}}

animate={{
opacity:1,
y:0
}}

exit={{
opacity:0,
y:10
}}

className="
absolute top-full mt-3
left-0 w-56
bg-white
rounded-xl
shadow-xl
overflow-hidden
"

>


{
item.children.map(child => (

<Link

key={child.href}

href={child.href}

className="
block px-5 py-3
text-sm
text-gray-700
hover:bg-cyan-50
hover:text-cyan-600
"

>

{child.label}

</Link>

))

}


</motion.div>

)

}

</AnimatePresence>


</div>


) : (

<Link

key={item.href}

href={item.href}

className={cn(
"px-3 py-2 rounded-lg text-sm font-medium transition",
"text-gray-200 hover:text-cyan-400",
active(item.href) && "text-cyan-400"
)}

>

{item.label}

</Link>

)


))

}


</div>





{/* ACTIONS */}

<div className="flex items-center gap-3">


<button

onClick={() =>
setTheme(
theme === "dark"
? "light"
: "dark"
)
}

className="
p-2 rounded-lg
text-gray-200
hover:bg-white/10
"

>

{
theme === "dark"
?
<Sun className="w-5 h-5"/>
:
<Moon className="w-5 h-5"/>
}

</button>



<Link

href="/jobs"

className="
hidden md:block
bg-blue-600
hover:bg-blue-700
text-white
px-6 py-2.5
rounded-lg
font-semibold
text-sm
"

>

Find Jobs

</Link>



<button

onClick={() =>
setMobileOpen(!mobileOpen)
}

className="lg:hidden text-white"

>

{
mobileOpen
?
<X/>
:
<Menu/>
}

</button>


</div>


</div>

</nav>





{/* MOBILE MENU */}

<AnimatePresence>

{
mobileOpen && (

<motion.div

initial={{
height:0,
opacity:0
}}

animate={{
height:'auto',
opacity:1
}}

exit={{
height:0,
opacity:0
}}

className="
lg:hidden
bg-[#0a1628]
border-t border-white/10
"

>


<div className="p-5 space-y-2">


{
navLinks.map(item => (

<div
key={item.href}
>


<Link

href={item.href}

className="
block py-3
text-white
font-medium
"

>

{item.label}

</Link>


{
item.children && (

<div className="pl-4">

{
item.children.map(child => (

<Link

key={child.href}

href={child.href}

className="
block py-2
text-gray-300
text-sm
"

>

{child.label}

</Link>

))

}

</div>

)

}


</div>

))

}


</div>


</motion.div>

)

}

</AnimatePresence>


</header>

  );
}