import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

const AItools = () => {

  const navigate = useNavigate()
  const {user}= useUser();

  return (
    <div className ='px-4 sm:px-20 xl:px-32 my-24'> 
        <div className='text-center'>
            <h2 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mb-4'>Powerful AI tools</h2>
            <p className='text-gray-500 max-w-lg mx-auto'> Everything you need to create,enhance and optimize your content with cutting-edge AI Technology.</p>
        </div>
        <div className='flex flex-wrap justify-center mt-10'>
          {AiToolsData.map((tool, index) => (
            <div 
              key={index} 
              className='p-8 m-4 max-w-xs rounded-lg bg-white shadow-lg hover:shadow-2xl transition cursor-pointer' onClick={() =>user && navigate(tool.path)}>
                <tool.Icon className='w-12 h-12 p-3 text-white rounded-xl' style={{background:`linear-gradient(to bottom,${tool.bg.from},${tool.bg.to})`}}/>
                <h3 className='mt-6 mb-3 text-lg font-semibold'>{tool.title}</h3>
                <p className='text-gray-400 text-sm max-w-[95%]'>{tool.description}</p>
                </div>
          ))}
        </div>
    </div>
  )
}

export default AItools