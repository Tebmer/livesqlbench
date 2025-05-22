import Image from 'next/image'
import Link from 'next/link'
import { FileText } from 'lucide-react'

const LinksSection = () => {
  return (
    <div className="flex justify-center font-medium gap-8 sm:gap-8 my-2">
      <Link href="#" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
        <FileText className="w-5 h-5" />
        Paper (Coming Soon)
      </Link>
      <Link href="#" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
        <Image
          src="/hg.png"
          alt="Huggingface"
          width={20}
          height={20}
          className="w-5 h-5 max-w-full h-auto"  // Ensure responsiveness for Huggingface image
        />
        Dataset
        <span className="text-gray-500 text-sm font-mono"> (Coming Soon)</span>
      </Link>
      <Link href="https://github.com/bird-bench/livesqlbench" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
        <Image
          src="/github.png"
          alt="GitHub"
          width={20}
          height={20}
          className="w-5 h-5 max-w-full h-auto"  // Ensure responsiveness for GitHub image
        />
        GitHub
      </Link>
    </div>
  )
}

export default LinksSection