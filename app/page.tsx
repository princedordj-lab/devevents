import EventCard from '@/components/EventCard'
import ExploreBtn from '@/components/ExploreBtn'
import { IEvent } from '@/database/event.model'


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const page = async () => {

  const response = await fetch(`${BASE_URL}/api/events`);
  const { events} = await response.json();

  return (
    <section className='pt-20'>
      <h1 className='text-center text-4xl'>The Hub For Every <span className='font-bold text-blue-300'>DevEvent</span> <br /> You Can&apos;t Miss</h1>
      <p className='text-center mt-5'>Hackathons, Meetups and Conferences. All in One Place</p>
      <div className=' my-5 flex justify-center h-auto'>
        <ExploreBtn />
      </div>
      
      <div className='mt-20 space-y-10 px-4' id='events'>
        <h2 className='font-bold'>Featured Events</h2>
        <ul className='flex flex-row flex-wrap gap-5 md:flex-row sm:flex-row max-md:flex-col max-md:items-center  '>
          {events && events.length > 0 && events.map((event:IEvent) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default page