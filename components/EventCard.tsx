import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface Props{
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}

const EventCard = ({title, image, location, date, time}: Props) => {
  return (
    <div>
      <Link href={"/events"}>
        <Image
          src={image}
          alt={title}
          width={410}
          height={200}
          className="object-cover rounded-xl"
        />
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex gap-2 items-center text-[12px]">
            <MapPin size={15}/>
            <p>{location}</p>
          </div>
          <p className="text-2xl">{title}</p>

          <p>{date}</p>
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