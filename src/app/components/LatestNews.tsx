import Image from 'next/image'
import Link from 'next/link'

const LatestNews = () => {
  return (
    <div className="mb-8">
      {/* Latest News */}
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-xl font-bold flex-shrink-0">Latest News</h2>
        <div className="h-0.5 flex-grow bg-gray-200"></div>
      </div>
      <div className="font-medium">
        <div className="grid" style={{ gridTemplateColumns: "auto auto 1fr", alignItems: "start" }}>
          {/* Logo with adjustable vertical position */}
          <div className="relative" style={{ width: "40px", height: "40px" }}>
            <div className="absolute" style={{ top: "-7px" }}>
              <Image
                src="/live_button.png"
                alt="livesqlbench"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </div>
          </div>
          
          {/* Date with adjustable vertical position */}
          <div className="relative px-2" style={{ top: "0px" }}>
            <span className="text-gray-500 font-bold whitespace-nowrap">[02/11/2025]:</span>
          </div>
          
          {/* Text with adjustable vertical position */}
          <div className="relative" style={{ top: "0px" }}>
            <span className="text-gray-700">
              LiveSQLBench has been released! It contains two versions: LiveSQLBench-Base and LiveSQLBench-Large. Download it and test your text-to-SQL LLMs or agents in a containmation-free way!
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LatestNews
