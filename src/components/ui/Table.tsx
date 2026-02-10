import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export interface Column<T> {
    header: string;
    accessor?: keyof T | ((row: T) => ReactNode); // accessor can be property name or generic render function (though usually 'render' prop handles function)
    className?: string;
    render?: (row: T) => ReactNode; // Explicit render function
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    pageSize?: number;
}

export interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    actions?: (row: T) => ReactNode;
    isLoading?: boolean;
    className?: string;
    pagination?: PaginationProps;
}

const Table = <T extends { id?: string | number } | any>({ columns, data, actions, isLoading, className, pagination }: TableProps<T>) => {
    return (
        <div className={cn("overflow-hidden rounded-xl border border-gray-100/50 bg-white/40 backdrop-blur-md shadow-sm", className)}>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50/50 backdrop-blur-sm border-b border-gray-100/50">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className={cn(
                                    "px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider",
                                    col.className
                                )}>
                                    {col.header}
                                </th>
                            ))}
                            {actions && <th className="px-6 py-4 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-8 text-center text-gray-500">
                                    Loading data...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-8 text-center text-gray-500">
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                <tr key={(row as any).id ?? index} className="hover:bg-white/40 transition-colors">
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className={cn("px-6 py-4", col.className)}>
                                            {col.render ? col.render(row) : (typeof col.accessor === 'string' ? (row[col.accessor] as any) : '')}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-6 py-4 text-right">
                                            {actions(row)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && !isLoading && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100/50 bg-white/30">
                    <div className="text-xs text-gray-500">
                        {pagination.totalItems !== undefined && (
                            <>Showing {(pagination.currentPage - 1) * (pagination.pageSize || 25) + 1} to {Math.min(pagination.currentPage * (pagination.pageSize || 25), pagination.totalItems)} of {pagination.totalItems} entries</>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={pagination.currentPage === 1}
                            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <span className="text-sm font-medium text-gray-700">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={pagination.currentPage === pagination.totalPages}
                            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
