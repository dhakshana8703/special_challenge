'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  User, 
  Building2, 
  Bell, 
  ChevronDown, 
  LogOut, 
  Sparkles, 
  Terminal, 
  Database, 
  Layers, 
  Compass, 
  Radio, 
  Lightbulb, 
  Lock,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';

const PERSONAS_CONFIG = [
  { id: "usr_pub_01", name: "Public Visitor", role: "public_visitor", label: "Public Visitor", badge: "Public", color: "bg-slate-700" },
  { id: "usr_emp_priya", name: "Priya Sharma", role: "product_owner", label: "Priya Sharma (Product Owner / Employee)", badge: "Azentio Employee", color: "bg-purple-600" },
  { id: "usr_emp_aisha", name: "Aisha Al-Mansoor", role: "learning_moderator", label: "Aisha Al-Mansoor (Learning Moderator)", badge: "Moderator", color: "bg-amber-600" },
  { id: "usr_emp_marcus", name: "Marcus Vance", role: "content_publisher", label: "Marcus Vance (Content Publisher)", badge: "Publisher", color: "bg-blue-600" },
  { id: "usr_client_apex_david", name: "David Chen", role: "client_member", label: "David Chen (Apex Global Bank - Member)", badge: "Apex Bank", color: "bg-emerald-600" },
  { id: "usr_client_apex_sarah", name: "Sarah Jenkins", role: "client_admin", label: "Sarah Jenkins (Apex Bank - Client Admin)", badge: "Apex Admin", color: "bg-teal-600" },
  { id: "usr_client_meridian_tariq", name: "Tariq Al-Sayed", role: "client_member", label: "Tariq Al-Sayed (Meridian Trust - Member)", badge: "Meridian", color: "bg-emerald-700" },
  { id: "usr_client_gulf_fatima", name: "Fatima Zahra", role: "client_member", label: "Fatima Zahra (Gulf Financial - Member)", badge: "Gulf Financial", color: "bg-emerald-800" },
  { id: "usr_admin_kiran", name: "Kiran Rao", role: "portal_admin", label: "Kiran Rao (Portal Infrastructure Admin)", badge: "Portal Admin", color: "bg-red-600" }
];

