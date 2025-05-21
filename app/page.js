import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-5xl w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
          Hello, Welcome to Timesheet App!
        </h1>
        <p className="text-xl text-center text-gray-700 mb-8">
          This is a simple timesheet application built with Next.js and Tailwind CSS.
        </p>
        <div className="flex justify-center">
          <Link href="/dashboard">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 