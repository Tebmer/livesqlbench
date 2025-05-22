import Link from 'next/link';
import { Plus, LogIn, Users } from 'lucide-react';

export default function NoticeBanner() {
  return (
    <div className="mb-8 p-6 max-w-4xl mx-auto border border-black rounded-lg text-center">
      <p className="text-gray-800 text-sm font-medium">
        Humanity's Last Exam is still accepting questions from late contributors and submissions for the dataset and co-authorship, but new submissions are not eligible for the prize pool.
      </p>
      <div className="flex justify-center items-center gap-0 mt-4">
        <Link href="#" className="flex flex-col items-center w-48 text-gray-700 hover:text-gray-500 active:text-gray-400 transition-colors duration-200">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 transition-colors duration-200" />
            <span className="text-sm font-medium transition-colors duration-200">New Submission</span>
          </div>
          <span className="text-gray-500 text-xs mt-1 font-medium transition-colors duration-200">(for new contributors)</span>
        </Link>
        <span className="text-gray-400">|</span>
        <Link href="#" className="flex flex-col items-center w-48 text-gray-700 hover:text-gray-500 active:text-gray-400 transition-colors duration-200">
          <div className="flex items-center gap-2">
            <LogIn className="w-5 h-5 transition-colors duration-200" />
            <span className="text-sm font-medium transition-colors duration-200">Sign In Dashboard</span>
          </div>
          <span className="text-gray-500 text-xs mt-1 font-medium transition-colors duration-200">(for current contributors)</span>
        </Link>
        <span className="text-gray-400">|</span>
        <Link href="#" className="flex flex-col items-center w-48 text-gray-700 hover:text-gray-500 active:text-gray-400 transition-colors duration-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 transition-colors duration-200" />
            <span className="text-sm font-medium transition-colors duration-200">Current Contributors</span>
          </div>
        </Link>
      </div>
    </div>
  );
}