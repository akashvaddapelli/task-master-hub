import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Get all pending tasks with due dates
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("*")
      .eq("status", "pending")
      .not("due_date", "is", null);

    if (tasksError) throw tasksError;
    if (!tasks || tasks.length === 0) {
      return new Response(JSON.stringify({ message: "No tasks to check" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const notifications: Array<{
      user_id: string;
      task_id: string;
      title: string;
      message: string;
      type: string;
    }> = [];

    for (const task of tasks) {
      const dueTime = task.due_time || "09:00:00";
      const taskDue = new Date(`${task.due_date}T${dueTime}`);

      // Check what notifications already exist for this task
      const { data: existing } = await supabase
        .from("notifications")
        .select("type")
        .eq("task_id", task.id);

      const existingTypes = new Set((existing || []).map((n: { type: string }) => n.type));

      // At due time (within 5 min window)
      const diffDue = taskDue.getTime() - now.getTime();
      if (diffDue >= -300000 && diffDue <= 300000 && !existingTypes.has("reminder_due")) {
        notifications.push({
          user_id: task.user_id,
          task_id: task.id,
          title: "⏰ Task Due Now!",
          message: `"${task.title}" is due right now.`,
          type: "reminder_due",
        });
      }

      // 1 hour before (within 5 min window)
      const diffHour = taskDue.getTime() - oneHourLater.getTime();
      if (
        diffDue > 300000 &&
        diffHour >= -300000 &&
        diffHour <= 300000 &&
        !existingTypes.has("reminder_1h")
      ) {
        notifications.push({
          user_id: task.user_id,
          task_id: task.id,
          title: "🔔 Task Due in 1 Hour",
          message: `"${task.title}" is due in about 1 hour.`,
          type: "reminder_1h",
        });
      }

      // 1 day before (within 30 min window)
      const diffDay = taskDue.getTime() - oneDayLater.getTime();
      if (
        diffDue > 3600000 &&
        diffDay >= -1800000 &&
        diffDay <= 1800000 &&
        !existingTypes.has("reminder_1d")
      ) {
        notifications.push({
          user_id: task.user_id,
          task_id: task.id,
          title: "📋 Task Due Tomorrow",
          message: `"${task.title}" is due in about 24 hours.`,
          type: "reminder_1d",
        });
      }
    }

    if (notifications.length > 0) {
      const { error: insertError } = await supabase
        .from("notifications")
        .insert(notifications);
      if (insertError) throw insertError;
    }

    return new Response(
      JSON.stringify({
        message: `Checked ${tasks.length} tasks, created ${notifications.length} notifications`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
