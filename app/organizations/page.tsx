import { DashboardLayout } from "@/components/ui/dashboard-layout"
import { OrganizationsList } from "@/components/organizations/organizations-list"

export default function Organizations() {
    return (

            <DashboardLayout>
                <OrganizationsList />
            </DashboardLayout>
    )
}