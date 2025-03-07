import { ContentLayout } from '@/components/admin-panel/content-layout'
import DashboardHomePage from '@/components/v2/home/home-content-page';

export default async function Page() {
  return (
    <ContentLayout title="Home">
      <DashboardHomePage />
    </ContentLayout>
  )
}