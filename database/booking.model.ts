import mongoose, { Schema, Document } from "mongoose";

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "eventId is required"],
      index: true, // Faster lookups when querying bookings by event
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      lowercase: true,
      // Validate email format with a reasonable regex pattern.
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
  },
  {
    timestamps: true, // Automatically manage createdAt / updatedAt
  }
);

// ---------------------------------------------------------------------------
// Pre-save hook: referential integrity check
// ---------------------------------------------------------------------------

/**
 * Before saving a booking, verify that the referenced Event actually exists
 * in the database. This prevents orphaned bookings from being created when
 * the related event has been deleted or the ID is invalid.
 */
bookingSchema.pre<IBooking>("save", async function () {
  if (this.isModified("eventId") || this.isNew) {
    const eventExists = await mongoose.model("Event").exists({ _id: this.eventId });
    if (!eventExists) {
      throw new Error(`Referenced event does not exist: "${this.eventId}"`);
    }
  }
});

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);