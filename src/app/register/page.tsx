"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Check,
  AlertCircle,
} from "lucide-react";
import { LightCrmLogo } from "@/components/lightcrm-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const initialPlan = searchParams.get("plan") || "business";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  // Calculate password strength score (0 to 4)
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Rock Solid"];
  const strengthColors = [
    "bg-zinc-700",
    "bg-red-500",
    "bg-amber-500",
    "bg-cyan-400",
    "bg-emerald-400",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setErrorMessage("Please agree to the Terms of Service to create your account.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company: company,
            plan: selectedPlan,
          },
        },
      });

      if (error) {
        setIsLoading(false);
        setErrorMessage(error.message);
        toast.error("Registration Failed", {
          description: error.message,
        });
        return;
      }

      if (data.session) {
        toast.success("Workspace Created", {
          description: `Welcome to LightCRM, ${fullName}! Setting up your pipeline...`,
        });
        setStatusMessage("Account workspace created! Redirecting to your dashboard...");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.success("Account Created", {
          description: "Please check your email to confirm your account.",
        });
        setStatusMessage(
          "Account created successfully! Please check your email inbox to confirm your account or sign in."
        );
        setIsLoading(false);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || "Failed to register account.");
      toast.error("Registration Error", {
        description: err.message || "Failed to register account.",
      });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#09090b] text-zinc-100 selection:bg-cyan-500/30 selection:text-white overflow-hidden">
      {/* Background Ambience & Blueprint Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none -z-10" />
      <div className="absolute top-10 left-1/4 w-[550px] h-[550px] bg-gradient-to-br from-indigo-500/15 via-cyan-500/10 to-transparent blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-purple-600/15 via-cyan-500/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Top Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to LightCRM</span>
        </Link>

        <Link href="/" className="flex items-center">
          <LightCrmLogo size="sm" />
        </Link>

        <div className="text-xs text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors ml-1"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Main Form & Showcase */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Product Value & Social Proof */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="hidden lg:flex flex-col justify-center lg:col-span-5 space-y-8 pr-2"
          >
            <div>
              <Badge
                variant="indigo"
                className="mb-4 gap-1.5 py-1 px-3 bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
              >
                <Sparkles className="h-3 w-3 text-cyan-400" />
                <span>14-Day Full Free Access</span>
              </Badge>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Start running your business with{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  zero friction.
                </span>
              </h1>

              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Join thousands of small businesses, agencies, and freelancers who organize clients, track orders, and get paid faster with LightCRM.
              </p>
            </div>

            {/* Core Value Checklist */}
            <div className="space-y-3.5 bg-white/[0.02] border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                Included with your trial:
              </div>
              <ul className="space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span>Full customer contact cards & order board</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span>Instant 1-click PDF & email invoicing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span>Lightning ⌘K command menu & quick search</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span>1-click CSV customer export anytime</span>
                </li>
              </ul>
            </div>

            {/* Peace of Mind Badges */}
            <div className="flex items-center gap-6 text-xs text-zinc-400 font-medium pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>No credit card needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-cyan-400" />
                <span>2-minute setup</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Registration Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="w-full lg:col-span-7 max-w-lg mx-auto"
          >
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#13131c]/95 via-[#0e0e15]/95 to-[#0a0a0f]/98 p-6 sm:p-8 shadow-[0_24px_70px_-15px_rgba(0,0,0,0.85)] backdrop-blur-xl">

              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h2 className="text-2xl font-bold tracking-tight text-white">Create Your Account</h2>

                  {/* Selected Plan Tag */}
                  <Badge
                    variant="indigo"
                    className="capitalize text-[11px] font-mono py-0.5 px-2 bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                  >
                    {selectedPlan} Plan Trial
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Start your 14-day free trial. No credit card required.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 flex items-center gap-2 rounded-xl bg-red-950/60 border border-red-500/40 p-3 text-xs text-red-300"
                >
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {/* Status Message */}
              {statusMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-3 text-xs text-emerald-300"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{statusMessage}</span>
                </motion.div>
              )}

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 text-xs font-medium border-white/10 hover:border-white/20 hover:bg-white/[0.06] cursor-pointer"
                  onClick={() => {
                    setStatusMessage("Connecting to Google OAuth...");
                    setTimeout(() => setStatusMessage(null), 2500);
                  }}
                >
                  <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8 0-1.3.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                    />
                  </svg>
                  <span>Google</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-10 text-xs font-medium border-white/10 hover:border-white/20 hover:bg-white/[0.06] cursor-pointer"
                  onClick={() => {
                    setStatusMessage("Connecting to GitHub OAuth...");
                    setTimeout(() => setStatusMessage(null), 2500);
                  }}
                >
                  <svg className="h-4 w-4 mr-1.5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </Button>
              </div>

              {/* Divider */}
              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.08]" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                  <span className="bg-[#101018] px-3 text-zinc-500 font-mono">
                    Or register with email
                  </span>
                </div>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Full Name & Company in 2 Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" requiredIndicator>
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      icon={<User className="h-4 w-4" />}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="company" requiredIndicator>
                      Company / Studio
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      required
                      placeholder="Corp Inc."
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      icon={<Building2 className="h-4 w-4" />}
                      className="h-10"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" requiredIndicator>
                    Work Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="h-4 w-4" />}
                    className="h-10"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" requiredIndicator>
                    Create Password
                  </Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="At least 8 characters..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="h-4 w-4" />}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-0.5 flex items-center justify-center"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                    className="h-10"
                  />

                  {/* Interactive Password Strength Indicator */}
                  {password.length > 0 && (
                    <div className="pt-1.5 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400">Security strength:</span>
                        <span
                          className={`font-semibold ${strength <= 1
                              ? "text-red-400"
                              : strength === 2
                                ? "text-amber-400"
                                : strength === 3
                                  ? "text-cyan-400"
                                  : "text-emerald-400"
                            }`}
                        >
                          {strengthLabels[strength]}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 h-1">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`rounded-full transition-colors duration-300 ${strength >= step ? strengthColors[strength] : "bg-zinc-800"
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Plan Selector Buttons */}
                <div className="pt-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-400">Chosen plan trial:</span>
                    <span className="text-[11px] text-zinc-500">Change anytime</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "starter", name: "Starter", price: "$19/mo" },
                      { id: "business", name: "Business", price: "$49/mo" },
                      { id: "pro", name: "Pro Team", price: "$99/mo" },
                    ].map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`px-2.5 py-2 rounded-xl text-left border transition-all cursor-pointer ${selectedPlan.toLowerCase() === plan.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-white shadow-sm"
                            : "border-white/10 bg-white/[0.02] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                          }`}
                      >
                        <div className="text-xs font-semibold">{plan.name}</div>
                        <div className="text-[10px] text-zinc-500">{plan.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="pt-2 flex items-start gap-2.5">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor="terms"
                    className="text-[11px] text-zinc-400 leading-snug cursor-pointer select-none"
                  >
                    I agree to the{" "}
                    <Link href="#" className="text-zinc-300 underline hover:text-white">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-zinc-300 underline hover:text-white">
                      Privacy Policy
                    </Link>
                    . No credit card required for 14-day trial.
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-950/40 hover:shadow-[0_0_24px_rgba(56,189,248,0.35)] transition-all cursor-pointer bg-white text-zinc-950 hover:bg-zinc-100 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-3.5 w-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                        <span>Creating Workspace...</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        <span>Create Account & Start Free Trial</span>
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>

              {/* Bottom Switcher */}
              <div className="mt-5 pt-4 border-t border-white/[0.08] text-center text-xs text-zinc-400">
                Already have a LightCRM workspace?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors ml-1 inline-flex items-center gap-1"
                >
                  <span>Sign In</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center text-[11px] text-zinc-600">
        © {new Date().getFullYear()} LightCRM Technologies Inc. All rights reserved.
      </footer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-400 text-xs">
          Loading LightCRM registration...
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
