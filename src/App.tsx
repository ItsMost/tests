import React, { useState, useEffect, useMemo } from 'react';
import { UserPlus, User, Activity, TrendingUp, Save, Trash2, Calendar, Sun, Moon, Target, Shield, Edit2, Check, X, AlertTriangle, Trophy, Plus, Edit } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- تهيئة Supabase ---
const supabaseUrl = 'https://koakdlbwsjekmtiunfhr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvYWtkbGJ3c2pla210aXVuZmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNDEyNDUsImV4cCI6MjA4OTcxNzI0NX0.ZTXsET8hhtIebRmXiv1fHELmReGjVJlrq7HdlO9uWMI';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- تعريفات الأنواع (TypeScript Interfaces) ---
interface Player {
  id: string;
  name: string;
  dob: string;
  specialty: string;
}

interface AthleteRecord {
  id: string;
  playerId: string;
  category: string;
  test: string;
  result: number;
  date: string;
}

interface TestCategories {
  [key: string]: string[];
}

interface CellEditModalData {
  playerId: string;
  testName: string;
  category: string;
  recordId: string | null;
  result: string | number;
  date: string;
  playerName?: string;
}

// إعدادات الثيمات
const THEMES: any = {
  solo: {
    name: 'سولو ليفيلينج', icon: '🗡️',
    light: {
      bgImage: "url('https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=2000&q=80')",
      overlay: 'bg-indigo-50/85',
      card: 'bg-white/70 backdrop-blur-xl shadow-[0_0_30px_rgba(79,70,229,0.15)] border-white/50',
      text: 'text-slate-800', textMuted: 'text-slate-600',
      border: 'border-indigo-300/50', inputBg: 'bg-white/60 backdrop-blur-sm',
      primaryBtn: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] border border-indigo-400/50',
      primaryText: 'text-indigo-800', 
      successBtn: 'bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] border border-purple-400/50',
      successText: 'text-purple-700', dangerText: 'text-red-600', dangerBg: 'hover:bg-red-500/20',
      chartSpeed: '#8b5cf6', chartPower: '#4f46e5', header: 'bg-indigo-700/90 backdrop-blur-md text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]',
      ring: 'focus:ring-indigo-500 focus:shadow-[0_0_15px_rgba(79,70,229,0.3)]', tableHead: 'bg-indigo-100/50', tableRow: 'hover:bg-indigo-100/40 border-indigo-200/50',
      radarFill: 'rgba(79, 70, 229, 0.2)', radarStroke: '#4f46e5'
    },
    dark: {
      bgImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2000&q=80')",
      overlay: 'bg-[#090b14]/85',
      card: 'bg-[#111625]/75 backdrop-blur-xl shadow-[0_0_30px_rgba(99,102,241,0.2)] border-indigo-500/20',
      text: 'text-indigo-50', textMuted: 'text-indigo-300/80',
      border: 'border-indigo-500/30', inputBg: 'bg-black/40 backdrop-blur-sm',
      primaryBtn: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.7)] border border-indigo-400/30',
      primaryText: 'text-indigo-400', 
      successBtn: 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] border border-purple-400/30',
      successText: 'text-purple-400', dangerText: 'text-rose-500', dangerBg: 'hover:bg-rose-900/30',
      chartSpeed: '#a855f7', chartPower: '#6366f1', header: 'bg-[#090b14]/80 backdrop-blur-xl border-b border-indigo-500/30 text-indigo-400 shadow-[0_0_30px_rgba(79,70,229,0.2)]',
      ring: 'focus:ring-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.4)]', tableHead: 'bg-indigo-900/20', tableRow: 'hover:bg-indigo-900/30 border-indigo-500/20',
      radarFill: 'rgba(99, 102, 241, 0.3)', radarStroke: '#818cf8'
    }
  },
  bluelock: {
    name: 'بلو لوك', icon: '⚽',
    light: {
      bgImage: "url('https://images.unsplash.com/photo-1551280857-2b9bbe5260fc?auto=format&fit=crop&w=2000&q=80')",
      overlay: 'bg-cyan-50/85',
      card: 'bg-white/70 backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.15)] border-white/50',
      text: 'text-slate-800', textMuted: 'text-slate-600',
      border: 'border-cyan-300/50', inputBg: 'bg-white/60 backdrop-blur-sm',
      primaryBtn: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] border border-emerald-400/50',
      primaryText: 'text-emerald-700', 
      successBtn: 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] border border-cyan-400/50',
      successText: 'text-cyan-700', dangerText: 'text-rose-600', dangerBg: 'hover:bg-rose-500/20',
      chartSpeed: '#10b981', chartPower: '#06b6d4', header: 'bg-slate-900/90 backdrop-blur-md text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
      ring: 'focus:ring-emerald-500 focus:shadow-[0_0_15px_rgba(16,185,129,0.3)]', tableHead: 'bg-cyan-100/50', tableRow: 'hover:bg-cyan-100/40 border-cyan-200/50',
      radarFill: 'rgba(16, 185, 129, 0.2)', radarStroke: '#10b981'
    },
    dark: {
      bgImage: "url('https://images.unsplash.com/photo-1518605368461-1ee711683111?auto=format&fit=crop&w=2000&q=80')",
      overlay: 'bg-[#020617]/85',
      card: 'bg-[#0f172a]/75 backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] border-emerald-500/20',
      text: 'text-white', textMuted: 'text-emerald-200/70',
      border: 'border-emerald-500/30', inputBg: 'bg-black/40 backdrop-blur-sm',
      primaryBtn: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:shadow-[0_0_25px_rgba(16,185,129,0.7)] border border-emerald-400/30',
      primaryText: 'text-emerald-400', 
      successBtn: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] border border-cyan-400/30',
      successText: 'text-cyan-400', dangerText: 'text-rose-500', dangerBg: 'hover:bg-rose-900/30',
      chartSpeed: '#10b981', chartPower: '#06b6d4', header: 'bg-[#020617]/80 backdrop-blur-xl border-b border-emerald-500/30 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]',
      ring: 'focus:ring-emerald-500 focus:shadow-[0_0_15px_rgba(16,185,129,0.4)]', tableHead: 'bg-emerald-900/20', tableRow: 'hover:bg-emerald-900/30 border-emerald-500/20',
      radarFill: 'rgba(16, 185, 129, 0.3)', radarStroke: '#34d399'
    }
  },
  haikyuu: {
    name: 'هايكيو', icon: '🏐',
    light: {
      bgImage: "url('https://wallpapercave.com/wp/wp6857187.jpg')",
      overlay: 'bg-orange-50/50',
      card: 'bg-white/70 backdrop-blur-xl shadow-[0_0_30px_rgba(249,115,22,0.15)] border-white/50',
      text: 'text-slate-800', textMuted: 'text-slate-800 font-medium',
      border: 'border-orange-400/50', inputBg: 'bg-white/60 backdrop-blur-sm',
      primaryBtn: 'bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] border border-orange-400/50',
      primaryText: 'text-orange-700', 
      successBtn: 'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] border border-amber-400/50',
      successText: 'text-amber-700', dangerText: 'text-red-600', dangerBg: 'hover:bg-red-500/20',
      chartSpeed: '#f97316', chartPower: '#f59e0b', header: 'bg-orange-600/90 backdrop-blur-md text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]',
      ring: 'focus:ring-orange-500 focus:shadow-[0_0_15px_rgba(249,115,22,0.3)]', tableHead: 'bg-orange-100/60', tableRow: 'hover:bg-orange-100/50 border-orange-300/50',
      radarFill: 'rgba(249, 115, 22, 0.2)', radarStroke: '#f97316'
    },
    dark: {
      bgImage: "url('https://wallpapercave.com/wp/wp10574163.jpg')",
      overlay: 'bg-zinc-950/70',
      card: 'bg-zinc-900/75 backdrop-blur-xl shadow-[0_0_30px_rgba(249,115,22,0.2)] border-orange-500/20',
      text: 'text-orange-50', textMuted: 'text-orange-200/80',
      border: 'border-orange-500/30', inputBg: 'bg-black/40 backdrop-blur-sm',
      primaryBtn: 'bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.5)] hover:shadow-[0_0_25px_rgba(234,88,12,0.7)] border border-orange-400/30',
      primaryText: 'text-orange-500', 
      successBtn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(217,119,6,0.5)] hover:shadow-[0_0_25px_rgba(217,119,6,0.7)] border border-amber-400/30',
      successText: 'text-amber-500', dangerText: 'text-red-500', dangerBg: 'hover:bg-red-900/30',
      chartSpeed: '#f97316', chartPower: '#f59e0b', header: 'bg-zinc-950/80 backdrop-blur-xl border-b border-orange-500/30 text-orange-500 shadow-[0_0_30px_rgba(234,88,12,0.2)]',
      ring: 'focus:ring-orange-500 focus:shadow-[0_0_15px_rgba(234,88,12,0.4)]', tableHead: 'bg-orange-900/30', tableRow: 'hover:bg-orange-900/40 border-orange-500/30',
      radarFill: 'rgba(249, 115, 22, 0.3)', radarStroke: '#fb923c'
    }
  },
  kuroko: {
    name: 'كوروكو', icon: '🏀',
    light: {
      bgImage: "url('https://images.unsplash.com/photo-1519861531473-920026076fb3?auto=format&fit=crop&w=2000&q=80')",
      overlay: 'bg-red-50/85',
      card: 'bg-white/70 backdrop-blur-xl shadow-[0_0_30px_rgba(220,38,38,0.15)] border-white/50',
      text: 'text-slate-800', textMuted: 'text-slate-600',
      border: 'border-red-300/50', inputBg: 'bg-white/60 backdrop-blur-sm',
      primaryBtn: 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] border border-red-400/50',
      primaryText: 'text-red-700', 
      successBtn: 'bg-orange-600 hover:bg-orange-700 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)] hover:shadow-[0_0_25px_rgba(234,88,12,0.6)] border border-orange-400/50',
      successText: 'text-orange-700', dangerText: 'text-neutral-600', dangerBg: 'hover:bg-neutral-500/20',
      chartSpeed: '#dc2626', chartPower: '#ea580c', header: 'bg-red-700/90 backdrop-blur-md text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]',
      ring: 'focus:ring-red-500 focus:shadow-[0_0_15px_rgba(220,38,38,0.3)]', tableHead: 'bg-red-100/50', tableRow: 'hover:bg-red-100/40 border-red-200/50',
      radarFill: 'rgba(220, 38, 38, 0.2)', radarStroke: '#dc2626'
    },
    dark: {
      bgImage: "url('https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=2000&q=80')",
      overlay: 'bg-black/85',
      card: 'bg-neutral-900/75 backdrop-blur-xl shadow-[0_0_30px_rgba(220,38,38,0.2)] border-red-600/20',
      text: 'text-red-50', textMuted: 'text-red-200/70',
      border: 'border-red-600/30', inputBg: 'bg-black/40 backdrop-blur-sm',
      primaryBtn: 'bg-red-700 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(185,28,28,0.5)] hover:shadow-[0_0_25px_rgba(185,28,28,0.7)] border border-red-500/30',
      primaryText: 'text-red-500', 
      successBtn: 'bg-orange-700 hover:bg-orange-600 text-white shadow-[0_0_15px_rgba(194,65,12,0.5)] hover:shadow-[0_0_25px_rgba(194,65,12,0.7)] border border-orange-500/30',
      successText: 'text-orange-500', dangerText: 'text-neutral-400', dangerBg: 'hover:bg-neutral-800/50',
      chartSpeed: '#dc2626', chartPower: '#ea580c', header: 'bg-black/80 backdrop-blur-xl border-b border-red-600/30 text-red-500 shadow-[0_0_30px_rgba(220,38,38,0.2)]',
      ring: 'focus:ring-red-600 focus:shadow-[0_0_15px_rgba(220,38,38,0.4)]', tableHead: 'bg-red-900/20', tableRow: 'hover:bg-red-900/30 border-red-900/20',
      radarFill: 'rgba(220, 38, 38, 0.3)', radarStroke: '#ef4444'
    }
  }
};

