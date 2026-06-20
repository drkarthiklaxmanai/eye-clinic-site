// netlify/functions/manage-bookings.js
//
// Server-side function for staff-admin to read/write Supabase booking
// and schedule data. Uses the Supabase service role key (server-side
// only, never exposed to the browser) so it can bypass RLS safely --
// access is gated entirely by the ADMIN_PASSWORD check below.

let createClient;
try {
  createClient = require("@supabase/supabase-js").createClient;
} catch (importError) {
  console.error("Failed to import @supabase/supabase-js:", importError);
}

const SUPABASE_URL = "https://tvvknokblzmjxlixdqce.supabase.co";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  const { password, action, data } = payload;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: "Incorrect password" }) };
  }

  if (!createClient) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server module @supabase/supabase-js failed to load." }),
    };
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "SUPABASE_SERVICE_ROLE_KEY environment variable is missing." }),
    };
  }

  // Disable the Realtime client entirely -- we never use subscriptions
  // in this function, and Realtime's WebSocket setup crashes on
  // Netlify's Node 20 runtime (no native WebSocket support pre-Node 22).
  const supabase = createClient(SUPABASE_URL, serviceRoleKey, {
    realtime: { disabled: true },
  });

  try {
    switch (action) {
      case "list_appointments": {
        const { data: rows, error } = await supabase
          .from("appointments")
          .select("*")
          .order("appointment_date", { ascending: true })
          .order("appointment_time", { ascending: true });
        if (error) throw error;
        return ok({ appointments: rows });
      }

      case "cancel_appointment": {
        const { error } = await supabase
          .from("appointments")
          .update({ status: "cancelled" })
          .eq("id", data.id);
        if (error) throw error;
        return ok({ success: true });
      }

      case "list_weekly_schedule": {
        const { data: rows, error } = await supabase
          .from("weekly_schedule")
          .select("*")
          .order("day_of_week", { ascending: true });
        if (error) throw error;
        return ok({ schedule: rows });
      }

      case "toggle_schedule_slot": {
        const { error } = await supabase
          .from("weekly_schedule")
          .update({ is_active: data.is_active })
          .eq("id", data.id);
        if (error) throw error;
        return ok({ success: true });
      }

      case "add_schedule_slot": {
        const { error } = await supabase
          .from("weekly_schedule")
          .insert({ day_of_week: data.day_of_week, time_slot: data.time_slot, is_active: true });
        if (error) throw error;
        return ok({ success: true });
      }

      case "list_blocked_dates": {
        const { data: rows, error } = await supabase
          .from("blocked_dates")
          .select("*")
          .order("blocked_date", { ascending: true });
        if (error) throw error;
        return ok({ blockedDates: rows });
      }

      case "add_blocked_date": {
        const { error } = await supabase
          .from("blocked_dates")
          .insert({ blocked_date: data.blocked_date, reason: data.reason || null });
        if (error) throw error;
        return ok({ success: true });
      }

      case "remove_blocked_date": {
        const { error } = await supabase.from("blocked_dates").delete().eq("id", data.id);
        if (error) throw error;
        return ok({ success: true });
      }

      case "list_blocked_slots": {
        const { data: rows, error } = await supabase
          .from("blocked_slots")
          .select("*")
          .order("blocked_date", { ascending: true });
        if (error) throw error;
        return ok({ blockedSlots: rows });
      }

      case "add_blocked_slot": {
        const { error } = await supabase
          .from("blocked_slots")
          .insert({ blocked_date: data.blocked_date, time_slot: data.time_slot, reason: data.reason || null });
        if (error) throw error;
        return ok({ success: true });
      }

      case "remove_blocked_slot": {
        const { error } = await supabase.from("blocked_slots").delete().eq("id", data.id);
        if (error) throw error;
        return ok({ success: true });
      }

      default:
        return { statusCode: 400, body: JSON.stringify({ error: "Unknown action" }) };
    }
  } catch (error) {
    console.error("manage-bookings error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Something went wrong.",
        debug: { name: error.name, stack: error.stack?.split("\n").slice(0, 3) },
      }),
    };
  }
};

function ok(body) {
  return { statusCode: 200, body: JSON.stringify(body) };
}
