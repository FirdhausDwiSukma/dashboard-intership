"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
    Home,
    Users,
    Settings,
    LogOut,
    LayoutDashboard,
    PieChart,
    Bell,
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    FileText,
    HelpCircle,
    GraduationCap,
    Grid3X3,
    Lock,
    UserPlus,
    ClipboardList,
    Download,
    Briefcase,
    type LucideIcon,
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { authHelper } from "@/app/utils/authHelper";
import Image from "next/image";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

interface SidebarItem {
    icon: LucideIcon;
    label: string;
    href?: string;
    submenu?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
    { icon: Home, label: "Home", href: "/dashboard" },
    {
        icon: LayoutDashboard,
        label: "Dashboard",
        submenu: [
            { icon: PieChart, label: "Analytics", href: "/dashboard/analytics" },
            { icon: FileText, label: "Report", href: "/dashboard/report" },
        ]
    },
    { icon: Users, label: "Users", href: "/dashboard/users" },
    { icon: GraduationCap, label: "Intership Management", href: "/dashboard/interns" },
    {
        icon: Briefcase,
        label: "HR Dashboard",
        submenu: [
            { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/hr" },
            { icon: GraduationCap, label: "All Interns", href: "/dashboard/hr/all-interns" },
            { icon: UserPlus, label: "Add Intern", href: "/dashboard/hr/add-intern" },
            { icon: Users, label: "Assign PIC", href: "/dashboard/hr/assign-pic" },
            { icon: Lock, label: "Lock Period", href: "/dashboard/hr/lock-period" },
            { icon: Grid3X3, label: "9 Grid Overview", href: "/dashboard/hr/nine-grid" },
            { icon: ClipboardList, label: "Reporting", href: "/dashboard/hr/reporting" },
            { icon: Download, label: "Export Data", href: "/dashboard/hr/export" },
        ]
    },
];

// Bottom menu items (above user profile)
const bottomMenuItems: SidebarItem[] = [
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
    { icon: HelpCircle, label: "Support", href: "/dashboard/support" },
];

export function Sidebar({ isOpen, setIsOpen, isCollapsed, toggleCollapse }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [username, setUsername] = useState<string>("Admin");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // New state
    const [email, setEmail] = useState<string>("admin@dashtern.com"); // New state
    const [role, setRole] = useState<string | null>(null);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const [showProfileCard, setShowProfileCard] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Function to load profile data
    const loadProfileData = () => {
        // Try to get from localStorage first for immediate display
        const storedUser = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");
        const storedAvatar = localStorage.getItem("avatar_url");
        const storedEmail = localStorage.getItem("email");

        if (storedUser) setUsername(storedUser);
        if (storedRole) setRole(storedRole);
        if (storedAvatar) setAvatarUrl(storedAvatar);
        if (storedEmail) setEmail(storedEmail);
    };

    useEffect(() => {
        loadProfileData();

        // Listen for profile update events
        const handleProfileUpdate = (event: CustomEvent) => {
            // Reload data from storage or payload
            if (event.detail) {
                if (event.detail.full_name) setUsername(event.detail.full_name);
                if (event.detail.avatar_url) setAvatarUrl(event.detail.avatar_url);
                if (event.detail.email) setEmail(event.detail.email);
            } else {
                loadProfileData();
            }
        };

        window.addEventListener('user-profile-updated', handleProfileUpdate as EventListener);
        return () => {
            window.removeEventListener('user-profile-updated', handleProfileUpdate as EventListener);
        };
    }, []);

    const handleLogout = () => {
        authHelper.clearToken();
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("avatar_url");
        localStorage.removeItem("email");
        router.push("/login");
    };

    const toggleSubmenu = (label: string) => {
        setOpenSubmenu(openSubmenu === label ? null : label);
    };

    // Close profile card when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfileCard(false);
            }
        };

        if (showProfileCard) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showProfileCard]);

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out flex flex-col",
                    // Mobile: controlled by isOpen (width 72). Desktop: controlled by isCollapsed (width 72 or 20)
                    isOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0",
                    isCollapsed ? "lg:w-20" : "lg:w-72"
                )}
            >
                {/* Logo Section */}
                <div className={cn(
                    "h-16 flex items-center border-b border-gray-100 dark:border-gray-800 relative transition-all duration-300",
                    isCollapsed ? "justify-center px-0" : "px-6 justify-between"
                )}>
                    <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold shrink-0">
                            D
                        </div>
                        <span className={cn(
                            "text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-900 dark:from-white dark:to-white bg-clip-text text-transparent whitespace-nowrap transition-opacity duration-300",
                            isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
                        )}>
                            Dashtern
                        </span>
                    </Link>

                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={toggleCollapse}
                        className={cn(
                            "hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-full items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 shadow-sm transition-colors z-50",
                            isCollapsed && "-right-3"
                        )}
                    >
                        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {/* Search Bar */}
                    <div className="mb-6 relative">
                        {isCollapsed ? (
                            <button className="w-full flex justify-center p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                <Search className="w-5 h-5" />
                            </button>
                        ) : (
                            <>
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                />
                            </>
                        )}
                    </div>

                    {!isCollapsed && (
                        <p className="px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                            Menu
                        </p>
                    )}

                    {sidebarItems.filter(item => {
                        // Hide Users menu if not Super Admin
                        if (item.label === "Users" && role !== "super_admin") return false;
                        // Hide HR Dashboard if not HR or Super Admin
                        if (item.label === "HR Dashboard" && role !== "hr" && role !== "super_admin") return false;
                        return true;
                    }).map((item) => {
                        const hasSubmenu = item.submenu && item.submenu.length > 0;
                        const isSubmenuOpen = openSubmenu === item.label;
                        const isParentActive = item.submenu?.some(sub => pathname === sub.href);
                        const isActive = pathname === item.href;

                        return (
                            <div key={item.label}>
                                {/* Main Menu Item */}
                                {hasSubmenu ? (
                                    <button
                                        onClick={() => {
                                            if (isCollapsed) {
                                                // Expand sidebar when collapsed so submenu is visible
                                                toggleCollapse();
                                                setOpenSubmenu(item.label);
                                            } else {
                                                // Toggle submenu in expanded state
                                                toggleSubmenu(item.label);
                                            }
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                                            isParentActive
                                                ? "bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400"
                                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200",
                                            isCollapsed && "justify-center px-2"
                                        )}
                                        title={isCollapsed ? item.label : undefined}
                                    >
                                        <item.icon
                                            className={cn(
                                                "w-5 h-5 transition-colors shrink-0",
                                                isParentActive
                                                    ? "text-primary-600 dark:text-primary-400"
                                                    : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                                            )}
                                        />
                                        {!isCollapsed && (
                                            <>
                                                <span className="whitespace-nowrap flex-1 text-left">{item.label}</span>
                                                {isSubmenuOpen ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href!}
                                        onClick={() => {
                                            // Close any open submenu when clicking other menu items
                                            setOpenSubmenu(null);
                                        }}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                                            isActive
                                                ? "bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400"
                                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200",
                                            isCollapsed && "justify-center px-2"
                                        )}
                                        title={isCollapsed ? item.label : undefined}
                                    >
                                        <item.icon
                                            className={cn(
                                                "w-5 h-5 transition-colors shrink-0",
                                                isActive
                                                    ? "text-primary-600 dark:text-primary-400"
                                                    : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                                            )}
                                        />
                                        {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                                    </Link>
                                )}

                                {/* Submenu Items */}
                                {hasSubmenu && isSubmenuOpen && !isCollapsed && (
                                    <div className="mt-1 ml-4 space-y-1">
                                        {item.submenu!.map((subItem) => {
                                            const isSubActive = pathname === subItem.href;
                                            return (
                                                <Link
                                                    key={subItem.href}
                                                    href={subItem.href!}
                                                    className={cn(
                                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group",
                                                        isSubActive
                                                            ? "bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 font-medium"
                                                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                                                    )}
                                                >
                                                    <subItem.icon
                                                        className={cn(
                                                            "w-4 h-4 transition-colors shrink-0",
                                                            isSubActive
                                                                ? "text-primary-600 dark:text-primary-400"
                                                                : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                                                        )}
                                                    />
                                                    <span className="whitespace-nowrap">{subItem.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Menu Items */}
                <div className="px-4 py-2 space-y-1">
                    {bottomMenuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href!}
                                onClick={() => {
                                    // Close any open submenu when clicking bottom menu items
                                    setOpenSubmenu(null);
                                }}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200",
                                    isCollapsed && "justify-center px-2"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <item.icon
                                    className={cn(
                                        "w-5 h-5 transition-colors shrink-0",
                                        isActive
                                            ? "text-primary-600 dark:text-primary-400"
                                            : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                                    )}
                                />
                                {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                            </Link>
                        );
                    })}
                </div>

                {/* User Profile Section (Bottom) */}
                <div
                    ref={profileRef}
                    className={cn("relative p-4 border-t border-gray-200 dark:border-gray-800", isCollapsed && "p-2")}
                >
                    <div
                        onClick={() => setShowProfileCard(!showProfileCard)}
                        className={cn(
                            "flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group",
                            isCollapsed && "justify-center"
                        )}
                        title={isCollapsed ? username : undefined}
                    >
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden relative shrink-0 ring-2 ring-white dark:ring-gray-800 shadow-sm">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl.startsWith('http') ? avatarUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${avatarUrl}`}
                                    alt={username}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement?.querySelector('.footer-btn-avatar-fallback')?.classList.remove('hidden');
                                    }}
                                />
                            ) : null}
                            <div className={cn(
                                "footer-btn-avatar-fallback absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium bg-gray-200 dark:bg-gray-700",
                                avatarUrl ? "hidden" : ""
                            )}>
                                {username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        {!isCollapsed && (
                            <>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {username}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {email}
                                    </p>
                                </div>
                                <ChevronUp
                                    className={cn(
                                        "w-4 h-4 text-gray-400 transition-transform",
                                        showProfileCard && "rotate-180"
                                    )}
                                />
                            </>
                        )}
                    </div>

                    {/* Profile Dropdown Card */}
                    {showProfileCard && (
                        <div
                            className={cn(
                                "absolute left-full bottom-2 ml-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 p-4 z-50",
                                "animate-in fade-in slide-in-from-left-2 duration-200"
                            )}
                        >
                            {/* Profile Photo & Info */}
                            <div className="flex flex-col items-center text-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden relative mb-3 ring-2 ring-white dark:ring-gray-800 shadow-md">
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl.startsWith('http') ? avatarUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${avatarUrl}`}
                                            alt={username}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement?.querySelector('.avatar-fallback')?.classList.remove('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <div className={cn(
                                        "avatar-fallback absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-2xl bg-gray-200 dark:bg-gray-700",
                                        avatarUrl ? "hidden" : ""
                                    )}>
                                        {username.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {username}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {email}
                                </p>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-200 dark:border-gray-800 my-3"></div>

                            {/* Menu Items */}
                            <div className="space-y-1">
                                <Link
                                    href="/dashboard/profile"
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => setShowProfileCard(false)}
                                >
                                    <Users className="w-4 h-4" />
                                    <span>Profile</span>
                                </Link>
                                <Link
                                    href="/dashboard/settings"
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => setShowProfileCard(false)}
                                >
                                    <Settings className="w-4 h-4" />
                                    <span>Settings</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        setShowProfileCard(false);
                                        handleLogout();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
