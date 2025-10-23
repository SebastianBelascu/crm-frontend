import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { ContactDetail } from "@/components/contacts/contact-detail";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <DashboardLayout>
      <ContactDetail id={parseInt(id)} />
    </DashboardLayout>
  );
}