import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';

const CustomDayCalendar = ({ onCustomDaySelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
    onCustomDaySelect(day);
  };

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="Sidebarcalendario-header row flex-middle">
        <div className="Sidebarcalendario-col Sidebarcalendario-col-start">
          <div className="Sidebarcalendario-icon" onClick={prevMonth}>
            {"<"}
          </div>
        </div>
        <div className="Sidebarcalendario-col Sidebarcalendario-col-center">
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <div className="Sidebarcalendario-col Sidebarcalendario-col-end" onClick={nextMonth}>
          <div className="Sidebarcalendario-icon">{">"}</div>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];
    let startDate = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="Sidebarcalendario-col Sidebarcalendario-col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="Sidebarcalendario-days row">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`Sidebarcalendario-col Sidebarcalendario-cell ${
              !isSameMonth(day, monthStart)
                ? "Sidebarcalendario-disabled"
                : isSameDay(day, selectedDate)
                ? "Sidebarcalendario-selected"
                : ""
            }`}
            key={day}
            onClick={() => handleDateClick(cloneDay)}
          >
            <span className="Sidebarcalendario-number">{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="Sidebarcalendario-row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="Sidebarcalendario-body">{rows}</div>;
  };

  return (
    <div className="Sidebarcalendario-custom-day-calendar">
      <h3>Seleccione un día personalizado</h3>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default CustomDayCalendar;
