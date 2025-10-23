import { DashboardLayout } from "@/components/ui/dashboard-layout"
import { ContactsList } from "@/components/contacts/contacts-list"

export default function Contacts() {
    return (
            <DashboardLayout>
                <ContactsList />
            </DashboardLayout>
    )
}