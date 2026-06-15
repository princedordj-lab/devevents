import mongoose, { Schema, Document } from "mongoose";

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert an arbitrary string to a URL-friendly slug:
 * lowercase, replace whitespace runs with hyphens, strip non-alphanumeric.
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

/**
 * Normalise a date string to `YYYY-MM-DD`. Throws if the value is not a
 * parseable date.
 */
function normalizeDate(value: string): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date value: "${value}"`);
  }
  return d.toISOString().split("T")[0];
}

/**
 * Normalise a time string to a consistent `HH:MM AM/PM` format. Accepts
 * `HH:MM`, `HH:MM AM/PM`, `H:MM AM/PM`, etc.
 */
function normalizeTime(value: string): string {
  const trimmed = value.trim().toUpperCase();

  // Already in HH:MM AM/PM — return as-is
  if (/^\d{1,2}:\d{2}\s?(AM|PM)$/.test(trimmed)) {
    return trimmed.replace(/\s?(AM|PM)/, (m) => ` ${m.trim()}`);
  }

  // 24-hour format (HH:MM) — convert to 12-hour
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    let hours = parseInt(match24[1], 10);
    const minutes = match24[2];
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  }

  // Fallback: return the original value so the caller can decide.
  return value.trim();
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: [true, "title is required"], trim: true },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    overview: { type: String, required: [true, "overview is required"] },
    image: { type: String, required: [true, "image is required"] },
    venue: { type: String, required: [true, "venue is required"] },
    location: { type: String, required: [true, "location is required"] },
    date: { type: String, required: [true, "date is required"] },
    time: { type: String, required: [true, "time is required"] },
    mode: { type: String, required: [true, "mode is required"] },
    audience: { type: String, required: [true, "audience is required"] },
    agenda: {
      type: [String],
      required: [true, "agenda is required"],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "agenda must contain at least one item",
      },
    },
    organizer: { type: String, required: [true, "organizer is required"] },
    tags: {
      type: [String],
      required: [true, "tags is required"],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically manage createdAt / updatedAt
  }
);

// ---------------------------------------------------------------------------
// Pre-save hook: slug generation & date/time normalisation
// ---------------------------------------------------------------------------

eventSchema.pre<IEvent>("save", function () {
  // ── Slug ────────────────────────────────────────────────────────────
  // Only regenerate when the title is new or has been modified so that
  // updates to other fields don't invalidate existing URLs.
  if (this.isModified("title") || this.isNew) {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error("title is required to generate a slug");
    }
    this.slug = generateSlug(this.title);
  }

  // ── Date ────────────────────────────────────────────────────────────
  // Normalise to YYYY-MM-DD so consumers always get a consistent format.
  if (this.isModified("date") || this.isNew) {
    this.date = normalizeDate(this.date);
  }

  // ── Time ────────────────────────────────────────────────────────────
  // Normalise to HH:MM AM/PM so the front-end doesn't need to guess the
  // format. If parsing fails the original value is kept.
  if (this.isModified("time") || this.isNew) {
    try {
      this.time = normalizeTime(this.time);
    } catch {
      // Keep the original value if normalisation fails.
    }
  }
});

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

export const Event = mongoose.model<IEvent>("Event", eventSchema);