import MobileNav from "./navigation/MobileNav";
import DesktopNav from "./navigation/DesktopNav";

export default function NavBar() {
    return (
        <>
            <DesktopNav />
            <MobileNav />
        </>
    );
}
