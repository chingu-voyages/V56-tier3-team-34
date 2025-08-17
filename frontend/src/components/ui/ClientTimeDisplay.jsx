'use client';

import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ClientTimeDisplay({ date }) {
  const [formattedTime, setFormattedTime] = useState('--:--:--');
  
  useEffect(() => {
    // This will only run on the client after hydration
    setFormattedTime(date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }));
  }, [date]);

  return (
    <div className="flex items-center">
      <Clock className="h-5 w-5 mr-2" />
      <span>Last Updated: {formattedTime}</span>
    </div>
  );
}