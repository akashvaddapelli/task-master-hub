import { Task } from "@/lib/tasks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Calendar, GripVertical } from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const priorityStyles: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/30 shadow-[inset_0_0_0_1px] shadow-destructive/10",
  medium: "bg-warning/10 text-warning border-warning/30 shadow-[inset_0_0_0_1px] shadow-warning/10",
  low: "bg-success/10 text-success border-success/30 shadow-[inset_0_0_0_1px] shadow-success/10",
};

const priorityBorder: Record<string, string> = {
  high: "border-l-destructive",
  medium: "border-l-warning",
  low: "border-l-success",
};

const TaskCard = ({ task, onToggle, onEdit, onDelete }: TaskCardProps) => {
  const isCompleted = task.status === "completed";

  return (
    <div
      className={`
        group relative flex items-start gap-4 rounded-xl border border-l-4 bg-card p-5
        shadow-theme-sm transition-all duration-300
        hover:shadow-theme-lg hover:-translate-y-0.5
        active:shadow-theme-md active:translate-y-0
        ${priorityBorder[task.priority]}
        ${isCompleted ? "opacity-50" : ""}
        animate-fade-in
      `}
    >
      <Checkbox
        checked={isCompleted}
        onCheckedChange={() => onToggle(task)}
        className="mt-1 h-5 w-5 transition-all duration-200 hover:scale-110"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={`text-base font-semibold text-card-foreground transition-all duration-200 ${isCompleted ? "line-through" : ""}`}>
            {task.title}
          </h3>
          <Badge variant="outline" className={`text-xs font-medium ${priorityStyles[task.priority]}`}>
            {task.priority}
          </Badge>
        </div>
        {task.description && (
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">{task.description}</p>
        )}
        {task.due_date && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            <Calendar className="h-3 w-3" />
            {format(new Date(task.due_date), "MMM d, yyyy")}
          </div>
        )}
      </div>
      <div className="flex gap-1 opacity-0 transition-all duration-200 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary active:scale-95 transition-all duration-150"
          onClick={() => onEdit(task)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg hover:bg-destructive/10 hover:text-destructive active:scale-95 transition-all duration-150"
          onClick={() => onDelete(task)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
