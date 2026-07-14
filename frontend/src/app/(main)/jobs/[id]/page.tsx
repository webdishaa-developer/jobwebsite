import type { Metadata } from 'next';
import JobDetailClient from './JobDetailClient';

export const metadata: Metadata = {
  title: 'Job Details | Recluta',
};

export default function JobDetailPage({ params }: { params: { id: string } }) {
  return <JobDetailClient slug={params.id} />;
}
