'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const CreateEventForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agendaItems, setAgendaItems] = useState(['']);
  const [tags, setTags] = useState(['']);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    // Filter out empty agenda items and tags
    const filteredAgenda = agendaItems.filter((item) => item.trim() !== '');
    const filteredTags = tags.filter((tag) => tag.trim() !== '');

    // Remove old agenda/tags entries
    formData.delete('agenda');
    formData.delete('tags');

    // Add filtered agenda items
    filteredAgenda.forEach((item) => {
      formData.append('agenda', item);
    });

    // Add filtered tags
    filteredTags.forEach((tag) => {
      formData.append('tags', tag);
    });

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create event');
      }

      // Redirect to home or event detail page
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const addAgendaItem = () => {
    setAgendaItems([...agendaItems, '']);
  };

  const removeAgendaItem = (index: number) => {
    setAgendaItems(agendaItems.filter((_, i) => i !== index));
  };

  const updateAgendaItem = (index: number, value: string) => {
    const newAgenda = [...agendaItems];
    newAgenda[index] = value;
    setAgendaItems(newAgenda);
  };

  const addTag = () => {
    setTags([...tags, '']);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const updateTag = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Event Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="form-input"
          placeholder="e.g., Cloud Next 2026"
        />
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          className="form-input"
          placeholder="Brief description of the event..."
        />
      </div>

      {/* Overview */}
      <div className="form-group">
        <label htmlFor="overview" className="form-label">
          Overview *
        </label>
        <textarea
          id="overview"
          name="overview"
          required
          rows={4}
          className="form-input"
          placeholder="Detailed overview of what attendees can expect..."
        />
      </div>

      {/* Image Upload */}
      <div className="form-group">
        <label htmlFor="image" className="form-label">
          Event Image *
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          required
          className="form-input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-primary/90 file:cursor-pointer"
        />
        <p className="text-light-200 text-sm mt-1">
          Upload an image (JPG, PNG, etc.)
        </p>
      </div>

      {/* Venue & Location Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label htmlFor="venue" className="form-label">
            Venue *
          </label>
          <input
            type="text"
            id="venue"
            name="venue"
            required
            className="form-input"
            placeholder="e.g., Moscone Center"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location" className="form-label">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            className="form-input"
            placeholder="e.g., San Francisco, CA"
          />
        </div>
      </div>

      {/* Date & Time Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label htmlFor="date" className="form-label">
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="time" className="form-label">
            Time *
          </label>
          <input
            type="time"
            id="time"
            name="time"
            required
            className="form-input"
          />
        </div>
      </div>

      {/* Mode */}
      <div className="form-group">
        <label htmlFor="mode" className="form-label">
          Event Mode *
        </label>
        <select id="mode" name="mode" required className="form-input">
          <option value="">Select mode</option>
          <option value="online">Online</option>
          <option value="offline">Offline (In-Person)</option>
          <option value="hybrid">Hybrid (In-Person & Online)</option>
        </select>
      </div>

      {/* Audience */}
      <div className="form-group">
        <label htmlFor="audience" className="form-label">
          Target Audience *
        </label>
        <input
          type="text"
          id="audience"
          name="audience"
          required
          className="form-input"
          placeholder="e.g., Cloud engineers, DevOps, enterprise leaders"
        />
      </div>

      {/* Organizer */}
      <div className="form-group">
        <label htmlFor="organizer" className="form-label">
          Organizer *
        </label>
        <textarea
          id="organizer"
          name="organizer"
          required
          rows={3}
          className="form-input"
          placeholder="Information about the organizing team or company..."
        />
      </div>

      {/* Agenda Items */}
      <div className="form-group">
        <label className="form-label">Agenda *</label>
        <div className="space-y-3">
          {agendaItems.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateAgendaItem(index, e.target.value)}
                className="form-input flex-1"
                placeholder="e.g., 08:30 AM - 09:30 AM | Keynote: Topic"
              />
              {agendaItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAgendaItem(index)}
                  className="btn-secondary px-4"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addAgendaItem}
            className="btn-secondary w-full"
          >
            + Add Agenda Item
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="form-group">
        <label className="form-label">Tags *</label>
        <div className="space-y-3">
          {tags.map((tag, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={tag}
                onChange={(e) => updateTag(index, e.target.value)}
                className="form-input flex-1"
                placeholder="e.g., Cloud, DevOps, AI"
              />
              {tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="btn-secondary px-4"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTag}
            className="btn-secondary w-full"
          >
            + Add Tag
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating Event...' : 'Create Event'}
      </button>
    </form>
  );
};

export default CreateEventForm;
