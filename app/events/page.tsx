import EventCard from '@/components/EventCard'
import { IEvent } from '@/database/event.model'
import {events }from '@/lib/constants'

//const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventsPage = async () => {
 
  //const response = await fetch(`${BASE_URL}/api/events`, { cache: "no-store" });
 // const { events } = await response.json();

  return (
    <section className="pt-20 px-4">
      <h1 className="text-center text-4xl">
        All <span className="font-bold text-blue-300">Events</span>
      </h1>
      <p className="text-center mt-2">Discover hackathons, meetups, and conferences.</p>

      <div className="mt-10">
        {events && events.length > 0 ? (
          <ul className="flex flex-row flex-wrap gap-5 max-md:flex-col max-md:items-center justify-center">
            {events.map((event: IEvent) => (
              <li key={event.slug} className="bg-indigo-950/70 hover:scale-101 transition-all py-2 px-3 rounded-lg">
                <EventCard {...event} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-400 mt-20">No events found.</p>
        )}
      </div>
    </section>
  );
};

export default EventsPage;