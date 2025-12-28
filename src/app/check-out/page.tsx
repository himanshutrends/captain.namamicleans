"use client";

import { useState } from 'react';
import { ArrowLeft, Fuel, MessageSquare, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useCaptain } from '@/context/CaptainContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CheckOutPage() {
  const router = useRouter();
  const { checkOut, todayAttendance, earnings, jobs } = useCaptain();
  
  const [fuelLevel, setFuelLevel] = useState([30]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completedJobs = jobs.filter(j => j.status === 'completed').length;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    checkOut(fuelLevel[0], notes);
    toast.success('Check-out complete! See you tomorrow.');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center gap-3 p-4 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-foreground">Check Out</h1>
            <p className="text-sm text-muted-foreground">End your day</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 max-w-lg mx-auto space-y-4">
        {/* Summary */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 border-0">
          <CardContent className="p-6 text-primary-foreground">
            <h2 className="text-lg font-semibold mb-4">Today&apos;s Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-primary-foreground/70 text-sm">Check-in Time</p>
                <p className="text-xl font-bold">{todayAttendance?.checkInTime}</p>
              </div>
              <div>
                <p className="text-primary-foreground/70 text-sm">Jobs Completed</p>
                <p className="text-xl font-bold">{completedJobs}</p>
              </div>
              <div>
                <p className="text-primary-foreground/70 text-sm">Earnings</p>
                <p className="text-xl font-bold">₹{earnings.today.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-primary-foreground/70 text-sm">Opening Fuel</p>
                <p className="text-xl font-bold">{todayAttendance?.openingFuel}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Closing Fuel */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Fuel className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Closing Fuel Level</h3>
                <p className="text-sm text-muted-foreground">Enter your current fuel level</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <span className="text-4xl font-bold text-primary">{fuelLevel[0]}%</span>
              </div>
              
              <div className="px-2">
                <Slider
                  value={fuelLevel}
                  onValueChange={setFuelLevel}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Empty</span>
                  <span>Full</span>
                </div>
              </div>

              {/* Fuel usage indicator */}
              {todayAttendance?.openingFuel && (
                <div className="bg-accent/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Fuel used today: <span className="font-semibold text-foreground">
                      {Math.max(0, todayAttendance.openingFuel - fuelLevel[0])}%
                    </span>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Notes (Optional)</h3>
                <p className="text-sm text-muted-foreground">Any issues or feedback?</p>
              </div>
            </div>

            <Textarea
              placeholder="Write any notes about your day..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
        <div className="max-w-lg mx-auto">
          <Button
            className="w-full h-12 text-lg bg-destructive hover:bg-destructive/90"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 border-2 border-destructive-foreground border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <span className="flex items-center gap-2">
                <LogOut className="h-5 w-5" />
                Confirm Check-Out
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
