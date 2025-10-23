import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { OrganizationDetail } from "@/components/organizations/organization-detail";

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <DashboardLayout>
      <OrganizationDetail id={parseInt(id)} />
    </DashboardLayout>
  );
}