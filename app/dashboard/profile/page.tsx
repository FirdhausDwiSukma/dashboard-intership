"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
import { User, getProfile, updateProfile, uploadAvatar } from "@/app/services/userService";
import { useToast } from "@/app/context/ToastContext";
import { Loader2, Mail, Phone, MessageCircle, Shield, User as UserIcon, CheckCircle, XCircle, Lock, Pencil, Camera } from "lucide-react";
import { cn } from "@/app/lib/utils";
import ChangePasswordModal from "@/app/components/profile/ChangePasswordModal";

export default function ProfilePage() {
    const { addToast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setIsLoading(true);
            const userData = await getProfile();
            setUser(userData);
            setFormData({
                full_name: userData.full_name,
                email: userData.email,
            });
        } catch (error: any) {
            addToast({
                type: "error",
                title: "Error",
                message: error.message || "Failed to load profile",
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel edit: reset form to current user data
            if (user) {
                setFormData({
                    full_name: user.full_name,
                    email: user.email,
                });
            }
            setIsEditing(false);
        } else {
            // Start edit
            setIsEditing(true);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setIsSaving(true);
            const updatedUser = await updateProfile(formData);
            setUser(updatedUser);
            setIsEditing(false); // Exit edit mode
            addToast({
                type: "success",
                title: "Success",
                message: "Profile updated successfully",
                duration: 3000,
            });
        } catch (error: any) {
            addToast({
                type: "error",
                title: "Error",
                message: error.message || "Failed to update profile",
                duration: 5000,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Basic validation
        if (file.size > 2 * 1024 * 1024) {
            addToast({
                type: "error",
                title: "Error",
                message: "File size must be less than 2MB",
                duration: 4000,
            });
            return;
        }

        if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
            addToast({
                type: "error",
                title: "Error",
                message: "Invalid file type. Only JPG, PNG, WEBP allowed.",
                duration: 4000,
            });
            return;
        }

        try {
            setIsUploading(true);
            const result = await uploadAvatar(file);

            // Update local user state immediately
            const updatedUser = { ...user, avatar_url: result.avatar_url };
            setUser(updatedUser);

            // Update localStorage and notify other components (Sidebar)
            if (typeof window !== 'undefined') {
                localStorage.setItem('avatar_url', result.avatar_url);
                window.dispatchEvent(new CustomEvent('user-profile-updated', {
                    detail: {
                        full_name: user.full_name,
                        avatar_url: result.avatar_url
                    }
                }));
            }

            addToast({
                type: "success",
                title: "Success",
                message: "Avatar updated successfully",
                duration: 3000,
            });
        } catch (error: any) {
            addToast({
                type: "error",
                title: "Error",
                message: error.message || "Failed to upload avatar",
                duration: 5000,
            });
        } finally {
            setIsUploading(false);
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // Helper to get safe role name string
    const getRoleName = (u: User) => {
        if (typeof u.role === 'string') return u.role;
        return u.role?.name || 'unknown';
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    if (!user) return null;

    const roleName = getRoleName(user);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Manage your account information
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center shadow-sm">
                        <div className="relative inline-block mx-auto mb-4">
                            <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-md overflow-hidden group">
                                {user.avatar_url ? (
                                    <img
                                        src={user.avatar_url.startsWith('http') ? user.avatar_url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${user.avatar_url}`}
                                        alt={user.full_name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback if image fails to load
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement?.querySelector('span')?.classList.remove('hidden');
                                        }}
                                    />
                                ) : (
                                    <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                                        {user.full_name.charAt(0).toUpperCase()}
                                    </span>
                                )}

                                <span className={cn("text-4xl font-bold text-primary-600 dark:text-primary-400 absolute hidden", user.avatar_url ? "" : "hidden")}>
                                    {user.full_name.charAt(0).toUpperCase()}
                                </span>

                                <div
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {isUploading ? (
                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                    ) : (
                                        <Camera className="w-6 h-6 text-white" />
                                    )}
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/jpeg,image/png,image/webp,image/jpg"
                                onChange={handleFileChange}
                            />
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.full_name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">@{user.username}</p>

                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className={cn(
                                "px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                                roleName === "super_admin" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                                    roleName === "hr" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                        roleName === "pic" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                            )}>
                                <Shield className="w-3 h-3" />
                                {roleName.replace("_", " ").toUpperCase()}
                            </span>
                            <span className={cn(
                                "px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                                user.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            )}>
                                {user.status === "active" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                {user.status.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Contact Information (Read Only) */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                            Contact Details
                        </h3>
                        {/* Contacts rendering code kept as is */}
                        <div className="space-y-3">
                            {user.contacts && user.contacts.length > 0 ? (
                                user.contacts.map((contact, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-3">
                                            {contact.contact_type === 'whatsapp' ? (
                                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-500">
                                                    <MessageCircle className="w-4 h-4" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-500">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                                    {contact.contact_type}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                                    {contact.contact_value}
                                                </p>
                                            </div>
                                        </div>
                                        {contact.is_primary && (
                                            <span className="text-[10px] bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full font-medium">
                                                Primary
                                            </span>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic text-center py-2">No contacts linked</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                            Account Settings
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Username (Read Only) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            value={user.username}
                                            disabled
                                            className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1 ml-1">Username cannot be changed</p>
                                </div>

                                {/* Role (Read Only) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Role
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            value={roleName.toUpperCase()}
                                            disabled
                                            className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Full Name (Editable) */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <UserIcon className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            required
                                            disabled={!isEditing}
                                            className={cn(
                                                "w-full pl-10 pr-3 py-2 border rounded-lg transition-all sm:text-sm",
                                                isEditing
                                                    ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                            )}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                </div>

                                {/* Email (Editable) */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            disabled={!isEditing}
                                            className={cn(
                                                "w-full pl-10 pr-3 py-2 border rounded-lg transition-all sm:text-sm",
                                                isEditing
                                                    ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                            )}
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Lock className="w-4 h-4" />
                                    Change Password
                                </button>

                                <div className="flex items-center gap-3">
                                    {!isEditing ? (
                                        <button
                                            type="button"
                                            onClick={handleEditToggle}
                                            className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 font-medium"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleEditToggle}
                                                className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                                                disabled={isSaving}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm"
                                            >
                                                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                                Save Changes
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
}
