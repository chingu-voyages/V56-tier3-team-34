'use client';

import { useCallback, useEffect, useState } from 'react';
import { Monitor, Users, Clock, RefreshCw, Activity, CheckCircle, AlertCircle, Pause, XCircle, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { getPatients } from '@/lib/patients';
import { generateDailyPatientNumber } from '@/lib/patients';

// Status configuration for patient statuses
const statusConfig = {
  'scheduled': {
    label: 'Scheduled',
    color: 'bg-blue-500 text-white',
    icon: Calendar,
    message: 'Procedure scheduled'
  },
  'checked-in': {
    label: 'Checked In',
    color: 'bg-green-500 text-white',
    icon: CheckCircle,
    message: 'In the facility awaiting their procedure.'
  },
  'pre-procedure': {
    label: 'Pre-Procedure',
    color: 'bg-yellow-500 text-white',
    icon: Clock,
    message: 'Undergoing surgical preparation.'
  },
  'in-progress': {
    label: 'In-Progress',
    color: 'bg-red-500 text-white',
    icon: Activity,
    message: 'Surgical procedure is underway.'
  },
  'closing': {
    label: 'Closing',
    color: 'bg-orange-500 text-white',
    icon: AlertCircle,
    message: 'Surgery completed. The patient is being prepared for recovery.'
  },
  'recovery': {
    label: 'Recovery',
    color: 'bg-purple-500 text-white',
    icon: Pause,
    message: 'Patient transferred to post-surgery recovery room.'
  },
  'complete': {
    label: 'Complete',
    color: 'bg-emerald-500 text-white',
    icon: CheckCircle,
    message: 'Recovery completed. Patient awaiting dismissal'
  },
  'dismissal': {
    label: 'Dismissal',
    color: 'bg-gray-500 text-white',
    icon: XCircle,
    message: 'Transferred to a hospital room for an overnight stay or for outpatient procedures the patient has left the hospital.'
  }
};

export default function StatusBoardPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { user } = useAuth();

  // Check if user can navigate dates (admin or surgical_team)
  const canNavigateDates = user && user.role !== 'guest';

  const loadPatients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPatients();
      // Filter out dismissed patients for public display
      let activePatients = data.filter(p => p.status !== 'dismissed');
      
      // Filter by selected date
      const selectedDateStr = selectedDate.toDateString();
      activePatients = activePatients.filter(patient => {
        const patientDate = new Date(patient.scheduledTime || patient.createdAt);
        return patientDate.toDateString() === selectedDateStr;
      });
      
      setPatients(activePatients);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadPatients();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadPatients, 30000);
    return () => clearInterval(interval);
  }, [loadPatients]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
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

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      setSelectedDate(newDate);
    }
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
          
          {/* Date Display */}
          <div className="mb-6">
            <div className="text-2xl font-semibold text-white mb-2">
              {formatDate(selectedDate)}
              {isToday(selectedDate) && (
                <Badge className="ml-3 bg-green-500 text-white">Today</Badge>
              )}
            </div>
            <p className="text-xl text-blue-100">
              Real-time surgical progress updates
            </p>
          </div>

          {/* Date Navigation - Only for Admin and Surgical Staff */}
          {canNavigateDates && (
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Button
                onClick={() => navigateDate(-1)}
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous Day
              </Button>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-white" />
                <Input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={handleDateChange}
                  className="bg-white/10 border-white/20 text-white placeholder-white/50 w-40"
                />
              </div>
              
              <Button
                onClick={() => navigateDate(1)}
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                Next Day
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              
              <Button
                onClick={() => setSelectedDate(new Date())}
                variant="outline"
                size="sm"
                className="bg-primary/20 hover:bg-primary/30 text-white border-primary/30"
              >
                Today
              </Button>
            </div>
          )}
          
          <div className="flex items-center justify-center space-x-6 text-blue-100">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span>{patients.length} {isToday(selectedDate) ? 'Active' : 'Scheduled'} Patients</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>Last Updated: {formatTime(lastUpdated)}</span>
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
              No {isToday(selectedDate) ? 'Active' : 'Scheduled'} Patients
            </div>
            <div className="text-blue-100">
              {isToday(selectedDate) 
                ? 'All surgical procedures have been completed'
                : `No procedures scheduled for ${formatDate(selectedDate)}`
              }
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
            {patients.map((patient) => {
              const status = statusConfig[patient.status];
              const StatusIcon = status?.icon || Activity;
              
              // Generate daily sequential number based on surgery date/time
              const dailyNumber = generateDailyPatientNumber(patients, patient.scheduledTime);
              
              return (
                <Card
                  key={patient.id}
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 min-h-[280px] flex flex-col"
                >
                  <CardContent className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                    <div className="text-center">
                      {/* Patient Number */}
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
                        {dailyNumber}
                      </div>
                      
                      {/* Status */}
                      <div className="flex items-center justify-center mb-4 lg:mb-6">
                        <StatusIcon className="h-5 w-5 md:h-6 md:w-6 text-white mr-2" />
                        <Badge className={`${status?.color || 'bg-gray-500 text-white'} text-xs md:text-sm px-2 md:px-3 py-1`}>
                          {status?.label || patient.status}
                        </Badge>
                      </div>
                      
                      {/* Procedure */}
                      <div className="text-white mb-2 md:mb-3 font-medium text-sm md:text-base lg:text-lg leading-tight">
                        {patient.procedure}
                      </div>
                      
                      {/* Surgeon */}
                      <div className="text-blue-100 text-xs md:text-sm mb-3 md:mb-4">
                        Dr. {patient.surgeon}
                      </div>
                      
                      {/* Timing - Stacked for better desktop layout */}
                      <div className="space-y-1 md:space-y-2">
                        {patient.estimatedTime && (
                          <div className="text-blue-200 text-xs md:text-sm flex items-center justify-center">
                            <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            Est: {patient.estimatedTime}
                          </div>
                        )}
                        
                        {patient.actualStartTime && (
                          <div className="text-green-200 text-xs md:text-sm flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            Started: {patient.actualStartTime}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Enhanced Footer for Desktop */}
        <div className="text-center mt-12 lg:mt-20 text-blue-100">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 md:p-6">
                <RefreshCw className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-blue-300" />
                <p className="text-sm md:text-base font-medium mb-1">Auto-Refresh</p>
                <p className="text-xs md:text-sm opacity-75">Updates every 30 seconds</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 md:p-6">
                <Users className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-blue-300" />
                <p className="text-sm md:text-base font-medium mb-1">Live Tracking</p>
                <p className="text-xs md:text-sm opacity-75">Real-time status updates</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 md:p-6">
                <AlertCircle className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-red-300" />
                <p className="text-sm md:text-base font-medium mb-1">Emergency</p>
                <p className="text-xs md:text-sm opacity-75">Contact staff immediately</p>
              </div>
            </div>
            <div className="border-t border-white/20 pt-6">
              <p className="text-sm md:text-base mb-2">
                This board updates automatically every 30 seconds
              </p>
              <p className="text-xs md:text-sm opacity-75">
                For medical emergencies, contact hospital staff immediately
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}