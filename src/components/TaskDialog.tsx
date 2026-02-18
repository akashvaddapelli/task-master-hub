import { useState } from "react";
import { Task } from "@/lib/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Flag, CalendarDays, Type, AlignLeft, Rocket } from "lucide-react";
import { useTheme, AnimeTheme } from "@/contexts/ThemeContext";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSave: (data: { title: string; description: string; priority: "low" | "medium" | "high"; due_date: string | null }) => void;
  loading?: boolean;
}

const priorityLabels: Record<AnimeTheme, { low: string; medium: string; high: string }> = {
  shinchan: { low: "😌 Chill~", medium: "😤 Let's Do It!", high: "🔥 URGENT!" },
  doraemon: { low: "☁️ Take it easy~", medium: "🔔 Gadget time!", high: "🚨 Emergency!" },
  benten: { low: "🟢 Low Priority", medium: "🟡 Standard Ops", high: "🔴 CRITICAL" },
};

const TaskDialog = ({ open, onOpenChange, task, onSave, loading }: TaskDialogProps) => {
  const { theme, branding } = useTheme();
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

  const labels = priorityLabels[theme];
  const titleLabel = theme === "benten" ? "Objective" : theme === "doraemon" ? "Quest Name" : "Mission Name";
  const detailLabel = theme === "benten" ? "Intel" : theme === "doraemon" ? "Details" : "Details";
  const priorityLabel = theme === "benten" ? "Threat Level" : theme === "doraemon" ? "Urgency" : "Priority Level";
  const deadlineLabel = theme === "benten" ? "Deadline" : theme === "doraemon" ? "Due Date" : "Deadline";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl w-[95vw] shadow-theme-xl rounded-2xl p-0 overflow-hidden animate-bounce-in border-2 border-primary/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/30 to-accent/10 border-b-2 border-primary/10 px-5 pt-4 pb-3 sm:px-6 sm:pt-5 sm:pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 shadow-theme-sm">
                <span className="text-xl">{task ? "✏️" : branding.emoji}</span>
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold">
                  {task ? `Edit ${branding.missionWord}!` : `New ${branding.missionWord}!`}
                </DialogTitle>
                <DialogDescription className="text-sm mt-0.5 font-medium">
                  {task
                    ? theme === "benten" ? "Recalibrate mission parameters." : `Update your ${branding.missionWord.toLowerCase()} details~`
                    : theme === "benten" ? "Configure new mission parameters." : `What's your next adventure? Let's go!`
                  }
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 sm:px-6 sm:py-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-bold flex items-center gap-2">
              <Type className="h-4 w-4 text-primary" />
              {titleLabel} {theme === "benten" ? "📡" : "✨"}
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={theme === "benten" ? "Enter objective designation..." : "What needs to be done?"}
              required
              className="h-10 text-sm rounded-xl border-2 shadow-theme-sm focus:shadow-theme-md focus:border-primary/50 transition-all duration-200"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-bold flex items-center gap-2">
              <AlignLeft className="h-4 w-4 text-primary" />
              {detailLabel} {theme === "benten" ? "📋" : "📋"}
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={theme === "benten" ? "Provide mission intel..." : "Add more details..."}
              rows={3}
              className="text-sm rounded-xl border-2 shadow-theme-sm focus:shadow-theme-md focus:border-primary/50 transition-all duration-200 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-bold flex items-center gap-2">
                <Flag className="h-4 w-4 text-primary" />
                {priorityLabel} {theme === "benten" ? "🎯" : "🎯"}
              </Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as "low" | "medium" | "high")}>
                <SelectTrigger className="h-10 text-sm rounded-xl border-2 shadow-theme-sm hover:shadow-theme-md transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="shadow-theme-lg rounded-xl">
                  <SelectItem value="low" className="py-2 cursor-pointer rounded-lg">
                    <span className="flex items-center gap-2">{labels.low}</span>
                  </SelectItem>
                  <SelectItem value="medium" className="py-2 cursor-pointer rounded-lg">
                    <span className="flex items-center gap-2">{labels.medium}</span>
                  </SelectItem>
                  <SelectItem value="high" className="py-2 cursor-pointer rounded-lg">
                    <span className="flex items-center gap-2">{labels.high}</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="due_date" className="text-sm font-bold flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                {deadlineLabel} 📅
              </Label>
              <Input
                id="due_date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-10 text-sm rounded-xl border-2 shadow-theme-sm focus:shadow-theme-md focus:border-primary/50 transition-all duration-200"
              />
            </div>
          </div>

          <DialogFooter className="pt-3 border-t-2 border-primary/10 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 px-5 text-sm rounded-full border-2 hover-lift press-effect"
            >
              {branding.cancelLabel}
            </Button>
            <Button
              type="submit"
              disabled={loading || !title.trim()}
              className="h-10 px-6 text-sm rounded-full hover-glow press-effect shadow-theme-md"
            >
              <Rocket className="mr-2 h-4 w-4" />
              {loading ? "Saving…" : task ? branding.updateLabel : branding.saveLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
