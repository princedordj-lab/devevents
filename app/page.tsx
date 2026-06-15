import EventCard from '@/components/EventCard'
import ExploreBtn from '@/components/ExploreBtn'
import {events} from '@/lib/constants'


const page = () => {
  return (
    <section className='pt-20'>
      <h1 className='text-center text-4xl'>The Hub For Every <span className='font-bold text-lime-300'>DevEvent</span> <br /> You Can&apos;t Miss</h1>
      <p className='text-center mt-5'>Hackathons, Meetups and Conferences. All in One Place</p>
      <div className=' my-5 flex justify-center h-auto'>
        <ExploreBtn />
      </div>
      
      <div className='mt-20 space-y-10 px-4'>
        <h2 className='font-bold'>Featured Events</h2>
        <ul className='flex flex-row flex-wrap gap-5 max-md:flex-col max-md:items-center lg:justify-center '>
          {events.map((event) => (
            <li key={event.title} className='border border-gray-200/70 py-2 px-3 rounded-lg'>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default page