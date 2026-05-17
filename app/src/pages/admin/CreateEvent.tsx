import React from 'react';
import EventForm from '@/components/admin/EventForm';

const CreateEvent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Event</h1>
        <p className="text-gray-500 mt-1">Create and publish a new event or webinar</p>
      </div>

      <EventForm />
    </div>
  );
};

export default CreateEvent;