import { cn } from "../ui/utils";

interface SDToggleFilterProps {
  activeTab: 'pending' | 'settled';
  onTabChange: (tab: 'pending' | 'settled') => void;
  className?: string;
}

export function SDToggleFilter({ activeTab, onTabChange, className }: SDToggleFilterProps) {
  return (
    <div className={cn(
      "w-60 h-10 bg-white/10 rounded-[20px] p-1 flex relative",
      className
    )}>
      {/* Sliding thumb */}
      <div 
        className={cn(
          "absolute top-1 bottom-1 w-[116px] rounded-[16px] transition-all duration-300 ease-out",
          activeTab === 'pending' 
            ? "left-1 bg-[#F77F00]" 
            : "left-[116px] bg-white"
        )}
      />
      
      {/* Pending Tab */}
      <button
        onPointerDown={() => onTabChange('pending')}
        className={cn(
          "flex-1 flex items-center justify-center text-sm font-medium transition-colors duration-300 relative z-10",
          activeTab === 'pending' 
            ? "text-[#2D2D2D]" 
            : "text-white/70 hover:text-white"
        )}
      >
        Pending
      </button>
      
      {/* Settled Tab */}
      <button
        onPointerDown={() => onTabChange('settled')}
        className={cn(
          "flex-1 flex items-center justify-center text-sm font-medium transition-colors duration-300 relative z-10",
          activeTab === 'settled' 
            ? "text-[#2D2D2D]" 
            : "text-white/70 hover:text-white"
        )}
      >
        Settled
      </button>
    </div>
  );
}