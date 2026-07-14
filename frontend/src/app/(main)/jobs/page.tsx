import type { Metadata } from 'next';
import JobsPageClient from './JobsPageClient';

export const metadata: Metadata = {
  title: 'Jobs | Recluta Talent Management',
  description: 'Browse hundreds of job opportunities across IT, BFSI, Manufacturing, Healthcare and more. Apply now with Recluta Talent Management.',
};

export default function JobsPage() {
  return <JobsPageClient />;
}
