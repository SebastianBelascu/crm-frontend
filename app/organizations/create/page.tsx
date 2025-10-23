import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { OrganizationCreate } from "@/components/organizations/organization-create";

export default function CreateOrganizationPage() {
  return (
    <DashboardLayout>
      <OrganizationCreate />
    </DashboardLayout>
  );
}