import { TrendingUp, Clock, Check, Users, AlertCircle, Calendar } from "lucide-react";
import { cn } from "../ui/utils";

interface Stats {
  pending: number;
  today: number;
  approved: number;
  totalStudents: number;
  totalHours: number;
  avgResponseTime: string;
}

interface SDImprovedStatGridProps {
  stats: Stats;
  className?: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  subtitle?: string;
}

function StatCard({ title, value, icon, color, trend, subtitle }: StatCardProps) {
  return (
    <div 
      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: color + '20' }}
        >
          <div style={{ color: color }}>
            {icon}
          </div>
        </div>
        
        {trend && (
          <div className="flex items-center space-x-1 text-white/60">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs">{trend}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-semibold text-white">
          {value}
        </div>
        <div className="text-white/70 text-sm">
          {title}
        </div>
        {subtitle && (
          <div className="text-white/50 text-xs">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

export function SDImprovedStatGrid({ stats, className }: SDImprovedStatGridProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard
          title="Pending Review"
          value={stats.pending}
          icon={<Clock className="w-5 h-5" />}
          color="var(--sd-accent-pending)"
          trend="+2"
          subtitle="requires attention"
        />
        
        <StatCard
          title="Today's Claims"
          value={stats.today}
          icon={<Calendar className="w-5 h-5" />}
          color="var(--sd-accent-accept)"
          trend="+5"
          subtitle="submitted today"
        />
        
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={<Check className="w-5 h-5" />}
          color="var(--sd-accent-green)"
          trend="+12"
          subtitle="this week"
        />
        
        <StatCard
          title="Active Students"
          value={stats.totalStudents}
          icon={<Users className="w-5 h-5" />}
          color="var(--sd-surface-secondary)"
          subtitle="registered"
        />
      </div>

      {/* Quick Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg font-semibold text-white mb-1">
            {stats.totalHours}h
          </div>
          <div className="text-white/60 text-xs">
            Total Verified
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg font-semibold text-white mb-1">
            {stats.avgResponseTime}h
          </div>
          <div className="text-white/60 text-xs">
            Avg Response
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg font-semibold text-white mb-1">
            98%
          </div>
          <div className="text-white/60 text-xs">
            Approval Rate
          </div>
        </div>
      </div>
    </div>
  );
}