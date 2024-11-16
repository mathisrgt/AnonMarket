import { Card, CardBody } from "@nextui-org/react";
import { Settings, Shield, Bell, HelpCircle } from "lucide-react";

export function SettingsMenu() {
    const menuItems = [
        { icon: <Settings size={20} />, label: 'Settings', href: '/account/settings' },
        { icon: <Shield size={20} />, label: 'Security', href: '/account/security' },
        { icon: <Bell size={20} />, label: 'Notifications', href: '/account/notifications' },
        { icon: <HelpCircle size={20} />, label: 'Help & Support', href: '/account/support' },
    ];

    return <Card className="bg-white shadow-md">
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
    </Card>;
}