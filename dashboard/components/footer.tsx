import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-sm text-gray-600">
              Copyright 2025 Medication Reminder. All rights reserved.
            </p>
            <p className="text-xs text-gray-500">
              Built with Arduino Uno, Next.js, TypeScript and Tailwind CSS
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600">
              Created by{" "}
              <Link
                href="https://antonni-code.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
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
