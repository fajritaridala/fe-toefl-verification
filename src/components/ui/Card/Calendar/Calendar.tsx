"use client";

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ScheduleData, useCalendar } from '@features/service/hooks/useCalendar';

type CalendarCardProps = {
  data: ScheduleData[];
  className?: string;
};

const CELL_HEIGHT = "h-20";

const Calendar = ({ data = [], className = '' }: CalendarCardProps) => {
  const { currentDate, calendarGrid, changeMonth, navigateToRegister } =
    useCalendar(data);

  return (
    <div
      // CONTAINER UTAMA
      // Border diubah menjadi border-secondary (sesuai request)
      className={`w-full max-w-3xl rounded-2xl border border-secondary bg-bg-light p-6 shadow-sm ${className}`}
    >
      {/* --- NAVIGASI BULAN --- */}
      <div className="mb-4 flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="rounded-full p-1.5 text-text-muted transition-colors hover:bg-bg hover:text-text"
        >
          <FiChevronLeft size={20} />
        </button>
        
        {/* Judul Bulan: Menggunakan Primary agar senada dengan aksen di dalam */}
        <h2 className="text-lg font-bold text-primary">
          {currentDate.toLocaleDateString('id-ID', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        
        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="rounded-full p-1.5 text-text-muted transition-colors hover:bg-bg hover:text-text"
        >
          <FiChevronRight size={20} />
        </button>
      </div>

      {/* --- HEADER HARI --- */}
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-text-muted">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* --- GRID TANGGAL --- */}
      <div className="grid grid-cols-7 gap-2">
        {calendarGrid.map((item, index) => {
          if (!item.isCurrentMonth) {
            return (
              <div
                key={`empty-${index}`}
                className={`${CELL_HEIGHT} border border-transparent`}
              />
            );
          }

          const hasSchedule = !!item.schedule;
          const quota = item.schedule?.quota ?? 0;
          const registrants = item.schedule?.registrants ?? 0;
          const isActive = item.schedule?.status === 'aktif';
          const isFull =
            hasSchedule && quota > 0 ? registrants >= quota : false;
          const isInteractive = hasSchedule && isActive && !isFull;

          const baseStyles = `relative ${CELL_HEIGHT} rounded-lg flex flex-col items-center justify-start pt-1.5 px-1 text-sm border transition-all duration-200`;

          let stateStyles = "";

          if (isInteractive) {
            // 1. AVAILABLE
            // Border default: secondary/30 (Orange tipis)
            // Hover: border-primary (Biru tegas)
            stateStyles = `
              cursor-pointer 
              bg-bg-light 
              border-secondary/30 
              hover:border-primary 
              hover:shadow-md 
              hover:-translate-y-0.5
            `;
          } else if (hasSchedule && (!isActive || isFull)) {
            stateStyles = `
              cursor-not-allowed 
              ${isActive ? 'bg-danger/10 border-danger/30' : 'bg-bg border-border/40'}
            `;
          } else {
            // 3. EMPTY
            stateStyles = `
              cursor-default 
              bg-bg 
              border-transparent 
              text-text-muted
            `;
          }

          // TODAY HIGHLIGHT
          // Ring tetap Primary agar fokus
          const todayStyles = item.isToday 
            ? "ring-1 ring-primary ring-offset-1" 
            : "";

          return (
            <div
              key={`${item.day}-${index}`}
              className={`${baseStyles} ${stateStyles} ${todayStyles}`}
              onClick={() =>
                isInteractive && item.schedule && navigateToRegister(item.schedule._id)
              }
            >
              <span
                className={`mb-0.5 text-sm font-semibold ${
                  item.isToday 
                    ? "text-primary" 
                    : "text-text"
                }`}
              >
                {item.day}
              </span>

              {item.schedule && (
                <div className="flex w-full flex-col items-center">
                  {!isActive ? (
                    <span className="rounded-md bg-warning/20 px-1.5 py-0.5 text-[9px] font-bold text-warning">
                      TIDAK AKTIF
                    </span>
                  ) : isFull ? (
                    <span className="rounded-md bg-danger px-1.5 py-0.5 text-[9px] font-bold text-highlight">
                      PENUH
                    </span>
                  ) : (
                    <>
                      <span className="text-xs font-bold text-secondary">
                        {registrants}
                        {quota ? `/${quota}` : ''}
                      </span>
                      <span className="text-[9px] leading-none text-text-muted">
                        Terisi
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;