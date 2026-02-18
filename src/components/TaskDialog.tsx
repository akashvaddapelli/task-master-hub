import { useState } from "react";
import { Task } from "@/lib/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ClipboardList, Flag, CalendarDays, Type, AlignLeft } from "lucide-react";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSave: (data: { title: string; description: string; priority: "low" | "medium" | "high"; due_date: string | null }) => void;
  loading?: boolean;
}

const TaskDialog = ({ open, onOpenChange, task, onSave, loading }: TaskDialogProps) => {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(task?.priority ?? "medium");
  const [dueDate, setDueDate] = useState(task?.due_date ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, priority, due_date: dueDate || null });
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTitle(task?.title ?? "");
      setDescription(task?.description ?? "");
      setPriority(task?.priority ?? "medium");
      setDueDate(task?.due_date ?? "");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl w-[95vw] shadow-theme-xl rounded-xl p-0 overflow-hidden animate-scale-in">
        {/* Header with gradient */}
        <div className="bg-primary/5 border-b px-6 pt-6 pb-4 sm:px-8 sm:pt-8 sm:pb-5">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-bold">{task ? "Edit Task" : "Create New Task"}</DialogTitle>
                <DialogDescription className="text-sm mt-0.5">
                  {task ? "Update the details of your task below." : "Fill in the details to create a new task."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 sm:px-8 sm:py-6 space-y-5 sm:space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold flex items-center gap-2">
              <Type className="h-4 w-4 text-muted-foreground" />
              Task Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              className="h-12 text-base shadow-theme-sm focus:shadow-theme-md transition-shadow duration-200"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2">
              <AlignLeft className="h-4 w-4 text-muted-foreground" />
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task…"
              rows={5}
              className="text-base shadow-theme-sm focus:shadow-theme-md transition-shadow duration-200 resize-none"
            />
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Flag className="h-4 w-4 text-muted-foreground" />
                Priority
              </Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as "low" | "medium" | "high")}>
                <SelectTrigger className="h-12 text-base shadow-theme-sm hover:shadow-theme-md transition-shadow duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="shadow-theme-lg">
                  <SelectItem value="low" className="py-3 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-success" />
                      Low Priority
                    </span>
                  </SelectItem>
                  <SelectItem value="medium" className="py-3 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-warning" />
                      Medium Priority
                    </span>
                  </SelectItem>
                  <SelectItem value="high" className="py-3 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                      High Priority
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date" className="text-sm font-semibold flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                Due Date
              </Label>
              <Input
                id="due_date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-12 text-base shadow-theme-sm focus:shadow-theme-md transition-shadow duration-200"
              />
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="pt-4 border-t gap-3 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 px-6 text-base hover-lift press-effect"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !title.trim()}
              className="h-11 px-8 text-base hover-glow press-effect"
            >
              {loading ? "Saving…" : task ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
