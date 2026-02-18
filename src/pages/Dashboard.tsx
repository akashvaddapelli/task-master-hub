import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchTasks, createTask, updateTask, deleteTask, Task } from "@/lib/tasks";
import TaskCard from "@/components/TaskCard";
import TaskDialog from "@/components/TaskDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckSquare, Plus, LogOut, Search, ListFilter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const createMutation = useMutation({
    mutationFn: (data: { title: string; description: string; priority: "low" | "medium" | "high"; due_date: string | null }) =>
      createTask({ ...data, user_id: user!.id, status: "pending" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setDialogOpen(false);
      toast({ title: "Task created" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Task>) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setDialogOpen(false);
      setEditingTask(null);
      toast({ title: "Task updated" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "Task deleted" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const filtered = tasks
    .filter((t) => filter === "all" || t.status === filter)
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    pending: tasks.filter((t) => t.status === "pending").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
            <CheckSquare className="h-6 w-6 text-primary" />
            TaskFlow
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl py-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: "Total", value: stats.total },
            { label: "Pending", value: stats.pending },
            { label: "Completed", value: stats.completed },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border bg-card p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search tasks…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <SelectTrigger className="w-36">
                <ListFilter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => { setEditingTask(null); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        </div>

        {/* Task List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-card p-12 text-center">
            <CheckSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium text-foreground">No tasks yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Create your first task to get started</p>
            <Button className="mt-4" onClick={() => { setEditingTask(null); setDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Create Task
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={(t) => updateMutation.mutate({ id: t.id, status: t.status === "completed" ? "pending" : "completed" })}
                onEdit={(t) => { setEditingTask(t); setDialogOpen(true); }}
                onDelete={(t) => deleteMutation.mutate(t.id)}
              />
            ))}
          </div>
        )}
      </main>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        loading={createMutation.isPending || updateMutation.isPending}
        onSave={(data) => {
          if (editingTask) {
            updateMutation.mutate({ id: editingTask.id, ...data });
          } else {
            createMutation.mutate(data);
          }
        }}
      />
    </div>
  );
};

export default Dashboard;
