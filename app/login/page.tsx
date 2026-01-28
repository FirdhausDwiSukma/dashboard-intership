/**
 * Login page
 * Page layer - entry point for login route
 */

import { LoginForm } from "@/app/components/login/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login - Dashtern",
    description: "Login to Dashtern Dashboard",
};

export default function LoginPage() {
    return <LoginForm />;
}
