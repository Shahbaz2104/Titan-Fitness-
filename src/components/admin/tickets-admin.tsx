"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ChevronDown, MessageSquare, Send, Ticket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { QUERY_KEYS } from "@/lib/constants";
import { useApiQuery, useApiMutation } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface TicketMessage {
  id: string;
  senderId: string;
  senderRole: string;
  content: string;
  createdAt: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  messages: TicketMessage[];
}

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

const STATUS_STYLES: Record<string, string> = {
  OPEN: "warning",
  IN_PROGRESS: "primary",
  RESOLVED: "success",
  CLOSED: "outline",
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TicketsAdmin() {
  const queryClient = useQueryClient();
  const { data: tickets, isLoading, isError } = useApiQuery<Ticket[]>(QUERY_KEYS.adminTickets, "/api/admin/tickets");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState<Record<string, string>>({});
  const [sending, setSending] = React.useState(false);

  const sendReply = useApiMutation(`/api/admin/tickets/${expandedId ?? ""}/reply`);
  const changeStatus = useApiMutation<{ id: string }>(`/api/admin/tickets/${expandedId ?? ""}/status`, "PATCH");

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminTickets });
  };

  const handleReply = async (ticketId: string) => {
    const content = (replyText[ticketId] ?? "").trim();
    if (!content) return;
    setSending(true);
    try {
      await sendReply({ content });
      toast.success("Reply sent");
      setReplyText({ ...replyText, [ticketId]: "" });
      await refresh();
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const handleStatus = async (status: string) => {
    try {
      await changeStatus({ status });
      toast.success(`Ticket marked ${status.replace("_", " ").toLowerCase()}`);
      await refresh();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Support tickets"
        description={`${tickets?.filter((t) => t.status === "OPEN").length ?? "…"} open tickets`}
        icon={<Ticket className="h-5 w-5" />}
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : isError || !tickets ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <AlertTriangle className="h-8 w-8 text-warning" />
            <p className="text-sm text-muted-foreground">Could not load tickets.</p>
          </CardContent>
        </Card>
      ) : tickets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No support tickets yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => {
            const lastMessage = ticket.messages[ticket.messages.length - 1];
            return (
              <div key={ticket.id}>
                <motion.button
                  layout="position"
                  onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}
                  className="flex w-full items-center gap-4 rounded-2xl border border-border bg-surface/60 p-4 text-left transition-all hover:border-primary/30"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/15 text-primary">
                      {ticket.user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{ticket.subject}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {ticket.user.name} · {lastMessage?.content ?? "No messages yet"}
                    </p>
                  </div>
                  <div className="hidden items-center gap-2 sm:flex">
                    <Badge variant="outline">{ticket.priority}</Badge>
                    <Badge variant={STATUS_STYLES[ticket.status] as never}>{ticket.status}</Badge>
                  </div>
                  <span className="hidden text-xs text-muted-foreground md:block">{formatDate(ticket.createdAt)}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                      expandedId === ticket.id && "rotate-180"
                    )}
                  />
                </motion.button>

                {expandedId === ticket.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-2xl border border-border bg-surface/40 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-medium text-foreground">
                          From: <span className="text-muted-foreground">{ticket.user.name} ({ticket.user.email})</span>
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Status:</span>
                          <Select value={ticket.status} onValueChange={(v) => handleStatus(v)}>
                            <SelectTrigger className="h-9 w-40 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUSES.map((s) => (
                                <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        {ticket.messages.length === 0 && (
                          <p className="rounded-xl border border-dashed border-border py-4 text-center text-xs text-muted-foreground">
                            No messages yet
                          </p>
                        )}
                        {ticket.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={cn(
                              "max-w-[85%] rounded-2xl border border-border bg-surface p-3 text-sm",
                              msg.senderRole === "ADMIN" ? "ml-auto border-primary/30" : "mr-auto"
                            )}
                          >
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {msg.senderRole === "ADMIN" ? "You (admin)" : ticket.user.name} · {formatDate(msg.createdAt)}
                            </p>
                            <p className="whitespace-pre-wrap text-foreground">{msg.content}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex gap-3">
                        <Textarea
                          value={replyText[ticket.id] ?? ""}
                          onChange={(e) => setReplyText({ ...replyText, [ticket.id]: e.target.value })}
                          placeholder="Write a reply…"
                          rows={2}
                          className="flex-1"
                        />
                        <Button
                          onClick={() => handleReply(ticket.id)}
                          disabled={sending || !(replyText[ticket.id] ?? "").trim()}
                          className="shrink-0"
                        >
                          <Send className="h-4 w-4" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
