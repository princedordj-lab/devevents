'use client'

import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import posthog from 'posthog-js'

interface Props{
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}

const EventCard = ({title, image,slug, location, date, time}: Props) => {
  const handleCardClick = () => {
    posthog.capture("event_card_clicked", {
      event_title: title,
      event_slug: slug,
      event_location: location,
      event_date: date,
    });
  };

  return (
    <div className="w-full md:w-[400px] h-[380px] bg-indigo-950/70 rounded-xl overflow-hidden hover:scale-101 transition-all py-2 px-3">
      <Link href={`/events/${slug}`} onClick={handleCardClick} className="flex flex-col h-full">
        <Image
          src={image}
          alt={title}
          width={410}
          height={200}
          className="object-cover rounded-xl w-full h-48 flex-shrink-0"
        />
        <div className="flex flex-col gap-2 mt-2 flex-1">
          <div className="flex gap-2 items-center text-[12px]">
            <MapPin size={15}/>
            <p>{location}</p>
          </div>
          <p className="text-2xl line-clamp-2">{title}</p>

          <p className="mt-auto">{date}</p>
          <div className="flex gap-2">
            <Calendar />
            <p>{time}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default EventCard
