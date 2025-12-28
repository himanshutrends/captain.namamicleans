"use client";

import { useState } from 'react';
import { 
  Smartphone, Shield, ChevronRight, ArrowLeft,
  Bike
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const formatPhone = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    // Limit to 10 digits
    return digits.slice(0, 10);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    setStep('otp');
    startResendTimer();
    toast.success('OTP sent successfully!');
  };

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    // Mock verification - in real app, verify with backend
    if (otp === '123456') {
      toast.success('Login successful!');
      router.push('/');
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    startResendTimer();
    toast.success('OTP resent successfully!');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/80 pt-safe">
        <div className="p-6 pb-12">
          {step === 'otp' && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-primary-foreground/10 -ml-2 mb-4"
              onClick={() => setStep('phone')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex items-center gap-3 mb-6">
            <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center">
              <Image src="/logo.png" alt="Logo" width={30} height={30} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">Namami Cleans</h1>
              <p className="text-primary-foreground/80">App for Namamians</p>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-primary-foreground">
              {step === 'phone' ? 'Welcome back!' : 'Verify OTP'}
            </h2>
            <p className="text-primary-foreground/80">
              {step === 'phone' 
                ? 'Enter your mobile number to continue'
                : `Enter the 6-digit code sent to +91 ${phone}`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 -mt-6 rounded-t-3xl bg-background relative">
        <div className="p-6 max-w-lg mx-auto">
          {step === 'phone' ? (
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Mobile Number
                  </label>
                  <div className="flex">
                    <div className="flex items-center px-4 bg-muted border border-r-0 border-input rounded-l-lg">
                      <span className="text-muted-foreground font-medium">+91</span>
                    </div>
                    <Input
                      type="tel"
                      placeholder="Enter 10-digit number"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="rounded-l-none text-lg h-12"
                      maxLength={10}
                    />
                  </div>
                </div>

                <Button 
                  className="w-full h-12 text-lg"
                  onClick={handleSendOtp}
                  disabled={phone.length !== 10 || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      <span>Sending OTP...</span>
                    </div>
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <p>By continuing, you agree to our</p>
                  <p>
                    <button className="text-primary font-medium">Terms of Service</button>
                    {' & '}
                    <button className="text-primary font-medium">Privacy Policy</button>
                  </p>
                </div>
              </div>
          ) : (
              <div className="p-6 space-y-6">
                <div className="flex justify-center">
                  <InputOTP 
                    maxLength={6} 
                    value={otp} 
                    onChange={setOtp}
                    className="gap-2"
                  >
                    <InputOTPGroup className="gap-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <InputOTPSlot 
                          key={index} 
                          index={index}
                          className="h-14 w-12 text-xl font-semibold rounded-lg border-2"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button 
                  className="w-full h-12 text-lg"
                  onClick={handleVerifyOtp}
                  disabled={otp.length !== 6 || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    'Verify & Continue'
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Didn&apos;t receive the code?
                  </p>
                  <Button
                    variant="ghost"
                    className="text-primary font-medium"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || isLoading}
                  >
                    {resendTimer > 0 
                      ? `Resend in ${resendTimer}s` 
                      : 'Resend OTP'
                    }
                  </Button>
                </div>

                {/* Demo hint */}
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-xs text-muted-foreground">
                    Demo: Use OTP <span className="font-mono font-bold">123456</span> to login
                  </p>
                </div>
              </div>
          )}

          {/* Features */}
          {/* <div className="mt-8 space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Secure Login</p>
                <p className="text-sm text-muted-foreground">Your data is protected</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Quick Access</p>
                <p className="text-sm text-muted-foreground">Login in seconds with OTP</p>
              </div>
            </div>
          </div> */}

          {/* Trust badge */}
          <div className="sticky bottom-10 text-center">
            <p className="text-sm text-muted-foreground">
              Trusted by <span className="font-semibold text-foreground">10,000+</span> captains
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
