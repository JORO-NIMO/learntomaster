import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WelcomeCard } from '@/components/dashboard/WelcomeCard';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { SubjectProgressCard } from '@/components/dashboard/SubjectProgressCard';
import { WeeklyActivityCard } from '@/components/dashboard/WeeklyActivityCard';
import { RecommendationsCard } from '@/components/dashboard/RecommendationsCard';
import { Helmet } from 'react-helmet-async';

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard - Learn2Master</title>
        <meta name="description" content="Your personalized learning dashboard. Track progress, view recommendations, and continue your A-Level journey." />
      </Helmet>
      
      <DashboardLayout>
        <div className="space-y-6 animate-fade-in">
          {/* Welcome section */}
          <WelcomeCard />
          
          {/* Quick stats */}
          <QuickStats />
          
          {/* Main grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left column - 2/3 */}
            <div className="lg:col-span-2 space-y-6">
              <SubjectProgressCard />
              <WeeklyActivityCard />
            </div>
            
            {/* Right column - 1/3 */}
            <div>
              <RecommendationsCard />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
