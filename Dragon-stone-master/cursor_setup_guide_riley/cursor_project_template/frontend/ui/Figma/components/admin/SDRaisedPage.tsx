import { cn } from "../ui/utils";

interface SDRaisedPageProps {
  children: React.ReactNode;
  className?: string;
}

export function SDRaisedPage({ children, className }: SDRaisedPageProps) {
  return (
    <div className={cn(
      "flex-1 mx-4 mt-7 mb-[86px] bg-[#5A2D82] rounded-[20px]",
      "shadow-[0_6px_18px_-6px_rgba(0,0,0,0.12)]",
      className
    )}>
      {children}
    </div>
  );
}