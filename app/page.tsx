import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { getEvents } from "@/lib/actions/event.actions";

export const instant = false;

const page = async () => {
  const events = await getEvents();


  return (
        <section>
    <h1 className="text-center">The Hub for Every Dev <br /> Event You Mustn&apos;t Miss</h1>
    <p className="text-center mt-5">Hackathons, meetups, and conferences All in One Place!</p>
    <ExploreBtn />

    <div>
      <h3 className="mb-6">Featured Events</h3>
      <ul className="events">
        {events.length > 0 && events.map((event) => (
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
