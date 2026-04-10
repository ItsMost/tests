import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UserPlus, User, Activity, TrendingUp, Save, Trash2, Calendar, Sun, Moon, Target, Shield, Edit2, Check, X, AlertTriangle, Plus, Search, Info } from 'lucide-react';
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
  gender: string;
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

// --- المعايير العالمية (Benchmarks) للسرعة والوثب والقوة (للبالغين 20+ سنة) ---
const BENCHMARKS_ELEC: Record<string, Record<string, number>> = {
  male: {
    '10 متر': 1.65, '20 متر': 3.05, '20 متر طائر': 2.15, '30 متر': 4.10, '30 متر طائر': 3.15, '40 متر': 5.10, '50 متر': 6.10, '60 متر': 7.10, '80 متر': 9.20, '100 متر': 10.80, '150 متر': 16.20, '200 متر': 21.50, '300 متر': 34.00, '400 متر': 48.00,
    'وثب طويل': 7.20, 'وثب ثلاثي': 15.00, 'ثلاثي من الثبات': 9.50, 'وثب من ثبات': 2.90,
    'Squat': 150, 'Quarter Squat': 240, 'Clean': 100, 'Bench press': 100
  },
  female: {
    '10 متر': 1.85, '20 متر': 3.35, '20 متر طائر': 2.45, '30 متر': 4.60, '30 متر طائر': 3.55, '40 متر': 5.60, '50 متر': 6.70, '60 متر': 7.80, '80 متر': 10.20, '100 متر': 12.20, '150 متر': 18.70, '200 متر': 24.50, '300 متر': 39.00, '400 متر': 55.00,
    'وثب طويل': 5.80, 'وثب ثلاثي': 12.50, 'ثلاثي من الثبات': 7.50, 'وثب من ثبات': 2.40,
    'Squat': 100, 'Quarter Squat': 160, 'Clean': 70, 'Bench press': 60
  }
};

const BENCHMARKS_MANUAL: Record<string, Record<string, number>> = {
  male: {
    ...BENCHMARKS_ELEC.male,
    '10 متر': 1.40, '20 متر': 2.80, '20 متر طائر': 1.90, '30 متر': 3.85, '30 متر طائر': 2.90, '40 متر': 4.85, '50 متر': 5.85, '60 متر': 6.85, '80 متر': 8.95, '100 متر': 10.55, '150 متر': 15.95, '200 متر': 21.25, '300 متر': 33.75, '400 متر': 47.75,
  },
  female: {
    ...BENCHMARKS_ELEC.female,
    '10 متر': 1.60, '20 متر': 3.10, '20 متر طائر': 2.20, '30 متر': 4.35, '30 متر طائر': 3.30, '40 متر': 5.35, '50 متر': 6.45, '60 متر': 7.55, '80 متر': 9.95, '100 متر': 11.95, '150 متر': 18.45, '200 متر': 24.25, '300 متر': 38.75, '400 متر': 54.75,
  }
};

// --- دالة استخراج معاملات السن ---
function getAgeFactors(age: number) {
  let sFac = 1, pFac = 1;
  if (age < 12) { sFac = 1.30; pFac = 0.40; }
  else if (age <= 13) { sFac = 1.20; pFac = 0.55; }
  else if (age <= 15) { sFac = 1.12; pFac = 0.70; }
  else if (age <= 17) { sFac = 1.06; pFac = 0.85; }
  else if (age <= 19) { sFac = 1.02; pFac = 0.95; }
  return { speed: sFac, power: pFac };
}

// --- دالة حساب السكور للبوصلة ---
function getBenchmarkScore(test: string, category: string, result: number, gender: string, age: number): number {
  const base = BENCHMARKS_MANUAL[gender]?.[test] || BENCHMARKS_MANUAL['male']?.[test]; 
  if (!base) return 0;

  const { speed: sFac, power: pFac } = getAgeFactors(age);
  const target = category === 'السرعة' ? (base * sFac) : (base * pFac);

  let score = 0;
  if (category === 'السرعة') {
    score = (target / result) * 100; 
  } else {
    score = (result / target) * 100; 
  }
  return Math.min(Math.max(score, 0), 120); 
}

