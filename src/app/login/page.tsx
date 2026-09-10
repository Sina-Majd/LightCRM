"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Building2,
} from "lucide-react";
import { LightCrmLogo } from "@/components/lightcrm-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    // Simulated auth UI response for pairing/testing
    setTimeout(() => {
      setIsLoading(false);
      setStatusMessage("Sign in successful! Redirecting to your dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 600);
    }, 800);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setForgotPasswordNotice(true);
    setTimeout(() => setForgotPasswordNotice(false), 5000);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#09090b] text-zinc-100 selection:bg-cyan-500/30 selection:text-white overflow-hidden">
      {/* Background Ambience & Blueprint Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none -z-10" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/15 via-indigo-500/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-gradient-to-tr from-purple-500/10 via-blue-600/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Top Navigation Bar */}
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
          New to LightCRM?{" "}
          <Link
            href="/register"
            className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors ml-1"
          >
            Start free trial
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Story & Social Proof (Visible on Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="hidden lg:flex flex-col justify-center lg:col-span-6 space-y-8 pr-4"
          >
            <div>
              <Badge
                variant="indigo"
                className="mb-4 gap-1.5 py-1 px-3 bg-cyan-500/10 text-cyan-300 border-cyan-500/25"
              >
                <Sparkles className="h-3 w-3 text-cyan-400" />
                <span>Modern CRM for Growing Teams</span>
              </Badge>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Manage clients, orders, and invoices with{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  complete clarity.
                </span>
              </h1>

              <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-md">
                Log in to access your real-time customer pipelines, dispatch branded invoices, and keep your business running smoothly.
              </p>
            </div>

            {/* Testimonial Quote Card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
              <p className="text-xs text-zinc-300 italic leading-relaxed">
                &ldquo;LightCRM cut our invoice turnaround from 14 days down to 24 hours. The interface is lightning fast and our entire team uses it without any training.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src="/astrid-avatar.jpg"
                  alt="Astrid Lindholm"
                  className="h-9 w-9 rounded-full object-cover border border-white/20 shadow-md shrink-0"
                />
                <div>
                  <div className="text-xs font-semibold text-white">Astrid Lindholm</div>
                  <div className="text-[11px] text-zinc-400">Founder & Director · Solstice Studio</div>
                </div>
              </div>
            </div>

            {/* Security Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>256-bit SSL encryption</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Zap className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>Sub-100ms sync speed</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Building2 className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>SOC-2 Type II compliant</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />
                <span>99.99% cloud uptime</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Sign In Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="w-full lg:col-span-6 max-w-md mx-auto"
          >
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#12121a]/95 via-[#0e0e15]/95 to-[#0a0a0f]/98 p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              
              {/* Header */}
              <div className="mb-6 text-center lg:text-left">
                <h2 className="text-2xl font-bold tracking-tight text-white">Sign In to LightCRM</h2>
                <p className="mt-1.5 text-xs sm:text-sm text-zinc-400">
                  Welcome back! Please enter your workspace credentials.
                </p>
              </div>

              {/* Status Message Notification */}
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

              {/* Forgot Password Notification Notice */}
              {forgotPasswordNotice && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 flex items-center gap-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 p-3 text-xs text-cyan-300"
                >
                  <Mail className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>
                    A password reset link will be sent to <strong>{email || "your email address"}</strong>.
                  </span>
                </motion.div>
              )}

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {/* Google Button */}
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

                {/* GitHub Button */}
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
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.08]" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                  <span className="bg-[#101018] px-3 text-zinc-500 font-mono">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Credentials Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" requiredIndicator>
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="name@business.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="h-4 w-4" />}
                    className="h-11"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" requiredIndicator>
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
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
                    className="h-11"
                  />
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked)}
                    />
                    <label
                      htmlFor="remember-me"
                      className="text-xs text-zinc-400 hover:text-zinc-300 cursor-pointer select-none"
                    >
                      Remember me for 30 days
                    </label>
                  </div>
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
                        <span>Signing In...</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        <span>Sign In</span>
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>

              {/* Bottom Switcher */}
              <div className="mt-6 pt-5 border-t border-white/[0.08] text-center text-xs text-zinc-400">
                Don&apos;t have a LightCRM workspace yet?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors ml-1 inline-flex items-center gap-1"
                >
                  <span>Start 14-day trial</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <p className="mt-4 text-center text-[11px] text-zinc-500">
              Protected by 256-bit SSL encryption. By continuing, you agree to our{" "}
              <Link href="#" className="underline hover:text-zinc-400">
                Terms of Service
              </Link>
              .
            </p>
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
