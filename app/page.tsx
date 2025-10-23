import { DashboardLayout } from "@/components/ui/dashboard-layout"

export default function Home() {
    return (
        <DashboardLayout title="Dashboard">
            <div className="text-gray-700 dark:text-gray-300">
                <p>Hello! Welcome to my CRM demo app.</p>
            </div>
        </DashboardLayout>
    )
}