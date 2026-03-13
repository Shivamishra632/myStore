export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
        
        {/* Copyright */}
        <p className="text-sm sm:text-base">
          © {new Date().getFullYear()} MyStore. All rights reserved.
        </p>

        {/* Extra Links (optional, easy to expand later) 
        <div className="flex gap-4 mt-2 sm:mt-0">
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </div>*/}
      </div>
    </footer>
  );
}