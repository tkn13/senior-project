import { NavLink } from "react-router";
import { useAuth } from "../hook/useAuth";

export function SideNavLink() {

    const { logout } = useAuth();

    const navItem = [
        { to: "/", id: "home", label: "Home" },
        { to: "/node", id: "node", label: "Node" },
        { to: "/job", id: "job", label: "Job" }
    ]

    return (
        <nav className="flex flex-col w-48 h-screen bg-gray-200 p-4">
            {navItem.map((item) => (
                <NavLink
                    key={item.id}
                    to={item.to}
                    className={({ isActive }) => 
                        `p-2 mb-1 text-lg hover:bg-gray-300 rounded
                        ${isActive ? 
                            "bg-gray-400 rounded" 
                            : ""}`}
                >
                    {item.label}
                </NavLink>
            ))}
            <button
                onClick={logout}
                className="p-2 mt-auto text-lg hover:bg-gray-300 rounded"
            >
                Logout
            </button>
        </nav>
    );
}