import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { ContactCreate } from "@/components/contacts/contact-create";

export default function CreateContactPage() {
  return (
    <DashboardLayout>
      <ContactCreate />
    </DashboardLayout>
  );
}