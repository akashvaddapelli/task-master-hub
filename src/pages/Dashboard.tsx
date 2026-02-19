import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchTasks, createTask, updateTask, deleteTask, Task } from "@/lib/tasks";
import TaskCard from "@/components/TaskCard";
import TaskDialog from "@/components/TaskDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, LogOut, Search, ListFilter, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { branding } = useTheme();
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
      toast({ title: branding.toastCreate });
    },
    onError: (e: Error) => toast({ title: branding.toastError, description: e.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Task>) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setDialogOpen(false);
      setEditingTask(null);
      toast({ title: branding.toastUpdate });
    },
    onError: (e: Error) => toast({ title: branding.toastError, description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: branding.toastDelete });
    },
    onError: (e: Error) => toast({ title: branding.toastError, description: e.message, variant: "destructive" }),
  });

  const filtered = tasks
    .filter((t) => filter === "all" || t.status === filter)
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    pending: tasks.filter((t) => t.status === "pending").length,
  };

  const statItems = [
    { label: "Total Tasks", color: "border-primary/20 bg-primary/5", value: stats.total },
    { label: "In Progress", color: "border-warning/20 bg-warning/5", value: stats.pending },
    { label: "Completed", color: "border-success/20 bg-success/5", value: stats.completed },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/80 glass shadow-theme-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link to="/" className="text-xl font-bold text-foreground tracking-tight">
              {branding.name}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
              {user?.email?.split("@")[0]}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={signOut}
              className="rounded-full border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 active:scale-95 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl py-8 px-4 sm:px-6">
        {/* Page Title */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">{branding.tagline}</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statItems.map((s, i) => (
            <div
              key={s.label}
              className={`rounded-2xl border ${s.color} p-5 text-center shadow-theme-sm hover-lift cursor-default animate-fade-in`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <p className="text-3xl font-extrabold text-foreground">{s.value}</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={branding.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 rounded-full border shadow-theme-sm focus:shadow-theme-md transition-shadow duration-200"
              />
            </div>
            <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <SelectTrigger className="w-40 h-11 rounded-full border shadow-theme-sm hover:shadow-theme-md transition-shadow duration-200">
                <ListFilter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="shadow-theme-lg rounded-xl">
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="pending">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => { setEditingTask(null); setDialogOpen(true); }}
            className="h-11 px-6 shadow-theme-md hover-glow press-effect rounded-full text-base"
          >
            <Plus className="mr-2 h-5 w-5" /> New Task
          </Button>
        </div>

        {/* Task List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground font-medium">{branding.loadingText}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-muted bg-card p-16 text-center shadow-theme-sm animate-fade-in">
            <h3 className="text-xl font-bold text-foreground">{branding.emptyTitle}</h3>
            <p className="mt-2 text-muted-foreground">{branding.emptyDescription}</p>
            <Button
              className="mt-6 h-11 px-8 shadow-theme-md hover-glow press-effect rounded-full"
              onClick={() => { setEditingTask(null); setDialogOpen(true); }}
            >
              <Sparkles className="mr-2 h-5 w-5" /> {branding.ctaFirst}
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
