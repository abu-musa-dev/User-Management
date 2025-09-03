'use client';

import { useState, useMemo, ChangeEvent, useRef, useEffect } from 'react';
import { User } from '@/types'; // Ensure your type import is correct
import Link from 'next/link';
import { motion } from 'framer-motion';

// Define the props interface for the component
interface UserListProps {
  users: User[];
}

// Constant for the number of items to display per page
const ITEMS_PER_PAGE = 10;

// Create a new motion component by wrapping Next.js's Link with Framer Motion's HOC.
// Defining it outside the component prevents it from being recreated on every render, improving performance.
const MotionLink = motion(Link);

export default function UserList({ users }: UserListProps) {
  // State for the search input field
  const [searchTerm, setSearchTerm] = useState<string>('');
  // State for the active search query that filters the list
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');
  // State for the current page number for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Ref to access the input element directly
  const inputRef = useRef<HTMLInputElement>(null);

  // Effect to handle mobile keyboard behavior, preventing the page from scrolling on focus
  useEffect(() => {
    const inputElement = inputRef.current;
    const preventScrollOnFocus = (event: Event) => {
      event.preventDefault();
      // The `preventScroll` option helps stop the browser's default scroll-to-element behavior
      inputElement?.focus({ preventScroll: true });
    };
    // Use 'touchstart' for a better mobile experience
    inputElement?.addEventListener('touchstart', preventScrollOnFocus);
    
    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      inputElement?.removeEventListener('touchstart', preventScrollOnFocus);
    };
  }, []);

  // Memoized function to filter users based on the active search query

  const filteredUsers = useMemo(() => {
    if (!activeSearchQuery) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(activeSearchQuery.toLowerCase())
    );
  }, [users, activeSearchQuery]);

  // Memoized function to paginate the filtered user list
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  // Handler for the search button click
  const handleSearch = (): void => {
    setActiveSearchQuery(searchTerm);
    setCurrentPage(1); // Reset to the first page on a new search
  };

  return (
    <div className="p-4">
      {/* Search Bar Container */}
      {/* This container is sticky on mobile to keep the search bar at the top of the screen when the keyboard appears. */}
      {/* It becomes a regular element (`sm:relative`) on larger screens. */}
      <div className="sticky top-0 z-10 bg-white pt-2 pb-4 sm:relative sm:pt-0 sm:pb-0">
        <div className="flex flex-col sm:flex-row items-center gap-4">
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
      </div>

      {/* User Table */}
      {/* Added `mt-6` to create a visual gap between the sticky search bar and the table content. */}
      <div className="overflow-x-auto mt-6">
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
              // Animate the list container with a stagger effect for its children
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.05 } },
                }}
              >
                {paginatedUsers.map((user) => (
                  // Using the custom MotionLink component for animated routing
                  <MotionLink
                    href={`/user/${user.id}`}
                    key={user.id}
                    className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 
                               hover:bg-gray-50 transition-colors cursor-pointer"
                    // Variants for individual item animation (fade in and slide up)
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
                  </MotionLink>
                ))}
              </motion.div>
            ) : (
              // Display a message if no users are found after filtering
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