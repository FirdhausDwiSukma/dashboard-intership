"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { authHelper } from "@/app/utils/authHelper";
import { roleService, RolePermissionView } from "@/app/services/roleService";
import {
    ArrowLeft,
    Shield,
    Save,
    AlertTriangle,
    CheckCircle,
    Lock,
    Loader2,
} from "lucide-react";

export default function EditRolePermissionsPage() {
    const router = useRouter();
    const params = useParams();
    const roleId = Number(params.id);

    const [view, setView] = useState<RolePermissionView | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (!authHelper.isAuthenticated()) {
            router.push("/login");
            return;
        }
        const role = localStorage.getItem("role");
        if (role !== "super_admin") {
            router.push("/dashboard");
            return;
        }
        loadPermissions();
    }, [router, roleId]);

    const loadPermissions = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await roleService.getRolePermissions(roleId);
            setView(data);
            setSelectedIds(new Set(data.assigned_ids || []));
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || "Failed to load permissions");
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (permId: number) => {
        // Block changes to super_admin
        if (view?.role_name === "super_admin") return;

        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(permId)) {
                next.delete(permId);
            } else {
                next.add(permId);
            }
            return next;
        });
        setSuccess(null);
    };

    const handleToggleModule = (permIds: number[]) => {
        if (view?.role_name === "super_admin") return;

        setSelectedIds((prev) => {
            const next = new Set(prev);
            const allSelected = permIds.every((id) => next.has(id));
            if (allSelected) {
                permIds.forEach((id) => next.delete(id));
            } else {
                permIds.forEach((id) => next.add(id));
            }
            return next;
        });
        setSuccess(null);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);
            await roleService.updateRolePermissions(roleId, Array.from(selectedIds));
            setSuccess("Permissions updated successfully");
            // Reload to confirm
            await loadPermissions();
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || "Failed to save permissions");
        } finally {
            setSaving(false);
        }
    };

    const isSuperAdmin = view?.role_name === "super_admin";

    const moduleLabel = (m: string) => {
        const labels: Record<string, string> = {
            user: "👤 User Module",
            internship: "🎓 Internship Module",
            evaluation: "📋 Evaluation Module",
            reporting: "📊 Reporting Module",
            profile: "🔒 Profile Module",
            admin: "⚙️ Admin Module",
        };
        return labels[m] || m.charAt(0).toUpperCase() + m.slice(1) + " Module";
    };

    const permLabel = (name: string) =>
        name
            .split("_")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Loading permissions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push("/dashboard/admin/roles")}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Shield className="w-6 h-6 text-primary-600" />
                            Edit Permissions — <span className="capitalize">{view?.role_name?.replace("_", " ")}</span>
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Select which permissions this role should have
                        </p>
                    </div>
                </div>

                {!isSuperAdmin && (
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                )}
            </div>

            {/* Super Admin Warning */}
            {isSuperAdmin && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                    <Lock className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                        Super Admin permissions are immutable and cannot be modified.
                    </p>
                </div>
            )}

            {/* Messages */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
            )}
            {success && (
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
                </div>
            )}

            {/* Permission Groups */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {view?.groups.map((group) => {
                    const groupPermIds = group.permissions.map((p) => p.id);
                    const allChecked = groupPermIds.every((id) => selectedIds.has(id));
                    const someChecked = groupPermIds.some((id) => selectedIds.has(id));

                    return (
                        <div
                            key={group.module}
                            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                        >
                            {/* Module Header */}
                            <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {moduleLabel(group.module)}
                                </h3>
                                {!isSuperAdmin && (
                                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-gray-500">
                                        <input
                                            type="checkbox"
                                            checked={allChecked}
                                            ref={(el) => {
                                                if (el) el.indeterminate = someChecked && !allChecked;
                                            }}
                                            onChange={() => handleToggleModule(groupPermIds)}
                                            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                                        />
                                        Select All
                                    </label>
                                )}
                            </div>

                            {/* Permission Items */}
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {group.permissions.map((perm) => (
                                    <label
                                        key={perm.id}
                                        className={`flex items-center gap-3 px-5 py-3.5 transition-colors ${isSuperAdmin
                                                ? "cursor-default"
                                                : "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/30"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(perm.id)}
                                            onChange={() => handleToggle(perm.id)}
                                            disabled={isSuperAdmin}
                                            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-60 cursor-pointer disabled:cursor-default"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {permLabel(perm.name)}
                                            </p>
                                            <p className="text-xs text-gray-500 font-mono">{perm.name}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
