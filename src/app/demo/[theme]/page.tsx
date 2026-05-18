import ThemeRouter from "@/components/themes/ThemeRouter";
import ThemeWrapper from "@/components/themes/ThemeWrapper";
import { notFound } from "next/navigation";
import { dummyData } from "@/data/invitations";

export default async function DemoPage({ params }: { params: Promise<{ theme: string }> }) {
  const resolvedParams = await params;
  
  // Clone dummy data and assign a generic ID/slug for the demo
  const data: any = {
    ...dummyData,
    id: `demo-${resolvedParams.theme}`,
    slug: `demo-${resolvedParams.theme}`,
    theme: resolvedParams.theme
  };

  return (
    <ThemeWrapper data={data} isOwner={false}>
      <ThemeRouter data={data} />
    </ThemeWrapper>
  );
}
