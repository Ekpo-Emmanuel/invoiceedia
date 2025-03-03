import ChartsAndInsights from './charts/charts-and-insights'
import DashboardHomeHeader from './home-header'
import KeyMetrics from './key-metrics'
import NotificationsPanel from './notifications-panel'
import QuickLinks from './quick-links'
import RecentInvoices from './recent-invoices'
import UpcomingDeadlines from './upcoming-deadlines'

export default function DashboardHomePage() {
  return (
    <div className="space-y-4">
      <DashboardHomeHeader />
      <div className="space-y-8">
        <div>
          <KeyMetrics />
        </div>
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentInvoices />
          </div>
          {/* <div>
            <UpcomingDeadlines />
          </div> */}
        </div>
        <div className="">
          <ChartsAndInsights />
        </div>
        <div className="grid gap-8 md:gap-6 md:grid-cols-2">
          <NotificationsPanel />
          <QuickLinks />
        </div>
      </div>
    </div>
  )
}

