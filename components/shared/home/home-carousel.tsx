"use client"

import * as React from 'react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '@/components/ui/carousel'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function HomeCarousel({
    items,
}: {
    items: {
    image: string
    url: string
    title: string
    buttonCaption: string
    } []
}) {
    const plugin= React.useRef(
        Autoplay({ delay: 6000, stopOnInteraction: true})
    )

    return (
        <Carousel
        dir='ltr'
        plugins={[plugin.current]}
        className='w-full mx-auto'
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {items.map((item) => (
                    <CarouselItem key={item.title}>
                        <Link href={item.url}>
                            <div className='flex h-[50vh] items-center justify-center relative'>
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className='object-cover'
                                  priority
                                  />
                                  {/* Dark overlay for text readability */}
                                  <div className='absolute inset-0 bg-black/40' />
                                  <div className='absolute left-8 md:left-16 lg:left-24 top-1/2 -translate-y-1/2 max-w-md md:max-w-lg'>
                                    <h2
                                      className={cn(
                                        'text-2xl md:text-5xl lg:text-6xl font-bold mb-3 text-white font-sans tracking-tight leading-tight drop-shadow-lg'
                                      )}
                                    >
                                        {item.title}
                                    </h2>
                                    <Button size='lg' className='mt-2'>
                                        {item.buttonCaption}
                                    </Button>
                                  </div>
                            </div>
                        </Link>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className='left-0 md:left-12'></CarouselPrevious>
            <CarouselNext className='right-0 md:right-12'></CarouselNext>
        </Carousel>
    )
}