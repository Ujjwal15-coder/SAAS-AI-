import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Hero = () => {
  const navigate = useNavigate()

  return (
    <div className="
      px-4 sm:px-20 xl:px-32
      relative inline-flex flex-col
      w-full min-h-screen
      justify-center items-center
      bg-[url('/gradientBackground.png')]
      bg-cover bg-no-repeat
      text-center
    ">

      {/* Heading */}
      <div className="mb-6 max-w-3xl">
        <h1 className="
          text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl
          font-bold mb-4
        ">
          Create amazing content with AI tools
        </h1>

        <p className="text-gray-600 sm:text-lg">
          Transform your content creation with our suite of premium AI tools.
          Generate images, blog titles, and more with the power of AI with UJJWAL.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs">
        <button
          onClick={() => navigate('/ai')}
          className="
            bg-primary text-white
            px-10 py-3 rounded-lg
            hover:scale-[1.02]
            active:scale-95
            transition
            cursor-pointer
          "
        >
          Start Creating Now
        </button>

        <button
          className="
            bg-white px-10 py-3
            rounded-lg border border-gray-300
            hover:scale-[1.02]
            active:scale-95
            transition
            cursor-pointer
          "
        >
          Watch Demo
        </button>
      </div>

      {/* Trust Section */}
      <div className="mt-8 flex items-center gap-3 text-sm text-gray-600">
        <img src={assets.user_group} alt="Users" className='h-8' />
        <span>Trusted by over 10K+ users worldwide</span>
      </div>

    </div>
  )
}

export default Hero
