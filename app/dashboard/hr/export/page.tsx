"use client";

import { useState } from "react";
import { exportData, fetchPeriods, type Period } from "@/app/services/hrService";
import { Download, FileSpreadsheet, FileText, Check, AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function HRExportPage() {
    const [periods, setPeriods] = useState<Period[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [selectedFormat, setSelectedFormat] = useState("csv");
    const [downloading, setDownloading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPeriods().then(setPeriods).catch(() => { });
    }, []);

    const handleExport = async () => {
        setDownloading(true);
        setError("");
        setSuccess("");

        try {
            const blob = await exportData(selectedFormat, selectedPeriod);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            let filename = `hr_export`;
            if (selectedPeriod) filename += `_${selectedPeriod}`;
            filename += selectedFormat === "csv" ? ".csv" : ".csv";

            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setSuccess(`File ${filename} downloaded successfully!`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to export data");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Export Data</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Download evaluation and intern data as CSV
                </p>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
            )}
            {success && (
                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" /> {success}
                </div>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                {/* Format Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Export Format</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setSelectedFormat("csv")}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${selectedFormat === "csv"
                                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                }`}
                        >
                            <FileText className={`w-8 h-8 ${selectedFormat === "csv" ? "text-primary-600" : "text-gray-400"}`} />
                            <div className="text-left">
                                <p className={`font-medium ${selectedFormat === "csv" ? "text-primary-600 dark:text-primary-400" : "text-gray-700 dark:text-gray-300"}`}>
                                    CSV
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Comma-separated values</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setSelectedFormat("excel")}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${selectedFormat === "excel"
                                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                }`}
                        >
                            <FileSpreadsheet className={`w-8 h-8 ${selectedFormat === "excel" ? "text-primary-600" : "text-gray-400"}`} />
                            <div className="text-left">
                                <p className={`font-medium ${selectedFormat === "excel" ? "text-primary-600 dark:text-primary-400" : "text-gray-700 dark:text-gray-300"}`}>
                                    Excel
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">CSV with Excel compatibility</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Period Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Period (optional)</label>
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    >
                        <option value="">All Periods</option>
                        {periods.map((p) => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                </div>

                {/* Data Info */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Exported data includes:</p>
                    <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                        <li>• Intern ID, Full Name, Department</li>
                        <li>• PIC Name</li>
                        <li>• Performance Score, Potential Score</li>
                        <li>• 9 Grid Position</li>
                    </ul>
                </div>

                {/* Export Button */}
                <button
                    onClick={handleExport}
                    disabled={downloading}
                    className="w-full px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    {downloading ? "Downloading..." : "Download Export"}
                </button>
            </div>
        </div>
    );
}
