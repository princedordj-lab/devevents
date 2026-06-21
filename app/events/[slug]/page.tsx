import { notFound } from "next/navigation";
import EventDetailClient from "./EventDetailClient";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailPage = async ({ params }: Props) => {
  const { slug } = await params;

  const response = await fetch(`${BASE_URL}/api/events/${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return notFound()
  }

  const { event } = await response.json();

  return <EventDetailClient event={event} />;
};

export default EventDetailPage;