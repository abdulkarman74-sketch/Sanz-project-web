import React from "react";

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AdminInput: React.FC<AdminInputProps> = ({ label, error, className = "", ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-white">{label}</label>
      <input
        className="w-full bg-[#020617] text-[#f8fafc] border border-[#334155] rounded-xl px-4 py-2.5 outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-colors caret-[#22d3ee] placeholder-[#64748b]"
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export const AdminTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string, error?: string }> = ({ label, error, className = "", ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-white">{label}</label>
      <textarea
        className="w-full bg-[#020617] text-[#f8fafc] border border-[#334155] rounded-xl px-4 py-2.5 outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-colors caret-[#22d3ee] placeholder-[#64748b] min-h-[100px] resize-y"
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export const AdminSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, error?: string, options: {value: string, label: string}[] }> = ({ label, error, options, className = "", ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-white">{label}</label>
      <select
        className="w-full bg-[#020617] text-[#f8fafc] border border-[#334155] rounded-xl px-4 py-2.5 outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-colors"
        {...props}
      >
        <option value="" disabled className="text-[#64748b]">Pilih salah satu</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export const AdminButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'danger' | 'ghost' }> = ({ children, variant = 'primary', className = "", disabled, ...props }) => {
  const baseColors = {
    primary: "bg-[#22d3ee] text-slate-900 border border-transparent hover:bg-cyan-300",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
    ghost: "bg-transparent text-[#94a3b8] border border-transparent hover:text-white hover:bg-[#1e293b]"
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${baseColors[variant]} ${variant === 'primary' ? 'btn-primary' : variant === 'ghost' ? 'btn-secondary' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
