import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type Row,
} from '@tanstack/react-table';
import { useRef, useMemo, memo, useState, useCallback, useEffect } from 'react';
import { type Person } from '@/types';
import { useInfiniteItems } from '@/api';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { SkeletonTableRow } from '@/components/skeletons';

const fetchSize = 10;

const TruncatedCell = ({ value, maxLength = 50 }: { value: string; maxLength?: number }) => {
  if (value.length <= maxLength) return <span>{value}</span>;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="block cursor-pointer truncate">{value.slice(0, maxLength)}...</span>
      </HoverCardTrigger>
      <HoverCardContent className="max-h-64 w-auto max-w-md overflow-auto">
        <div className="text-sm whitespace-pre-wrap">{value}</div>
      </HoverCardContent>
    </HoverCard>
  );
};

const MemoizedTableRow = memo(
  function ({ row }: { row: Row<Person> }) {
    return (
      <tr key={row.id}>
        {row.getVisibleCells().map((cell) => (
          <td
            key={cell.id}
            className="border-b px-4 py-3 text-sm whitespace-nowrap"
            style={{ width: cell.column.getSize() }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    );
  },
  (prev, next) => {
    return prev.row.original === next.row.original;
  }
);

export function Table() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => <TruncatedCell value={info.getValue<string>()} maxLength={20} />,
        size: 120,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        size: 50,
      },
      {
        accessorKey: 'gender',
        header: 'Gender',
        size: 80,
      },
      {
        accessorKey: 'balance',
        header: 'Balance',
        size: 80,
      },
      {
        accessorKey: 'company',
        header: 'Company',
        size: 80,
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        size: 80,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => {
          const email = info.getValue<string>();
          return (
            <a href={`mailto:${email}`} className="block truncate text-blue-500 hover:underline">
              <TruncatedCell value={email} maxLength={25} />
            </a>
          );
        },
        size: 150,
      },
      {
        accessorKey: 'about',
        header: 'About',
        cell: (info) => <TruncatedCell value={info.getValue<string>()} maxLength={50} />,
        size: 200,
      },
    ],
    []
  );

  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteItems();

  const flatData = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);
  const totalCount = data?.pages[0].totalCount;
  const totalDBRowCount = data?.pages[0]?.totalPages ? data.pages[0].totalPages * fetchSize : 0;
  const totalFetched = flatData.length;

  const fetchMore = useCallback(() => {
    if (!isFetching && totalFetched < totalDBRowCount) {
      fetchNextPage();
    }
  }, [fetchNextPage, isFetching, totalFetched, totalDBRowCount]);

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      },
      {
        root: tableContainerRef.current,
        rootMargin: '300px',
        threshold: 0,
      }
    );

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => observer.current?.disconnect();
  }, [fetchMore]);

  const table = useReactTable({
    data: flatData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      <div className="text-secondary-foreground mb-3 text-xs">
        Загружено {flatData.length} из {totalCount} пользователей
      </div>

      <ScrollArea
        className="h-[600px] w-full overflow-auto rounded-lg border"
        ref={tableContainerRef}
      >
        <div className="min-w-full">
          <table className="h-full w-full table-auto">
            <thead className="bg-muted sticky top-0 h-[40px] shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className={`px-3 text-left text-xs font-semibold tracking-wider uppercase ${
                        header.column.getCanSort() ? 'cursor-pointer hover:underline' : ''
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' ↑',
                        desc: ' ↓',
                      }[header.column.getIsSorted() as string] ?? null}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <MemoizedTableRow key={row.id} row={row} />
              ))}
            </tbody>
          </table>

          {isFetching &&
            Array.from({ length: fetchSize }, (_, index) => <SkeletonTableRow key={index} />)}
        </div>

        <div ref={loadMoreRef} className="flex min-h-[1px] w-full items-center justify-center" />

        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {isFetching && (
        <div className="mt-2 text-center text-sm text-gray-500">Загружаем больше данных...</div>
      )}
    </div>
  );
}
