import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventForm from '@/components/admin/EventForm';
import { eventAPI } from '@/services/api';
import { Loader2 } from 'lucide-react';

const EditEvent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      setIsLoading(true);
      const response = await eventAPI.getById(id!);
      const eventData = response.data.data.event;
      
      setEvent({
        ...eventData,
        image: eventData.image,
        speakers: eventData.speakers || [],
        agenda: eventData.agenda || [],
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load event');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate('/admin/events')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Event</h1>
        <p className="text-gray-500 mt-1">Update event details</p>
      </div>

      <EventForm eventId={id} initialData={event} />
    </div>
  );
};

export default EditEvent;