'use client'

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import posthog from "posthog-js";

const CreateEventPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [overview, setOverview] = useState('');
  const [venue, setVenue] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [mode, setMode] = useState('');
  const [audience, setAudience] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [agenda, setAgenda] = useState<string[]>(['']);
  const [tagsInput, setTagsInput] = useState('');

  const addAgendaItem = () => setAgenda([...agenda, '']);
  const removeAgendaItem = (index: number) => {
    if (agenda.length > 1) setAgenda(agenda.filter((_, i) => i !== index));
  };
  const updateAgendaItem = (index: number, value: string) => {
    const updated = [...agenda];
    updated[index] = value;
    setAgenda(updated);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const filteredAgenda = agenda.filter((item) => item.trim() !== '');

    if (filteredAgenda.length === 0) {
      setError('Please add at least one agenda item.');
      setLoading(false);
      return;
    }

    if (!image) {
      setError('Please select an image.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('overview', overview);
    formData.append('venue', venue);
    formData.append('location', location);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('mode', mode);
    formData.append('audience', audience);
    formData.append('organizer', organizer);
    formData.append('image', image);
    formData.append('agenda', JSON.stringify(filteredAgenda));
    formData.append('tags', JSON.stringify(tags));

    try {
      const res = await fetch('/api/events', { method: 'POST', body: formData });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create event');
      }

      posthog.capture("event_created", { event_title: title });
      router.push('/events');
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      posthog.capture("event_creation_failed", { error_message: message });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-20 px-4 max-w-3xl mx-auto pb-8">
      <h1 className="text-center text-4xl">
        Create <span className="font-bold text-blue-300">Event</span>
      </h1>
      <p className="text-center mt-2 text-gray-400">Fill in the details below to publish a new event.</p>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-indigo-950/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-indigo-950/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Overview */}
        <div>
          <label className="block text-sm font-medium mb-1">Overview</label>
          <textarea
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-indigo-950/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Venue & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Venue</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-indigo-950/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-indigo-950/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Date, Time, Mode */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-indigo-950/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 10:00 AM"
              required
              className="w-full px-4 py-3 rounded-lg bg-indigo-950/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-indigo-950/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>Select mode</option>
              <option value="In-Person">In-Person</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Audience & Organizer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Audience</label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. Developers, Designers"
              required
              className="w-full px-4 py-3 rounded-lg bg-indigo-950/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Organizer</label>
            <input
              type="text"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-indigo-950/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            required
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
          />
        </div>

        {/* Agenda */}
        <div>
          <label className="block text-sm font-medium mb-1">Agenda</label>
          {agenda.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateAgendaItem(index, e.target.value)}
                placeholder={`Item ${index + 1}`}
                className="flex-1 px-4 py-3 rounded-lg bg-indigo-950/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {agenda.length > 1 && (
                <button type="button" onClick={() => removeAgendaItem(index)} className="text-red-400 hover:text-red-300">
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addAgendaItem}
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm mt-1"
          >
            <Plus size={16} /> Add item
          </button>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. hackathon, web3, react"
            className="w-full px-4 py-3 rounded-lg bg-indigo-950/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-gray-500 mt-1">Separate tags with commas.</p>
        </div>

        {/* Error */}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors px-7 py-4 rounded-lg font-medium flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : null}
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </section>
  );
};

export default CreateEventPage;