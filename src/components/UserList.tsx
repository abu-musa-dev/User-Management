'use client';

import { useState, useMemo, ChangeEvent, useRef, useEffect } from 'react';
import { User } from '@/types';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface UserListProps {
  users: User[];
}

const ITEMS_PER_PAGE = 10;

export default function UserList({ users }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState<string>(''); // typing state
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>(''); // active filter state
  const [currentPage, setCurrentPage] = useState<number>(1);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const inputElement = inputRef.current;
    const preventScrollOnFocus = (event: Event) => {
      event.preventDefault();
      inputElement?.focus({ preventScroll: true });
    };
    inputElement?.addEventListener('touchstart', preventScrollOnFocus);
    return () => {
      inputElement?.removeEventListener('touchstart', preventScrollOnFocus);
    };
  }, []);

  // Filter users based on activeSearchQuery
  const filteredUsers = useMemo(() => {
    if (!activeSearchQuery) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(activeSearchQuery.toLowerCase())
    );
  }, [users, activeSearchQuery]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  // Update activeSearchQuery on button click
  const handleSearch = (): void => {
    setActiveSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by name or email"
          className="w-full p-3 border border-gray-200 rounded-lg placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-blue-500 transition"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-8 py-3 rounded-lg 
                     hover:bg-blue-700 transition-colors 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-blue-500 w-full sm:w-auto shrink-0"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-gray-50 
                          text-left text-xs font-semibold text-gray-500 
                          uppercase tracking-wider rounded-t-lg">
            <div>Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Company</div>
          </div>

          {/* Table Body */}
          <div className="bg-white rounded-b-lg">
            {paginatedUsers.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.05 } },
                }}
              >
                {paginatedUsers.map((user) => (
                  <Link href={`/user/${user.id}`} key={user.id} legacyBehavior>
                    <motion.a
                      className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 
                                 hover:bg-gray-50 transition-colors cursor-pointer"
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        show: { opacity: 1, y: 0 },
                      }}
                    >
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                      <div className="break-words text-gray-700">{user.email}</div>
                      <div className="text-gray-700">{user.phone}</div>
                      <div className="text-gray-700">{user.company.name}</div>
                    </motion.a>
                  </Link>
                ))}
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[300px] text-center">
                <p className="text-gray-500">No users found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-600">
          Showing {paginatedUsers.length} of {filteredUsers.length} users
        </p>
      </div>
    </div>
  );
}
