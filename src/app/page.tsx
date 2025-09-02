// src/app/page.tsx

import UserList from '@/components/UserList';
import { User } from '@/types';

// Function to fetch data from the API
async function getUsers() {
  try {
    // Adding 'no-store' is a good practice to ensure fresh data on every request
    const res = await fetch('https://jsonplaceholder.typicode.com/users', { cache: 'no-store' }); 
    
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }
    
    return res.json();

  } catch (error) {
    console.error("FETCH ERROR DETAILS:", error);
    // If fetching fails, returning an empty array is a good practice to prevent the page from crashing.
    return []; 
  }
}

// This is the main component for your page
export default async function UserListPage() {
  // Calling the getUsers function to fetch data
  const users: User[] = await getUsers();

  // **This return part is very important**
  // It returns JSX, which will be rendered in the browser
  return (
    <main className="min-h-screen p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          User Management
        </h1>
        {/* Passing the users data to the UserList component here */}
        <UserList users={users} />
      </div>
    </main>
  );
}