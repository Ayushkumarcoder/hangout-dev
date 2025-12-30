

import EventDetails from '@/components/EventDetails';
import React, { Suspense } from 'react'

const EventDetailsPage = async({ params }: { params: Promise<{ slug: string }>}) => {

    const slug = params.then((p) => p.slug);

  return (
    <main>
        <Suspense fallback={<div>Loading event details...</div>}>
            <EventDetails params={slug}></EventDetails>
            
        </Suspense>
    </main>
  )
}

export default EventDetailsPage
