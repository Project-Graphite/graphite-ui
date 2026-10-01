import { useLink } from '../UiProvider.js';

export function Pagination({
  maxPages = Infinity,
  page,
  pageHref,
  totalPages,
}: {
  maxPages?: number;
  page: number;
  pageHref(page: number): string;
  totalPages: number;
}) {
  const Link = useLink();
  const lastPage = Math.min(totalPages, maxPages);
  if (lastPage <= 1) {
    return null;
  }

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-5">
      {page > 1 ? (
        <Link className="secondary-button inline-flex" href={pageHref(page - 1)} rel="prev">
          Previous
        </Link>
      ) : (
        <span aria-disabled="true" className="secondary-button inline-flex opacity-50">
          Previous
        </span>
      )}
      <span className="mono-sm text-faint">
        Page {page.toLocaleString()} of {lastPage.toLocaleString()}
      </span>
      {page < lastPage ? (
        <Link className="secondary-button inline-flex" href={pageHref(page + 1)} rel="next">
          Next
        </Link>
      ) : (
        <span aria-disabled="true" className="secondary-button inline-flex opacity-50">
          Next
        </span>
      )}
    </nav>
  );
}
