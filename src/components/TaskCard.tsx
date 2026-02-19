import { Task } from "@/lib/tasks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useTheme, AnimeTheme } from "@/contexts/ThemeContext";

interface TaskCardProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const priorityConfigs: Record<AnimeTheme, Record<string, { style: string; border: string; emoji: string; label: string }>> = {
  venom: {
    high: { style: "bg-destructive/10 text-destructive border-destructive/30", border: "border-l-destructive", emoji: "💀", label: "LETHAL" },
    medium: { style: "bg-warning/10 text-warning border-warning/30", border: "border-l-warning", emoji: "🕷️", label: "HOSTILE" },
    low: { style: "bg-success/10 text-success border-success/30", border: "border-l-success", emoji: "🌑", label: "DORMANT" },
  },
  spiderman: {
    high: { style: "bg-destructive/10 text-destructive border-destructive/30", border: "border-l-destructive", emoji: "🔴", label: "CRITICAL" },
    medium: { style: "bg-warning/10 text-warning border-warning/30", border: "border-l-warning", emoji: "⚡", label: "ACTIVE" },
    low: { style: "bg-success/10 text-success border-success/30", border: "border-l-success", emoji: "🔵", label: "PATROL" },
  },
};

const TaskCard = ({ task, onToggle, onEdit, onDelete }: TaskCardProps) => {
  const { theme } = useTheme();
  const isCompleted = task.status === "completed";
  const p = priorityConfigs[theme][task.priority];

  const completedPrefix = theme === "venom" ? "☠️ " : "✅ ";

  return (
    <div
      className={`
        group relative flex items-start gap-4 rounded-2xl border-2 border-l-4 bg-card p-5
        shadow-theme-sm transition-all duration-300
        hover:shadow-theme-lg hover:-translate-y-1
        ${theme === "venom" ? "hover:scale-[1.01]" : ""}
        active:shadow-theme-md active:translate-y-0
        ${p.border}
        ${isCompleted ? "opacity-50" : ""}
        animate-fade-in
      `}
    >
      <Checkbox
        checked={isCompleted}
        onCheckedChange={() => onToggle(task)}
        className="mt-1 h-5 w-5 rounded-md transition-all duration-200 hover:scale-125"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={`text-base font-bold text-card-foreground transition-all duration-200 ${isCompleted ? "line-through" : ""}`}>
            {isCompleted ? completedPrefix : ""}{task.title}
          </h3>
          <Badge variant="outline" className={`text-xs font-bold rounded-full px-3 ${p.style}`}>
            {p.emoji} {p.label}
          </Badge>
        </div>
        {task.description && (
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">{task.description}</p>
        )}
        {task.due_date && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1 text-xs font-bold text-secondary-foreground">
            <Calendar className="h-3 w-3" />
            {format(new Date(task.due_date), "MMM d, yyyy")}
          </div>
        )}
      </div>
      <div className="flex gap-1 opacity-0 transition-all duration-200 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full hover:bg-accent/15 hover:text-accent active:scale-90 transition-all duration-150"
          onClick={() => onEdit(task)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full hover:bg-destructive/15 hover:text-destructive active:scale-90 transition-all duration-150"
          onClick={() => onDelete(task)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
