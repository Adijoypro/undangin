"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  targetDate: string; // e.g. "14 Februari 2027"
  theme?: "premium" | "cinematic";
}

export default function CountdownTimer({ targetDate, theme = "premium" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const indonesianMonths: { [key: string]: string } = {
      januari: "January", februari: "February", maret: "March", april: "April",
      mei: "May", juni: "June", juli: "July", agustus: "August",
      september: "September", oktober: "October", november: "November", desember: "December"
    };
    
    let parsedDateStr = targetDate.toLowerCase();
    Object.keys(indonesianMonths).forEach(month => {
      parsedDateStr = parsedDateStr.replace(month, indonesianMonths[month]);
    });

    const dateWithTimezone = parsedDateStr.includes(":") 
      ? `${parsedDateStr} GMT+0700` 
      : `${parsedDateStr} 08:00:00 GMT+0700`;

    const targetTime = new Date(dateWithTimezone).getTime();
    const validTargetTime = isNaN(targetTime) ? new Date().getTime() + 30 * 24 * 60 * 60 * 1000 : targetTime;

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = validTargetTime - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return false;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
      return true;
    };

    updateTimer();
    const intervalId = setInterval(() => {
      if (!updateTimer()) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  const units = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds }
  ];

  if (theme === "cinematic") {
    return (
      <div className="flex gap-2 sm:gap-6 justify-center w-full">
        {units.map((unit, i) => (
          <motion.div 
            key={unit.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 sm:w-20 sm:h-20 border border-white/20 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-md text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <span className="font-serif text-lg sm:text-3xl">{unit.value}</span>
            </div>
            <span className="text-[8px] sm:text-xs text-gray-400 mt-3 uppercase tracking-[0.2em]">{unit.label}</span>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 sm:gap-5 justify-center w-full">
      {units.map((unit, i) => (
        <motion.div 
          key={unit.label}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * i, duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center bg-white p-2 sm:p-4 rounded-xl shadow-lg border border-wedding-gold/20 min-w-[60px] sm:min-w-[80px]"
        >
          <span className="font-serif text-2xl sm:text-4xl text-wedding-gold mb-1">{unit.value}</span>
          <span className="text-[8px] sm:text-xs text-gray-500 uppercase tracking-widest">{unit.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