// --- إعدادات الثيمات (CSS Patterns) ---
const THEMES: Record<string, any> = {
  solo: {
    name: 'سولو ليفيلينج', icon: '🗡️',
    light: {
      bgPattern: 'bg-indigo-50 bg-[linear-gradient(to_right,#4f46e515_1px,transparent_1px),linear-gradient(to_bottom,#4f46e515_1px,transparent_1px)] bg-[size:40px_40px]',
      card: 'bg-white/90 backdrop-blur-sm shadow-xl border-indigo-100',
      text: 'text-slate-800', textMuted: 'text-slate-500',
      border: 'border-indigo-200', inputBg: 'bg-white',
      primaryBtn: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md border-indigo-700',
      primaryText: 'text-indigo-700', 
      successBtn: 'bg-purple-600 hover:bg-purple-700 text-white shadow-md',
      successText: 'text-purple-600', dangerText: 'text-red-500', dangerBg: 'hover:bg-red-50',
      chartSpeed: '#8b5cf6', chartPower: '#4f46e5', header: 'bg-indigo-700 text-white shadow-md',
      ring: 'focus:ring-indigo-500', radarFill: 'rgba(79, 70, 229, 0.2)', radarStroke: '#4f46e5'
    },
    dark: {
      bgPattern: 'bg-[#090b14] bg-[linear-gradient(to_right,#4f46e515_1px,transparent_1px),linear-gradient(to_bottom,#4f46e515_1px,transparent_1px)] bg-[size:40px_40px]',
      card: 'bg-[#111625]/95 backdrop-blur-sm shadow-2xl border-indigo-500/20',
      text: 'text-indigo-50', textMuted: 'text-indigo-300/70',
      border: 'border-indigo-500/30', inputBg: 'bg-black/50',
      primaryBtn: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] border-indigo-500',
      primaryText: 'text-indigo-400', 
      successBtn: 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]',
      successText: 'text-purple-400', dangerText: 'text-rose-500', dangerBg: 'hover:bg-rose-900/30',
      chartSpeed: '#a855f7', chartPower: '#6366f1', header: 'bg-[#090b14] border-b border-indigo-500/30 text-indigo-400 shadow-md',
      ring: 'focus:ring-indigo-500', radarFill: 'rgba(99, 102, 241, 0.3)', radarStroke: '#818cf8'
    }
  },
  bluelock: {
    name: 'بلو لوك', icon: '⚽',
    light: {
      bgPattern: 'bg-cyan-50 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:30px_30px]',
      card: 'bg-white/90 backdrop-blur-sm shadow-xl border-cyan-100',
      text: 'text-slate-800', textMuted: 'text-slate-500',
      border: 'border-cyan-200', inputBg: 'bg-white',
      primaryBtn: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md border-emerald-600',
      primaryText: 'text-emerald-700', 
      successBtn: 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-md',
      successText: 'text-cyan-700', dangerText: 'text-rose-500', dangerBg: 'hover:bg-rose-50',
      chartSpeed: '#10b981', chartPower: '#06b6d4', header: 'bg-slate-900 text-emerald-400 shadow-md',
      ring: 'focus:ring-emerald-500', radarFill: 'rgba(16, 185, 129, 0.2)', radarStroke: '#10b981'
    },
    dark: {
      bgPattern: 'bg-[#020617] bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:30px_30px]',
      card: 'bg-[#0f172a]/95 backdrop-blur-sm shadow-2xl border-emerald-500/20',
      text: 'text-white', textMuted: 'text-emerald-200/70',
      border: 'border-emerald-500/30', inputBg: 'bg-black/50',
      primaryBtn: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] border-emerald-400',
      primaryText: 'text-emerald-400', 
      successBtn: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]',
      successText: 'text-cyan-400', dangerText: 'text-rose-500', dangerBg: 'hover:bg-rose-900/30',
      chartSpeed: '#10b981', chartPower: '#06b6d4', header: 'bg-[#020617] border-b border-emerald-500/30 text-emerald-400 shadow-md',
      ring: 'focus:ring-emerald-500', radarFill: 'rgba(16, 185, 129, 0.3)', radarStroke: '#34d399'
    }
  },
  haikyuu: {
    name: 'هايكيو', icon: '🏐',
    light: {
      bgPattern: 'bg-orange-50 bg-[radial-gradient(#ea580c20_2px,transparent_2px)] bg-[size:24px_24px]',
      card: 'bg-white/90 backdrop-blur-sm shadow-xl border-orange-100',
      text: 'text-slate-800', textMuted: 'text-slate-600',
      border: 'border-orange-200', inputBg: 'bg-white',
      primaryBtn: 'bg-orange-500 hover:bg-orange-600 text-white shadow-md border-orange-600',
      primaryText: 'text-orange-700', 
      successBtn: 'bg-amber-500 hover:bg-amber-600 text-white shadow-md',
      successText: 'text-amber-700', dangerText: 'text-red-500', dangerBg: 'hover:bg-red-50',
      chartSpeed: '#f97316', chartPower: '#f59e0b', header: 'bg-orange-600 text-white shadow-md',
      ring: 'focus:ring-orange-500', radarFill: 'rgba(249, 115, 22, 0.2)', radarStroke: '#f97316'
    },
    dark: {
      bgPattern: 'bg-zinc-950 bg-[radial-gradient(#ea580c20_2px,transparent_2px)] bg-[size:24px_24px]',
      card: 'bg-zinc-900/95 backdrop-blur-sm shadow-2xl border-orange-500/20',
      text: 'text-orange-50', textMuted: 'text-orange-200/80',
      border: 'border-orange-500/30', inputBg: 'bg-black/50',
      primaryBtn: 'bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.3)] border-orange-500',
      primaryText: 'text-orange-500', 
      successBtn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(217,119,6,0.3)]',
      successText: 'text-amber-500', dangerText: 'text-red-500', dangerBg: 'hover:bg-red-900/30',
      chartSpeed: '#f97316', chartPower: '#f59e0b', header: 'bg-zinc-950 border-b border-orange-500/30 text-orange-500 shadow-md',
      ring: 'focus:ring-orange-500', radarFill: 'rgba(249, 115, 22, 0.3)', radarStroke: '#fb923c'
    }
  },
  kuroko: {
    name: 'كوروكو', icon: '🏀',
    light: {
      bgPattern: 'bg-red-50 bg-[repeating-linear-gradient(45deg,#dc262610_0,#dc262610_2px,transparent_2px,transparent_12px)]',
      card: 'bg-white/90 backdrop-blur-sm shadow-xl border-red-100',
      text: 'text-slate-800', textMuted: 'text-slate-600',
      border: 'border-red-200', inputBg: 'bg-white',
      primaryBtn: 'bg-red-600 hover:bg-red-700 text-white shadow-md border-red-700',
      primaryText: 'text-red-700', 
      successBtn: 'bg-orange-600 hover:bg-orange-700 text-white shadow-md',
      successText: 'text-orange-700', dangerText: 'text-neutral-500', dangerBg: 'hover:bg-neutral-100',
      chartSpeed: '#dc2626', chartPower: '#ea580c', header: 'bg-red-700 text-white shadow-md',
      ring: 'focus:ring-red-500', radarFill: 'rgba(220, 38, 38, 0.2)', radarStroke: '#dc2626'
    },
    dark: {
      bgPattern: 'bg-black bg-[repeating-linear-gradient(45deg,#dc262615_0,#dc262615_2px,transparent_2px,transparent_12px)]',
      card: 'bg-neutral-900/95 backdrop-blur-sm shadow-2xl border-red-600/20',
      text: 'text-red-50', textMuted: 'text-red-200/70',
      border: 'border-red-600/30', inputBg: 'bg-black/50',
      primaryBtn: 'bg-red-700 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(185,28,28,0.3)] border-red-600',
      primaryText: 'text-red-500', 
      successBtn: 'bg-orange-700 hover:bg-orange-600 text-white shadow-[0_0_15px_rgba(194,65,12,0.3)]',
      successText: 'text-orange-500', dangerText: 'text-neutral-400', dangerBg: 'hover:bg-neutral-800',
      chartSpeed: '#dc2626', chartPower: '#ea580c', header: 'bg-black border-b border-red-600/30 text-red-500 shadow-md',
      ring: 'focus:ring-red-600', radarFill: 'rgba(220, 38, 38, 0.3)', radarStroke: '#ef4444'
    }
  }
};

const DEFAULT_TEST_CATEGORIES: TestCategories = {
  'السرعة': ['10 متر', '20 متر', '20 متر طائر', '30 متر', '30 متر طائر', '40 متر', '50 متر', '60 متر', '80 متر', '100 متر', '150 متر', '200 متر', '300 متر', '400 متر'],
  'الوثب': ['وثب طويل', 'وثب ثلاثي', 'ثلاثي من الثبات', 'وثب من ثبات'],
  'القوة': ['Quarter Squat', 'Squat', 'Clean', 'Bench press']
};

