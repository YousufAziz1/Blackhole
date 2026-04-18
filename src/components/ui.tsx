import React from 'react';

export const Spinner = ({ size = 16 }: { size?: number }) => (
  <div
    style={{ width: size, height: size }}
    className="border-2 border-[var(--border-subtle)] border-t-[var(--accent)] rounded-full animate-spin"
  />
);

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`shimmer rounded-xl bg-[var(--bg-elevated)] ${className}`} />
);

export const PulseDots = () => (
  <div className="flex gap-1.5 items-center">
    {[0, 1, 2].map(i => (
      <div
        key={i}
        className="w-2 h-2 rounded-full bg-[var(--accent)]"
        style={{ animation: `pulseDot 1.2s ease-in-out ${i * 0.2}s infinite` }}
      />
    ))}
  </div>
);

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:   'bg-[var(--accent)] text-black hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_var(--accent-glow)]',
  secondary: 'bg-transparent border border-[var(--accent)]/50 text-[var(--accent)] hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]',
  ghost:     'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]',
  danger:    'bg-[var(--error)]/10 border border-[var(--error)]/40 text-[var(--error)] hover:bg-[var(--error)]/20',
  success:   'bg-[var(--success)]/10 border border-[var(--success)]/40 text-[var(--success)] hover:bg-[var(--success)]/20',
};
const sizes: Record<Size, string> = {
  xs: 'px-3 py-1.5 text-xs rounded-lg gap-1',
  sm: 'px-4 py-2 text-sm rounded-xl gap-1.5',
  md: 'px-6 py-3 text-base rounded-xl gap-2',
  lg: 'px-8 py-4 text-lg rounded-2xl gap-2.5',
  xl: 'px-10 py-5 text-xl rounded-2xl gap-3',
};

export const Button = ({
  variant = 'primary', size = 'md', loading, icon, iconPosition = 'left',
  fullWidth, children, className, ...props
}: ButtonProps) => (
  <button
    {...props}
    disabled={loading || props.disabled}
    className={`
      relative overflow-hidden font-medium
      flex items-center justify-center
      transition-all duration-200 active:scale-[0.97]
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
      ${variants[variant]} ${sizes[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `}
  >
    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
    {loading ? <Spinner size={16} /> : (iconPosition === 'left' && icon)}
    {children}
    {!loading && iconPosition === 'right' && icon}
  </button>
);

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';

const badgeStyles: Record<BadgeVariant, string> = {
  default: 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border-default)]',
  success: 'bg-[var(--success-dim)] text-[var(--success)] border-[var(--success)]/30',
  warning: 'bg-[var(--warning-dim)] text-[var(--warning)] border-[var(--warning)]/30',
  error:   'bg-[var(--error-dim)] text-[var(--error)] border-[var(--error)]/30',
  info:    'bg-[var(--info-dim)] text-[var(--info)] border-[var(--info)]/30',
  accent:  'bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/30',
};

export const Badge = ({ children, variant = 'default', dot }: { children: React.ReactNode, variant?: BadgeVariant, dot?: boolean }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${badgeStyles[variant]}`}>
    {dot && <span className={`w-1.5 h-1.5 rounded-full bg-current`} />}
    {children}
  </span>
);

export interface CardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  footer?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  glow?: boolean;
  children?: React.ReactNode;
}

export const Card = ({ title, description, icon, badge, footer, onClick, className, glow, children }: CardProps) => (
  <div
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    className={`
      relative group rounded-2xl p-6
      bg-[var(--bg-surface)] border border-[var(--border-subtle)]
      transition-all duration-300
      ${onClick ? 'cursor-pointer hover:border-[var(--accent)]/40 hover:-translate-y-1.5 hover:shadow-[0_24px_80px_var(--accent-glow)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2' : ''}
      ${glow ? 'border-glow' : ''}
      ${className}
    `}
  >
    {onClick && <div className="absolute inset-0 rounded-2xl bg-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />}

    {badge && (
      <span className="absolute top-4 right-4 text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/20">
        {badge}
      </span>
    )}

    {icon && (
      <div className="mb-4 w-12 h-12 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] group-hover:scale-110 group-hover:bg-[var(--accent)]/20 transition-all duration-300">
        {icon}
      </div>
    )}

    {title && <h3 className="font-display text-[var(--text-primary)] font-semibold text-lg mb-2 leading-snug">{title}</h3>}
    {description && <p className="text-[var(--text-muted)] text-sm leading-relaxed">{description}</p>}
    
    {children}
    
    {footer && <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">{footer}</div>}
  </div>
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = ({ label, error, hint, icon, suffix, className, ...props }: InputProps) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-[var(--text-secondary)]">
        {label}
        {props.required && <span className="text-[var(--error)] ml-1">*</span>}
      </label>
    )}
    <div className="relative flex items-center">
      {icon && <div className="absolute left-3 text-[var(--text-muted)]">{icon}</div>}
      <input
        {...props}
        className={`
          w-full px-4 py-3 rounded-xl text-sm
          bg-[var(--bg-surface)] text-[var(--text-primary)]
          border border-[var(--border-subtle)]
          placeholder:text-[var(--text-faint)]
          focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow)] focus:outline-none
          transition-all duration-200
          ${icon ? 'pl-10' : ''}
          ${suffix ? 'pr-10' : ''}
          ${error ? 'border-[var(--error)] focus:border-[var(--error)] focus:shadow-[0_0_0_3px_var(--error-dim)]' : ''}
          ${className}
        `}
      />
      {suffix && <div className="absolute right-3 text-[var(--text-muted)]">{suffix}</div>}
    </div>
    {error && <p className="text-xs text-[var(--error)] flex items-center gap-1">⚠ {error}</p>}
    {hint && !error && <p className="text-xs text-[var(--text-faint)]">{hint}</p>}
  </div>
);

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] text-2xl mb-4">
      {icon}
    </div>
    <h3 className="text-[var(--text-primary)] font-semibold text-lg mb-2">{title}</h3>
    <p className="text-[var(--text-muted)] text-sm max-w-xs leading-relaxed mb-6">{description}</p>
    {action && (
      <Button onClick={action.onClick} size="sm">{action.label}</Button>
    )}
  </div>
);
