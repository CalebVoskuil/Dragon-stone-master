import { useState } from "react";
import { Search, X, ChevronDown, Filter } from "lucide-react";
import { cn } from "../ui/utils";

interface SDImprovedSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'all' | 'pending' | 'approved' | 'rejected';
  onStatusFilterChange: (filter: 'all' | 'pending' | 'approved' | 'rejected') => void;
  schoolFilter: string;
  onSchoolFilterChange: (school: string) => void;
  schools: string[];
}

interface FilterDropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string; color?: string }[];
  onChange: (value: string) => void;
}

function FilterDropdown({ label, value, options, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find(opt => opt.value === value);
  const isActive = value !== 'all';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-10 px-3 rounded-lg flex items-center space-x-2 text-sm font-medium transition-all duration-200 min-w-[100px]",
          isActive 
            ? "bg-white text-gray-900 shadow-sm" 
            : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
        )}
      >
        <span className="truncate">
          {selectedOption?.label || label}
        </span>
        <ChevronDown 
          className={cn(
            "w-4 h-4 transition-transform duration-200 flex-shrink-0",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-12 left-0 z-50 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[160px] max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between group"
              >
                <div className="flex items-center space-x-2">
                  {option.color && (
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: option.color }}
                    />
                  )}
                  <span className="text-gray-900">{option.label}</span>
                </div>
                {value === option.value && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function SDImprovedSearchBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  schoolFilter,
  onSchoolFilterChange,
  schools
}: SDImprovedSearchBarProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending', color: 'var(--sd-accent-pending)' },
    { value: 'approved', label: 'Approved', color: 'var(--sd-accent-green)' },
    { value: 'rejected', label: 'Rejected', color: 'var(--sd-accent-reject)' }
  ];

  const schoolOptions = [
    { value: 'all', label: 'All Schools' },
    ...schools.map(school => ({ value: school, label: school }))
  ];

  return (
    <div className="space-y-3">
      {/* Main Search Row */}


      {/* Advanced Filters */}
      {isAdvancedOpen && (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-white/70 text-sm mb-2">School</label>
              <FilterDropdown
                label="School"
                value={schoolFilter}
                options={schoolOptions}
                onChange={onSchoolFilterChange}
              />
            </div>
            
            <div>
              <label className="block text-white/70 text-sm mb-2">Date Range</label>
              <button className="h-10 px-3 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors text-sm w-full">
                Last 30 days
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
            <span className="text-white/60 text-sm">
              {/* Active filter count */}
              {[statusFilter !== 'all', schoolFilter !== 'all'].filter(Boolean).length} filter(s) active
            </span>
            
            <button
              onClick={() => {
                onStatusFilterChange('all');
                onSchoolFilterChange('all');
                onSearchChange('');
              }}
              className="text-white/80 hover:text-white text-sm underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}