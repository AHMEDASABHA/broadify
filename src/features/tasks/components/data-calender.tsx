import React, { useState } from "react";
import { Task } from "../types/task";

import {
  format,
  parse,
  startOfWeek,
  getDay,
  subMonths,
  addMonths,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./data-calendar.css";
import { EventCard } from "./event-card";
import { CustomToolbar } from "./custom-tool-bar";

interface DataCalenderProps {
  tasks: Task[];
}
export default function DataCalender({ tasks }: DataCalenderProps) {
  const locales = {
    "en-US": enUS,
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  const [value, setValue] = useState(
    tasks.length > 0 ? tasks[0].dueDate : new Date()
  );

  const events = tasks.map((task) => ({
    title: task.name,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    project: task.project,
    assignee: task.assignee,
    status: task.status,
    id: task.$id,
  }));

  function handleNavigate(action: "PREV" | "NEXT" | "TODAY") {
    if (action === "PREV") {
      setValue(subMonths(value, 1));
    } else if (action === "NEXT") {
      setValue(addMonths(value, 1));
    } else {
      setValue(new Date());
    }
  }

  return (
    <div className="w-full h-full">
      <Calendar
        localizer={localizer}
        events={events}
        date={value}
        views={["month"]}
        defaultView="month"
        toolbar
        showAllEvents
        className="h-full"
        max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
        formats={{
          weekdayFormat: (date, culture, localizer) =>
            localizer?.format(date, "EEE", culture) ?? "",
        }}
        components={{
          eventWrapper: ({ event }) => {
            return (
              <EventCard
                title={event.title}
                assignee={event.assignee}
                project={event.project}
                status={event.status}
                id={event.id}
              />
            );
          },
          toolbar: () => {
            return <CustomToolbar date={value} onNavigate={handleNavigate} />;
          },
        }}
      />
    </div>
  );
}