export default function Navbar() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTenant, setActiveTenant] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setCurrentUser(data.user);
      setActiveTenant(data.activeTenant);
      setUnreadCount(data.unreadNotificationsCount || 0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSwitchPersona = async (personaId) => {
    try {
      const res = await fetch('/api/auth/switch-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: personaId })
      });
      const data = await res.json();
      if (data.success) {
        setPersonaMenuOpen(false);
        await fetchUserData();
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data.notifications || []);
      setNotifDropdownOpen(!notifDropdownOpen);
    } catch (e) {
      console.error(e);
    }
  };

  const markNotifsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true })
      });
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const isEmployee = currentUser?.roles?.includes('employee') || currentUser?.persona === 'employee' || currentUser?.persona === 'portal_admin';
  const isClient = currentUser?.persona === 'client_member' || currentUser?.persona === 'client_admin';
  const isModerator = currentUser?.persona === 'learning_moderator' || currentUser?.grants?.includes('moderate_learning');
  const isAdmin = currentUser?.persona === 'portal_admin';

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top Hackathon Demo Bar with Persona Quick-Switcher */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Azentio Hackathon 2026
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Interactive Multi-Persona Evaluation Environment (IAM-01 & IAM-02 Enforced)
          </span>
        </div>

        {/* Quick Switcher Trigger */}
        <div className="relative">
          <button 
            onClick={() => setPersonaMenuOpen(!personaMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <span className="text-slate-400">Active Persona:</span>
            <span className="font-medium text-emerald-400">{currentUser?.name || "Public Visitor"}</span>
            <span className="text-slate-400">({currentUser?.persona || "public"})</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Persona Selection Dropdown */}
          {personaMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-2 z-50">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                Switch Role / Access Boundary
              </div>
              <div className="max-h-80 overflow-y-auto space-y-1">
                {PERSONAS_CONFIG.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSwitchPersona(p.id)}
                    className={`w-full text-left px-2.5 py-2 rounded text-xs flex items-center justify-between transition ${
                      currentUser?.id === p.id 
                        ? 'bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30' 
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.label}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded text-white ${p.color}`}>
                      {p.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
              a
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition">
                azentio<span className="text-emerald-400">.ai</span>
              </span>
              <span className="block text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                Build Intelligence
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="/products" className="hover:text-emerald-400 transition">Products</a>
            <a href="/solutions" className="hover:text-emerald-400 transition">Solutions</a>
            <a href="/technology" className="hover:text-emerald-400 transition">Technology</a>
            <a href="/live" className="hover:text-emerald-400 transition flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              LIVE
            </a>
            <a href="/insights" className="hover:text-emerald-400 transition">Insights</a>
            <a href="/hackathon/register" className="text-emerald-400 hover:text-emerald-300 transition">Hackathon</a>
          </nav>
        </div>

        {/* Right Action Icons & Portals */}
        <div className="flex items-center gap-3">
          {/* Tenant Badge if Client */}
          {activeTenant && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-300">
              <Building2 className="w-3.5 h-3.5" />
              <span>{activeTenant.name}</span>
            </div>
          )}

          {/* Dedicated Portal Shortcuts based on Personas */}
          <div className="hidden sm:flex items-center gap-2">
            {isEmployee && (
              <a 
                href="/portal/employee" 
                className="px-3 py-1.5 rounded-md bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Terminal className="w-3.5 h-3.5" />
                Employee Portal
              </a>
            )}

            {isClient && (
              <a 
                href="/portal/client" 
                className="px-3 py-1.5 rounded-md bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Layers className="w-3.5 h-3.5" />
                Client Workspace
              </a>
            )}

            {/* Collective Learning Hub for all authenticated members */}
            {currentUser?.persona !== 'public_visitor' && (
              <a 
                href="/portal/learning" 
                className="px-3 py-1.5 rounded-md bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Collective Learning
              </a>
            )}

            {isModerator && (
              <a 
                href="/portal/moderation" 
                className="px-3 py-1.5 rounded-md bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Moderation Queue
              </a>
            )}

            {isAdmin && (
              <a 
                href="/portal/federated" 
                className="px-3 py-1.5 rounded-md bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Database className="w-3.5 h-3.5" />
                Federated Track
              </a>
            )}
          </div>

          {/* In-app Notification Bell */}
          <div className="relative">
            <button
              onClick={loadNotifications}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 relative transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="text-xs font-bold uppercase text-slate-400">In-App Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={markNotifsRead} className="text-[11px] text-emerald-400 hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <div className="text-xs text-slate-500 py-3 text-center">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`p-2 rounded text-xs border ${n.read ? 'bg-slate-800/40 border-slate-800 text-slate-400' : 'bg-slate-800 border-slate-700 text-slate-200'}`}>
                        <div className="font-semibold text-emerald-300">{n.title}</div>
                        <div className="text-[11px] mt-0.5 leading-relaxed">{n.message}</div>
                        <div className="text-[9px] text-slate-500 mt-1">{new Date(n.timestamp).toLocaleTimeString()}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Connect / Demo Button */}
          <a
            href="/connect"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs tracking-wide transition shadow-lg shadow-emerald-500/20"
          >
            Request Demo
          </a>

          {/* Mobile menu hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-2">
          <a href="/products" className="block py-1.5 text-sm font-medium text-slate-300">Products</a>
          <a href="/solutions" className="block py-1.5 text-sm font-medium text-slate-300">Solutions</a>
          <a href="/technology" className="block py-1.5 text-sm font-medium text-slate-300">Technology</a>
          <a href="/live" className="block py-1.5 text-sm font-medium text-slate-300">LIVE Broadcasts</a>
          <a href="/insights" className="block py-1.5 text-sm font-medium text-slate-300">Insights</a>
          <a href="/portal/learning" className="block py-1.5 text-sm font-medium text-emerald-400">Collective Learning Hub</a>
          <a href="/portal/client" className="block py-1.5 text-sm font-medium text-teal-400">Client Workspace</a>
          <a href="/portal/employee" className="block py-1.5 text-sm font-medium text-purple-400">Employee Portal</a>
          <a href="/portal/moderation" className="block py-1.5 text-sm font-medium text-amber-400">Moderation Queue</a>
          <a href="/portal/federated" className="block py-1.5 text-sm font-medium text-red-400">Federated Track</a>
        </div>
      )}
    </header>
  );
}
