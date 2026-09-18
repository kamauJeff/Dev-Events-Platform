import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";
import { getBaseUrl } from "@/lib/utils";

const BASE_URL = getBaseUrl();

const page = async () => {
  'use cache';
  cacheLife('hours')
  const response = await fetch(`${BASE_URL}/api/events`);
  const {events} = await response.json();


  return (
        <section>
    <h1 className="text-center">The Hub for Every Dev <br /> Event You Mustn&apos;t Miss</h1>
    <p className="text-center mt-5">Hackathons, meetups, and conferences All in One Place!</p>
    <ExploreBtn />

    <div>
      <h3 className="mb-6">Featured Events</h3>
      <ul className="events">
        {events && events.length > 0 && events.map((event: IEvent) => (
          <li key={event.title} className="list-none">
            <EventCard {...event} />
          </li>
        ))}
      </ul>
    </div>
    </section>



      
  )
}

export default page
