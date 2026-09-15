import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { events } from "@/lib/constants";

export default function HomePage(){
  return (

    <section>
    <h1 className="text-center">The Hub for Every Dev <br /> Event You Mustn&apos;t Miss</h1>
    <p className="text-center mt-5">Hackathons, meetups, and conferences All in One Place!</p>
    <ExploreBtn />

    <div>
      <h3>Featured Events</h3>
      <ul className="events">
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