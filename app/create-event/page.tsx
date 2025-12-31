import CreateEventForm from '@/components/CreateEventForm';

const CreateEventPage = () => {
  return (
    <section className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-center mb-2">Create New Event</h1>
      <p className="text-center text-light-200 mb-10">
        Fill in the details to create your event
      </p>
      <CreateEventForm />
    </section>
  );
};

export default CreateEventPage;
