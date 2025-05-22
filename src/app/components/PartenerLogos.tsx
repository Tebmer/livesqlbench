import Image from 'next/image'

const PartnerLogos = () => {
  return (
    <div className="flex justify-center items-center gap-4 mb-8">
      <div className="relative h-8 w-24">
        <Image
          src="/2.png"
          alt="Center for AI Safety logo"
          fill
          className="object-contain"
        />
      </div>
      <span className="text-gray-500">&</span>
      <div className="relative h-8 w-24">
        <Image
          src="/3.png"
          alt="Scale logo"
          fill
          className="object-contain"
        />
      </div>
    </div>
  )
}

export default PartnerLogos