import { LucideIcon } from "lucide-react";

/**
 * Represents a single breadcrumb item in the navigation path
 */
export interface BreadcrumbItem {
    /** Display label for the breadcrumb */
    label: string;

    /** Navigation path/URL for the breadcrumb */
    href: string;

    /** Optional icon component (typically used for home icon) */
    icon?: LucideIcon;
}
