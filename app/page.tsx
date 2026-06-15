import EventCard from '@/components/EventCard'
import ExploreBtn from '@/components/ExploreBtn'

const events = [{
  title: 'Github Summit',
  image: '/flow2.png',
  slug: 'github',
  location: 'SanFrancisco',
  date: '2026-06-17',
  time: '9:00pm'
}]

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
        <ul className='flex gap-5 max-md:flex-col max-md:items-center '>
          {events.map((event) => (
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