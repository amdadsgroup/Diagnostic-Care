'use client';

import React, { useState, useEffect } from 'react';
import { AdminService, AdminUserRecord } from '@/services/admin.service';
import {
  Search,
  Filter,
  UserCheck,
  UserX,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Edit2,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  Calendar,
  Layers,
} from 'lucide-react';
import { BRAND_COLORS } from '@/config/brand';

interface UsersAccessTabProps {
  language: 'en' | 'bn';
  adminEmail: string;
}

export default function UsersAccessTab({ language, adminEmail }: UsersAccessTabProps) {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal / Action State
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [actionType, setActionType] = useState<'SUSPEND' | 'ACTIVATE' | 'ROLE' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [newRole, setNewRole] = useState('PATIENT');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await AdminService.getUsers({
      query: search,
      role: roleFilter,
      status: statusFilter,
    });
    setUsers(res.users);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const executeUserAction = async () => {
    if (!selectedUser || !actionType) return;
    setSubmitting(true);
    setActionMessage(null);

    if (actionType === 'SUSPEND' || actionType === 'ACTIVATE') {
      const newStatus = actionType === 'SUSPEND' ? 'suspended' : 'active';
      const res = await AdminService.updateUserStatus(selectedUser.id, newStatus, actionReason || 'Admin action', adminEmail);
      if (res.success) {
        setActionMessage(
          language === 'bn'
            ? `অ্যাকাউন্ট সফলভাবে ${newStatus === 'active' ? 'সক্রিয়' : 'স্থগিত'} করা হয়েছে।`
            : `User status successfully updated to ${newStatus}.`
        );
        fetchUsers();
        setTimeout(() => {
          setActionType(null);
          setSelectedUser(null);
          setActionReason('');
        }, 1500);
      } else {
        setActionMessage(res.error || 'Failed to update user status');
      }
    } else if (actionType === 'ROLE') {
      const res = await AdminService.assignUserRole(selectedUser.id, newRole, adminEmail);
      if (res.success) {
        setActionMessage(
          language === 'bn'
            ? `রোল সফলভাবে পরিবর্তিত হয়েছে: ${newRole}`
            : `Role successfully updated to ${newRole}.`
        );
        fetchUsers();
        setTimeout(() => {
          setActionType(null);
          setSelectedUser(null);
        }, 1500);
      } else {
        setActionMessage(res.error || 'Failed to update role');
      }
    }
    setSubmitting(false);
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && !u.roles.includes(roleFilter.toUpperCase()) && u.primaryRole !== roleFilter.toUpperCase()) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Filter and Search Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '18px 20px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '280px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '8px 12px',
              width: '100%',
            }}
          >
            <Search size={16} color="#94A3B8" style={{ marginRight: '8px' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === 'bn' ? 'নাম, ইমেইল বা ফোন নম্বর দিয়ে খুঁজুন...' : 'Search by name, email, phone...'}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '13px',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: BRAND_COLORS.primary,
              color: '#FFFFFF',
              border: 'none',
              padding: '0 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {language === 'bn' ? 'অনুসন্ধান' : 'Search'}
          </button>
        </form>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '8px 12px',
              fontSize: '13px',
              color: '#0F172A',
              fontWeight: 600,
            }}
          >
            <option value="ALL">{language === 'bn' ? 'সকল রোল' : 'All Roles'}</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="OPERATIONS_MANAGER">Operations Manager</option>
            <option value="DOCTOR">Doctor</option>
            <option value="DIAGNOSTIC_CENTER">Diagnostic Center</option>
            <option value="PATIENT">Patient</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '8px 12px',
              fontSize: '13px',
              color: '#0F172A',
              fontWeight: 600,
            }}
          >
            <option value="ALL">{language === 'bn' ? 'সকল স্ট্যাটাস' : 'All Status'}</option>
            <option value="active">{language === 'bn' ? 'সক্রিয় (Active)' : 'Active'}</option>
            <option value="suspended">{language === 'bn' ? 'স্থগিত (Suspended)' : 'Suspended'}</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'ব্যবহারকারী' : 'User'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'যোগাযোগ' : 'Contact'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'রোল' : 'Assigned Role'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>{language === 'bn' ? 'নিবন্ধন তারিখ' : 'Registered'}</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'right' }}>{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                    {language === 'bn' ? 'ব্যবহারকারী লোড হচ্ছে...' : 'Loading users from database...'}
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                    {language === 'bn' ? 'কোনো ব্যবহারকারী পাওয়া যায়নি।' : 'No users found matching query.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 800, color: '#0F172A' }}>{user.fullName}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>ID: {user.id.slice(0, 8)}...</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                        <Mail size={13} color="#94A3B8" />
                        <span>{user.email}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155', marginTop: '2px' }}>
                        <Phone size={13} color="#94A3B8" />
                        <span>{user.phone}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: '9999px',
                          backgroundColor:
                            user.primaryRole === 'SUPER_ADMIN'
                              ? '#EFF6FF'
                              : user.primaryRole === 'DOCTOR'
                              ? '#ECFDF5'
                              : user.primaryRole === 'DIAGNOSTIC_CENTER'
                              ? '#F5F3FF'
                              : '#F1F5F9',
                          color:
                            user.primaryRole === 'SUPER_ADMIN'
                              ? '#2563EB'
                              : user.primaryRole === 'DOCTOR'
                              ? '#059669'
                              : user.primaryRole === 'DIAGNOSTIC_CENTER'
                              ? '#7C3AED'
                              : '#475569',
                        }}
                      >
                        {user.primaryRole}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: user.status === 'active' ? '#16A34A' : '#DC2626',
                        }}
                      >
                        <span
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            backgroundColor: user.status === 'active' ? '#22C55E' : '#EF4444',
                          }}
                        />
                        {user.status === 'active' ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#64748B' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        {/* Assign Role Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUser(user);
                            setActionType('ROLE');
                            setNewRole(user.primaryRole);
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            backgroundColor: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#0F172A',
                            cursor: 'pointer',
                          }}
                        >
                          {language === 'bn' ? 'রোল পরিবর্তন' : 'Role'}
                        </button>

                        {/* Suspend / Reactivate Button */}
                        {user.status === 'active' ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(user);
                              setActionType('SUSPEND');
                              setActionReason('');
                            }}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '8px',
                              backgroundColor: '#FEF2F2',
                              border: '1px solid #FECACA',
                              fontSize: '12px',
                              fontWeight: 700,
                              color: '#DC2626',
                              cursor: 'pointer',
                            }}
                          >
                            {language === 'bn' ? 'স্থগিত করুন' : 'Suspend'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(user);
                              setActionType('ACTIVATE');
                              setActionReason('');
                            }}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '8px',
                              backgroundColor: '#F0FDF4',
                              border: '1px solid #BBF7D0',
                              fontSize: '12px',
                              fontWeight: 700,
                              color: '#16A34A',
                              cursor: 'pointer',
                            }}
                          >
                            {language === 'bn' ? 'সক্রিয় করুন' : 'Activate'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Dialog Modal */}
      {actionType && selectedUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '26px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              {actionType === 'SUSPEND' ? (
                <ShieldAlert size={24} color="#EF4444" />
              ) : (
                <ShieldCheck size={24} color="#2563EB" />
              )}
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {actionType === 'SUSPEND'
                  ? language === 'bn' ? 'অ্যাকাউন্ট স্থগিতকরণ' : 'Suspend User Account'
                  : actionType === 'ACTIVATE'
                  ? language === 'bn' ? 'অ্যাকাউন্ট পুনঃসক্রিয়করণ' : 'Reactivate User Account'
                  : language === 'bn' ? 'রোল পরিবর্তন' : 'Change User Role'}
              </h3>
            </div>

            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
              {language === 'bn' ? 'টার্গেট ব্যবহারকারী:' : 'Target User:'}{' '}
              <strong style={{ color: '#0F172A' }}>{selectedUser.fullName}</strong> ({selectedUser.email})
            </p>

            {actionType === 'ROLE' ? (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  {language === 'bn' ? 'নতুন রোল নির্বাচন করুন:' : 'Select New Role:'}
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    backgroundColor: '#F8FAFC',
                  }}
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full Governance)</option>
                  <option value="OPERATIONS_MANAGER">OPERATIONS_MANAGER (Operations & Verification)</option>
                  <option value="FINANCE_MANAGER">FINANCE_MANAGER (Ledger & Settlements)</option>
                  <option value="SUPPORT_AGENT">SUPPORT_AGENT (Tickets & Helpline)</option>
                  <option value="DOCTOR">DOCTOR (Physician)</option>
                  <option value="DIAGNOSTIC_CENTER">DIAGNOSTIC_CENTER (Facility Admin)</option>
                  <option value="PATIENT">PATIENT (General Customer)</option>
                </select>
              </div>
            ) : (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  {language === 'bn' ? 'প্রশাসনিক কারণ (অডিট লগে সংরক্ষিত হবে):' : 'Administrative Reason (Logged to Audit Trail):'}
                </label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  rows={3}
                  placeholder={language === 'bn' ? 'কারণ উল্লেখ করুন...' : 'Specify official justification...'}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            {actionMessage && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: actionMessage.includes('সফল') || actionMessage.includes('success') ? '#F0FDF4' : '#FEF2F2',
                  color: actionMessage.includes('সফল') || actionMessage.includes('success') ? '#16A34A' : '#DC2626',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  marginBottom: '14px',
                }}
              >
                {actionMessage}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setActionType(null);
                  setSelectedUser(null);
                }}
                disabled={submitting}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#F1F5F9',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={executeUserAction}
                disabled={submitting}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  backgroundColor: actionType === 'SUSPEND' ? '#EF4444' : BRAND_COLORS.primary,
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? 'Processing...' : language === 'bn' ? 'নিশ্চিত করুন' : 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
