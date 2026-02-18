import { Task } from "@/lib/tasks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const priorityStyles: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-success/10 text-success border-success/20",
};

const TaskCard = ({ task, onToggle, onEdit, onDelete }: TaskCardProps) => {
  const isCompleted = task.status === "completed";

  return (
    <div className={`group flex items-start gap-3 rounded-lg border bg-card p-4 transition-all hover:shadow-sm ${isCompleted ? "opacity-60" : ""} animate-fade-in`}>
      <Checkbox
        checked={isCompleted}
        onCheckedChange={() => onToggle(task)}
        className="mt-0.5"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className={`font-medium text-card-foreground ${isCompleted ? "line-through" : ""}`}>
            {task.title}
          </h3>
          <Badge variant="outline" className={priorityStyles[task.priority]}>
            {task.priority}
          </Badge>
        </div>
        {task.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        )}
        {task.due_date && (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {format(new Date(task.due_date), "MMM d, yyyy")}
          </div>
        )}
      </div>
      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(task)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(task)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
