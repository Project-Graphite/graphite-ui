import MuiPagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
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
    <MuiPagination
      className="mt-8 flex justify-center border-t border-line pt-5"
      count={lastPage}
      page={page}
      renderItem={(item) => <PaginationItem component={Link} href={pageHref(item.page ?? page)} {...item} />}
    />
  );
}
