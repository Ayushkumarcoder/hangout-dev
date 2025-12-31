import EventCard from '@/components/EventCard'
import ExploreBtn from '@/components/ExploreBtn'
import { IEvent } from './database';


const BaseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const dynamic = 'force-dynamic';

const Page = async () => {

  const response = await fetch(`${BaseURL}/api/events`, { cache: 'no-store' });

  const {events} = await response.json();

  return (
    <section>
      <h1 className='text-center'>The Hub for Every Dev <br></br> Events You Can't Miss</h1>
      <p className='text-center mt-5'>Hackathons, Meetups and Conferences, All in One Place</p>

      <ExploreBtn></ExploreBtn>

      <div id='events-section' className='mt-20 space-y-7'>
        <h3>Featured Events</h3>

        <ul className='events'>
          {events && events.length > 0 && events.map((event : IEvent) => (
            <li key={event.title}>
              <EventCard {...event}></EventCard>
            </li>
          ))} 

        </ul>

      </div>

    </section>
  )
}

export default Page