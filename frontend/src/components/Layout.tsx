import { SideNavLink } from "../pages/NavLink";
import { Outlet } from "react-router";

export function Layout() {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <SideNavLink />

            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
            
        </div>
    );
}