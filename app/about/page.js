export default function About() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">About Timesheet App</h1>
      <p className="text-gray-700 mb-4">
        This is a simple timesheet application built with Next.js and Tailwind CSS. 
        It allows users to track their working hours and manage their time effectively.
      </p>
      <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-3">Features</h2>
      <ul className="list-disc pl-5 text-gray-700 mb-4">
        <li>Easy time tracking</li>
        <li>Project management</li>
        <li>Reporting tools</li>
        <li>User-friendly interface</li>
      </ul>
    </div>
  );
} 