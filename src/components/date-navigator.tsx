"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { fr } from "date-fns/locale";
import { format, parseISO, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  calendarDateInTimeZone,
  CLIENT_TIMEZONE,
} from "@/lib/calendar-day";

type Props = {
  value: string;
  onChange: (iso: string) => void;
  className?: string;
};

function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function DateNavigator({ value, onChange, className }: Props) {
  const [open, setOpen] = useState(false);
  const todayIso = useMemo(
    () => calendarDateInTimeZone(CLIENT_TIMEZONE),
    []
  );
  const dateObj = parseISO(value);
  const isToday = value === todayIso;

  const label = (() => {
    if (isToday) return "Aujourd'hui";
    const today = parseISO(todayIso);
    const diffDays = Math.round(
      (dateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === -1) return "Hier";
    if (diffDays === 1) return "Demain";
    return format(dateObj, "EEE d MMM", { locale: fr });
  })();

  return (
    <div className={`flex items-center gap-1 ${className ?? ""}`}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onChange(toIso(addDays(dateObj, -1)))}
        aria-label="Jour précédent"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className="inline-flex items-center gap-1.5 rounded-md border border-warm-border bg-background px-3 h-8 text-sm font-medium hover:bg-muted min-w-[9rem] justify-center"
        >
          <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="capitalize">{label}</span>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={dateObj}
            onSelect={(d) => {
              if (d) {
                onChange(toIso(d));
                setOpen(false);
              }
            }}
            locale={fr}
            weekStartsOn={1}
          />
          {!isToday && (
            <div className="border-t border-warm-border p-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => {
                  onChange(todayIso);
                  setOpen(false);
                }}
              >
                Aujourd&apos;hui
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onChange(toIso(addDays(dateObj, 1)))}
        aria-label="Jour suivant"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
