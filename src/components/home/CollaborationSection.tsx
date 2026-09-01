"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Zap, Bell, CheckCircle2, Users, Radio, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";

export function CollaborationSection() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Amit Chandra",
      role: "Lead Developer",
      avatar: "AC",
      avatarBg: "bg-indigo-600",
      content: "Amit completed the authentication module with JWT & bcrypt integration.",
      time: "10:14 AM",
      type: "system_event",
    },
    {
      id: 2,
      sender: "Rahim Ahmed",
      role: "Frontend Engineer",
      avatar: "RA",
      avatarBg: "bg-purple-600",
      content: "Rahim updated the project dashboard UI with real-time Socket.io state.",
      time: "10:15 AM",
      type: "message",
    },
    {
      id: 3,
      sender: "System Bot",
      role: "Automation",
      avatar: "SB",
      avatarBg: "bg-emerald-600",
      content: "You were assigned a new task: 'GraphQL Query Optimization'.",
      time: "10:15 AM",
      type: "notification",
    },
  ]);

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Socket.io Real-Time Engine"
          title="Your team, always"
          highlightedTitle="in sync."
          description="Experience zero-latency instant messaging, live presence indicators, and immediate notification updates across all devices."
          className="mb-16"
        />

        {/* Real-time Collaboration Interactive Mock Window */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 max-w-[1440px] mx-auto border border-slate-200/80 dark:border-slate-800 shadow-xl">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  # general-sprint-room
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Socket.io Channel • 6 Active Members Online
                </p>
              </div>
            </div>

            <Badge variant="success" icon={<Zap className="w-3 h-3 text-emerald-500 fill-emerald-500" />}>
              Socket Active
            </Badge>
          </div>

          {/* Chat Messages Stream */}
          <div className="py-6 space-y-4 max-h-[380px] overflow-y-auto px-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 hover:border-indigo-500/30 transition-colors"
              >
                <div
                  className={`w-9 h-9 rounded-xl ${msg.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
                >
                  {msg.avatar}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {msg.sender}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                        {msg.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.time}</span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Box Mock */}
          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              readOnly
              placeholder="Send real-time message to team..."
              className="flex-1 py-2.5 px-4 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              type="button"
              className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
