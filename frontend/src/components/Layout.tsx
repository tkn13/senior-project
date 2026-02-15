import { SideNavLink } from "../pages/NavLink";
import { Outlet } from "react-router";

export function Layout() {

    return (
        <div className="flex">
            < SideNavLink />
            <div className="flex-1 p-4">
                <Outlet />
            </div>
        </div>
    );
}