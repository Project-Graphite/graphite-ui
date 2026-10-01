const relativeTime = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

export function timeAgo(date: string) {
  const seconds = (new Date(date).getTime() - Date.now()) / 1000;
  const [unit, size] = (
    [
      ['year', 31_536_000],
      ['month', 2_592_000],
      ['week', 604_800],
      ['day', 86_400],
      ['hour', 3_600],
      ['minute', 60],
    ] as const
  ).find(([, length]) => Math.abs(seconds) >= length) ?? ['second', 1];
  return relativeTime.format(Math.round(seconds / size), unit);
}