const DEFAULT_TEST_CATEGORIES: TestCategories = {
  'السرعة': ['10 متر', '20 متر', '20 متر طائر', '30 متر', '30 متر طائر', '40 متر', '50 متر', '60 متر', '80 متر', '100 متر', '150 متر', '200 متر', '300 متر', '400 متر'],
  'الوثب': ['وثب طويل', 'وثب ثلاثي', 'ثلاثي من الثبات'],
  'القوة': ['وثب من ثبات', 'Squat', 'Clean', 'Bench press']
};

const PLAYER_SPECIALTIES = ['100 متر', '200 متر', '400 متر', 'وثب طويل', 'وثب ثلاثي', 'عام'];

const PRELOAD_DATA: any[] = [
  { rawName: 'Lamis 2011', '30 متر': 4.44, '60 متر': 8.48 },
  { rawName: 'Hanna 2011', '30 متر': 4.50, '100 متر': 22.6 },
  { rawName: 'Hasnaa' },
  { rawName: 'zaina' },
  { rawName: 'zainb' },
  { rawName: 'Fatma' },
  { rawName: 'jana 2010' },
  { rawName: 'Hanna 2010', '60 متر': 8.50, '100 متر': 20.9 },
  { rawName: 'Farida', '30 متر': 4.50, '60 متر': 8.69 },
  { rawName: 'Shahd', '100 متر': 20.18, '200 متر': 28 },
  { rawName: 'Judy', '30 متر': 4.45, '60 متر': 8.25, '100 متر': 20.9, '200 متر': 29.5 },
  { rawName: 'Logy', '30 متر': 4.56, '60 متر': 8.5, '100 متر': 22.13 },
  { rawName: 'Farrah Nabil' },
  { rawName: 'Janna Hesham', '30 متر': 4.38, '60 متر': 8.41 },
  { rawName: 'Aya', '30 متر': 4.50, '60 متر': 8.55, '100 متر': 21.43, '200 متر': 29.8 },
  { rawName: 'Jaydaa' },
  { rawName: 'Mariam baiomy', '100 متر': 22.2 },
  { rawName: 'Mariam Hossam', '30 متر': 4.27, '60 متر': 8.12, '100 متر': 20.19 },
  { rawName: 'Saga' },
  { rawName: 'Sama Aly', '30 متر': 4.27, '60 متر': 8.19, '100 متر': 21.14 },
  { rawName: 'Ahd' },
  { rawName: 'nour', '30 متر': 4.44, '60 متر': 8.47, '100 متر': 22.3 },
  { rawName: 'sama ahmed', '30 متر': 4.52, '60 متر': 8.70, '100 متر': 23.18 },
  { rawName: 'mariam gdeda', '30 متر': 5.05, '60 متر': 9.70 },
  { rawName: 'salma 2012', '30 متر': 5.20, '60 متر': 9.8 },
  { rawName: 'Ibrahim' },
  { rawName: 'Mostafa' },
  { rawName: 'Ali', '30 متر': 3.88, '60 متر': 7, '100 متر': 17.6 },
  { rawName: 'Rayan', '60 متر': 7.30, '100 متر': 17.8, '300 متر': 37.6 },
  { rawName: 'M.Happy', '30 متر': 3.99, '60 متر': 7.50, '100 متر': 18.79, '300 متر': 41.8 },
  { rawName: 'Moatz Adham' },
  { rawName: 'Karim' },
  { rawName: 'Eslam Kamal' },
  { rawName: 'Mohamed Salah', '100 متر': 17.15 },
  { rawName: 'Hamza Ahmed', '60 متر': 6.60, '100 متر': 16.2 },
  { rawName: 'Mahmoud Abdelsalam', '30 متر': 3.77, '30 متر طائر': 3.12, '60 متر': 6.90 },
  { rawName: 'Ramez', '30 متر': 3.79, '30 متر طائر': 3.07, '60 متر': 6.90, '100 متر': 17.08 },
  { rawName: 'Taym' },
  { rawName: 'Ahmed Khaled', '30 متر': 3.90, '60 متر': 7, '100 متر': 17.57 },
  { rawName: 'M.elsayed', '30 متر': 3.90, '30 متر طائر': 3.25, '60 متر': 7.25, '300 متر': 39.7 },
  { rawName: 'Hamza Kamal', '30 متر': 3.97, '30 متر طائر': 3.08, '60 متر': 7.05 },
  { rawName: '7oras', '300 متر': 42.5 }
];

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [themeKey, setThemeKey] = useState<string>('solo'); 
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<string>('entry'); 

  const [players, setPlayers] = useState<Player[]>([]);
  const [records, setRecords] = useState<AthleteRecord[]>([]);
  const [testCategories, setTestCategories] = useState<TestCategories>(DEFAULT_TEST_CATEGORIES);
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState<boolean>(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editPlayerName, setEditPlayerName] = useState<string>('');
  const [editPlayerYear, setEditPlayerYear] = useState<string>('');
  const [editPlayerSpecialty, setEditPlayerSpecialty] = useState<string>('');

  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);
  const [newTestCategory, setNewTestCategory] = useState<string>('السرعة');
  const [newTestName, setNewTestName] = useState<string>('');

  const [playerToDelete, setPlayerToDelete] = useState<string | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [cellEditModal, setCellEditModal] = useState<CellEditModalData | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('السرعة');
  const [selectedTest, setSelectedTest] = useState<string>(testCategories['السرعة'][0]);
  const [testResult, setTestResult] = useState<string>('');
  const [testDate, setTestDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [editRecordResult, setEditRecordResult] = useState<string>('');
  const [editRecordDate, setEditRecordDate] = useState<string>('');

  const [reportCategory, setReportCategory] = useState<string>('السرعة');
  const [reportTest, setReportTest] = useState<string>(testCategories['السرعة'][0]);

  const [tableCategory, setTableCategory] = useState<string>('السرعة');
  const [tableMode, setTableMode] = useState<string>('best'); 

  const theme = THEMES[themeKey][isDarkMode ? 'dark' : 'light'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: settingsData } = await supabase.from('settings').select('*').eq('id', 'categories').single();
        if (settingsData && settingsData.data) {
          setTestCategories(settingsData.data);
        } else {
          await supabase.from('settings').insert([{ id: 'categories', data: DEFAULT_TEST_CATEGORIES }]);
        }

        const { data: playersData } = await supabase.from('players').select('*');
        if (playersData) {
          setPlayers(playersData as Player[]);
        }

        const { data: recordsData } = await supabase.from('records').select('*');
        if (recordsData) {
          setRecords(recordsData as AthleteRecord[]);
        }

        if ((!playersData || playersData.length === 0) && (!recordsData || recordsData.length === 0)) {
          const newPlayers: Player[] = [];
          const newRecords: AthleteRecord[] = [];
          const today = new Date().toISOString().split('T')[0];

          PRELOAD_DATA.forEach((data, index) => {
            const id = `player_${Date.now()}_${index}`;
            const yearMatch = data.rawName.match(/\b(20\d{2})\b/);
            const name = yearMatch ? data.rawName.replace(yearMatch[0], '').trim() : data.rawName;
            const dob = yearMatch ? yearMatch[0] : '2005'; 
            
            newPlayers.push({ id, name, dob, specialty: 'عام' });

            Object.keys(data).forEach(key => {
              if (key !== 'rawName') {
                newRecords.push({
                  id: `rec_${id}_${key}_${Math.random().toString(36).substring(7)}`,
                  playerId: id,
                  category: 'السرعة',
                  test: key,
                  result: parseFloat(data[key]),
                  date: today
                });
              }
            });
          });

          await supabase.from('players').insert(newPlayers);
          await supabase.from('records').insert(newRecords);
          setPlayers(newPlayers);
          setRecords(newRecords);
        }

      } catch (error) {
        console.error("خطأ في جلب البيانات من Supabase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const savedTheme = localStorage.getItem('athlete_theme');
    const savedMode = localStorage.getItem('athlete_mode');
    if (savedTheme && THEMES[savedTheme]) setThemeKey(savedTheme);
    if (savedMode !== null) setIsDarkMode(JSON.parse(savedMode));
  }, []);

  useEffect(() => {
    localStorage.setItem('athlete_theme', themeKey);
    localStorage.setItem('athlete_mode', JSON.stringify(isDarkMode));
  }, [themeKey, isDarkMode]);

  useEffect(() => {
    if (testCategories[selectedCategory] && !testCategories[selectedCategory].includes(selectedTest)) {
      setSelectedTest(testCategories[selectedCategory][0]);
    }
  }, [selectedCategory, testCategories]);

  useEffect(() => {
    if (testCategories[reportCategory] && !testCategories[reportCategory].includes(reportTest)) {
      setReportTest(testCategories[reportCategory][0]);
    }
  }, [reportCategory, testCategories]);

  const getBirthYear = (dobOrYear: string) => {
    if (!dobOrYear) return '';
    return dobOrYear.includes('-') ? dobOrYear.split('-')[0] : dobOrYear;
  };

  const calculateAge = (dobOrYear: string) => {
    if (!dobOrYear) return '';
    const year = parseInt(getBirthYear(dobOrYear));
    return new Date().getFullYear() - year;
  };

  const handleAddNewTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim()) return;
    const updatedCategories = { ...testCategories };
    if (!updatedCategories[newTestCategory].includes(newTestName.trim())) {
      updatedCategories[newTestCategory] = [...updatedCategories[newTestCategory], newTestName.trim()];
      setTestCategories(updatedCategories);
      await supabase.from('settings').upsert([{ id: 'categories', data: updatedCategories }]);
    }
    setNewTestName('');
    setIsTestModalOpen(false);
  };

  const openAddPlayerModal = () => {
    setEditingPlayerId(null);
    setEditPlayerName('');
    setEditPlayerYear('');
    setEditPlayerSpecialty(PLAYER_SPECIALTIES[0]);
    setIsPlayerModalOpen(true);
  };

  const startEditPlayer = (player: Player) => {
    setEditingPlayerId(player.id);
    setEditPlayerName(player.name);
    setEditPlayerYear(getBirthYear(player.dob));
    setEditPlayerSpecialty(player.specialty || PLAYER_SPECIALTIES[0]);
    setIsPlayerModalOpen(true);
  };

  const savePlayerModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPlayerName.trim() || !editPlayerYear) return;
    
    if (editingPlayerId) {
      setPlayers(players.map(p => p.id === editingPlayerId ? { ...p, name: editPlayerName.trim(), dob: editPlayerYear, specialty: editPlayerSpecialty } : p));
      await supabase.from('players').update({ name: editPlayerName.trim(), dob: editPlayerYear, specialty: editPlayerSpecialty }).eq('id', editingPlayerId);
    } else {
      const newPlayer: Player = { 
        id: Date.now().toString(), 
        name: editPlayerName.trim(),
        dob: editPlayerYear,
        specialty: editPlayerSpecialty
      };
      setPlayers([...players, newPlayer]);
      setActivePlayerId(newPlayer.id);
      await supabase.from('players').insert([newPlayer]);
    }
    setIsPlayerModalOpen(false);
  };

  const cancelEditPlayer = () => setIsPlayerModalOpen(false);

  const confirmDeletePlayer = async () => {
    if (playerToDelete) {
      setPlayers(players.filter(p => p.id !== playerToDelete));
      setRecords(records.filter(r => r.playerId !== playerToDelete));
      if (activePlayerId === playerToDelete) setActivePlayerId(null);
      
      await supabase.from('players').delete().eq('id', playerToDelete);
      await supabase.from('records').delete().eq('playerId', playerToDelete);
      
      setPlayerToDelete(null);
    }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlayerId || !testResult) return;
    const newRecord: AthleteRecord = {
      id: Date.now().toString(),
      playerId: activePlayerId,
      category: selectedCategory,
      test: selectedTest,
      result: parseFloat(testResult.toString()),
      date: testDate
    };
    setRecords([...records, newRecord]);
    setTestResult('');
    await supabase.from('records').insert([newRecord]);
  };

  const startEditRecord = (record: AthleteRecord) => {
    setEditingRecordId(record.id);
    setEditRecordResult(record.result.toString());
    setEditRecordDate(record.date);
  };

  const saveEditRecord = async () => {
    if (!editRecordResult) return;
    setRecords(records.map(r => r.id === editingRecordId ? { ...r, result: parseFloat(editRecordResult), date: editRecordDate } : r));
    await supabase.from('records').update({ result: parseFloat(editRecordResult), date: editRecordDate }).eq('id', editingRecordId);
    setEditingRecordId(null);
  };

  const cancelEditRecord = () => setEditingRecordId(null);

  const confirmDeleteRecord = async () => {
    if (recordToDelete) {
      setRecords(records.filter(r => r.id !== recordToDelete));
      await supabase.from('records').delete().eq('id', recordToDelete);
      setRecordToDelete(null);
    }
  };

  const openCellModal = (playerId: string, testName: string, category: string) => {
    const pRecords = records.filter(r => r.playerId === playerId && r.test === testName);
    let recordToEdit: AthleteRecord | null = null;

    if (pRecords.length > 0) {
      if (tableMode === 'latest') {
        recordToEdit = pRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      } else {
        const isSpeed = category === 'السرعة';
        if (isSpeed) {
          recordToEdit = pRecords.reduce((min, r) => r.result < min.result ? r : min, pRecords[0]);
        } else {
          recordToEdit = pRecords.reduce((max, r) => r.result > max.result ? r : max, pRecords[0]);
        }
      }
    }

    setCellEditModal({
      playerId,
      testName,
      category,
      recordId: recordToEdit ? recordToEdit.id : null,
      result: recordToEdit ? recordToEdit.result.toString() : '',
      date: recordToEdit ? recordToEdit.date : new Date().toISOString().split('T')[0],
      playerName: players.find(p => p.id === playerId)?.name
    });
  };

  const saveCellModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cellEditModal || !cellEditModal.result) return;
    
    if (cellEditModal.recordId) {
      setRecords(records.map(r => r.id === cellEditModal.recordId ? { ...r, result: parseFloat(cellEditModal.result.toString()), date: cellEditModal.date } : r));
      await supabase.from('records').update({ result: parseFloat(cellEditModal.result.toString()), date: cellEditModal.date }).eq('id', cellEditModal.recordId);
    } else {
      const newRecord: AthleteRecord = {
        id: Date.now().toString(),
        playerId: cellEditModal.playerId,
        category: cellEditModal.category,
        test: cellEditModal.testName,
        result: parseFloat(cellEditModal.result.toString()),
        date: cellEditModal.date
      };
      setRecords([...records, newRecord]);
      await supabase.from('records').insert([newRecord]);
    }
    setCellEditModal(null);
  };

  const deleteCellRecord = () => {
    if (cellEditModal?.recordId) {
      setRecordToDelete(cellEditModal.recordId);
      setCellEditModal(null);
    }
  };

  const filteredRecords = useMemo(() => {
    if (!activePlayerId) return [];
    return records
      .filter(r => r.playerId === activePlayerId && r.test === reportTest)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [records, activePlayerId, reportTest]);

  const activePlayer = players.find(p => p.id === activePlayerId);

  const getPlayerCellData = (playerId: string, testName: string, category: string) => {
    const pRecords = records.filter(r => r.playerId === playerId && r.test === testName);
    if (pRecords.length === 0) return '-';

    if (tableMode === 'latest') {
      const latest = pRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      return latest.result;
    } else {
      const isSpeed = category === 'السرعة';
      const values = pRecords.map(r => r.result);
      return isSpeed ? Math.min(...values) : Math.max(...values);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white" dir="rtl">
        <div className="flex flex-col items-center gap-6">
           <Activity className="w-16 h-16 animate-pulse text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
           <h2 className="text-2xl font-bold animate-pulse">جاري جلب بيانات الفريق من السحابة...</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
        * { font-family: 'Cairo', sans-serif; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.5); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(100, 116, 139, 0.8); }
      `}</style>

      <div 
        className="min-h-screen bg-cover bg-center bg-fixed transition-all duration-700"
        style={{ backgroundImage: theme.bgImage }}
        dir="rtl"
      >
        <div className={`min-h-screen ${theme.overlay} ${theme.text} transition-colors duration-700 flex flex-col`}>
          
          <header className={`${theme.header} py-4 px-4 sm:px-6 transition-all duration-700 sticky top-0 z-40`}>
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
                <Activity className="w-8 h-8 drop-shadow-lg" />
                <div>
                  <h1 className="text-2xl font-bold tracking-wide drop-shadow-md">متتبع أداء اللاعبين (سحابي)</h1>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-black/10 dark:bg-white/5 p-1.5 rounded-2xl border border-current/10 backdrop-blur-md">
                <div className="flex gap-1 border-l border-current/20 pl-4">
                  {Object.keys(THEMES).map((key) => {
                    const t = THEMES[key];
                    return (
                      <button
                        key={key}
                        onClick={() => setThemeKey(key)}
                        title={t.name}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${themeKey === key ? 'bg-current/20 scale-110 shadow-lg' : 'opacity-60 hover:opacity-100 hover:bg-current/10'}`}
                      >
                        {t.icon}
                      </button>
                    )
                  })}
                </div>
                
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-current/10 hover:bg-current/20 shadow-sm"
                  title={isDarkMode ? 'تفعيل وضع النهار' : 'تفعيل الوضع الليلي'}
                >
                  {isDarkMode ? <Sun className="w-5 h-5 drop-shadow-md" /> : <Moon className="w-5 h-5 drop-shadow-md" />}
                </button>
              </div>
            </div>
          </header>

          <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6 overflow-x-auto">
            <div className="flex gap-2 sm:gap-4 border-b border-current/10 pb-px min-w-max">
              <button 
                onClick={() => setCurrentView('entry')}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-bold text-sm sm:text-base rounded-t-xl transition-all ${currentView === 'entry' ? `${theme.card} ${theme.primaryText} border-t border-x border-current/20` : `opacity-60 hover:opacity-100 hover:bg-current/5`}`}
              >
                <Save className="w-4 sm:w-5 h-4 sm:h-5" /> تسجيل البيانات
              </button>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-bold text-sm sm:text-base rounded-t-xl transition-all ${currentView === 'dashboard' ? `${theme.card} ${theme.primaryText} border-t border-x border-current/20` : `opacity-60 hover:opacity-100 hover:bg-current/5`}`}
              >
                <Target className="w-4 sm:w-5 h-4 sm:h-5" /> غرفة التحليل
              </button>
              <button 
                onClick={() => setCurrentView('table')}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-bold text-sm sm:text-base rounded-t-xl transition-all ${currentView === 'table' ? `${theme.card} ${theme.primaryText} border-t border-x border-current/20` : `opacity-60 hover:opacity-100 hover:bg-current/5`}`}
              >
                <Trophy className="w-4 sm:w-5 h-4 sm:h-5" /> سجل الفريق (إدارة شاملة)
              </button>
            </div>
          </div>

          <main className="max-w-6xl mx-auto w-full p-4 sm:p-6 pt-6 relative flex-grow pb-12">
            
            {currentView === 'table' ? (
              <div className={`${theme.card} p-4 sm:p-8 rounded-2xl border ${theme.border} transition-all duration-500 shadow-2xl`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-current/10 pb-6">
                  <div>
                    <h2 className={`text-2xl font-black flex items-center gap-3 ${theme.primaryText} drop-shadow-md mb-2`}>
                      <Trophy className="w-7 h-7" /> الجدول الشامل لنتائج الفريق
                    </h2>
                    <p className={`text-sm ${theme.textMuted}`}>يمكنك الضغط على أي رقم لتعديله، أو إضافة لاعب واختبار جديدين من هنا.</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button onClick={openAddPlayerModal} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm ${theme.primaryBtn}`}>
                      <UserPlus className="w-4 h-4" /> إضافة لاعب
                    </button>
                    <button onClick={() => setIsTestModalOpen(true)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm ${theme.successBtn}`}>
                      <Plus className="w-4 h-4" /> إضافة اختبار
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
                  <div className="w-full sm:w-64">
                    <label className={`block text-sm font-bold mb-2 ${theme.textMuted}`}>الفئة المعروضة:</label>
                    <select 
                      className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${theme.ring} cursor-pointer [&>option]:bg-slate-800 [&>option]:text-white shadow-inner`}
                      value={tableCategory}
                      onChange={(e) => setTableCategory(e.target.value)}
                    >
                      {Object.keys(testCategories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div className="flex bg-black/20 p-1.5 rounded-xl backdrop-blur-md border border-current/10 shadow-inner w-full sm:w-auto">
                    <button 
                      onClick={() => setTableMode('best')}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all ${tableMode === 'best' ? `${theme.primaryBtn} shadow-md` : 'opacity-60 hover:opacity-100 text-current'}`}
                    >
                      أفضل الأرقام (PB)
                    </button>
                    <button 
                      onClick={() => setTableMode('latest')}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all ${tableMode === 'latest' ? `${theme.primaryBtn} shadow-md` : 'opacity-60 hover:opacity-100 text-current'}`}
                    >
                      أحدث الأرقام
                    </button>
                  </div>
                </div>

                <div className={`overflow-x-auto rounded-xl border ${theme.border} shadow-lg backdrop-blur-xl bg-current/5`}>
                  <table className="w-full text-right border-collapse whitespace-nowrap min-w-full">
                    <thead>
                      <tr className={`${theme.tableHead} ${theme.textMuted} text-sm backdrop-blur-md`}>
                        <th className="p-4 font-black border-b border-current/10 sticky right-0 z-20 bg-inherit backdrop-blur-3xl shadow-[2px_0_5px_rgba(0,0,0,0.05)] w-48">
                          اسم اللاعب
                        </th>
                        <th className="p-4 font-bold border-b border-current/10">التخصص</th>
                        {testCategories[tableCategory].map(test => (
                          <th key={test} className="p-4 font-bold border-b border-current/10 text-center bg-current/5 border-l border-current/5">{test}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {players.length === 0 ? (
                        <tr>
                          <td colSpan={testCategories[tableCategory].length + 2} className="p-10 text-center opacity-60 font-semibold text-lg">
                            لا يوجد لاعبين مسجلين في الفريق حتى الآن
                          </td>
                        </tr>
                      ) : (
                        players.map(p => (
                          <tr key={p.id} className={`border-b ${theme.tableRow} transition-colors duration-200 group`}>
                            <td className={`p-4 font-bold sticky right-0 z-10 backdrop-blur-3xl bg-black/10 shadow-[2px_0_5px_rgba(0,0,0,0.1)]`}>
                              <div className="flex items-center justify-between gap-2">
                                <span className={`${theme.primaryText} truncate`}>{p.name}</span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 p-1 rounded-md backdrop-blur-md">
                                  <button onClick={() => startEditPlayer(p)} className="p-1 hover:text-blue-400"><Edit2 className="w-3.5 h-3.5" /></button>
                                  <button onClick={() => setPlayerToDelete(p.id)} className="p-1 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-sm font-semibold opacity-90">{p.specialty ? p.specialty : '-'}</td>
                            
                            {testCategories[tableCategory].map(test => {
                              const val = getPlayerCellData(p.id, test, tableCategory);
                              return (
                                <td 
                                  key={test} 
                                  onClick={() => openCellModal(p.id, test, tableCategory)}
                                  className="p-4 text-center border-l border-current/5 cursor-pointer hover:bg-current/10 transition-colors relative group/cell"
                                >
                                  {val !== '-' ? (
                                    <span className={`px-3 py-1 bg-current/10 rounded-lg border ${theme.border} inline-block min-w-[70px] font-black text-lg drop-shadow-sm group-hover/cell:scale-110 transition-transform`}>
                                      {val}
                                    </span>
                                  ) : (
                                    <span className="opacity-20 hover:opacity-60 transition-opacity">
                                      <Plus className="w-5 h-5 mx-auto" />
                                    </span>
                                  )}
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 bg-black/40 backdrop-blur-[2px] transition-opacity pointer-events-none rounded-sm">
                                    <Edit className="w-5 h-5 text-white drop-shadow-md" />
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            ) : currentView === 'entry' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className={`${theme.card} p-6 rounded-2xl border ${theme.border} transition-all duration-500`}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-xl font-bold flex items-center gap-2 ${theme.primaryText}`}>
                      <User className="w-6 h-6" /> اختيار اللاعب
                    </h2>
                    <button onClick={openAddPlayerModal} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${theme.primaryBtn}`}>
                      <UserPlus className="w-4 h-4" /> لاعب جديد
                    </button>
                  </div>
                  
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {players.length === 0 ? (
                      <div className={`text-center py-6 border border-dashed ${theme.border} rounded-xl ${theme.textMuted} text-sm bg-current/5`}>لا يوجد لاعبين، قم بإضافة لاعب لتبدأ</div>
                    ) : (
                      players.map(p => (
                        <div 
                          key={p.id} 
                          onClick={() => setActivePlayerId(p.id)}
                          className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${activePlayerId === p.id ? `${theme.primaryBtn} border-transparent scale-[1.02] shadow-lg` : `${theme.inputBg} ${theme.border} hover:border-current/50 hover:shadow-md`}`}
                        >
                          <div>
                            <span className="font-bold text-base drop-shadow-sm">{p.name}</span>
                            <span className={`text-xs mt-1 block ${activePlayerId === p.id ? 'text-white/80' : theme.textMuted}`}>
                              {p.specialty ? `لاعب ${p.specialty}` : 'تخصص غير محدد'} • {calculateAge(p.dob || '')} سنة
                            </span>
                          </div>
                          {activePlayerId === p.id && <Activity className="w-6 h-6 mr-3 drop-shadow-md" />}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className={`${theme.card} p-6 rounded-2xl border ${theme.border} transition-all duration-500`}>
                  <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${theme.successText}`}>
                    <Save className="w-6 h-6" /> إدخال اختبار جديد
                  </h2>
                  {!activePlayerId ? (
                    <div className={`flex flex-col items-center justify-center h-64 ${theme.textMuted} text-center border border-dashed ${theme.border} rounded-xl p-4 bg-current/5`}>
                      <User className="w-16 h-16 opacity-30 mb-4 drop-shadow-sm" />
                      <p className="font-semibold">الرجاء اختيار لاعب من القائمة المجاورة أولاً</p>
                    </div>
                  ) : (
                    <form onSubmit={handleAddRecord} className="space-y-5">
                      <div className={`bg-current/10 backdrop-blur-md p-4 rounded-xl mb-4 border ${theme.border} flex justify-between items-center shadow-inner`}>
                        <div>
                          <span className={`text-xs block ${theme.textMuted} mb-1`}>تسجيل أرقام لـ:</span>
                          <span className="font-bold text-lg drop-shadow-sm">{activePlayer?.name} <span className="text-sm font-normal opacity-80">({activePlayer?.specialty ? `لاعب ${activePlayer.specialty}` : 'غير محدد'})</span></span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-bold mb-2 ${theme.textMuted}`}>الفئة</label>
                          <select 
                            className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-4 py-3 transition-all ${theme.ring} cursor-pointer [&>option]:bg-slate-800 [&>option]:text-white`}
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                          >
                            {Object.keys(testCategories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                        <div>
                          <div className="flex justify-between items-end mb-2">
                            <label className={`block text-sm font-bold ${theme.textMuted}`}>الاختبار</label>
                            <button type="button" onClick={() => { setNewTestCategory(selectedCategory); setIsTestModalOpen(true); }} className={`text-xs font-bold ${theme.primaryText} hover:underline flex items-center gap-1`}>
                              <Plus className="w-3 h-3" /> جديد
                            </button>
                          </div>
                          <select 
                            className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-4 py-3 transition-all ${theme.ring} cursor-pointer [&>option]:bg-slate-800 [&>option]:text-white`}
                            value={selectedTest}
                            onChange={(e) => setSelectedTest(e.target.value)}
                          >
                            {testCategories[selectedCategory].map(test => <option key={test} value={test}>{test}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme.textMuted}`}>النتيجة (رقم)</label>
                        <input 
                          type="number" step="0.01" required
                          placeholder={selectedCategory === 'السرعة' ? 'ثانية' : (selectedCategory === 'الوثب' ? 'متر' : 'كجم')}
                          className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-4 py-3 transition-all ${theme.ring} text-2xl font-black text-center placeholder:text-base placeholder:font-normal`}
                          value={testResult}
                          onChange={(e) => setTestResult(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme.textMuted}`}>تاريخ الاختبار</label>
                        <input 
                          type="date" required
                          className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-4 py-3 transition-all ${theme.ring}`}
                          style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
                          value={testDate}
                          onChange={(e) => setTestDate(e.target.value)}
                        />
                      </div>
                      <button type="submit" className={`w-full ${theme.successBtn} font-bold py-4 rounded-xl text-lg flex justify-center items-center gap-2 mt-4 transition-all duration-300`}>
                        <Save className="w-6 h-6 drop-shadow-md" /> حفظ النتيجة
                      </button>
                    </form>
                  )}
                </div>
              </div>

            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                <div className={`${theme.card} p-5 rounded-2xl border ${theme.border} lg:col-span-1 h-fit transition-all duration-500`}>
                  <h3 className={`font-bold mb-5 ${theme.textMuted} flex items-center gap-2`}><Target className="w-5 h-5"/> اختر لاعباً:</h3>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {players.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setActivePlayerId(p.id)}
                        className={`w-full text-right px-4 py-3 rounded-xl transition-all duration-300 ${activePlayerId === p.id ? `${theme.primaryBtn} scale-[1.03]` : `${theme.inputBg} ${theme.textMuted} hover:${theme.primaryText} border ${theme.border} hover:shadow-lg`}`}
                      >
                        <span className="font-bold block drop-shadow-sm">{p.name}</span>
                        <span className={`text-xs mt-1 block ${activePlayerId === p.id ? 'opacity-80' : ''}`}>{p.specialty ? `لاعب ${p.specialty}` : 'غير محدد'} • {calculateAge(p.dob || '')} سنة</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-3 space-y-8">
                  {!activePlayerId ? (
                    <div className={`${theme.card} flex flex-col items-center justify-center h-96 rounded-2xl border border-dashed ${theme.border} ${theme.textMuted} bg-current/5`}>
                      <Target className="w-24 h-24 mb-6 opacity-30 drop-shadow-md animate-pulse" />
                      <p className="text-xl font-bold">اختر لاعباً لفتح غرفة التحليل الخاصة به</p>
                    </div>
                  ) : (
                    <>
                      <div className={`${theme.card} p-6 sm:p-8 rounded-2xl border ${theme.border} transition-all duration-500`}>
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                          <div>
                            <h2 className={`text-2xl font-black mb-2 flex items-center gap-2 ${theme.primaryText} drop-shadow-md`}>
                              <Shield className="w-7 h-7" /> بوصلة قدرات {activePlayer?.name}
                            </h2>
                            <p className={`text-sm font-medium ${theme.textMuted}`}>مقارنة أقصى قدراته بأفضل أرقام الفريق.</p>
                          </div>
                          <div className="text-left flex flex-row sm:flex-col items-end gap-2">
                            <div className={`px-4 py-1.5 rounded-lg bg-black/20 backdrop-blur-md border ${theme.border} font-bold text-sm shadow-inner`}>
                              العمر: {calculateAge(activePlayer?.dob || '')}
                            </div>
                            <div className={`px-4 py-1.5 rounded-lg bg-black/20 backdrop-blur-md border ${theme.border} font-bold text-sm shadow-inner`}>
                              {activePlayer?.specialty ? `لاعب ${activePlayer.specialty}` : 'تخصص غير محدد'}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-center items-center drop-shadow-2xl">
                          <RadarChart records={records} playerId={activePlayerId} theme={theme} />
                        </div>
                      </div>

                      <div className={`${theme.card} p-6 sm:p-8 rounded-2xl border ${theme.border} transition-all duration-500`}>
                        <h2 className={`text-2xl font-black mb-6 flex items-center gap-2 ${theme.primaryText} drop-shadow-md`}>
                          <TrendingUp className="w-7 h-7" /> تحليل التطور الزمني
                        </h2>
                        
                        <div className={`flex flex-wrap gap-4 mb-8 bg-current/10 backdrop-blur-md p-5 rounded-xl border ${theme.border} shadow-inner`}>
                          <div className="flex-1 min-w-[200px]">
                            <label className={`block text-xs font-bold mb-2 ${theme.textMuted}`}>الفئة</label>
                            <select 
                              className={`w-full border ${theme.border} ${theme.inputBg} rounded-lg px-4 py-3 text-sm transition-all ${theme.ring} cursor-pointer [&>option]:bg-slate-800 [&>option]:text-white`}
                              value={reportCategory}
                              onChange={(e) => setReportCategory(e.target.value)}
                            >
                              {Object.keys(testCategories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                          </div>
                          <div className="flex-1 min-w-[200px]">
                            <label className={`block text-xs font-bold mb-2 ${theme.textMuted}`}>الاختبار</label>
                            <select 
                              className={`w-full border ${theme.border} ${theme.inputBg} rounded-lg px-4 py-3 text-sm transition-all ${theme.ring} cursor-pointer [&>option]:bg-slate-800 [&>option]:text-white`}
                              value={reportTest}
                              onChange={(e) => setReportTest(e.target.value)}
                            >
                              {testCategories[reportCategory]?.map(test => <option key={test} value={test}>{test}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="mb-10 bg-black/10 backdrop-blur-sm p-4 rounded-xl border border-current/10 shadow-inner">
                          <SimpleLineChart data={filteredRecords} isSpeedTest={reportCategory === 'السرعة'} theme={theme} />
                        </div>

                        <div>
                          <h3 className={`text-base font-bold ${theme.textMuted} mb-4 flex items-center gap-2`}><Calendar className="w-5 h-5"/> السجل التفصيلي للاختبار</h3>
                          {filteredRecords.length === 0 ? (
                            <div className={`text-center py-10 border border-dashed ${theme.border} rounded-xl ${theme.textMuted} bg-current/5 font-semibold`}>لا توجد أرقام مسجلة لهذا الاختبار</div>
                          ) : (
                            <div className={`overflow-x-auto rounded-xl border ${theme.border} shadow-lg backdrop-blur-md bg-current/5`}>
                              <table className="w-full text-right border-collapse">
                                <thead>
                                  <tr className={`${theme.tableHead} ${theme.textMuted} text-sm backdrop-blur-md`}>
                                    <th className="p-4 font-bold border-b border-current/10">التاريخ</th>
                                    <th className="p-4 font-bold border-b border-current/10">النتيجة</th>
                                    <th className="p-4 font-bold border-b border-current/10">مؤشر التحسن</th>
                                    <th className="p-4 font-bold text-left border-b border-current/10">إجراء</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredRecords.map((record, index) => {
                                    let improvement = null;
                                    if (index > 0) {
                                      const prev = filteredRecords[index - 1].result;
                                      const curr = record.result;
                                      const diff = curr - prev;
                                      const isBetter = reportCategory === 'السرعة' ? curr < prev : curr > prev;
                                      if (diff !== 0) {
                                        improvement = <span className={`text-xs font-bold px-3 py-1.5 rounded-md shadow-sm ${isBetter ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>{diff > 0 ? '+' : ''}{diff.toFixed(2)}</span>;
                                      } else {
                                        improvement = <span className="text-xs font-medium text-slate-400 bg-slate-500/10 px-3 py-1.5 rounded-md border border-slate-500/20">ثبات</span>;
                                      }
                                    } else {
                                      improvement = <span className={`text-xs font-medium ${theme.textMuted}`}>أول تسجيل</span>;
                                    }

                                    const isEditing = editingRecordId === record.id;

                                    return (
                                      <tr key={record.id} className={`border-b ${theme.tableRow} transition-colors duration-200`}>
                                        <td className="p-4 text-sm font-medium">
                                          {isEditing ? (
                                            <input type="date" value={editRecordDate} onChange={(e) => setEditRecordDate(e.target.value)} className={`px-3 py-2 rounded-lg border ${theme.border} bg-black/30 text-sm focus:outline-none ${theme.ring}`} style={{ colorScheme: isDarkMode ? 'dark' : 'light' }} />
                                          ) : (
                                            <span className="opacity-70">{record.date}</span>
                                          )}
                                        </td>
                                        <td className={`p-4 font-black text-xl ${theme.primaryText} drop-shadow-md`}>
                                          {isEditing ? (
                                            <input type="number" step="0.01" value={editRecordResult} onChange={(e) => setEditRecordResult(e.target.value)} className={`w-28 px-3 py-2 rounded-lg border ${theme.border} bg-black/30 text-center focus:outline-none ${theme.ring}`} />
                                          ) : (
                                            record.result
                                          )}
                                        </td>
                                        <td className="p-4">{!isEditing && improvement}</td>
                                        <td className="p-4 text-left">
                                          {isEditing ? (
                                            <div className="flex gap-2 justify-end">
                                              <button onClick={saveEditRecord} className="p-2 rounded-lg bg-green-500 text-slate-900 hover:bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)]"><Check className="w-4 h-4" /></button>
                                              <button onClick={cancelEditRecord} className="p-2 rounded-lg bg-slate-500/30 text-white hover:bg-slate-500/50 backdrop-blur-sm"><X className="w-4 h-4" /></button>
                                            </div>
                                          ) : (
                                            <div className="flex gap-2 justify-end">
                                              <button onClick={() => startEditRecord(record)} className={`p-2 rounded-lg opacity-60 hover:opacity-100 hover:bg-current/10 hover:shadow-md transition-all`} title="تعديل"><Edit2 className="w-4 h-4" /></button>
                                              <button onClick={() => setRecordToDelete(record.id)} className={`${theme.dangerText} ${theme.dangerBg} p-2 rounded-lg hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all`} title="حذف"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>

                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ================== النوافذ المنبثقة (MODALS) ================== */}
            
            {isPlayerModalOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
                <div className={`${theme.card} p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-md w-full border ${theme.border} transform transition-all`}>
                  <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${theme.primaryText} drop-shadow-md`}>
                    <UserPlus className="w-7 h-7" /> {editingPlayerId ? 'تعديل بيانات اللاعب' : 'إضافة لاعب جديد'}
                  </h3>
                  <form onSubmit={savePlayerModal} className="space-y-4">
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme.textMuted}`}>الاسم الثلاثي</label>
                      <input type="text" required value={editPlayerName} onChange={(e) => setEditPlayerName(e.target.value)} className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-4 py-3 transition-all ${theme.ring}`} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme.textMuted}`}>سنة الميلاد</label>
                        <input type="number" required min="1970" max={new Date().getFullYear()} value={editPlayerYear} onChange={(e) => setEditPlayerYear(e.target.value)} className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-4 py-3 transition-all ${theme.ring}`} />
                      </div>
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme.textMuted}`}>التخصص</label>
                        <select value={editPlayerSpecialty} onChange={(e) => setEditPlayerSpecialty(e.target.value)} className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-4 py-3 transition-all ${theme.ring} [&>option]:bg-slate-800 [&>option]:text-white`}>
                          {PLAYER_SPECIALTIES.map(sp => <option key={sp} value={sp}>لاعب {sp}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="submit" className={`flex-1 ${theme.primaryBtn} py-3 rounded-xl font-bold transition-all shadow-lg`}>حفظ اللاعب</button>
                      <button type="button" onClick={cancelEditPlayer} className={`flex-1 bg-current/10 hover:bg-current/20 backdrop-blur-md py-3 rounded-xl font-bold transition-all`}>إلغاء</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {isTestModalOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
                <div className={`${theme.card} p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-sm w-full border ${theme.border} transform transition-all`}>
                  <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${theme.successText} drop-shadow-md`}>
                    <Plus className="w-7 h-7" /> إضافة اختبار جديد
                  </h3>
                  <form onSubmit={handleAddNewTest} className="space-y-4">
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme.textMuted}`}>اختر الفئة للاختبار الجديد</label>
                      <select value={newTestCategory} onChange={(e) => setNewTestCategory(e.target.value)} className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-4 py-3 transition-all ${theme.ring} [&>option]:bg-slate-800 [&>option]:text-white`}>
                        {Object.keys(testCategories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme.textMuted}`}>اسم الاختبار الجديد</label>
                      <input type="text" required placeholder="مثال: قفز حواجز..." value={newTestName} onChange={(e) => setNewTestName(e.target.value)} className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-4 py-3 transition-all ${theme.ring}`} />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="submit" className={`flex-1 ${theme.successBtn} py-3 rounded-xl font-bold transition-all shadow-lg`}>إضافة الاختبار</button>
                      <button type="button" onClick={() => setIsTestModalOpen(false)} className={`flex-1 bg-current/10 hover:bg-current/20 backdrop-blur-md py-3 rounded-xl font-bold transition-all`}>إلغاء</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {cellEditModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
                <div className={`${theme.card} p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-md w-full border ${theme.border} transform transition-all`}>
                  <h3 className={`text-2xl font-bold mb-2 flex items-center gap-2 ${theme.primaryText} drop-shadow-md`}>
                    <Edit className="w-6 h-6" /> {cellEditModal.recordId ? 'تعديل الرقم المسجل' : 'إضافة رقم جديد'}
                  </h3>
                  <div className={`text-sm ${theme.textMuted} mb-6 pb-4 border-b border-current/10`}>
                    <span className="font-bold text-current">{cellEditModal.playerName}</span> في اختبار <span className="font-bold text-current">{cellEditModal.testName}</span>
                  </div>
                  <form onSubmit={saveCellModal} className="space-y-5">
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme.textMuted}`}>النتيجة (رقم)</label>
                      <input type="number" step="0.01" required value={cellEditModal.result} onChange={(e) => setCellEditModal({...cellEditModal, result: e.target.value})} className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-4 py-4 transition-all ${theme.ring} text-2xl font-black text-center`} />
                    </div>
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme.textMuted}`}>التاريخ</label>
                      <input type="date" required value={cellEditModal.date} onChange={(e) => setCellEditModal({...cellEditModal, date: e.target.value})} className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-4 py-3 transition-all ${theme.ring}`} style={{ colorScheme: isDarkMode ? 'dark' : 'light' }} />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="submit" className={`flex-2 w-full ${theme.successBtn} py-3 rounded-xl font-bold transition-all shadow-lg`}>حفظ</button>
                      {cellEditModal.recordId && (
                        <button type="button" onClick={deleteCellRecord} className={`flex-1 bg-red-600 hover:bg-red-500 text-white shadow-lg py-3 rounded-xl font-bold transition-all`} title="حذف هذا الرقم"><Trash2 className="w-5 h-5 mx-auto" /></button>
                      )}
                      <button type="button" onClick={() => setCellEditModal(null)} className={`flex-1 bg-current/10 hover:bg-current/20 backdrop-blur-md py-3 rounded-xl font-bold transition-all`}>إلغاء</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {recordToDelete && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
                <div className={`${theme.card} p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-sm w-full border ${theme.border} transform transition-all`}>
                  <h3 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${theme.dangerText} drop-shadow-md`}>
                    <AlertTriangle className="w-8 h-8" /> حذف السجل
                  </h3>
                  <p className={`mb-8 text-base font-medium leading-relaxed ${theme.textMuted}`}>هل أنت متأكد من حذف هذا الرقم من سجلات اللاعب؟</p>
                  <div className="flex gap-4">
                    <button onClick={confirmDeleteRecord} className="flex-1 bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] py-3 rounded-xl font-bold transition-all">حذف الرقم</button>
                    <button onClick={() => setRecordToDelete(null)} className={`flex-1 bg-current/10 hover:bg-current/20 backdrop-blur-md py-3 rounded-xl font-bold transition-all`}>إلغاء</button>
                  </div>
                </div>
              </div>
            )}

            {playerToDelete && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                <div className={`${theme.card} p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-sm w-full border ${theme.border} transform transition-all`}>
                  <h3 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${theme.dangerText} drop-shadow-md`}>
                    <AlertTriangle className="w-8 h-8" /> تأكيد الحذف
                  </h3>
                  <p className={`mb-8 text-base font-medium leading-relaxed ${theme.textMuted}`}>هل أنت متأكد من حذف هذا اللاعب؟ سيتم مسح جميع أرقامه المسجلة نهائياً.</p>
                  <div className="flex gap-4">
                    <button onClick={confirmDeletePlayer} className="flex-1 bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] py-3 rounded-xl font-bold transition-all">نعم، احذف</button>
                    <button onClick={() => setPlayerToDelete(null)} className={`flex-1 bg-current/10 hover:bg-current/20 backdrop-blur-md py-3 rounded-xl font-bold transition-all`}>إلغاء</button>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </>
  );
}

function RadarChart({ records, playerId, theme }: { records: AthleteRecord[], playerId: string, theme: any }) {
  const categories = ['السرعة', 'الوثب', 'القوة'];
  
  const stats = categories.map(cat => {
    const teamCatRecords = records.filter(r => r.category === cat);
    if (teamCatRecords.length === 0) return { category: cat, score: 0 };
    const playerCatRecords = teamCatRecords.filter(r => r.playerId === playerId);
    if (playerCatRecords.length === 0) return { category: cat, score: 0 };

    const tests = [...new Set(teamCatRecords.map(r => r.test))];
    let totalPercent = 0;
    let testsCount = 0;

    tests.forEach(test => {
      const teamTestRecs = teamCatRecords.filter(r => r.test === test).map(r => r.result);
      const playerTestRecs = playerCatRecords.filter(r => r.test === test).map(r => r.result);
      
      if (playerTestRecs.length > 0) {
        const isSpeed = cat === 'السرعة';
        const teamBest = isSpeed ? Math.min(...teamTestRecs) : Math.max(...teamTestRecs);
        const playerBest = isSpeed ? Math.min(...playerTestRecs) : Math.max(...playerTestRecs);
        
        let percent = 0;
        if (isSpeed) {
           percent = (teamBest / playerBest) * 100;
        } else {
           percent = (playerBest / teamBest) * 100;
        }
        totalPercent += Math.min(percent, 100);
        testsCount++;
      }
    });

    const finalScore = testsCount > 0 ? (totalPercent / testsCount) : 0;
    return { category: cat, score: finalScore };
  });

  const size = 300;
  const center = size / 2;
  const radius = 100;
  const numPoints = 3;

  const getCoordinates = (value: number, index: number) => {
    const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
    const r = (value / 100) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const dataPoints = stats.map((s, i) => `${getCoordinates(s.score, i).x},${getCoordinates(s.score, i).y}`).join(' ');

  const renderGrid = () => {
    return [20, 40, 60, 80, 100].map(level => (
      <polygon 
        key={level} 
        points={stats.map((_, i) => `${getCoordinates(level, i).x},${getCoordinates(level, i).y}`).join(' ')} 
        fill="none" stroke="currentColor" strokeWidth="1" className="opacity-20" 
      />
    ));
  };

  const renderAxes = () => {
    return stats.map((s, i) => {
      const coords = getCoordinates(100, i);
      return (
        <g key={i}>
          <line x1={center} y1={center} x2={coords.x} y2={coords.y} stroke="currentColor" strokeWidth="1" className="opacity-30" />
          <text
            x={center + (radius + 28) * Math.cos((Math.PI * 2 * i) / numPoints - Math.PI / 2)}
            y={center + (radius + 22) * Math.sin((Math.PI * 2 * i) / numPoints - Math.PI / 2)}
            textAnchor="middle" alignmentBaseline="middle" className="text-base font-black fill-current drop-shadow-md"
          >
            {s.category} ({Math.round(s.score)}%)
          </text>
        </g>
      );
    });
  };

  return (
    <div className={`relative w-[300px] h-[300px] ${theme.text}`}>
      <svg width={size} height={size} className="overflow-visible">
        {renderGrid()}
        {renderAxes()}
        {stats.some(s => s.score > 0) ? (
          <>
            <polygon points={dataPoints} fill={theme.radarFill} stroke={theme.radarStroke} strokeWidth="3.5" style={{ filter: `drop-shadow(0 0 12px ${theme.radarStroke})` }} />
            {stats.map((s, i) => <circle key={i} cx={getCoordinates(s.score, i).x} cy={getCoordinates(s.score, i).y} r="6" fill="#fff" stroke={theme.radarStroke} strokeWidth="2.5" style={{ filter: `drop-shadow(0 0 5px ${theme.radarStroke})` }} />)}
          </>
        ) : (
          <text x={center} y={center} textAnchor="middle" className="text-sm opacity-60 font-bold fill-current">البيانات غير كافية لرسم البوصلة</text>
        )}
      </svg>
    </div>
  );
}

function SimpleLineChart({ data, isSpeedTest, theme }: { data: AthleteRecord[], isSpeedTest: boolean, theme: any }) {
  if (data.length < 2) {
    return (
      <div className={`h-[200px] w-full flex items-center justify-center rounded-xl border border-dashed border-current/20 bg-current/5`}>
        <p className={`text-sm font-bold opacity-70`}>يجب تسجيل رقمين على الأقل في هذا الاختبار لظهور منحنى التطور المضيء</p>
      </div>
    );
  }

  const values = data.map(d => d.result);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const padding = (maxVal - minVal) * 0.2 || minVal * 0.1;
  const chartMin = minVal - padding;
  const chartMax = maxVal + padding;
  const range = chartMax - chartMin;
  const height = 180; 

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - (((d.result - chartMin) / range) * height);
    return { x, y, value: d.result, date: d.date };
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const strokeColor = isSpeedTest ? theme.chartSpeed : theme.chartPower;

  return (
    <div className="relative h-[220px] w-full mt-4 mb-2">
      <svg className="w-full h-[180px] overflow-visible" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="0" stroke="currentColor" className="opacity-10" strokeWidth="1" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" className="opacity-10" strokeWidth="1" />
        <line x1="0" y1="100%" x2="100%" y2="100%" stroke="currentColor" className="opacity-20" strokeWidth="1" />

        <path d={pathData} fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ filter: `drop-shadow(0 0 10px ${strokeColor})` }} />

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={`${p.x}%`} cy={p.y} r="6" fill="#fff" stroke={strokeColor} strokeWidth="3" className="transition-all duration-300 hover:r-8" style={{ filter: `drop-shadow(0 0 8px ${strokeColor})` }} />
            <text x={`${p.x}%`} y={p.y - 18} textAnchor="middle" fontSize="13" className="font-black fill-current drop-shadow-md opacity-90">{p.value}</text>
            <text x={`${p.x}%`} y={height + 20} textAnchor="middle" fontSize="11" className="fill-current opacity-70 font-bold">{p.date.substring(5)}</text>
          </g>
        ))}
      </svg>
      <div className={`absolute top-0 right-0 -mt-8 text-xs font-bold ${theme.textMuted} bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm border border-current/10`}>
        {isSpeedTest ? '⚡ (الرقم الأقل يعني سرعة أفضل)' : '💪 (الرقم الأعلى يعني أداء أفضل)'}
      </div>
    </div>
  );
}