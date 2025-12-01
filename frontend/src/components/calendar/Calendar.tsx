import React, { useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useCalendarEvents, type CalendarEvent } from '@/hooks/useCalendarEvents';
import './calendar-responsive.css';

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarComponentProps {
  projectId?: number;
}

export const CalendarComponent: React.FC<CalendarComponentProps> = ({ projectId }) => {
  const { events, loading, error } = useCalendarEvents(projectId);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [currentView, setCurrentView] = useState<View>('month');

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const handleViewChange = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 font-semibold">Error cargando calendario</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-4 p-4 sm:p-6 bg-gray-50 flex-col lg:flex-row">
      {/* Calendar View */}
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col min-h-0">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', minHeight: '500px' }}
          onSelectEvent={handleSelectEvent}
          onView={handleViewChange}
          view={currentView}
          popup
          selectable
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
          messages={{
            today: 'Today',
            previous: 'Previous',
            next: 'Next',
            month: 'Month',
            week: 'Week',
            day: 'Day',
            agenda: 'Agenda',
            date: 'Date',
            time: 'Time',
            event: 'Event',
            noEventsInRange: 'No events in this range',
            showMore: (total: number) => `+${total} events`,
          }}
          eventPropGetter={() => ({
            className: 'rbc-event-custom',
            style: {
              backgroundColor: '#3B82F6',
              borderRadius: '4px',
              opacity: 0.85,
              color: 'white',
              border: 'none',
              display: 'block',
              fontSize: '0.75rem',
              padding: '2px 4px',
            },
          })}
        />
      </div>

      {/* Event Detail Sidebar - Responsive */}
      {selectedEvent && (
        <div className="w-full lg:w-80 bg-white rounded-lg shadow overflow-hidden flex flex-col max-h-96 lg:max-h-full">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between flex-shrink-0">
            <h2 className="font-semibold text-base sm:text-lg truncate">{selectedEvent.title}</h2>
            <button
              onClick={handleCloseDetail}
              className="text-white hover:bg-blue-700 p-1 rounded transition-colors flex-shrink-0 ml-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {/* Project */}
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Project
              </p>
              <p className="text-sm text-gray-900 truncate">{selectedEvent.project_name}</p>
            </div>

            {/* Status */}
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Status
              </p>
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm rounded-full">
                {selectedEvent.status_name}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Due Date
              </p>
              <p className="text-sm text-gray-900">
                {new Date(selectedEvent.due_date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Description */}
            {selectedEvent.description && (
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Description
                </p>
                <p className="text-sm text-gray-700 line-clamp-3">{selectedEvent.description}</p>
              </div>
            )}

            {/* Assigned Users */}
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Assigned to ({selectedEvent.assigned_users.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedEvent.assigned_users.map((user, index) => (
                  <div
                    key={index}
                    className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full truncate"
                  >
                    {user}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="pt-2 sm:pt-3 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Línea de tiempo
              </p>
              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  <span className="font-semibold">Creado:</span>{' '}
                  {new Date(selectedEvent.created_at).toLocaleDateString('es-ES')}
                </p>
                <p>
                  <span className="font-semibold">Actualizado:</span>{' '}
                  {new Date(selectedEvent.updated_at).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
