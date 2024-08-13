import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import CustomDayCalendar from './CustomDayCalendar';
import MonthTool from './MonthTool';
import { Icon } from 'react-icons-kit';
import { ic_expand_more } from 'react-icons-kit/md/ic_expand_more';
import { ic_expand_less } from 'react-icons-kit/md/ic_expand_less';
import AdvancedFilters from './AdvancedFilters';

const WeekdaySelector = ({ selectedDay, onDayChange, onCustomDayClick, customDays }) => {
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="Sidebarcalendario-weekday-selector">
      {daysOfWeek.map((day, index) => (
        <button
          key={index}
          className={`Sidebarcalendario-weekday-button ${selectedDay === index ? 'selected' : ''}`}
          onClick={() => onDayChange(index)}
        >
          {day}
        </button>
      ))}
      {customDays.map((day, index) => (
        <button
          key={`custom-${index}`}
          className="Sidebarcalendario-weekday-button Sidebarcalendario-custom-day-button"
          onClick={() => onCustomDayClick(index)}
        >
          {format(day, 'dd/MM/yyyy')}
        </button>
      ))}
      <button className="Sidebarcalendario-weekday-button Sidebarcalendario-custom-day-button" onClick={() => onCustomDayClick(null)}>
        Añadir Día Personalizado
      </button>
    </div>
  );
};

const Sidebar = ({ filters, onFilterChange, onAdvancedFilterChange, onDateClick, onHoursChange, events = [], theme }) => {
  const [expanded, setExpanded] = useState({
    Clase: false,
    Cita: false,
    Pago: false,
    Rutina: false,
    Libre: false,
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(0);
  const [dailyAvailableHours, setDailyAvailableHours] = useState({});
  const [customDays, setCustomDays] = useState([]);
  const [showCustomDayCalendar, setShowCustomDayCalendar] = useState(false);
  const [currentCustomDayIndex, setCurrentCustomDayIndex] = useState(null);
  const [showHoursDropdown, setShowHoursDropdown] = useState(false);

  const [hoveredDate, setHoveredDate] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });
  const [dayEvents, setDayEvents] = useState([]);

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    onFilterChange(name, checked);
  };

  const handleExpandClick = (eventType) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [eventType]: !prevExpanded[eventType],
    }));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
    onDateClick(day);
  };

  const handleDayChange = (dayIndex) => {
    setSelectedDay(dayIndex);
    setShowCustomDayCalendar(false);
  };

  const handleCustomDayClick = (index) => {
    setCurrentCustomDayIndex(index);
    setShowCustomDayCalendar(true);
  };

  const handleCustomDaySelect = (day) => {
    setShowCustomDayCalendar(false);
    if (currentCustomDayIndex !== null) {
      setCustomDays((prev) => {
        const newDays = [...prev];
        newDays[currentCustomDayIndex] = day;
        return newDays;
      });
    } else {
      setCustomDays((prev) => [...prev, day]);
    }
    setCurrentCustomDayIndex(null);
  };

  const handleHoursChange = (hour) => {
    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const selectedDayName = currentCustomDayIndex !== null ? format(customDays[currentCustomDayIndex], 'yyyy-MM-dd') : dayNames[selectedDay];
    setDailyAvailableHours((prev) => {
      const hoursForDay = prev[selectedDayName] || [];
      if (hoursForDay.includes(hour)) {
        return {
          ...prev,
          [selectedDayName]: hoursForDay.filter((h) => h !== hour),
        };
      } else {
        return {
          ...prev,
          [selectedDayName]: [...hoursForDay, hour],
        };
      }
    });
  };

  useEffect(() => {
    onHoursChange(dailyAvailableHours);
  }, [dailyAvailableHours, onHoursChange]);

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

    const handleMouseEnter = (day, e) => {
      const eventsForDay = events.filter(event => isSameDay(new Date(event.start), day));
      if (eventsForDay.length > 0) {
        setHoveredDate(day);
        setHoverPosition({ top: e.clientY, left: e.clientX });
        setDayEvents(eventsForDay);
      }
    };

    const handleMouseLeave = () => {
      setHoveredDate(null);
      setDayEvents([]);
    };

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`Sidebarcalendario-col Sidebarcalendario-cell ${
              !isSameMonth(day, monthStart)
                ? "Sidebarcalendario-disabled"
                : isSameDay(day, selectedDate) || customDays.some(customDay => isSameDay(day, customDay))
                ? "Sidebarcalendario-selected"
                : ""
            }`}
            key={day}
            onClick={() => handleDateClick(cloneDay)}
            onMouseEnter={(e) => handleMouseEnter(cloneDay, e)}
            onMouseLeave={handleMouseLeave}
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

  const renderHours = () => {
    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const selectedDayName = currentCustomDayIndex !== null ? format(customDays[currentCustomDayIndex], 'yyyy-MM-dd') : dayNames[selectedDay];
    const hoursForDay = dailyAvailableHours[selectedDayName] || [];
    return (
      <>
        <WeekdaySelector selectedDay={selectedDay} onDayChange={handleDayChange} onCustomDayClick={handleCustomDayClick} customDays={customDays} />
        {showCustomDayCalendar && <CustomDayCalendar onCustomDaySelect={handleCustomDaySelect} />}
        <h3>Horas Disponibles para {currentCustomDayIndex !== null ? format(customDays[currentCustomDayIndex], 'yyyy-MM-dd') : selectedDayName}</h3>
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} className="Sidebarcalendario-hour-label">
            <input
              type="checkbox"
              checked={hoursForDay.includes(i)}
              onChange={() => handleHoursChange(i)}
            />
            <label>{`${i}:00 - ${i + 1}:00`}</label>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className={`Sidebarcalendario-sidebar ${theme === 'dark' ? 'sidebar-dark' : 'sidebar-light'}`}>
      <div className="Sidebarcalendario-month-calendar">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
      <div className="Sidebarcalendario-event-filter">
        <h3>Filtrar eventos</h3>
        {['Clase', 'Cita', 'Pago', 'Rutina', 'Libre'].map((eventType) => (
          <div key={eventType} className="Sidebarcalendario-filter-group">
            <div className="Sidebarcalendario-event-label" onClick={() => handleExpandClick(eventType)}>
              <input
                type="checkbox"
                name={eventType}
                checked={filters[eventType]}
                onChange={handleFilterChange}
              />
              <span className={`Sidebarcalendario-color-box Sidebarcalendario-${eventType.toLowerCase()}`}></span>
              <label>{eventType}</label>
              <button className="Sidebarcalendario-expand-btn">{expanded[eventType] ? '-' : '+'}</button>
            </div>
            {expanded[eventType] && (
              <AdvancedFilters eventType={eventType} onAdvancedFilterChange={onAdvancedFilterChange} />
            )}
          </div>
        ))}
        <div className="Sidebarcalendario-hours-dropdown">
          <button onClick={() => setShowHoursDropdown(!showHoursDropdown)} className="Sidebarcalendario-dropdown-btn">
            Selección de Días y Horas
            <Icon icon={showHoursDropdown ? ic_expand_less : ic_expand_more} size={24} />
          </button>
          {showHoursDropdown && renderHours()}
        </div>
      </div>
      {hoveredDate && dayEvents.length > 0 && <MonthTool events={dayEvents} position={hoverPosition} />}
    </div>
  );
};

export default Sidebar;
