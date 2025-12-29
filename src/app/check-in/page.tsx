"use client";

import { useState } from 'react';
import { ArrowLeft, Camera, CheckCircle2, Gauge, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StepProgress } from '@/components/captain/StepProgress';
import { MaterialsChecklist } from '@/components/captain/MaterialsChecklist';
import { ImageUploader } from '@/components/captain/ImageUploader';
import { Spinner } from '@/components/ui/spinner';
import { useCaptain } from '@/context/CaptainContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { materialsChecklist } from '@/config/serviceConfig';
import { useTranslation } from 'react-i18next';

interface MaterialCheckState {
  checked: boolean;
  quantity?: number;
}

const steps = ['Selfie', 'Materials', 'Odometer'];

export default function CheckInPage() {
  const router = useRouter();
  const { checkIn } = useCaptain();
  const { t } = useTranslation();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selfie, setSelfie] = useState<string[]>([]);
  const [checkedMaterials, setCheckedMaterials] = useState<Record<string, MaterialCheckState>>({});
  const [odometer, setOdometer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requiredMaterials = materialsChecklist.filter(m => m.required);
  const allRequiredMaterialsChecked = requiredMaterials.every(item => {
    const state = checkedMaterials[item.id];
    if (!state?.checked) return false;
    if (item.hasQuantity && (!state.quantity || state.quantity < (item.minQuantity || 0))) return false;
    return true;
  });

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selfie.length >= 1;
      case 1:
        return allRequiredMaterialsChecked;
      case 2:
        return odometer.length > 0 && parseFloat(odometer) > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/');
    }
  };

  const toggleMaterial = (id: string) => {
    setCheckedMaterials(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        checked: !prev[id]?.checked,
        quantity: prev[id]?.quantity,
      }
    }));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCheckedMaterials(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        checked: prev[id]?.checked || true,
        quantity,
      }
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate GPS capture
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    checkIn({
      checkInSelfie: selfie[0],
      checkInLocation: { lat: 28.6139, lng: 77.209 }, // Mock location
      materialsChecked: Object.entries(checkedMaterials)
        .filter(([_, state]) => state.checked)
        .map(([id]) => id),
      openingFuel: 0, // Changed to odometer
      odometer: parseFloat(odometer),
    });

    toast.success(t('checkIn.checkInSuccess'));
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center gap-3 p-4 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-foreground">{t('checkIn.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('common.loading').replace('...', '')} {currentStep + 1} / {steps.length}</p>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="p-4 pl-14 justify-center">
        <StepProgress steps={steps} currentStep={currentStep} />
      </div>

      {/* Content */}
      <main className="p-4 max-w-lg mx-auto pb-24">
        {/* Step 1: Selfie */}
        {currentStep === 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  {t('checkIn.takeSelfie')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('checkIn.selfieDescription')}
                </p>
              </div>

              <ImageUploader
                images={selfie}
                onImagesChange={setSelfie}
                minImages={1}
                maxImages={1}
                cameraOnly={true}
                label="Capture Selfie"
              />
            </CardContent>
          </Card>
        )}

        {/* Step 2: Materials */}
        {currentStep === 1 && (
          <Card>
            <CardContent className="p-6">
              <MaterialsChecklist
                checkedItems={checkedMaterials}
                onToggle={toggleMaterial}
                onQuantityChange={updateQuantity}
              />
            </CardContent>
          </Card>
        )}

        {/* Step 3: Odometer */}
        {currentStep === 2 && (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gauge className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  {t('checkIn.odometerReading')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('checkIn.odometerDescription')}
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Current Odometer Reading (km)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 45678"
                    value={odometer}
                    onChange={(e) => setOdometer(e.target.value)}
                    className="text-lg h-14 text-center font-semibold"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Enter the exact reading shown on your vehicle&apos;s odometer
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">{t('checkIn.locationCaptured')}</p>
                  <p className="text-muted-foreground">{t('checkIn.gpsTagged')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
        <div className="max-w-lg mx-auto">
          <Button
            className="w-full h-12 text-lg"
            disabled={!canProceed() || isSubmitting}
            onClick={handleNext}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <span>{t('common.processing')}</span>
              </div>
            ) : currentStep === steps.length - 1 ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                {t('checkIn.completeCheckIn')}
              </span>
            ) : (
              t('common.continue')
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
