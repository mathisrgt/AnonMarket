import Link from "next/link";
import { Home, Wallet, User, ArrowLeftRight, LineChart } from 'lucide-react';
import { Badge } from "@nextui-org/react";

export default function MobileNav() {
    return (
        <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl px-6 py-3 z-50">
            <div className="flex justify-around items-center">
                <NavLink href="/home" icon={<Home size={20} />} label="Home" />
                {/* <NavLink href="/markets" icon={<LineChart size={20} />} label="Markets" /> */}
                {/* <Badge content="1" color="danger" className="flex flex-col">
                </Badge> */}
                <NavLink href="/portfolio" icon={<Wallet size={20} />} label="Portfolio" />
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
