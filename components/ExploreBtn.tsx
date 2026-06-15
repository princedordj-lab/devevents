'use client'

import { ArrowDown } from "lucide-react"
import posthog from "posthog-js"

const ExploreBtn = () => {
  const handleExploreClick = () => {
    posthog.capture("explore_events_clicked");
  };

  return (
    <div className="flex items-center justify-center max-sm:px-4 w-full">
      <button
        type="button"
        id="explore-btn"
        onClick={handleExploreClick}
        className="flex gap-2 items-center justify-center rounded-full p-4 bg-indigo-900/50 max-sm:w-full "
      >
        <a
          href="#events"
          className="text-lg bg-transparent w-full flex items-center justify-center gap-2 group "
        >
          <h2>Explore Events</h2>
          <ArrowDown
            size={24}
            className="bg-transparent opacity-0 group-hover:opacity-100"
          />
        </a>
      </button>
    </div>
  );
}

export default ExploreBtn