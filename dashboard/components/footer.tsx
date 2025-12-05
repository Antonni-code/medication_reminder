import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white border-t-2 border-[#EBEBEB] mt-auto">
      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left */}
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-gray-700">
              Copyright 2025 Medication Reminder. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Arduino Uno • Next.js • TypeScript • Tailwind CSS
            </p>
          </div>

          {/* Right */}
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-700">
              Created by{" "}
              <Link
                href="https://antonni-code.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#EF7722] hover:text-[#FAA533] transition-colors"
              >
                Antonni-code
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
