import Link from "next/link";
import { Home, Wallet, User, ArrowLeftRight } from 'lucide-react';
import { Badge } from "@nextui-org/react";

export default function MobileNav() {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-gray-200 px-6 py-3 z-50">
            <div className="flex justify-around items-center">
                <NavLink href="/markets" icon={<Home size={20} />} label="Markets" />
                <NavLink href="/converter" icon={<ArrowLeftRight size={20} />} label="Converter" />
                <Badge content="1" color="danger" className="flex flex-col">
                    <NavLink href="/portfolio" icon={<Wallet size={20} />} label="Portfolio" />
                </Badge>
                <NavLink href="/account" icon={<User size={20} />} label="Profile" />
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
        <Link href={href} className="flex flex-col items-center">
            <div className="text-gray-600">{icon}</div>
            <span className="text-xs text-gray-600 mt-1">{label}</span>
        </Link>
    );
}