const PLAYER_SPECIALTIES = ['100 متر', '200 متر', '400 متر', 'وثب طويل', 'وثب ثلاثي', 'عام'];

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [themeKey, setThemeKey] = useState<string>('solo'); 
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<string>('entry'); 

  const [players, setPlayers] = useState<Player[]>([]);
  const [records, setRecords] = useState<AthleteRecord[]>([]);
  const [testCategories, setTestCategories] = useState<TestCategories>(DEFAULT_TEST_CATEGORIES);
  
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); 
  
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState<boolean>(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editPlayerName, setEditPlayerName] = useState<string>('');
  const [editPlayerYear, setEditPlayerYear] = useState<string>('');
  const [editPlayerSpecialty, setEditPlayerSpecialty] = useState<string>(PLAYER_SPECIALTIES[0]);
  const [editPlayerGender, setEditPlayerGender] = useState<string>('male');
  const [nameError, setNameError] = useState<string>('');

  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);
  const [newTestCategory, setNewTestCategory] = useState<string>('السرعة');
  const [newTestName, setNewTestName] = useState<string>('');

  const [playerToDelete, setPlayerToDelete] = useState<string | null>(null);

  // --- حالات إدخال وتعديل السجلات المتطورة ---
  const [massEntryMode, setMassEntryMode] = useState<'new' | 'edit' | null>(null);
  const [massEditValues, setMassEditValues] = useState<Record<string, { result: string, id: string | null }>>({});
  const [massEditDate, setMassEditDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // --- حالات التبويبات للرسومات ---
  const [chartTab, setChartTab] = useState<string>('overall'); 
  const [reportCategory, setReportCategory] = useState<string>('السرعة');
  const [reportTest, setReportTest] = useState<string>(testCategories['السرعة'][0]);

  // --- حالات صفحة Benchmarks المراجع ---
  const [benchmarkAge, setBenchmarkAge] = useState<number>(20);

  const theme = THEMES[themeKey][isDarkMode ? 'dark' : 'light'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: settingsData } = await supabase.from('settings').select('*').eq('id', 'categories').single();
        if (settingsData && settingsData.data) setTestCategories(settingsData.data);
        else await supabase.from('settings').insert([{ id: 'categories', data: DEFAULT_TEST_CATEGORIES }]);

        const { data: playersData } = await supabase.from('players').select('*');
        if (playersData) setPlayers(playersData as Player[]);

        const { data: recordsData } = await supabase.from('records').select('*');
        if (recordsData) setRecords(recordsData as AthleteRecord[]);

      } catch (error) {
        console.error("Error fetching data:", error);
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
    if (testCategories[reportCategory] && !testCategories[reportCategory].includes(reportTest)) {
      setReportTest(testCategories[reportCategory][0]);
    }
  }, [reportCategory, testCategories]);

  const getBirthYear = (dobOrYear: string) => dobOrYear ? (dobOrYear.includes('-') ? dobOrYear.split('-')[0] : dobOrYear) : '';
  const calculateAge = (dobOrYear: string) => {
    const year = parseInt(getBirthYear(dobOrYear) || '0');
    return year > 0 ? new Date().getFullYear() - year : 0;
  };

  const getTestCategoryName = (testName: string, categories: TestCategories) => {
    for (const [cat, tests] of Object.entries(categories)) {
      if (tests.includes(testName)) return cat;
    }
    return 'السرعة';
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
    setEditPlayerGender('male');
    setNameError('');
    setIsPlayerModalOpen(true);
  };

  const startEditPlayerInfo = (player: Player) => {
    setEditingPlayerId(player.id);
    setEditPlayerName(player.name);
    setEditPlayerYear(getBirthYear(player.dob));
    setEditPlayerSpecialty(player.specialty || PLAYER_SPECIALTIES[0]);
    setEditPlayerGender(player.gender || 'male');
    setNameError('');
    setIsPlayerModalOpen(true);
  };

  const savePlayerModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPlayerName.trim() || !editPlayerYear) return;
    
    // منع تكرار الأسماء
    const isDuplicate = players.some(p => p.name.trim().toLowerCase() === editPlayerName.trim().toLowerCase() && p.id !== editingPlayerId);
    if (isDuplicate) {
      setNameError('هذا الاسم مسجل بالفعل! الرجاء اختيار اسم مختلف.');
      return;
    }

    if (editingPlayerId) {
      setPlayers(players.map((p: Player) => p.id === editingPlayerId ? { ...p, name: editPlayerName.trim(), dob: editPlayerYear, specialty: editPlayerSpecialty, gender: editPlayerGender } : p));
      await supabase.from('players').update({ name: editPlayerName.trim(), dob: editPlayerYear, specialty: editPlayerSpecialty, gender: editPlayerGender }).eq('id', editingPlayerId);
    } else {
      const newPlayer: Player = { 
        id: Date.now().toString(), name: editPlayerName.trim(), dob: editPlayerYear, specialty: editPlayerSpecialty, gender: editPlayerGender
      };
      setPlayers([...players, newPlayer]);
      setActivePlayerId(newPlayer.id);
      await supabase.from('players').insert([newPlayer]);
    }
    setIsPlayerModalOpen(false);
  };

  const confirmDeletePlayer = async () => {
    if (playerToDelete) {
      setPlayers(players.filter((p: Player) => p.id !== playerToDelete));
      setRecords(records.filter((r: AthleteRecord) => r.playerId !== playerToDelete));
      if (activePlayerId === playerToDelete) setActivePlayerId(null);
      await supabase.from('players').delete().eq('id', playerToDelete);
      await supabase.from('records').delete().eq('playerId', playerToDelete);
      setPlayerToDelete(null);
    }
  };

  // --- دوال الجلسات وتصحيح الأرقام ---
  const startMassNew = () => {
    if (!activePlayerId) return;
    const initialValues: Record<string, { result: string, id: string | null }> = {};
    Object.values(testCategories).flat().forEach(testName => {
      initialValues[testName] = { result: '', id: null };
    });
    setMassEditValues(initialValues);
    setMassEditDate(new Date().toISOString().split('T')[0]);
    setMassEntryMode('new');
  };

  const startMassEdit = () => {
    if (!activePlayerId) return;
    const initialValues: Record<string, { result: string, id: string | null }> = {};
    Object.values(testCategories).flat().forEach(testName => {
      const pRecords = records.filter(r => r.playerId === activePlayerId && r.test === testName);
      if (pRecords.length > 0) {
        const latest = pRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        initialValues[testName] = { result: latest.result.toString(), id: latest.id };
      } else {
        initialValues[testName] = { result: '', id: null };
      }
    });
    setMassEditValues(initialValues);
    setMassEditDate(new Date().toISOString().split('T')[0]);
    setMassEntryMode('edit');
  };

  const handleMassEditChange = (testName: string, value: string) => {
    setMassEditValues(prev => ({ ...prev, [testName]: { ...prev[testName], result: value } }));
  };

  const saveMassAction = async () => {
    if (!activePlayerId) return;
    const newRecordsList = [...records];
    const updatesToSupabase: any[] = [];
    const insertsToSupabase: any[] = [];

    for (const [testName, data] of Object.entries(massEditValues)) {
      if (data.result.trim() === '') continue; 
      const numVal = parseFloat(data.result);
      const cat = getTestCategoryName(testName, testCategories);

      if (massEntryMode === 'edit' && data.id) {
        const index = newRecordsList.findIndex(r => r.id === data.id);
        if (index > -1) {
          newRecordsList[index].result = numVal;
          newRecordsList[index].date = massEditDate;
        }
        updatesToSupabase.push({ id: data.id, result: numVal, date: massEditDate });
      } else {
        const newRec = {
          id: Date.now().toString() + Math.random().toString(36).substring(7),
          playerId: activePlayerId,
          category: cat, test: testName, result: numVal, date: massEditDate
        };
        newRecordsList.push(newRec);
        insertsToSupabase.push(newRec);
      }
    }

    setRecords(newRecordsList);
    for (const up of updatesToSupabase) {
      await supabase.from('records').update({ result: up.result, date: up.date }).eq('id', up.id);
    }
    if (insertsToSupabase.length > 0) {
      await supabase.from('records').insert(insertsToSupabase);
    }
    setMassEntryMode(null);
  };

  const activePlayer = useMemo(() => players.find((p: Player) => p.id === activePlayerId), [players, activePlayerId]);

  const filteredPlayersList = useMemo(() => {
    return players.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [players, searchQuery]);

  const getLatestTestValue = useCallback((playerId: string, testName: string) => {
    const pRecords = records.filter(r => r.playerId === playerId && r.test === testName);
    if (pRecords.length === 0) return '-';
    return pRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].result;
  }, [records]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white" dir="rtl">
        <Activity className="w-16 h-16 animate-pulse text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
        * { font-family: 'Cairo', sans-serif; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.3); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(100, 116, 139, 0.8); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .gpu-accelerate { transform: translateZ(0); will-change: transform, opacity; }
      `}</style>

      <div className={`min-h-screen transition-colors duration-500 ${theme.bgPattern} gpu-accelerate`} dir="rtl">
        <div className={`min-h-screen ${theme.text} flex flex-col gpu-accelerate`}>
          
          {/* --- Header --- */}
          <header className={`${theme.header} py-4 px-4 sm:px-6 sticky top-0 z-40`}>
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8" />
                <h1 className="text-2xl font-bold tracking-wide">متتبع أداء اللاعبين</h1>
              </div>
              
              <div className="flex items-center gap-4 bg-black/10 dark:bg-white/5 p-1.5 rounded-2xl border border-current/10">
                <div className="flex gap-1 border-l border-current/20 pl-4">
                  {Object.keys(THEMES).map((key: string) => {
                    const t = THEMES[key];
                    return (
                      <button key={key} onClick={() => setThemeKey(key)} title={t.name} className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-transform ${themeKey === key ? 'bg-current/20 scale-110' : 'opacity-60 hover:opacity-100 hover:bg-current/10'}`}>
                        {t.icon}
                      </button>
                    )
                  })}
                </div>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors bg-current/10 hover:bg-current/20">
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </header>

          {/* --- Navigation --- */}
          <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 sm:gap-4 border-b border-current/10 pb-px min-w-max">
              <button onClick={() => setCurrentView('entry')} className={`flex items-center gap-2 px-6 py-3 font-bold text-sm sm:text-base rounded-t-xl transition-colors ${currentView === 'entry' ? `${theme.card} ${theme.primaryText} border-t border-x border-b-0 border-current/20 relative top-[1px]` : `opacity-60 hover:opacity-100 hover:bg-current/5`}`}>
                <Save className="w-5 h-5" /> إدارة و تسجيل البيانات
              </button>
              <button onClick={() => setCurrentView('dashboard')} className={`flex items-center gap-2 px-6 py-3 font-bold text-sm sm:text-base rounded-t-xl transition-colors ${currentView === 'dashboard' ? `${theme.card} ${theme.primaryText} border-t border-x border-b-0 border-current/20 relative top-[1px]` : `opacity-60 hover:opacity-100 hover:bg-current/5`}`}>
                <Target className="w-5 h-5" /> غرفة التحليل والرسومات
              </button>
              <button onClick={() => setCurrentView('reference')} className={`flex items-center gap-2 px-6 py-3 font-bold text-sm sm:text-base rounded-t-xl transition-colors ${currentView === 'reference' ? `${theme.card} ${theme.primaryText} border-t border-x border-b-0 border-current/20 relative top-[1px]` : `opacity-60 hover:opacity-100 hover:bg-current/5`}`}>
                <Calendar className="w-5 h-5" /> المراجع (Benchmarks)
              </button>
            </div>
          </div>

          <main className="max-w-6xl mx-auto w-full p-4 sm:p-6 pt-6 relative flex-grow pb-12">
            
            {/* ================== شاشة إدارة وتسجيل البيانات ================== */}
            {currentView === 'entry' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <div className={`lg:col-span-4 ${theme.card} p-5 sm:p-6 rounded-3xl border ${theme.border} h-fit`}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-xl font-black flex items-center gap-2 ${theme.primaryText}`}>
                      <User className="w-6 h-6" /> الفريق
                    </h2>
                    <button onClick={openAddPlayerModal} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold ${theme.primaryBtn}`}>
                      <UserPlus className="w-4 h-4" /> إضافة
                    </button>
                  </div>
                  
                  <div className="relative mb-4">
                    <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.textMuted}`} />
                    <input 
                      type="text" placeholder="بحث بالاسم..." 
                      value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full bg-black/5 border border-current/10 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none ${theme.ring}`}
                    />
                  </div>
                  
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {filteredPlayersList.length === 0 ? (
                      <div className={`text-center py-6 border border-dashed ${theme.border} rounded-xl ${theme.textMuted} text-sm bg-black/5`}>لا يوجد نتائج</div>
                    ) : (
                      filteredPlayersList.map((p: Player) => (
                        <div key={p.id} onClick={() => { setActivePlayerId(p.id); setMassEntryMode(null); }} className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${activePlayerId === p.id ? `${theme.primaryBtn} border-transparent scale-[1.02] shadow-lg` : `${theme.inputBg} ${theme.border} hover:border-current/30 hover:shadow-sm`}`}>
                          <div>
                            <span className="font-bold text-base">{p.name}</span>
                            <span className={`text-xs mt-1 block ${activePlayerId === p.id ? 'text-white/80' : theme.textMuted}`}>
                              {p.gender === 'female' ? 'بنت' : 'ولد'} • {p.specialty ? `لاعب ${p.specialty}` : 'عام'} • {calculateAge(p.dob || '')} سنة
                            </span>
                          </div>
                          {activePlayerId === p.id ? (
                            <Activity className="w-5 h-5 mr-3" />
                          ) : (
                            <div className="flex gap-1.5 opacity-60">
                              <button onClick={(e) => { e.stopPropagation(); startEditPlayerInfo(p); }} className="p-1 hover:text-blue-500"><Edit2 className="w-4 h-4"/></button>
                              <button onClick={(e) => { e.stopPropagation(); setPlayerToDelete(p.id); }} className="p-1 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className={`lg:col-span-8 ${theme.card} p-5 sm:p-8 rounded-3xl border ${theme.border}`}>
                  {!activePlayerId ? (
                    <div className={`flex flex-col items-center justify-center h-full min-h-[400px] ${theme.textMuted} text-center border border-dashed ${theme.border} rounded-3xl bg-black/5`}>
                      <User className="w-20 h-20 opacity-20 mb-4" />
                      <p className="font-bold text-lg">اختر لاعباً من القائمة لعرض أرقامه وتسجيل جلسات جديدة</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-current/10 pb-6">
                        <div>
                          <h2 className={`text-2xl font-black mb-1 ${theme.primaryText}`}>{activePlayer?.name}</h2>
                          <div className={`text-sm font-bold ${theme.textMuted} bg-black/5 px-3 py-1 rounded-lg inline-block`}>
                            {activePlayer?.gender === 'female' ? 'بنت' : 'ولد'} • {activePlayer?.specialty ? `لاعب ${activePlayer.specialty}` : 'عام'} • العمر: {calculateAge(activePlayer?.dob || '')}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {!massEntryMode ? (
                            <>
                              <button onClick={startMassNew} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm ${theme.successBtn} shadow-lg hover:scale-105 transition-transform`}>
                                <Plus className="w-4 h-4" /> أرقام جلسة جديدة 
                              </button>
                              <button onClick={startMassEdit} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm bg-black/5 hover:bg-black/10 transition-colors`}>
                                <Edit2 className="w-4 h-4 opacity-60" /> تصحيح آخر أرقام 
                              </button>
                            </>
                          ) : (
                            <button onClick={() => setMassEntryMode(null)} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors`}>
                              <X className="w-4 h-4" /> إلغاء {massEntryMode === 'new' ? 'التسجيل' : 'التصحيح'}
                            </button>
                          )}
                        </div>
                      </div>

                      {massEntryMode && (
                        <div className="mb-6 p-5 bg-black/5 rounded-2xl border border-current/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-inner">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-full ${massEntryMode === 'new' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>
                              {massEntryMode === 'new' ? <Plus className="w-6 h-6" /> : <Edit2 className="w-6 h-6" />}
                            </div>
                            <div>
                              <h4 className="font-black text-lg">{massEntryMode === 'new' ? 'تسجيل أرقام جلسة جديدة' : 'تصحيح آخر أرقام مسجلة'}</h4>
                              <p className={`text-xs ${theme.textMuted}`}>{massEntryMode === 'new' ? 'أدخل أرقام الاختبارات. سيتم حفظها كجلسة جديدة في تاريخ اللاعب (لرسم منحنى التطور).' : 'استخدم هذا لتصحيح الأرقام الخاطئة التي تم إدخالها مسبقاً.'}</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0 w-full sm:w-auto">
                            <label className="block text-xs font-bold mb-1 opacity-70 flex items-center gap-1"><Calendar className="w-3 h-3" /> تاريخ الجلسة:</label>
                            <input type="date" value={massEditDate} onChange={(e) => setMassEditDate(e.target.value)} className={`bg-white/50 dark:bg-black/50 border border-current/20 px-3 py-2 rounded-xl font-bold outline-none text-current cursor-pointer w-full focus:ring-2 ${theme.ring}`} style={{ colorScheme: isDarkMode ? 'dark' : 'light' }} />
                          </div>
                        </div>
                      )}

                      <div className="space-y-8">
                        {Object.entries(testCategories).map(([catName, tests]) => (
                          <div key={catName}>
                            <div className="flex justify-between items-center mb-4">
                              <h3 className={`text-lg font-black flex items-center gap-2 opacity-80 border-r-4 ${theme.border} pr-3`}>
                                {catName}
                              </h3>
                              <button onClick={() => { setNewTestCategory(catName); setIsTestModalOpen(true); }} className="text-xs font-bold opacity-50 hover:opacity-100 flex items-center gap-1">
                                <Plus className="w-3 h-3"/> إضافة اختبار
                              </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              {tests.map(test => {
                                if (massEntryMode) {
                                  const val = massEditValues[test]?.result || '';
                                  return (
                                    <div key={test} className={`${theme.inputBg} border ${theme.border} rounded-2xl p-3 flex flex-col focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-transparent ${theme.ring} transition-all shadow-sm`}>
                                      <label className="text-[11px] font-bold opacity-60 mb-1.5 truncate text-center">{test}</label>
                                      <input 
                                        type="number" step="0.01" placeholder="-" 
                                        value={val} onChange={(e) => handleMassEditChange(test, e.target.value)}
                                        className="w-full bg-black/5 rounded-lg py-2 border-none font-black text-xl outline-none text-center" 
                                      />
                                    </div>
                                  );
                                } else {
                                  const val = getLatestTestValue(activePlayerId, test);
                                  return (
                                    <div key={test} className={`${theme.inputBg} border ${theme.border} rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm`}>
                                      <span className="text-[11px] font-bold opacity-60 mb-1 text-center line-clamp-1">{test}</span>
                                      <span className={`font-black text-xl ${val !== '-' ? theme.primaryText : 'opacity-20'}`}>{val}</span>
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      {massEntryMode && (
                        <div className="mt-8 pt-6 border-t border-current/10">
                          <button onClick={saveMassAction} className={`w-full ${massEntryMode === 'new' ? theme.successBtn : theme.primaryBtn} py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform shadow-xl`}>
                            <Save className="w-6 h-6" /> {massEntryMode === 'new' ? 'تسجيل جلسة الأرقام الجديدة' : 'حفظ التصحيحات'}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ================== شاشة التحليل والرسومات ================== */}
            {currentView === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <div className={`lg:col-span-4 ${theme.card} p-5 rounded-3xl border ${theme.border} h-fit`}>
                  <h3 className={`font-bold mb-4 ${theme.textMuted} flex items-center gap-2`}><Target className="w-5 h-5"/> اختر لاعباً للتحليل:</h3>
                  <div className="relative mb-4">
                    <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.textMuted}`} />
                    <input type="text" placeholder="بحث بالاسم..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full bg-black/5 border border-current/10 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none ${theme.ring}`} />
                  </div>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {filteredPlayersList.map((p: Player) => (
                      <button key={p.id} onClick={() => setActivePlayerId(p.id)} className={`w-full text-right px-4 py-3 rounded-2xl transition-all ${activePlayerId === p.id ? `${theme.primaryBtn} scale-[1.02] shadow-md` : `${theme.inputBg} ${theme.textMuted} hover:${theme.primaryText} border ${theme.border}`}`}>
                        <span className="font-bold block">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-8">
                  {!activePlayerId ? (
                    <div className={`${theme.card} flex flex-col items-center justify-center h-96 rounded-3xl border border-dashed ${theme.border} ${theme.textMuted} bg-black/5`}>
                      <Target className="w-24 h-24 mb-6 opacity-30 animate-pulse" />
                      <p className="text-xl font-bold">اختر لاعباً لفتح غرفة التحليل الخاصة به</p>
                    </div>
                  ) : (
                    <>
                      <div className={`${theme.card} p-6 sm:p-8 rounded-3xl border ${theme.border}`}>
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4 border-b border-current/10 pb-6">
                          <div>
                            <h2 className={`text-2xl font-black mb-2 flex items-center gap-2 ${theme.primaryText}`}>
                              <Shield className="w-7 h-7" /> البوصلة (مقارنة بالمعايير العالمية)
                            </h2>
                            <p className={`text-sm font-medium ${theme.textMuted}`}>توضح نسبة ما يحققه اللاعب مقارنة بالمعايير المثالية لـ (سن {calculateAge(activePlayer?.dob || '')}) للـ ({activePlayer?.gender === 'female' ? 'بنات' : 'أولاد'}).</p>
                          </div>
                        </div>
                        <div className="flex justify-center items-center">
                          <MemoizedRadarChart records={records} player={activePlayer!} testCategories={testCategories} theme={theme} calculateAge={calculateAge} />
                        </div>
                      </div>

                      <div className={`${theme.card} p-6 sm:p-8 rounded-3xl border ${theme.border}`}>
                        <h2 className={`text-2xl font-black mb-6 flex items-center gap-2 ${theme.primaryText}`}>
                          <TrendingUp className="w-7 h-7" /> منحنى التطور الزمني
                        </h2>
                        
                        <div className="flex overflow-x-auto gap-3 pb-4 mb-4 no-scrollbar border-b border-current/10">
                           <button onClick={() => setChartTab('overall')} className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${chartTab === 'overall' ? theme.primaryBtn : 'bg-black/5 hover:bg-black/10 border border-current/10'}`}>تطور عام</button>
                           <button onClick={() => setChartTab('speed')} className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${chartTab === 'speed' ? theme.primaryBtn : 'bg-black/5 hover:bg-black/10 border border-current/10'}`}>تطور السرعة</button>
                           <button onClick={() => setChartTab('jump')} className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${chartTab === 'jump' ? theme.primaryBtn : 'bg-black/5 hover:bg-black/10 border border-current/10'}`}>تطور الوثب</button>
                           <button onClick={() => setChartTab('power')} className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${chartTab === 'power' ? theme.primaryBtn : 'bg-black/5 hover:bg-black/10 border border-current/10'}`}>تطور القوة</button>
                           <button onClick={() => setChartTab('specific')} className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${chartTab === 'specific' ? theme.primaryBtn : 'bg-black/5 hover:bg-black/10 border border-current/10'}`}>تفاصيل اختبار محدد</button>
                        </div>

                        {chartTab === 'specific' && (
                           <div className={`flex flex-wrap gap-4 mb-8 bg-black/5 p-4 rounded-2xl border ${theme.border}`}>
                             <div className="flex-1 min-w-[150px]">
                               <label className={`block text-xs font-bold mb-1.5 ${theme.textMuted}`}>الفئة</label>
                               <select value={reportCategory} onChange={(e) => setReportCategory(e.target.value)} className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-3 py-2 text-sm focus:outline-none ${theme.ring} [&>option]:bg-slate-800 [&>option]:text-white`}>
                                 {Object.keys(testCategories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                               </select>
                             </div>
                             <div className="flex-1 min-w-[150px]">
                               <label className={`block text-xs font-bold mb-1.5 ${theme.textMuted}`}>الاختبار</label>
                               <select value={reportTest} onChange={(e) => setReportTest(e.target.value)} className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-3 py-2 text-sm focus:outline-none ${theme.ring} [&>option]:bg-slate-800 [&>option]:text-white`}>
                                 {testCategories[reportCategory]?.map((test: string) => <option key={test} value={test}>{test}</option>)}
                               </select>
                             </div>
                           </div>
                        )}

                        <div className="mb-6 bg-black/5 p-4 rounded-2xl border border-current/10">
                          <MemoizedProgressChart 
                             records={records} 
                             player={activePlayer!} 
                             chartTab={chartTab}
                             reportCategory={reportCategory}
                             reportTest={reportTest}
                             theme={theme}
                             calculateAge={calculateAge}
                             testCategories={testCategories}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ================== شاشة لوحة المراجع الديناميكية (Benchmarks Table) ================== */}
            {currentView === 'reference' && (
              <div className={`${theme.card} p-6 sm:p-8 rounded-3xl border ${theme.border}`}>
                <div className="mb-8 border-b border-current/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <h2 className={`text-2xl font-black mb-2 flex items-center gap-2 ${theme.primaryText}`}>
                      <Calendar className="w-7 h-7" /> لوحة المراجع التدريبية
                    </h2>
                    <p className={`text-sm font-medium ${theme.textMuted}`}>الجدول يتغير تلقائياً حسب السن المختار ليعرض لك التارجت (الهدف) المطلوب لللاعبين.</p>
                  </div>
                  
                  <div className={`${theme.inputBg} p-4 rounded-2xl border ${theme.border} shadow-inner min-w-[250px]`}>
                    <label className="block text-sm font-bold mb-2 flex items-center gap-2"><Target className="w-4 h-4"/> اختر السن لعرض التارجت:</label>
                    <input 
                      type="number" min="8" max="40" 
                      value={benchmarkAge} onChange={(e) => setBenchmarkAge(parseInt(e.target.value) || 20)}
                      className={`w-full bg-black/5 border border-current/10 px-4 py-3 rounded-xl font-black text-xl text-center outline-none focus:ring-2 ${theme.ring}`} 
                    />
                  </div>
                </div>

                {/* بوكس شرح المعادلة */}
                <div className="mb-8 bg-blue-500/10 border border-blue-500/30 p-5 rounded-2xl">
                  <h4 className="font-bold flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400"><Info className="w-5 h-5"/> كيف يتم حساب الأرقام لسن {benchmarkAge}؟</h4>
                  <p className="text-sm opacity-80 mb-2">التطبيق يمتلك قاعدة بيانات للبالغين (20 سنة فأكثر)، ويقوم بضربها في مُعامل (Age Factor) لتقليل أو زيادة التارجت حسب السن.</p>
                  <ul className="text-sm font-bold list-disc list-inside px-4 space-y-1 opacity-90">
                    <li>مُعامل السرعة المُطبق لسن {benchmarkAge}: <span className="text-blue-600 dark:text-blue-400 text-lg">x{getAgeFactors(benchmarkAge).speed.toFixed(2)}</span> (يتم ضرب زمن البالغين في هذا الرقم).</li>
                    <li>مُعامل القوة/الوثب المُطبق لسن {benchmarkAge}: <span className="text-blue-600 dark:text-blue-400 text-lg">x{getAgeFactors(benchmarkAge).power.toFixed(2)}</span> (يتم ضرب وزن/مسافة البالغين في هذا الرقم).</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* جدول الأولاد الديناميكي */}
                  <div className="bg-black/5 p-4 rounded-2xl border border-current/10">
                    <h3 className="font-black text-xl mb-4 text-blue-500 border-b border-current/10 pb-2">التارجت - أولاد</h3>
                    <div className="overflow-x-auto no-scrollbar">
                      <table className="w-full text-sm text-right">
                        <thead className="opacity-60 font-bold border-b border-current/10">
                          <tr><th className="py-2">الاختبار</th><th className="text-center">يدوي (Manual)</th><th className="text-center">إلكتروني (FAT)</th></tr>
                        </thead>
                        <tbody>
                          {Object.keys(BENCHMARKS_MANUAL.male).map(test => {
                            const cat = getTestCategoryName(test, testCategories);
                            const factor = cat === 'السرعة' ? getAgeFactors(benchmarkAge).speed : getAgeFactors(benchmarkAge).power;
                            const manualVal = (BENCHMARKS_MANUAL.male[test] * factor).toFixed(2);
                            const elecVal = (BENCHMARKS_ELEC.male[test] * factor).toFixed(2);
                            
                            return (
                              <tr key={test} className="border-b border-current/5 hover:bg-black/5">
                                <td className="py-3 font-semibold">{test}</td>
                                <td className="text-center font-black text-blue-600 dark:text-blue-400">{manualVal}</td>
                                <td className="text-center opacity-60">{elecVal}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* جدول البنات الديناميكي */}
                  <div className="bg-black/5 p-4 rounded-2xl border border-current/10">
                    <h3 className="font-black text-xl mb-4 text-pink-500 border-b border-current/10 pb-2">التارجت - بنات</h3>
                    <div className="overflow-x-auto no-scrollbar">
                      <table className="w-full text-sm text-right">
                        <thead className="opacity-60 font-bold border-b border-current/10">
                          <tr><th className="py-2">الاختبار</th><th className="text-center">يدوي (Manual)</th><th className="text-center">إلكتروني (FAT)</th></tr>
                        </thead>
                        <tbody>
                          {Object.keys(BENCHMARKS_MANUAL.female).map(test => {
                            const cat = getTestCategoryName(test, testCategories);
                            const factor = cat === 'السرعة' ? getAgeFactors(benchmarkAge).speed : getAgeFactors(benchmarkAge).power;
                            const manualVal = (BENCHMARKS_MANUAL.female[test] * factor).toFixed(2);
                            const elecVal = (BENCHMARKS_ELEC.female[test] * factor).toFixed(2);

                            return (
                              <tr key={test} className="border-b border-current/5 hover:bg-black/5">
                                <td className="py-3 font-semibold">{test}</td>
                                <td className="text-center font-black text-pink-600 dark:text-pink-400">{manualVal}</td>
                                <td className="text-center opacity-60">{elecVal}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================== النوافذ المنبثقة ================== */}
            {isPlayerModalOpen && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
                <div className={`${theme.card} p-8 rounded-3xl shadow-2xl max-w-md w-full border ${theme.border}`}>
                  <h3 className={`text-2xl font-black mb-6 flex items-center gap-2 ${theme.primaryText}`}>
                    <UserPlus className="w-7 h-7" /> {editingPlayerId ? 'تعديل بيانات اللاعب' : 'إضافة لاعب جديد'}
                  </h3>
                  <form onSubmit={savePlayerModal} className="space-y-4">
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme.textMuted}`}>الاسم الثلاثي</label>
                      <input type="text" required value={editPlayerName} onChange={(e) => setEditPlayerName(e.target.value)} className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-4 py-3 focus:outline-none ${theme.ring}`} />
                      {nameError && <p className="text-red-500 text-xs font-bold mt-2">{nameError}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme.textMuted}`}>النوع</label>
                        <select value={editPlayerGender} onChange={(e) => setEditPlayerGender(e.target.value)} className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-4 py-3 focus:outline-none ${theme.ring} [&>option]:bg-slate-800 [&>option]:text-white`}>
                          <option value="male">ولد</option>
                          <option value="female">بنت</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-bold mb-2 ${theme.textMuted}`}>سنة الميلاد</label>
                        <input type="number" required min="1970" max={new Date().getFullYear()} value={editPlayerYear} onChange={(e) => setEditPlayerYear(e.target.value)} className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-4 py-3 focus:outline-none ${theme.ring}`} />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme.textMuted}`}>التخصص</label>
                      <select value={editPlayerSpecialty} onChange={(e) => setEditPlayerSpecialty(e.target.value)} className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-4 py-3 focus:outline-none ${theme.ring} [&>option]:bg-slate-800 [&>option]:text-white`}>
                        {PLAYER_SPECIALTIES.map(sp => <option key={sp} value={sp}>لاعب {sp}</option>)}
                      </select>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="submit" className={`flex-1 ${theme.primaryBtn} py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform`}>حفظ</button>
                      <button type="button" onClick={() => setIsPlayerModalOpen(false)} className={`flex-1 bg-black/10 hover:bg-black/20 py-3 rounded-xl font-bold transition-colors`}>إلغاء</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {isTestModalOpen && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
                <div className={`${theme.card} p-8 rounded-3xl shadow-2xl max-w-sm w-full border ${theme.border}`}>
                  <h3 className={`text-2xl font-black mb-6 flex items-center gap-2 ${theme.successText}`}>
                    <Plus className="w-7 h-7" /> إضافة اختبار جديد
                  </h3>
                  <form onSubmit={handleAddNewTest} className="space-y-4">
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme.textMuted}`}>اختر الفئة</label>
                      <select value={newTestCategory} onChange={(e) => setNewTestCategory(e.target.value)} className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-4 py-3 focus:outline-none ${theme.ring} [&>option]:bg-slate-800 [&>option]:text-white`}>
                        {Object.keys(testCategories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme.textMuted}`}>اسم الاختبار</label>
                      <input type="text" required placeholder="مثال: قفز حواجز..." value={newTestName} onChange={(e) => setNewTestName(e.target.value)} className={`w-full border ${theme.border} ${theme.inputBg} rounded-xl px-4 py-3 focus:outline-none ${theme.ring}`} />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="submit" className={`flex-1 ${theme.successBtn} py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform`}>إضافة</button>
                      <button type="button" onClick={() => setIsTestModalOpen(false)} className={`flex-1 bg-black/10 hover:bg-black/20 py-3 rounded-xl font-bold transition-colors`}>إلغاء</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {playerToDelete && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                <div className={`${theme.card} p-8 rounded-3xl shadow-2xl max-w-sm w-full border ${theme.border}`}>
                  <h3 className={`text-2xl font-black mb-4 flex items-center gap-2 ${theme.dangerText}`}>
                    <AlertTriangle className="w-8 h-8" /> تأكيد الحذف
                  </h3>
                  <p className={`mb-8 text-base font-medium leading-relaxed ${theme.textMuted}`}>هل أنت متأكد من حذف هذا اللاعب؟ سيتم مسح جميع أرقامه المسجلة نهائياً.</p>
                  <div className="flex gap-4">
                    <button onClick={confirmDeletePlayer} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold transition-colors">نعم، احذف</button>
                    <button onClick={() => setPlayerToDelete(null)} className={`flex-1 bg-black/10 hover:bg-black/20 py-3 rounded-xl font-bold transition-colors`}>إلغاء</button>
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

// ==========================================
// رسومات التحليل البيانية (Charts)
// ==========================================
const MemoizedRadarChart = React.memo(RadarChart);
const MemoizedProgressChart = React.memo(ProgressChart);

function RadarChart({ records, player, testCategories, theme, calculateAge }: { records: AthleteRecord[], player: Player, testCategories: TestCategories, theme: any, calculateAge: any }) {
  const stats = useMemo(() => {
    const age = calculateAge(player.dob || '');
    const gender = player.gender || 'male';
    const categories = ['السرعة', 'الوثب', 'القوة'];
    
    return categories.map(cat => {
      const catTests = testCategories[cat] || [];
      const catRecords = records.filter((r: AthleteRecord) => r.playerId === player.id && r.category === cat);
      
      if (catRecords.length === 0) return { category: cat, score: 0 };

      let totalScore = 0;
      let validTests = 0;

      catTests.forEach(testName => {
        const testRecs = catRecords.filter(r => r.test === testName).map(r => r.result);
        if (testRecs.length > 0) {
           const bestRes = cat === 'السرعة' ? Math.min(...testRecs) : Math.max(...testRecs);
           const score = getBenchmarkScore(testName, cat, bestRes, gender, age);
           if (score > 0) {
             totalScore += score;
             validTests++;
           }
        }
      });

      return { category: cat, score: validTests > 0 ? (totalScore / validTests) : 0 };
    });
  }, [records, player, testCategories, calculateAge]);

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
      <polygon key={level} points={stats.map((_, i) => `${getCoordinates(level, i).x},${getCoordinates(level, i).y}`).join(' ')} fill="none" stroke="currentColor" strokeWidth="1" className="opacity-20" />
    ));
  };

  const renderAxes = () => {
    return stats.map((s, i) => {
      const coords = getCoordinates(100, i);
      return (
        <g key={i}>
          <line x1={center} y1={center} x2={coords.x} y2={coords.y} stroke="currentColor" strokeWidth="1" className="opacity-30" />
          <text x={center + (radius + 28) * Math.cos((Math.PI * 2 * i) / numPoints - Math.PI / 2)} y={center + (radius + 22) * Math.sin((Math.PI * 2 * i) / numPoints - Math.PI / 2)} textAnchor="middle" alignmentBaseline="middle" className="text-base font-black fill-current">
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
            <polygon points={dataPoints} fill={theme.radarFill} stroke={theme.radarStroke} strokeWidth="3.5" />
            {stats.map((s, i) => <circle key={i} cx={getCoordinates(s.score, i).x} cy={getCoordinates(s.score, i).y} r="6" fill="#fff" stroke={theme.radarStroke} strokeWidth="2.5" />)}
          </>
        ) : (
          <text x={center} y={center} textAnchor="middle" className="text-sm opacity-60 font-bold fill-current">لا توجد أرقام للتحليل</text>
        )}
      </svg>
    </div>
  );
}

function ProgressChart({ records, player, chartTab, reportCategory, reportTest, theme, calculateAge, testCategories }: any) {
  const { pathData, points, height, isSpeedMode } = useMemo(() => {
    const age = calculateAge(player.dob || '');
    const gender = player.gender || 'male';
    const pRecords = records.filter((r: AthleteRecord) => r.playerId === player.id);
    let pts: any[] = [];
    let isSpeed = false;

    if (chartTab === 'specific') {
      isSpeed = reportCategory === 'السرعة';
      const testRecords = pRecords.filter((r: AthleteRecord) => r.test === reportTest).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      if (testRecords.length < 2) return { pathData: '', points: [], height: 180, isSpeedMode: isSpeed };

      const values = testRecords.map((r: any) => r.result);
      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);
      const padding = (maxVal - minVal) * 0.2 || minVal * 0.1;
      const chartMin = minVal - padding;
      const range = (maxVal + padding) - chartMin;

      pts = testRecords.map((d: any, i: number) => ({
        x: (i / (testRecords.length - 1)) * 100,
        y: 180 - (((d.result - chartMin) / range) * 180),
        value: d.result,
        date: d.date,
        label: d.result.toString()
      }));

    } else {
      isSpeed = false; 
      const recordsByDate: Record<string, AthleteRecord[]> = {};
      pRecords.forEach((r: AthleteRecord) => {
        if (!recordsByDate[r.date]) recordsByDate[r.date] = [];
        recordsByDate[r.date].push(r);
      });

      const sortedDates = Object.keys(recordsByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      const dateScores: { date: string, score: number }[] = [];

      sortedDates.forEach(date => {
        let dailyRecs = recordsByDate[date];
        if (chartTab === 'speed') dailyRecs = dailyRecs.filter(r => r.category === 'السرعة');
        else if (chartTab === 'jump') dailyRecs = dailyRecs.filter(r => r.category === 'الوثب');
        else if (chartTab === 'power') dailyRecs = dailyRecs.filter(r => r.category === 'القوة');

        if (dailyRecs.length > 0) {
          let scoreSum = 0;
          let validCount = 0;
          dailyRecs.forEach(r => {
             const s = getBenchmarkScore(r.test, r.category, r.result, gender, age);
             if (s > 0) { scoreSum += s; validCount++; }
          });
          if (validCount > 0) dateScores.push({ date, score: scoreSum / validCount });
        }
      });

      if (dateScores.length < 2) return { pathData: '', points: [], height: 180, isSpeedMode: isSpeed };

      const values = dateScores.map(d => d.score);
      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);
      const padding = (maxVal - minVal) * 0.2 || 5;
      const chartMin = Math.max(minVal - padding, 0); 
      const range = (maxVal + padding) - chartMin;

      pts = dateScores.map((d, i) => ({
        x: (i / (dateScores.length - 1)) * 100,
        y: 180 - (((d.score - chartMin) / range) * 180),
        value: d.score,
        date: d.date,
        label: Math.round(d.score) + '%'
      }));
    }

    return {
      pathData: pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '),
      points: pts,
      height: 180,
      isSpeedMode: isSpeed
    };
  }, [records, player, chartTab, reportCategory, reportTest, calculateAge]);

  if (points.length < 2) {
    return (
      <div className={`h-[200px] w-full flex items-center justify-center rounded-xl border border-dashed border-current/20 bg-black/5`}>
        <p className={`text-sm font-bold opacity-70`}>يجب تسجيل بيانات في يومين مختلفين على الأقل لظهور المنحنى</p>
      </div>
    );
  }

  const strokeColor = isSpeedMode ? theme.chartSpeed : theme.chartPower;

  return (
    <div className="relative h-[220px] w-full mt-4 mb-2">
      <svg className="w-full h-[180px] overflow-visible" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="0" stroke="currentColor" className="opacity-10" strokeWidth="1" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" className="opacity-10" strokeWidth="1" />
        <line x1="0" y1="100%" x2="100%" y2="100%" stroke="currentColor" className="opacity-20" strokeWidth="1" />

        <path d={pathData} fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={`${p.x}%`} cy={p.y} r="6" fill="#fff" stroke={strokeColor} strokeWidth="3" className="transition-transform hover:scale-125 hover:cursor-pointer" />
            <text x={`${p.x}%`} y={p.y - 18} textAnchor="middle" fontSize="13" className="font-black fill-current opacity-90">{p.label}</text>
            <text x={`${p.x}%`} y={height + 20} textAnchor="middle" fontSize="11" className="fill-current opacity-70 font-bold">{p.date.substring(5)}</text>
          </g>
        ))}
      </svg>
      <div className={`absolute top-0 right-0 -mt-8 text-xs font-bold ${theme.textMuted} bg-black/10 px-3 py-1 rounded-full border border-current/10`}>
        {chartTab === 'specific' 
          ? (isSpeedMode ? '⚡ (الرقم الأقل يعني سرعة أفضل)' : '💪 (الرقم الأعلى يعني أداء أفضل)') 
          : '📈 (النسبة المئوية من المعايير العالمية للعمر والنوع)'}
      </div>
    </div>
  );
} 