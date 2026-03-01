import { NavLink } from "react-router";
import { useAuth } from "../hook/useAuth";
import { Home, Server, ListChecks, LogOut } from "lucide-react";

export function SideNavLink() {
    const { logout } = useAuth();

    const navItem = [
        { to: "/", id: "home", label: "Home", icon: <Home className="w-5 h-5 mr-2" /> },
        { to: "/node", id: "node", label: "Node", icon: <Server className="w-5 h-5 mr-2" /> },
        { to: "/job", id: "job", label: "Job", icon: <ListChecks className="w-5 h-5 mr-2" /> },
    ];

    return (
        <nav className="flex flex-col w-56 h-screen bg-gradient-to-b from-slate-900 to-slate-700 text-white p-4 shadow-lg">
            <div className="mb-8 text-2xl font-bold tracking-wide">Blade Dashboard</div>
            <div className="flex flex-col gap-2 flex-1">
                {navItem.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-2 rounded-lg transition-colors duration-150 text-base font-medium gap-2
                            ${isActive ? "bg-slate-600 text-lime-400" : "hover:bg-slate-800 hover:text-lime-300"}`
                        }
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </div>
            <button
                onClick={logout}
                className="flex items-center px-4 py-2 mt-8 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold gap-2 transition-colors duration-150"
            >
                <LogOut className="w-5 h-5 mr-2" /> Logout
            </button>
        </nav>
    );
}