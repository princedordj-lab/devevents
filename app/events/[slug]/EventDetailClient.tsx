'use client'
import { useState } from 'react'
import { IEvent } from '@/database/event.model'
import { Calendar, Clock, Computer, MapPin, RefreshCw, Users, House, Notebook } from 'lucide-react'
import Image from 'next/image'

const EventDetailClient = ({ event }: { event: IEvent }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/events/${event.slug}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        alert(data.message || "Failed to create booking");
      }
    } catch {
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const AgendaCard = ({ agendaItem }: { agendaItem: string }) => (
    <div className="flex items-center gap-2">
      <p>{agendaItem}</p>
    </div>
  )
  
  return (
    <section className="flex flex-col justify-center md:flex-row gap-8 max-md:gap-4 px-4 py-8 w-full">
      <div className="px-4 py-8 flex flex-col flex-wrap">
        <h1 className="text-4xl font-bold">{event.title}</h1>
        <p className="mt-2  text-wrap">{event.description}</p>

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <Image
              src={event.image}
              alt={event.title}
              width={800}
              height={800}
              className="mt-4 rounded-lg"
            />
          </div>
          <div className='mt-6'>
            <h2 className='font-bold'>Overview</h2>
            <p>{event.overview}</p>
          </div>
          <div>
            <p>
              <House size={15} className='inline mr-2' />
              <span>
                { event.venue}
              </span>
            </p>
            <p>
              <MapPin size={15} className='inline mr-2' />
              <span>
                { event.location}
              </span>
            </p>
            <p>
              <Calendar size={15} className='inline mr-2' />
              <span>
                {event.date}
              </span>
            </p>
            <p>
              <Clock size={15} className='inline mr-2' />
              <span>
                {event.time}
              </span>
            </p>
            <p>
              <Computer size={15} className='inline mr-2' />
              <span>
                {event.mode}
              </span>
            </p>
            <p>
              <Users size={15} className='inline mr-2' />
              <span>
                {event.audience}
              </span>
            </p>
          </div>
          <div className='mt-6'>
            <h2 className='font-bold'>Agenda</h2>
            <ul className='list-disc mt-2 flex flex-col gap-4'>
              {event.agenda.map((agendaItem, index) => (
                <li key={index} className='ml-4'><AgendaCard agendaItem={agendaItem}  /></li>
              ))}
            </ul>
          </div>
          <div className='mt-6'>
            <h2 className='font-bold'>Organizer</h2>
            <p>{event.organizer}</p>
          </div>
          <div className='mt-6'>
            <h2 className='font-bold'>Tags</h2>
            <div className='flex flex-wrap gap-2'>
              {event.tags.map((tag, index) => (
                <span key={index} className='bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm'>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <aside className='w-full mt-10 lg:w-[50%]'>
        <div className="bg-indigo-900 border-l-8 border-indigo-500 p-6 rounded-lg shadow-md w-full ">
          <h1>Book Your Spot Now</h1>
          {submitted ? (<>
            <div>
              <p>Thank you for Signing up! Hope to see you there </p>
          </div>
          </>) : (
            <>
           <form
            onSubmit={handleBooking}
            className="mt-4 w-full flex flex-col"
          >
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-4 rounded-lg w-full bg-indigo-950 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 transition-colors px-7 py-5 rounded-lg font-medium text-white disabled:opacity-50"
            >
              {loading ? "Booking..." : "Book Now"}
            </button>
          </form></>)}
         
        </div>
      </aside>
    </section>
  );
}

export default EventDetailClient