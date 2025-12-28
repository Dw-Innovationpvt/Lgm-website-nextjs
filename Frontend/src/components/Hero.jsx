

// 'use client'

// import React from 'react'
// import { useRouter } from 'next/navigation'
// import Image from 'next/image'
// import { Swiper, SwiperSlide } from 'swiper/react'
// import { Autoplay, Navigation, Pagination } from 'swiper/modules'
// import { ArrowRight } from 'lucide-react'

// import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'
// import './hero.css' // Updated CSS file
// const slideGroups = [
//   [
//     {
//       category: 'INLINE SKATES',
//       image: '/banner/banner1.jpg',
//       link: '/inline-skates',
//       color: 'bg-orange-500 hover:bg-orange-600',
//       buttonText: 'SHOP NOW',
//       desc: 'Glide into action with top-rated inline skates.',
//     },
//     {
//       category: 'ROLLER SKATES',
//       image: '/banner/banner2.jpg',
//       link: '/roller-skates',
//       color: 'bg-sky-400 hover:bg-sky-500',
//       buttonText: 'SHOP NOW',
//       desc: 'Retro vibes with modern performance.',
//     },
//   ],
//   [
//     {
//   category: 'CYCLING',
//   image: 'https://images.unsplash.com/photo-1681295692638-97ace05f56b4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   link: '/cycling',
//   color: 'bg-green-600 hover:bg-green-700',
//   buttonText: 'EXPLORE NOW',
//   desc: 'Ride strong with top-tier cycling gear.',
// },
//     {
//       category: 'WORKOUT GEAR',
//       image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//       link: '/workout-gear',
//       color: 'bg-purple-600 hover:bg-purple-700',
//       buttonText: 'DISCOVER MORE',
//       desc: 'Elevate your training with elite gear.',
//     },
//   ],
// ]

// const Hero = () => {
//   const router = useRouter()

//   return (
//     <div className="font-['Poppins']">
//       <Swiper
//         modules={[Autoplay, Navigation, Pagination]}
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         pagination={{ clickable: true }}
//         navigation
//         loop
//         className="relative h-[80vh] w-full"
//       >
//         {slideGroups.map((group, index) => (
//           <SwiperSlide key={index}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
//               {group.map((slide, idx) => (
//                 <div
//                   key={idx}
//                   className="relative h-full group cursor-pointer overflow-hidden"
//                   onClick={() => router.push(slide.link)}
//                 >
//                   <Image
//                     src={slide.image}
//                     alt={slide.category}
//                     fill
//                     className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 transition-all duration-700"></div>

//                   <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 text-center">
//                     <h2 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
//                       {slide.category}
//                     </h2>
//                     <p className="text-sm md:text-base text-gray-200 mb-4 max-w-[80%]">
//                       {slide.desc}
//                     </p>
//                     <button
//                       className={`${slide.color} flex items-center gap-2 px-6 py-2 rounded-full transition-all hover:scale-105 text-sm md:text-base`}
//                     >
//                       {slide.buttonText}
//                       <ArrowRight size={18} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   )
// }

// export default Hero




'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { ArrowRight } from 'lucide-react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './hero.css'

const slideGroups = [
  [
    {
      category: 'INLINE SKATES',
      image: '/banner/banner1.jpg',
      link: '/inline-skates',
      color: 'bg-orange-500 hover:bg-orange-600',
      buttonText: 'SHOP NOW',
      desc: 'Glide into action with top-rated inline skates.',
    },
    {
      category: 'ROLLER SKATES',
      image: '/banner/banner2.jpg',
      link: '/hockey-skates',
      color: 'bg-sky-400 hover:bg-sky-500',
      buttonText: 'SHOP NOW',
      desc: 'Retro vibes with modern performance.',
    },
  ],
  [
    {
      category: 'CYCLING',
      image:
        'https://images.unsplash.com/photo-1681295692638-97ace05f56b4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      link: '/cycling',
      color: 'bg-green-600 hover:bg-green-700',
      buttonText: 'EXPLORE NOW',
      desc: 'Ride strong with top-tier cycling gear.',
    },
    {
      category: 'WORKOUT GEAR',
      image:
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      link: '/workout-gear',
      color: 'bg-purple-600 hover:bg-purple-700',
      buttonText: 'DISCOVER MORE',
      desc: 'Elevate your training with elite gear.',
    },
  ],
]

const Hero = () => {
  const router = useRouter()

  return (
    <div className="font-['Arimo'] relative z-10">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="relative h-[80vh] w-full"
      >
        {slideGroups.map((group, index) => (
          <SwiperSlide key={index}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-white h-full">
              {group.map((slide, idx) => (
                <div
                  key={idx}
                  className="relative h-full group overflow-hidden"
                  onClick={() => router.push(slide.link)}
                >
                  <Image
                    src={slide.image}
                    alt={slide.category}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 transition-all duration-700"></div>
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                      {slide.category}
                    </h2>
                    <p className="text-sm md:text-base text-gray-200 mb-4 max-w-[80%]">
                      {slide.desc}
                    </p>
                    <button
                      className={`${slide.color} flex items-center gap-2 px-6 py-2 rounded-full transition-all hover:scale-105 text-sm md:text-base`}
                    >
                      {slide.buttonText}
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Hero
