'use client';

import * as React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Container, Section, Grid, Flex, Stack } from '../../../components/layout/LayoutComponents';

interface EmployeeTask {
  id: string;
  title: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  isCompleted: boolean;
}

export default function EmployeeDashboardPage() {
  const [isCheckedIn, setIsCheckedIn] = React.useState(false);
  const [checkInTime, setCheckInTime] = React.useState<string | null>(null);
  const [isOnBreak, setIsOnBreak] = React.useState(false);
  
  const [tasks, setTasks] = React.useState<EmployeeTask[]>([
    { id: '1', title: 'Deep clean prep counter #2', dueDate: '10:00 PM', priority: 'High', isCompleted: false },
    { id: '2', title: 'Restock tandoori chicken marinade', dueDate: '11:00 PM', priority: 'Medium', isCompleted: true },
    { id: '3', title: 'Audit mozzarella cheese inventory', dueDate: '11:30 PM', priority: 'Low', isCompleted: false },
  ]);

  const [leaveReason, setLeaveReason] = React.useState('');
  const [leaveDate, setLeaveDate] = React.useState('');

  const handleCheckInToggle = () => {
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      setCheckInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      alert('Attendance check-in successful! Have a great shift.');
    } else {
      setIsCheckedIn(false);
      setCheckInTime(null);
      setIsOnBreak(false);
      alert('Shift check-out recorded. Payslip calculations updated.');
    }
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)
    );
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveDate || !leaveReason) return alert('Please enter valid leave specifications');
    alert(`Leave request for ${leaveDate} submitted to manager approval.`);
    setLeaveDate('');
    setLeaveReason('');
  };

  return (
    <div className="flex-grow flex bg-[#F9F6F0] dark:bg-[#121110] text-foreground min-h-screen font-sans">
      {/* Sidebar for Employee dashboard */}
      <aside className="w-64 border-r border-border bg-card p-6 hidden md:block shrink-0">
        <div className="mb-8">
          <span className="text-xl font-bold font-display text-primary flex items-center gap-1.5">
            🍕 <span className="text-foreground font-sans">Swadesh HRMS</span>
          </span>
        </div>
        <div className="flex flex-col gap-6 text-sm select-none">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">My Identity</span>
            <div className="font-bold mt-1">Rahul Verma</div>
            <span className="text-xs text-foreground/50">Kitchen Commis Chef</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Shift Timing</span>
            <span className="font-mono text-xs font-semibold mt-1">12:00 PM - 09:00 PM</span>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        <Container>
          {/* Header Action row */}
          <Flex justify="between" className="mb-8 select-none">
            <div>
              <h1 className="text-3xl font-display font-bold">Employee Workspace</h1>
              <p className="text-xs text-foreground/50 mt-1">Manage shift times, check-ins, tasks, and leave bookings.</p>
            </div>
            <Button
              onClick={handleCheckInToggle}
              variant={isCheckedIn ? 'outline' : 'primary'}
              className="px-6 py-2.5 font-bold shadow-md"
            >
              {isCheckedIn ? '🛑 Check Out Shift' : '🟢 Check In Shift'}
            </Button>
          </Flex>

          <Grid cols={3} className="gap-8 items-start">
            {/* Left main area: Stats, tasks */}
            <div className="col-span-2 flex flex-col gap-6">
              {/* Attendance Tracker */}
              <Card className="p-6 border border-border bg-card">
                <h3 className="font-heading font-bold text-lg mb-4">Daily Attendance logs</h3>
                <Grid cols={3} className="text-center font-sans">
                  <div className="border-r border-border/60 py-2">
                    <span className="text-xs text-foreground/50 uppercase block">Status</span>
                    <span className={`text-base font-bold mt-1 block ${isCheckedIn ? 'text-success' : 'text-foreground/40'}`}>
                      {isCheckedIn ? 'ON DUTY' : 'OFF DUTY'}
                    </span>
                  </div>
                  <div className="border-r border-border/60 py-2">
                    <span className="text-xs text-foreground/50 uppercase block">Check In Time</span>
                    <span className="font-mono text-base font-semibold mt-1 block">
                      {checkInTime || '--:--'}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-xs text-foreground/50 uppercase block">Break Status</span>
                    <button
                      disabled={!isCheckedIn}
                      onClick={() => setIsOnBreak(!isOnBreak)}
                      className={`text-xs font-bold mt-1 px-3 py-1 rounded-full cursor-pointer transition-colors ${
                        isOnBreak ? 'bg-warning text-white' : 'bg-foreground/5 hover:bg-foreground/10 text-foreground/75'
                      }`}
                    >
                      {isOnBreak ? 'ON BREAK' : 'GO ON BREAK'}
                    </button>
                  </div>
                </Grid>
              </Card>

              {/* Checklist Tasks */}
              <Card className="p-6 border border-border bg-card">
                <h3 className="font-heading font-bold text-lg mb-4">Assigned Tasks ({tasks.filter(t => !t.isCompleted).length} pending)</h3>
                <Stack gap="sm">
                  {tasks.map((task) => (
                    <label
                      key={task.id}
                      className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0 select-none cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.isCompleted}
                          onChange={() => handleToggleTask(task.id)}
                          className="rounded border-border text-primary focus:ring-primary/20 w-4 h-4"
                        />
                        <span className={`text-sm ${task.isCompleted ? 'line-through text-foreground/40' : 'font-semibold'}`}>
                          {task.title}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        task.priority === 'High' ? 'bg-error/10 text-error' : task.priority === 'Medium' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'
                      }`}>
                        {task.priority}
                      </span>
                    </label>
                  ))}
                </Stack>
              </Card>
            </div>

            {/* Right sidebar: Leave Booking & Payslip */}
            <div className="flex flex-col gap-6">
              {/* Leave Apply form */}
              <Card className="p-6 border border-border bg-card">
                <h3 className="font-heading font-bold text-lg mb-4">Request Leave</h3>
                <form onSubmit={handleApplyLeave} className="flex flex-col gap-4">
                  <Input
                    label="Leave Date"
                    type="date"
                    required
                    value={leaveDate}
                    onChange={(e) => setLeaveDate(e.target.value)}
                    id="ldate"
                  />
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="lreason" className="text-sm font-semibold text-foreground/80">Reason</label>
                    <textarea
                      id="lreason"
                      required
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      placeholder="e.g. Health checkup, emergency trip"
                      className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 min-h-[70px] text-xs"
                    />
                  </div>
                  <Button type="submit" variant="primary" className="w-full py-2.5 mt-2">
                    Submit Request
                  </Button>
                </form>
              </Card>

              {/* Salary Payslip Card */}
              <Card className="p-6 border border-border bg-card flex flex-col gap-4">
                <h3 className="font-heading font-bold text-lg">Payroll & Payslip</h3>
                <div className="text-xs flex flex-col gap-2 border-b border-border pb-3">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Base Salary:</span>
                    <span className="font-mono font-bold">₹28,000 / mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Shift Allowance:</span>
                    <span className="font-mono font-semibold">+₹2,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Deductions (EPF):</span>
                    <span className="font-mono font-semibold text-error">-₹1,800</span>
                  </div>
                </div>
                <Button onClick={() => alert('Downloading May 2026 Payslip PDF...')} variant="outline" className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold">
                  Download Payslip
                </Button>
              </Card>
            </div>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
