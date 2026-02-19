import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
  priority: "low" | "medium" | "high";
  due_date: string | null;
  due_time: string | null;
  created_at: string;
  updated_at: string;
}

export type TaskInsert = Omit<Task, "id" | "created_at" | "updated_at">;
export type TaskUpdate = Partial<Omit<Task, "id" | "user_id" | "created_at" | "updated_at">>;

export const fetchTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Task[];
};

export const createTask = async (task: TaskInsert): Promise<Task> => {
  const { data, error } = await supabase.from("tasks").insert(task).select().single();
  if (error) throw error;
  return data as Task;
};

export const updateTask = async (id: string, updates: TaskUpdate): Promise<Task> => {
  const { data, error } = await supabase.from("tasks").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as Task;
};

export const deleteTask = async (id: string): Promise<void> => {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
};
