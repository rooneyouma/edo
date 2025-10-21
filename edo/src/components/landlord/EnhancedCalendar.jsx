"use client";

import * as React from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parse,
} from "date-fns";

const EnhancedCalendar = ({ className }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToPreviousYear = () => {
    setCurrentDate(addMonths(currentDate, -12));
  };

  const goToNextYear = () => {
    setCurrentDate(addMonths(currentDate, 12));
  };

  // Handle date selection
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });

    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = start.getDay();

    // Add empty cells for days before the first day of the month
    const emptyCells = Array(firstDayOfWeek).fill(null);

    // Combine empty cells and actual days
    return [...emptyCells, ...days];
  };

  const days = generateCalendarDays();
  const monthYearLabel = format(currentDate, "MMMM yyyy");

  return (
    <div
      className={`bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 ${className}`}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800">
          Calendar
        </h3>
        <svg
          className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <button
          onClick={goToPreviousYear}
          className="p-1 rounded-md hover:bg-gray-100"
          aria-label="Previous year"
        >
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="sr-only">Previous year</span>
        </button>

        <button
          onClick={goToPreviousMonth}
          className="p-1 rounded-md hover:bg-gray-100"
          aria-label="Previous month"
        >
          <svg
            className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="sr-only">Previous month</span>
        </button>

        <div className="text-sm sm:text-base font-medium text-gray-700">
          {monthYearLabel}
        </div>

        <button
          onClick={goToNextMonth}
          className="p-1 rounded-md hover:bg-gray-100"
          aria-label="Next month"
        >
          <svg
            className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="sr-only">Next month</span>
        </button>

        <button
          onClick={goToNextYear}
          className="p-1 rounded-md hover:bg-gray-100"
          aria-label="Next year"
        >
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="sr-only">Next year</span>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-7 sm:h-8"></div>;
          }

          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              className={`h-7 sm:h-8 text-xs sm:text-sm rounded-md flex items-center justify-center
                ${
                  isSelected
                    ? "bg-teal-500 text-white"
                    : isToday
                    ? "bg-teal-100 text-teal-800 font-bold"
                    : isCurrentMonth
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EnhancedCalendar;
