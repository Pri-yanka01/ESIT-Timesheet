export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Timesheet App</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/timesheets" className="hover:underline">Timesheets</a></li>
            <li><a href="/about" className="hover:underline">About</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 