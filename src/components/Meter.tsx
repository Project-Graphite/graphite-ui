import LinearProgress from '@mui/material/LinearProgress';

export function Meter({ label, value }: { label: string; value: number }) {
  return (
    <LinearProgress
      aria-label={label}
      className="h-1.5 rounded-full"
      color={value > 1 ? 'error' : 'primary'}
      value={Math.min(1, Math.max(0, value)) * 100}
      variant="determinate"
    />
  );
}
