import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ totalPages, currentPage, paginate }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center mt-4 space-x-2">
            <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 hover:bg-gray-600 transition"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>
            
            <span className="text-gray-400 text-sm">Trang {currentPage} / {totalPages}</span>

            <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 hover:bg-gray-600 transition"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
};