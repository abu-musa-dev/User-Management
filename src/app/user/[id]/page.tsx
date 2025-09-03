
import { User } from '@/types';
import Link from 'next/link';

// Function to fetch data for a specific user from the API
async function getUser(id: string) {
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch user data');
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return null; // Returns null if there is an error
  }
}

// A small Helper Component (to avoid repeating code)
const InfoField = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-base sm:text-lg font-medium text-gray-800 break-words">{value}</p>
  </div>
);

// The main details page component
export default async function UserDetailsPage({ params }: { params: { id: string } }) {
  const user: User | null = await getUser(params.id);

  // Displays an error message if the user is not found for
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-xl text-red-500">Could not find user.</p>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">
          &larr; Go Back to User List
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header: Back Button and Title */}
        <header className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-gray-700 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Users
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">User Details</h1>
        </header>

        {/* Main white container for all details */}
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-8 space-y-8">

          {/* Top Section: Personal Info & Address */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Personal Information Card */}
            <div className="lg:col-span-3">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <InfoField label="Name" value={user.name} />
                <InfoField label="Username" value={`@${user.username}`} />
                <InfoField label="Email" value={user.email} />
                <InfoField label="Phone" value={user.phone} />
                <InfoField 
                  label="Website" 
                  value={
                    <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {user.website}
                    </a>
                  } 
                />
              </div>
            </div>

            {/* Address Card */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Address</h2>
              <div className="space-y-6">
                <InfoField label="Street" value={user.address.street} />
                <InfoField label="Suite" value={user.address.suite} />
                <InfoField label="City" value={user.address.city} />
                <InfoField label="Zipcode" value={user.address.zipcode} />
                <InfoField label="Geo Location" value={`${user.address.geo.lat}, ${user.address.geo.lng}`} />
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div className="border-t border-gray-200"></div>

          {/* Company Card */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Company</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
              <InfoField label="Company Name" value={user.company.name} />
              <InfoField label="Catch Phrase" value={user.company.catchPhrase} />
              <InfoField label="Business" value={user.company.bs} />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}