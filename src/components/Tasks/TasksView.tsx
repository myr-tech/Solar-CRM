import React, { useState } from 'react';
import {
  ListTodo,
  PlusCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Bell,
  Calendar,
  User,
  ExternalLink,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { ProjectTask } from '../../types';
import { formatDate } from '../../utils/formatters';

interface TasksViewProps {
  onSelectProject: (projectId: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ onSelectProject }) => {
  const db = storage.getDatabase();
  const alerts = storage.getAlerts();
  const [filterPriority, setFilterPriority] = useState<string>('ALL');

  const today = new Date().toISOString().slice(0, 10);

  const handleToggleTaskStatus = (taskId: string, currentStatus: ProjectTask['status']) => {
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    storage.updateTask(taskId, { status: nextStatus });
  };

  const filteredTasks = db.tasks.filter((t) => {
    if (filterPriority === 'ALL') return true;
    return t.priority === filterPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <ListTodo className="w-6 h-6 text-amber-400" /> Operational Task Management & Alert Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Stage-driven priorities (🔴 Urgent, 🟠 High, 🟡 Medium, 🟢 Low) with automated overdue bottleneck detection
          </p>
        </div>
      </div>

      {/* Live System Alerts Feed (Requirement 34) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Automated Alert Center ({alerts.length} Active System Alerts)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">Live Discom & Project Triggers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              onClick={() => alt.projectId && onSelectProject(alt.projectId)}
              className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                alt.priority === 'Urgent'
                  ? 'bg-rose-950/40 border-rose-800/80 hover:bg-rose-950/60'
                  : 'bg-amber-950/30 border-amber-800/60 hover:bg-amber-950/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-bold ${
                    alt.priority === 'Urgent' ? 'text-rose-400' : 'text-amber-400'
                  }`}
                >
                  {alt.title}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{alt.date}</span>
              </div>
              <p className="text-slate-300 mt-1 leading-relaxed">{alt.message}</p>
              {alt.projectId && (
                <div className="mt-2 text-[10px] font-mono text-amber-400 flex items-center gap-1">
                  <span>Project Hub: {alt.projectId}</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Assigned Stage Tasks
            </h3>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
              {filteredTasks.length} tasks
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="Urgent">🔴 Urgent</option>
              <option value="High">🟠 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredTasks.map((t) => {
            const isCompleted = t.status === 'Completed';
            const isOverdue = !isCompleted && t.dueDate < today;

            return (
              <div
                key={t.id}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-colors ${
                  isCompleted
                    ? 'bg-slate-850 border-slate-800 opacity-60'
                    : isOverdue
                    ? 'bg-rose-950/20 border-rose-800/80'
                    : 'bg-slate-850 border-slate-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.priority === 'Urgent'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : t.priority === 'High'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {t.priority}
                    </span>
                    <span
                      className={`font-bold ${
                        isCompleted ? 'line-through text-slate-500' : 'text-white'
                      }`}
                    >
                      {t.taskTitle}
                    </span>
                    {isOverdue && (
                      <span className="text-[10px] bg-rose-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                        OVERDUE
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span className="font-mono text-amber-400">{t.projectId}</span>
                    <span>•</span>
                    <span>Customer: {t.customerName}</span>
                    <span>•</span>
                    <span>Assigned: {t.assignedEmployeeName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Due: {formatDate(t.dueDate)}</span>
                  </div>

                  <button
                    onClick={() => handleToggleTaskStatus(t.id, t.status)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                      isCompleted
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                    }`}
                  >
                    {isCompleted ? 'Mark Pending' : 'Mark Completed'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
