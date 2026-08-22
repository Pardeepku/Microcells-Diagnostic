import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { adminUser, adminAccounts, changeAdminPassword } = useData();

  const [selectedUser, setSelectedUser] = useState<string>(adminUser?.username || 'admin');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!currentPassword.trim()) {
      setStatus({ type: 'error', message: 'Please enter your current password.' });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    if (currentPassword === newPassword) {
      setStatus({ type: 'error', message: 'New password must be different from current password.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await changeAdminPassword(selectedUser, currentPassword, newPassword);
      setIsSubmitting(false);

      if (res.success) {
        setStatus({ type: 'success', message: res.message || 'Password successfully updated!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        if (onSuccess) {
          onSuccess(`Password updated successfully for account (${selectedUser})`);
        }

        setTimeout(() => {
          onClose();
          setStatus(null);
        }, 1200);
      } else {
        setStatus({ type: 'error', message: res.message || 'Failed to update password. Please check your current password.' });
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setStatus({ type: 'error', message: err?.message || 'An error occurred while updating password.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-change-password-title"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 id="modal-change-password-title" className="text-base font-bold font-display text-white">
                Change Admin Password
              </h3>
              <p className="text-xs text-teal-300">
                Update credentials for laboratory management access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            id="btn-close-change-password-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Status Message */}
          {status && (
            <div 
              className={`p-3.5 rounded-2xl flex items-start gap-2.5 ${
                status.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border border-rose-200 text-rose-900'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="font-semibold leading-relaxed">{status.message}</div>
            </div>
          )}

          {/* Account Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center gap-1.5" htmlFor="select-admin-target-user">
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Select Admin Account</span>
            </label>
            <select
              id="select-admin-target-user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {adminAccounts.map((acc) => (
                <option key={acc.username} value={acc.username}>
                  {acc.name} ({acc.username}) — {acc.role}
                </option>
              ))}
            </select>
          </div>

          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center justify-between" htmlFor="input-current-admin-pass">
              <span>Current Password</span>
              <span className="text-[11px] text-slate-400 font-normal">Required for verification</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="input-current-admin-pass"
                type={showCurrentPass ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current active password"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700" htmlFor="input-new-admin-pass">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="input-new-admin-pass"
                type={showNewPass ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 6 characters)"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700" htmlFor="input-confirm-new-admin-pass">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="input-confirm-new-admin-pass"
                type={showNewPass ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Security Note */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Updated password is encrypted and synced with Firestore credentials.</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-md shadow-teal-600/20 flex items-center gap-2 disabled:opacity-60 cursor-pointer"
              id="btn-submit-change-password"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
