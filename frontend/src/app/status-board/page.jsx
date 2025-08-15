'use client';

import { useCallback, useEffect, useState } from 'react';
import { Monitor, Users, Clock, RefreshCw, Activity, CheckCircle, AlertCircle, Pause, XCircle, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

// Status configuration for patient statuses
const statusConfig = {
  'scheduled': {
    label: 'Scheduled',
    color: 'bg-blue-500 text-white',
    icon: Calendar,
  },
  'checked-in': {
    label: 'Checked In',
    color: 'bg-green-500 text-white',
    icon: CheckCircle,
  },
  'pre-procedure': {
    label: 'Pre-Procedure',
    color: 'bg-yellow-500 text-white',
    icon: Clock,
  },
  'in-progress': {
    label: 'In-Progress',
    color: 'bg-red-500 text-white',
    icon: Activity,
  },
  'closing': {
    label: 'Closing',
    color: 'bg-orange-500 text-white',
    icon: AlertCircle,
  },
  'recovery': {
    label: 'Recovery',
    color: 'bg-purple-500 text-white',
    icon: Pause,
  },
  'complete': {
    label: 'Complete',
    color: 'bg-emerald-500 text-white',
    icon: CheckCircle,
  },
  'dismissal': {
    label: 'Dismissal',
    color: 'bg-gray-500 text-white',
    icon: XCircle,
  }
};

export default function StatusBoardPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { user } = useAuth();

  const loadPatients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/today-status-board/`);
      if (!response.ok) throw new Error('Failed to fetch patients');
      
      const data = await response.json();
      setPatients(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();
    const interval = setInterval(loadPatients, 30000);
    return () => clearInterval(interval);
  }, [loadPatients]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusConfig = (status) => {
    const statusKey = status.toLowerCase().replace(' ', '-');
    return statusConfig[statusKey] || {
      label: status,
      color: 'bg-gray-500 text-white',
      icon: Activity
    };
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Monitor className="h-16 w-16 text-white mb-4" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Surgery Status Board
          </h1>
          
          <div className="mb-6">
            <div className="text-2xl font-semibold text-white mb-2">
              {formatDate(new Date())}
              <Badge className="ml-3 bg-green-500 text-white">Today</Badge>
            </div>
            <p className="text-xl text-blue-100">
              Real-time surgical progress updates
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-blue-100">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span>{patients.length} Active Patients</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>Last Updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={loadPatients}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
        </div>

        {/* Status Legend */}
        <div className="flex justify-center mb-12">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Status Guide</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {Object.entries(statusConfig).map(([status, config]) => {
                  const Icon = config.icon;
                  return (
                    <div key={status} className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-white" />
                      <Badge className={config.color}>
                        {config.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patients Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <RefreshCw className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
              <div className="text-xl text-white">Loading patient data...</div>
            </div>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-2xl text-white mb-4">
              No Active Patients Today
            </div>
            <div className="text-blue-100">
              All surgical procedures have been completed
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {patients.map((patient) => {
              const config = getStatusConfig(patient.status);
              const Icon = config.icon;
              
              return (
                <Card
                  key={patient.patient_number}
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 min-h-[280px] flex flex-col"
                >
                  <CardContent className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                    <div className="text-center">
                      {/* Patient Number */}
                      <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {patient.patient_number}
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-center mb-3">
                        <Icon className="h-4 w-4 text-white mr-2" />
                        <Badge className={config.color}>
                          {config.label}
                        </Badge>
                      </div>

                      {/* Patient Info (conditionally shown) */}
                      {user?.role !== 'guest' && (
                        <div className="text-white mb-2">
                          {patient.first_name} {patient.last_name}
                        </div>
                      )}

                      {/* Procedure (shown for non-guests) */}
                      {user?.role !== 'guest' && (
                        <div className="text-blue-100 mb-2 text-sm">
                          {patient.procedure}
                        </div>
                      )}

                      {/* Room and Time (always shown) */}
                      <div className="text-blue-100 text-sm mb-1">
                        Room: {patient.room_no}
                      </div>
                      <div className="text-blue-100 text-sm mb-1">
                        Time: {formatTime(patient.scheduled_time)}
                      </div>

                      {/* Surgeon (always shown) */}
                      <div className="text-blue-100 text-sm">
                        Surgeon: {patient.surgeon_name}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-blue-100">
          <p className="text-sm mb-2">
            This board updates automatically every 30 seconds
          </p>
          <p className="text-xs opacity-75">
            For medical emergencies, contact hospital staff immediately
          </p>
        </div>
      </div>
    </div>
  );
}