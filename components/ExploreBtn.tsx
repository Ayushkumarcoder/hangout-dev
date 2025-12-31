'use client';

import Image from "next/image";

const ExploreBtn = () => {
    const handleClick = () => {
        const eventsSection = document.getElementById('events-section');
        if (eventsSection) {
            eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={handleClick}>
            <span className="flex items-center gap-2">
                Explore Events
                <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24} />
            </span>
        </button>
    )
}

export default ExploreBtn