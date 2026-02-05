"use client";

import { useState, useEffect } from "react";
import { DatePicker } from "@/app/components/ui/date-picker";
import {
    Users,
    Search,
    Filter,
    Download,
    UserPlus,
    GraduationCap,
    Building2,
    Calendar,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle,
    UserCheck,
    X,
    Trash2
} from "lucide-react";
import {
    fetchInterns,
    fetchInternStats,
    fetchPICs,
    createIntern,
    updateIntern,
    deleteIntern,
    type Intern
} from "@/app/services/internService";

export default function InternsPage() {
    const [interns, setInterns] = useState<Intern[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [activeCount, setActiveCount] = useState(0);
    const [currentBatch, setCurrentBatch] = useState("2024-Q1");
    const [avgPerformance, setAvgPerformance] = useState("0%");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBatch, setSelectedBatch] = useState<string>("all");
    const [selectedDivision, setSelectedDivision] = useState<string>("all");

    // Modal & Form State
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentInternId, setCurrentInternId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        email: "",
        password: "",
        pic_id: "",
        batch: "",
        division: "",
        university: "",
        major: "",
        start_date: "",
        end_date: "",
    });
    const itemsPerPage = 10;

    // Fetch data
    useEffect(() => {
        loadInterns();
        loadStats();
    }, [currentPage]);

    const loadInterns = async () => {
        setLoading(true);
        const response = await fetchInterns(currentPage, itemsPerPage);
        setInterns(response.data);
        setTotalPages(response.totalPages);
        setLoading(false);
    };

    const loadStats = async () => {
        try {
            const stats = await fetchInternStats();
            setTotalCount(stats.total_interns);
            setActiveCount(stats.active_interns);
            setCurrentBatch(stats.current_batch);
            setAvgPerformance(stats.performance_avg);
        } catch (error) {
            console.error("Failed to load stats", error);
        }
    };
    // ...
    // (Rendering logic needs to be updated to use currentBatch and avgPerformance)
    // ...
    // Skipping to the rendering part update


    // Get avatar URL
    const getAvatarUrl = (name: string) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`;
    };

    // Get performance badge color
    const getPerformanceBadge = (level?: "low" | "medium" | "high") => {
        switch (level) {
            case "high":
                return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
            case "medium":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
            case "low":
                return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
        }
    };

    // Handle form input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submit
    const handleSubmitIntern = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEditing && currentInternId) {
                await updateIntern(currentInternId, {
                    full_name: formData.full_name,
                    email: formData.email,
                    status: "active", // Default status, should probably come from form if we allow editing it
                    pic_id: parseInt(formData.pic_id),
                    batch: formData.batch,
                    division: formData.division,
                    university: formData.university,
                    major: formData.major,
                    start_date: formData.start_date,
                    end_date: formData.end_date,
                });
                alert("Intern updated successfully!");
            } else {
                await createIntern({
                    ...formData,
                    pic_id: parseInt(formData.pic_id),
                });
                alert("Intern created successfully!");
            }

            closeModal();
            loadInterns();
            loadStats();
        } catch (error: any) {
            console.error("Operation failed:", error);
            alert(`Error: ${error.message || "Operation failed"}`);
        }
    };

    const handleEdit = (intern: Intern) => {
        setIsEditing(true);
        setCurrentInternId(intern.id);

        const startDate = intern.start_date ? new Date(intern.start_date).toISOString().split('T')[0] : "";
        const endDate = intern.end_date ? new Date(intern.end_date).toISOString().split('T')[0] : "";

        setFormData({
            full_name: intern.full_name,
            username: intern.username,
            email: intern.email,
            password: "", // Password not required for update unless changed (logic simplified here)
            pic_id: (intern.pic_id || "").toString(),
            batch: intern.batch,
            division: intern.division,
            university: intern.university,
            major: intern.major,
            start_date: startDate,
            end_date: endDate,
        });

        setShowAddModal(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this intern? This action cannot be undone.")) return;

        try {
            await deleteIntern(id);
            alert("Intern deleted successfully");
            loadInterns();
            loadStats();
        } catch (error: any) {
            console.error(error);
            alert(`Failed to delete intern: ${error.message}`);
        }
    };

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentInternId(null);
        setFormData({
            full_name: "",
            username: "",
            email: "",
            password: "",
            pic_id: "",
            batch: "",
            division: "",
            university: "",
            major: "",
            start_date: "",
            end_date: "",
        });
        setShowAddModal(true);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setIsEditing(false);
        setCurrentInternId(null);
    };

    const [availablePICs, setAvailablePICs] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        loadPICs();
    }, []);

    const loadPICs = async () => {
        const pics = await fetchPICs();
        setAvailablePICs(pics);
    };

    // Filtered interns
    const filteredInterns = interns.filter(intern => {
        const matchesSearch = (intern.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (intern.email || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBatch = selectedBatch === "all" || intern.batch === selectedBatch;
        const matchesDivision = selectedDivision === "all" || intern.division === selectedDivision;
        return matchesSearch && matchesBatch && matchesDivision;
    });

    // Get unique batches and divisions
    const batches = Array.from(new Set(interns.map(i => i.batch)));
    const divisions = Array.from(new Set(interns.map(i => i.division)));

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Users className="w-8 h-8 text-primary-500" />
                            Intern Management
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Manage and monitor intern performance
                        </p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Intern
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Interns</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalCount}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Active Interns</p>
                                {/* Use filtered or fetched active count */}
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{activeCount}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Current Batch</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{currentBatch}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Avg Performance</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{avgPerformance}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        {/* Batch Filter */}
                        <select
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="all">All Batches</option>
                            {batches.map(batch => (
                                <option key={batch} value={batch}>{batch}</option>
                            ))}
                        </select>

                        {/* Division Filter */}
                        <select
                            value={selectedDivision}
                            onChange={(e) => setSelectedDivision(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="all">All Divisions</option>
                            {divisions.map(division => (
                                <option key={division} value={division}>{division}</option>
                            ))}
                        </select>

                        {/* Export Button */}
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Interns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        // Loading skeletons
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : filteredInterns.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">No interns found</p>
                        </div>
                    ) : (
                        filteredInterns.map((intern) => (
                            <div key={intern.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                                {/* Header with Avatar */}
                                <div className="flex items-start gap-4 mb-4">
                                    <img
                                        src={intern.avatar_url || getAvatarUrl(intern.full_name)}
                                        alt={intern.full_name}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-primary-200"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                            {intern.full_name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            {intern.email}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${intern.status === "active"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${intern.status === "active" ? "bg-green-600" : "bg-gray-600"
                                                    }`} />
                                                {(intern.status || "Unknown").charAt(0).toUpperCase() + (intern.status || "Unknown").slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="space-y-3">
                                    {/* PIC */}
                                    <div className="flex items-center gap-2 text-sm">
                                        <UserCheck className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-500 dark:text-gray-400">PIC:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{intern.pic_name}</span>
                                    </div>

                                    {/* Division & Batch */}
                                    <div className="flex items-center gap-2 text-sm">
                                        <Building2 className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-900 dark:text-white font-medium">{intern.division}</span>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-500 dark:text-gray-400">{intern.batch}</span>
                                    </div>

                                    {/* Education */}
                                    <div className="flex items-start gap-2 text-sm">
                                        <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white truncate">{intern.university}</p>
                                            <p className="text-gray-500 dark:text-gray-400 truncate">{intern.major}</p>
                                        </div>
                                    </div>

                                    {/* Period */}
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-500 dark:text-gray-400">
                                            {new Date(intern.start_date).toLocaleDateString()} - {new Date(intern.end_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Performance Metrics */}
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Task Completion</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-primary-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${intern.task_completion_rate}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {intern.task_completion_rate}%
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Attendance</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${intern.attendance_rate}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {intern.attendance_rate}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Performance & Potential Badges */}
                                    <div className="flex gap-2 mt-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${getPerformanceBadge(intern.performance_level)}`}>
                                            Performance: {intern.performance_level?.toUpperCase()}
                                        </span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${getPerformanceBadge(intern.potential_level)}`}>
                                            Potential: {intern.potential_level?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-4 flex gap-2">
                                    <button
                                        className="flex-1 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                                        onClick={() => handleEdit(intern)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(intern.id)}
                                        className="px-3 py-2 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-medium"
                                        title="Delete Intern"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {!loading && filteredInterns.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} entries
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1 rounded-lg transition-colors ${currentPage === page
                                            ? "bg-primary-500 text-white"
                                            : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Intern Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-primary-500" />
                                {isEditing ? "Edit Intern" : "Add New Intern"}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body - Form */}
                        <form onSubmit={handleSubmitIntern} className="p-6 space-y-6">
                            {/* Personal Information */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <UserCheck className="w-4 h-4" />
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Username <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            required
                                            readOnly={isEditing} // Prevent username change on edit if backend doesn't support it easily
                                            className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
                                            placeholder="intern_john"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    {!isEditing && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Password <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                                minLength={6}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Internship Details */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    Internship Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            PIC / Mentor <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="pic_id"
                                            value={formData.pic_id}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="">Select PIC</option>
                                            {availablePICs.map(pic => (
                                                <option key={pic.id} value={pic.id}>{pic.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Batch <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="batch"
                                            value={formData.batch}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="2024-Q1"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Division <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="division"
                                            value={formData.division}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="">Select Division</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Design">Design</option>
                                            <option value="Data Analytics">Data Analytics</option>
                                            <option value="HR">HR</option>
                                            <option value="Finance">Finance</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Education */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4" />
                                    Education
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            University <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="university"
                                            value={formData.university}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="Universitas Indonesia"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Major <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="major"
                                            value={formData.major}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="Computer Science"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Program Period */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Program Period
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Start Date <span className="text-red-500">*</span>
                                        </label>
                                        <DatePicker
                                            date={formData.start_date ? new Date(formData.start_date) : undefined}
                                            setDate={(date) => {
                                                setFormData({
                                                    ...formData,
                                                    start_date: date ? date.toLocaleDateString('en-CA') : ""
                                                });
                                            }}
                                            placeholder="Select start date"
                                        />
                                        <input type="hidden" name="start_date" value={formData.start_date} required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            End Date <span className="text-red-500">*</span>
                                        </label>
                                        <DatePicker
                                            date={formData.end_date ? new Date(formData.end_date) : undefined}
                                            setDate={(date) => {
                                                setFormData({
                                                    ...formData,
                                                    end_date: date ? date.toLocaleDateString('en-CA') : ""
                                                });
                                            }}
                                            placeholder="Select end date"
                                        />
                                        <input type="hidden" name="end_date" value={formData.end_date} required />
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                                >
                                    {isEditing ? "Update Intern" : "Create Intern"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
