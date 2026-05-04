import React from "react";

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AdminInput: React.FC<AdminInputProps> = ({ label, error, className = "", ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-[var(--theme-text-main)]">{label}</label>
      <input
        className="w-full bg-[var(--theme-bg-main)] text-[var(--theme-text-main)] border border-[var(--theme-border)] rounded-xl px-4 py-2.5 outline-none focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)] transition-colors caret-[var(--theme-primary)] placeholder-[#64748b]"
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export const AdminTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string, error?: string }> = ({ label, error, className = "", ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-[var(--theme-text-main)]">{label}</label>
      <textarea
        className="w-full bg-[var(--theme-bg-main)] text-[var(--theme-text-main)] border border-[var(--theme-border)] rounded-xl px-4 py-2.5 outline-none focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)] transition-colors caret-[var(--theme-primary)] placeholder-[#64748b] min-h-[100px] resize-y"
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export const AdminSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, error?: string, options: {value: string, label: string}[] }> = ({ label, error, options, className = "", ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-[var(--theme-text-main)]">{label}</label>
      <select
        className="w-full bg-[var(--theme-bg-main)] text-[var(--theme-text-main)] border border-[var(--theme-border)] rounded-xl px-4 py-2.5 outline-none focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)] transition-colors"
        {...props}
      >
        <option value="" disabled className="text-[#64748b] bg-[var(--theme-bg-main)]">Pilih salah satu</option>
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-[var(--theme-bg-main)] text-[var(--theme-text-main)]">{o.label}</option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export const AdminButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'danger' | 'ghost' }> = ({ children, variant = 'primary', className = "", disabled, ...props }) => {
  const baseColors = {
    primary: "bg-[var(--theme-primary)] text-[var(--theme-button-text)] border border-transparent hover:opacity-80 transition-opacity",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
    ghost: "bg-transparent text-[var(--theme-text-soft)] border border-transparent hover:text-[var(--theme-text-main)] hover:bg-[#1e293b]"
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
