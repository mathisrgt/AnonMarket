import Link from "next/link";
import { Home } from 'lucide-react';
import { Badge } from "@nextui-org/react";

export default function NavBar() {
    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-gray-200 py-2 flex justify-around z-50">
            <Link href="/markets" className="flex flex-col items-center">
                <Home className="text-gray-600" />
                <span className="text-xs text-gray-600">Markets</span>
            </Link>
            <Badge content="1" color="danger" className="flex flex-col">
                <Link href="/portfolio" className="flex flex-col items-center">
                    <Home className="text-gray-600" />
                    <span className="text-xs text-gray-600">Portfolio</span>
                </Link>
            </Badge>
            <Link href="/account" className="flex flex-col items-center">
                <Home className="text-gray-600" />
                <span className="text-xs text-gray-600">Profile</span>
            </Link>
        </nav>
    );
}
