'use client';
import { Card, CardBody, Button } from "@nextui-org/react";
import { Settings, Shield, Bell, HelpCircle, LogOut } from 'lucide-react';

export default function AccountPage() {
    const menuItems = [
        { icon: <Settings size={20} />, label: 'Settings', href: '/account/settings' },
        { icon: <Shield size={20} />, label: 'Security', href: '/account/security' },
        { icon: <Bell size={20} />, label: 'Notifications', href: '/account/notifications' },
        { icon: <HelpCircle size={20} />, label: 'Help & Support', href: '/account/support' },
    ];

    return (
        <div className="max-w-md mx-auto pt-6">
            <h1 className="text-2xl font-bold mb-6">Profile</h1>
            
            <Card className="bg-white shadow-md mb-6">
                <CardBody>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full" />
                        <div>
                            <h2 className="font-semibold">Anonymous User</h2>
                            <p className="text-sm text-gray-500">ID: 0x1234...5678</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <Card className="bg-white shadow-md">
                <CardBody className="p-0">
                    {menuItems.map((item, index) => (
                        <button
                            key={item.label}
                            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-gray-600">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </CardBody>
            </Card>

            <Button
                color="danger"
                variant="flat"
                className="w-full mt-6"
                startContent={<LogOut size={20} />}
            >
                Logout
            </Button>
        </div>
    );
}