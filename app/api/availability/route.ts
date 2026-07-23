import { NextResponse } from "next/server";
import { services } from "@/lib/data";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

const openDays = new Set([2, 3, 4, 5, 6]);
const startMinutes = 9 * 60;
const endMinutes = 18 * 60;
const stepMinutes = 30;
const bookingOffset = "-05:00";

function isMissingAppointmentsTable(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  return error.code === "PGRST205" || /appointments.*schema cache|table.*appointments.*not found/i.test(error.message || "");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const serviceId = searchParams.get("service");
    const service = services.find((item) => item.id === serviceId);

    if (!date || !service) {
      return NextResponse.json({ error: "Date and service are required" }, { status: 400 });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Date must use YYYY-MM-DD format" }, { status: 400 });
    }

    const selected = new Date(`${date}T12:00:00${bookingOffset}`);
    if (!Number.isFinite(selected.getTime())) {
      return NextResponse.json({ error: "Choose a valid date" }, { status: 400 });
    }

    const supabaseConfigured = isSupabaseConfigured();
    if (!openDays.has(selected.getDay())) {
      return NextResponse.json({ slots: [], databaseConnected: supabaseConfigured, databaseReady: supabaseConfigured });
    }

    let appointments: Array<{ starts_at: string; ends_at: string; status: string }> = [];
    let databaseReady = supabaseConfigured;
    let warning: string | undefined;

    if (supabaseConfigured) {
      const supabase = getSupabaseAdmin();
      const dayStart = new Date(`${date}T00:00:00${bookingOffset}`).toISOString();
      const dayEnd = new Date(`${date}T23:59:59${bookingOffset}`).toISOString();
      const { data, error } = await supabase
        .from("appointments")
        .select("starts_at,ends_at,status")
        .gte("starts_at", dayStart)
        .lte("starts_at", dayEnd)
        .in("status", ["pending", "confirmed"]);

      if (isMissingAppointmentsTable(error)) {
        databaseReady = false;
        warning = "Supabase is connected, but the appointments table has not been created. Showing business-hour availability only.";
      } else if (error) {
        throw new Error(`Unable to read appointments: ${error.message}`);
      } else {
        appointments = data || [];
      }
    } else {
      databaseReady = false;
      warning = "Supabase is not configured; showing business-hour availability without saved appointment conflicts.";
    }

    const slots: string[] = [];
    for (let minutes = startMinutes; minutes + service.duration <= endMinutes; minutes += stepMinutes) {
      const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
      const minute = String(minutes % 60).padStart(2, "0");
      const start = new Date(`${date}T${hour}:${minute}:00${bookingOffset}`);
      if (start.getTime() < Date.now() + 2 * 60 * 60 * 1000) continue;

      const end = new Date(start.getTime() + service.duration * 60000);
      const overlaps = appointments.some(
        (appointment) => start < new Date(appointment.ends_at) && end > new Date(appointment.starts_at)
      );

      if (!overlaps) slots.push(start.toISOString());
    }

    return NextResponse.json({
      slots,
      databaseConnected: supabaseConfigured,
      databaseReady,
      warning
    });
  } catch (error) {
    console.error("Availability route failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load availability" },
      { status: 500 }
    );
  }
}