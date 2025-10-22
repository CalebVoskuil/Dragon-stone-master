import { cn } from "../ui/utils";

interface SDStatCircleProps {
  value: string | number;
  label: string;
  color?: 'primary' | 'pending' | 'accept' | 'reject';
  className?: string;
}

export function SDStatCircle({ 
  value, 
  label, 
  color = 'primary',
  className 
}: SDStatCircleProps) {
  const colorClasses = {
    primary: 'bg-white/20 text-white',
    pending: 'bg-[#F77F00]/20 text-[#F77F00]',
    accept: 'bg-[#FFD60A]/20 text-[#2D2D2D]',
    reject: 'bg-[#E63946]/20 text-[#E63946]'
  };

  return (
    <div className={cn(
      "w-[78px] h-[78px] rounded-full flex flex-col items-center justify-center",
      colorClasses[color],
      className
    )}>
      <div className="text-xl font-semibold leading-none mb-1">
        {value}
      </div>
      <div className="text-xs font-medium text-center leading-tight px-1">
        {label}
      </div>
    </div>
  );
}