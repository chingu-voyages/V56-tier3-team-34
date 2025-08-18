'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { RefreshCw, Users, CalendarDays, Clock, Activity, UserPlus, ActivitySquare } from 'lucide-react';
import Link from 'next/link';
import { format, parseISO, addDays } from 'date-fns';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const todayStr = new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dataLoading, setDataLoading] = useState(false);

  const [overview, setOverview] = useState(null);
  const [activity, setActivity] = useState(null);
  const [breakdown, setBreakdown] = useState([]);

  const fetchDashboardData = async () => {
    setDataLoading(true);
    try {
      const [ovRes, actRes, brRes] = await Promise.all([
        fetch(`${API_BASE_URL}/analytics/overview?start_date=${startDate}&end_date=${endDate}`),
        fetch(`${API_BASE_URL}/analytics/recent-activity`),
        fetch(`${API_BASE_URL}/analytics/status-breakdown`),
      ]);

      const [overviewData, activityData, breakdownData] = await Promise.all([
        ovRes.json(),
        actRes.json(),
        brRes.json(),
      ]);

      setOverview(overviewData);
      setActivity(activityData);
      setBreakdown(
        breakdownData.sort((a, b) => a.order_index - b.order_index)
      );
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) fetchDashboardData();
  }, [startDate, endDate]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return ''; // guard clause
    try {
      return format(parseISO(dateStr), 'PPPP'); // Example: "Wednesday, August 18th, 2025"
    } catch (err) {
      console.error("Date formatting failed:", err);
      return '';
    }
  };

  const adjustDate = (offset) => {
    const newDate = format(addDays(parseISO(startDate), offset), 'yyyy-MM-dd');
    setStartDate(newDate);
    setEndDate(newDate);
  };

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>

      <div className="mt-6 items-center gap-2">
        <div>
          <span className="text-lg font-medium">
            {formatDateLabel(startDate)}
          </span>
          {startDate === todayStr && (
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm">Today</span>
          )}
        </div>

        <div className="ml-auto flex gap-2 pt-4 flex-wrap">
          <Button variant="outline" onClick={() => adjustDate(-1)}>
            &larr; Previous Day
          </Button>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setEndDate(e.target.value);
            }}
            className="border px-3 py-2 rounded text-sm"
          />
          <Button variant="outline" onClick={() => adjustDate(1)}>
            Next Day &rarr;
          </Button>
          <Button variant="secondary" onClick={() => {
            setStartDate(todayStr);
            setEndDate(todayStr);
          }}>
            Today
          </Button>
          <Button onClick={fetchDashboardData} disabled={dataLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${dataLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 font-medium">Total Patients</p>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mt-1">{overview?.new_patients ?? '-'}</h2>
            <p className="text-xs text-gray-400">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Surgeries Today</p>
              <CalendarDays className="w-4 h-4 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold">{overview?.surgeries_total ?? '-'}</h2>
            <p className="text-xs text-gray-400">
              {overview?.surgeries_completed ?? 0} completed, {overview?.surgeries_remaining ?? 0} scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Average Wait Time</p>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold">{Math.round(overview?.avg_wait_time_minutes ?? 0)}m</h2>
            <p className="text-xs text-gray-400">Current average</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Active Cases</p>
              <Activity className="w-4 h-4 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold">{overview?.active_cases ?? '-'}</h2>
            <p className="text-xs text-gray-400">Currently active</p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Sections: Quick Actions, Recent Activity, Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Quick Actions */}
        <Card className="w-full px-6 pb-6">
          <CardContent className="p-0">
            <h2 className="px-4 pt-4 pb-2 font-semibold text-lg">Quick Actions</h2>
            <ul className="divide-y divide-gray-200">
              
              <li>
                <Link
                  href="/patients"
                  className="flex items-center px-4 py-3 hover:bg-blue-50 transition-colors rounded-md"
                >
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">View All Patients</span>
                </Link>
              </li>

              {user?.role === 'admin' && (
                <li>
                  <Link
                    href="/add-patient"
                    className="flex items-center px-4 py-3 hover:bg-blue-50 transition-colors rounded-md"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Add New Patient</span>
                  </Link>
                </li>
              )}

              <li>
                <Link
                  href="/status-board"
                  className="flex items-center px-4 py-3 hover:bg-blue-50 transition-colors rounded-md"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">View Status Board</span>
                </Link>
              </li>

            </ul>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="w-full">
          <CardContent className="py-4">
            <h3 className="font-semibold text-lg mb-2">Recent Activity</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><span className="text-green-600 font-medium">●</span> Completed Surgeries: {activity?.completed_today?.length ?? '-'}</li>
              <li><span className="text-blue-600 font-medium">●</span> Status Changes: {activity?.status_changes?.length ?? '-'}</li>
              <li><span className="text-yellow-600 font-medium">●</span> Active Cases: {activity?.active_cases?.length ?? '-'}</li>
            </ul>
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card className="w-full">
          <CardContent className="py-4">
            <h3 className="font-semibold text-lg mb-4">Status Breakdown</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              {breakdown.map((item) => (
                <li key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: item.color + '33', // light background
                        color: item.color,
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900">{item.count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

