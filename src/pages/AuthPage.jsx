import React, { useState } from 'react';
import { Lock, Mail, UserPlus } from 'lucide-react';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { InputField, SelectField } from '../components/ui/FormField.jsx';
import { authService, DEFAULT_DEMO_ACCOUNT } from '../services/authService.js';

export function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState('login');

  const [loginEmail, setLoginEmail] = useState(DEFAULT_DEMO_ACCOUNT.email);
  const [loginPassword, setLoginPassword] = useState(DEFAULT_DEMO_ACCOUNT.password);

  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState('Manager');
  const [regDept, setRegDept] = useState('Operations');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const [errorMsg, setErrorMsg] = useState(null);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    const result = authService.signIn(loginEmail, loginPassword);
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }
    onAuthenticated(result.session, false);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    const result = authService.register({
      name: regName,
      role: regRole,
      department: regDept,
      email: regEmail,
      password: regPassword,
    });
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }
    onAuthenticated(result.session, true);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!resetEmail.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-[#F2F8FD] flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-[440px] space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-[12px] bg-[#1C7AC0] text-[#FFFFFF]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 13.5L9.5 18L19 7"
                stroke="#FFFFFF"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-[22px] font-bold text-[#1F2937]">Clearline</h1>
          <p className="text-[14px] text-[#5B6B7C]">
            Sign in to manage orders, stock, staff, and total cost
          </p>
        </div>

        <Card padding="lg" className="space-y-6">
          {mode !== 'reset' && (
            <div
              role="tablist"
              aria-label="Login or create account"
              className="grid grid-cols-2 gap-1 p-1 rounded-[8px] bg-[#F2F8FD] border border-[#D6E6F2]"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className={`min-h-[38px] rounded-[6px] text-[14px] font-medium transition-colors cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#1C7AC0] text-[#FFFFFF]'
                    : 'text-[#5B6B7C] hover:text-[#145E96]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'register'}
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                }}
                className={`min-h-[38px] rounded-[6px] text-[14px] font-medium transition-colors cursor-pointer ${
                  mode === 'register'
                    ? 'bg-[#1C7AC0] text-[#FFFFFF]'
                    : 'text-[#5B6B7C] hover:text-[#145E96]'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {errorMsg && (
            <div
              role="alert"
              className="p-3 rounded-[8px] bg-[#FDECEA] text-[#D9534F] text-[13px] font-medium"
            >
              {errorMsg}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <InputField
                id="login-email"
                label="Email Address"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <InputField
                id="login-password"
                label="Password"
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
              />

              <div className="flex items-center justify-between text-[13px]">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail(DEFAULT_DEMO_ACCOUNT.email);
                    setLoginPassword(DEFAULT_DEMO_ACCOUNT.password);
                    setErrorMsg(null);
                  }}
                  className="text-[#0D7F72] hover:underline font-medium cursor-pointer"
                >
                  Use Hasnain Ahmed account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('reset');
                    setResetSent(false);
                    setErrorMsg(null);
                  }}
                  className="text-[#1C7AC0] hover:text-[#145E96] font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" variant="primary" className="w-full">
                <Lock className="w-4 h-4" />
                <span>Sign In</span>
              </Button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <InputField
                id="reg-name"
                label="Your Name"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Enter your full name"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  id="reg-role"
                  label="Job Role"
                  required
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                />
                <SelectField
                  id="reg-dept"
                  label="Department"
                  value={regDept}
                  onChange={(e) => setRegDept(e.target.value)}
                  options={[
                    { value: 'Operations', label: 'Operations' },
                    { value: 'Finance', label: 'Finance' },
                    { value: 'Customer Care', label: 'Customer Care' },
                  ]}
                />
              </div>
              <InputField
                id="reg-email"
                label="Email Address"
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="name@company.com"
              />
              <InputField
                id="reg-password"
                label="Password"
                type="password"
                required
                minLength={6}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="At least 6 characters"
              />

              <Button type="submit" variant="primary" className="w-full">
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </Button>
            </form>
          )}

          {mode === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <h2 className="text-[16px] font-semibold text-[#1F2937]">
                  Reset Password
                </h2>
                <p className="mt-1 text-[13px] text-[#5B6B7C]">
                  Enter your email to receive a password reset link.
                </p>
              </div>
              <InputField
                id="reset-email"
                label="Email Address"
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email"
              />
              {resetSent && (
                <div className="p-3 rounded-[8px] bg-[#E3F5F1] text-[#0D7F72] text-[13px] font-medium">
                  Password reset link sent to {resetEmail}.
                </div>
              )}
              <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                  }}
                >
                  Back
                </Button>
                <Button type="submit" variant="primary">
                  <Mail className="w-4 h-4" />
                  <span>Send Link</span>
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
