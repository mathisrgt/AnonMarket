import Link from "next/link";
import { Home, Wallet, User, ArrowLeftRight, LineChart } from 'lucide-react';
import { Badge } from "@nextui-org/react";

export default function DesktopNav() {
    return (
        <nav className="hidden md:flex fixed top-0 left-0 w-full bg-white shadow-lg border-b border-gray-200 px-6 py-4 z-50">
            <div className="flex items-center gap-8 max-w-7xl mx-auto w-full">
                <Link href="/" className="text-xl font-bold">AnonMarket</Link>
                <div className="flex gap-6 ml-auto">
                    <NavLink href="/home" icon={<Home size={20} />} label="Home" />
                    <NavLink href="/portfolio" icon={<Wallet size={20} />} label="Portfolio" />
                    <NavLink href="/account" icon={<User size={20} />} label="Profile" />
                </div>
            </div>
        </nav>
    );
}

interface NavLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
}

function NavLink({ href, icon, label }: NavLinkProps) {
    return (
        <Link href={href} className="flex items-center gap-2 hover:text-primary transition-colors duration-200">
            {icon}
            <span>{label}</span>
        </Link>
    );
}
