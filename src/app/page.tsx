"use client";

import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CheckInCard } from '@/components/captain/CheckInCard';
import { EarningsCard } from '@/components/captain/EarningsCard';
import { JobCard } from '@/components/captain/JobCard';
import { useCaptain } from '@/context/CaptainContext';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { captain, isCheckedIn, jobs } = useCaptain();
  const router = useRouter();
  const { t } = useTranslation();

  const todaysJobs = jobs.filter(job => job.status !== 'completed').slice(0, 2);
  const completedToday = jobs.filter(job => job.status === 'completed').length;

  const openNavigation = (job: typeof jobs[0]) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${job.location.lat},${job.location.lng}`,
      '_blank'
    );
  };

  const startJob = (job: typeof jobs[0]) => {
    router.push(`/job/${job.id}/execute`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('auth.welcomeBack')}</p>
              <h1 className="font-semibold text-foreground">{captain.name}</h1>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 max-w-lg mx-auto space-y-4">
        {/* Check-in Card */}
        <CheckInCard />

        {/* Quick Stats */}
        {isCheckedIn && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card rounded-xl p-3 text-center border border-border">
              <p className="text-2xl font-bold text-foreground">{todaysJobs.length}</p>
              <p className="text-xs text-muted-foreground">{t('jobs.scheduled')}</p>
            </div>
            <div className="bg-card rounded-xl p-3 text-center border border-border">
              <p className="text-2xl font-bold text-primary">{completedToday}</p>
              <p className="text-xs text-muted-foreground">{t('jobs.completed')}</p>
            </div>
            <div className="bg-card rounded-xl p-3 text-center border border-border">
              <p className="text-2xl font-bold text-foreground">⭐ {captain.rating}</p>
              <p className="text-xs text-muted-foreground">{t('profile.title')}</p>
            </div>
          </div>
        )}

        {/* Earnings Card */}
        {isCheckedIn && <EarningsCard />}

        {/* Upcoming Jobs */}
        {isCheckedIn && todaysJobs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">{t('jobs.title')}</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary"
                onClick={() => router.push('/jobs')}
              >
                {t('jobs.viewDetails')}
              </Button>
            </div>
            <div className="space-y-3">
              {todaysJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onNavigate={() => openNavigation(job)}
                  onStart={() => startJob(job)}
                  onView={() => router.push(`/jobs/${job.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Not Checked In State */}
        {!isCheckedIn && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧹</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {t('checkIn.startYourDay')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('checkIn.checkInToView')}
            </p>
            <Button size="lg" onClick={() => router.push('/check-in')}>
              {t('checkIn.title')}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
