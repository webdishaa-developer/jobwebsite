import { PrismaClient, AdminRole, JobType, WorkMode, JobStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create super admin
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@Recluta2024!', 12);
  
  const admin = await prisma.admin.upsert({
    where: { email: 'info@reclutasolutions.in' },
    update: {},
    create: {
      email: 'info@reclutasolutions.in',
      password: hashedPassword,
      name: 'Hemanand Saha',
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Create sample jobs
  const jobs = await Promise.all([
    prisma.job.upsert({
      where: { slug: 'senior-software-engineer-bangalore' },
      update: {},
      create: {
        title: 'Senior Software Engineer',
        slug: 'senior-software-engineer-bangalore',
        location: 'Bangalore, Karnataka',
        jobType: JobType.FULL_TIME,
        workMode: WorkMode.HYBRID,
        industry: 'Information Technology',
        department: 'Engineering',
        experienceMin: 4,
        experienceMax: 8,
        salaryMin: 1200000,
        salaryMax: 2000000,
        description: '<p>We are looking for a highly skilled Senior Software Engineer to join our client\'s engineering team. You will be responsible for designing, developing, and maintaining scalable software solutions.</p>',
        requirements: '<ul><li>4+ years of software development experience</li><li>Proficiency in React.js and Node.js</li><li>Experience with cloud platforms (AWS/GCP/Azure)</li><li>Strong problem-solving skills</li></ul>',
        responsibilities: '<ul><li>Design and implement scalable software solutions</li><li>Lead technical discussions and code reviews</li><li>Mentor junior developers</li><li>Collaborate with cross-functional teams</li></ul>',
        skills: 'React.js,Node.js,TypeScript,AWS,Docker,PostgreSQL',
        openings: 3,
        status: JobStatus.ACTIVE,
        isFeatured: true,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.job.upsert({
      where: { slug: 'hr-manager-mumbai' },
      update: {},
      create: {
        title: 'HR Manager',
        slug: 'hr-manager-mumbai',
        location: 'Mumbai, Maharashtra',
        jobType: JobType.FULL_TIME,
        workMode: WorkMode.ON_SITE,
        industry: 'Human Resources',
        department: 'HR',
        experienceMin: 5,
        experienceMax: 10,
        salaryMin: 800000,
        salaryMax: 1400000,
        description: '<p>We are seeking an experienced HR Manager to oversee all aspects of human resources practices and processes for our client organization.</p>',
        requirements: '<ul><li>5+ years of HR management experience</li><li>MBA in HR preferred</li><li>Strong knowledge of employment law</li><li>Excellent communication skills</li></ul>',
        responsibilities: '<ul><li>Manage end-to-end recruitment process</li><li>Develop HR policies and procedures</li><li>Handle employee relations and conflict resolution</li><li>Oversee performance management systems</li></ul>',
        skills: 'Recruitment,Performance Management,Employee Relations,HRMS,Labor Law',
        openings: 1,
        status: JobStatus.ACTIVE,
        isFeatured: true,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.job.upsert({
      where: { slug: 'branch-manager-bfsi-delhi' },
      update: {},
      create: {
        title: 'Branch Manager - BFSI',
        slug: 'branch-manager-bfsi-delhi',
        location: 'Delhi, NCR',
        jobType: JobType.FULL_TIME,
        workMode: WorkMode.ON_SITE,
        industry: 'Banking & Finance',
        department: 'Operations',
        experienceMin: 6,
        experienceMax: 12,
        salaryMin: 1000000,
        salaryMax: 1800000,
        description: '<p>Our BFSI client is looking for an experienced Branch Manager to lead and manage branch operations, drive business growth, and ensure excellent customer service.</p>',
        requirements: '<ul><li>6+ years in banking/financial services</li><li>Proven track record in sales and business development</li><li>Strong leadership and team management skills</li><li>CA/MBA Finance preferred</li></ul>',
        responsibilities: '<ul><li>Manage complete branch operations</li><li>Achieve business targets and KPIs</li><li>Lead and motivate a team of 15-20 employees</li><li>Ensure regulatory compliance</li></ul>',
        skills: 'Banking Operations,Team Management,Business Development,Compliance,CRM',
        openings: 2,
        status: JobStatus.ACTIVE,
        isFeatured: false,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.job.upsert({
      where: { slug: 'plant-manager-manufacturing-pune' },
      update: {},
      create: {
        title: 'Plant Manager',
        slug: 'plant-manager-manufacturing-pune',
        location: 'Pune, Maharashtra',
        jobType: JobType.FULL_TIME,
        workMode: WorkMode.ON_SITE,
        industry: 'Manufacturing',
        department: 'Operations',
        experienceMin: 10,
        experienceMax: 18,
        salaryMin: 1500000,
        salaryMax: 2500000,
        description: '<p>Leading manufacturing company seeking an experienced Plant Manager to oversee all production operations, quality control, and plant maintenance.</p>',
        requirements: '<ul><li>B.Tech/M.Tech in Mechanical/Production Engineering</li><li>10+ years in manufacturing</li><li>Experience with lean manufacturing and Six Sigma</li><li>Strong knowledge of quality systems</li></ul>',
        responsibilities: '<ul><li>Oversee complete plant operations</li><li>Implement lean manufacturing practices</li><li>Manage production targets and quality standards</li><li>Ensure health and safety compliance</li></ul>',
        skills: 'Lean Manufacturing,Six Sigma,Quality Management,Production Planning,EHS',
        openings: 1,
        status: JobStatus.ACTIVE,
        isFeatured: true,
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.job.upsert({
      where: { slug: 'data-scientist-hyderabad' },
      update: {},
      create: {
        title: 'Data Scientist',
        slug: 'data-scientist-hyderabad',
        location: 'Hyderabad, Telangana',
        jobType: JobType.FULL_TIME,
        workMode: WorkMode.HYBRID,
        industry: 'Information Technology',
        department: 'Data & Analytics',
        experienceMin: 3,
        experienceMax: 6,
        salaryMin: 1000000,
        salaryMax: 1800000,
        description: '<p>Join our IT client\'s growing data science team. You will work on cutting-edge machine learning models and data analytics projects that drive business decisions.</p>',
        requirements: '<ul><li>3+ years in data science/ML</li><li>Proficiency in Python and R</li><li>Experience with TensorFlow/PyTorch</li><li>Strong statistical knowledge</li></ul>',
        responsibilities: '<ul><li>Build and deploy ML models</li><li>Analyze large datasets to extract insights</li><li>Develop data pipelines</li><li>Present findings to stakeholders</li></ul>',
        skills: 'Python,Machine Learning,TensorFlow,SQL,Tableau,Statistics',
        openings: 2,
        status: JobStatus.ACTIVE,
        isFeatured: false,
        deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);
  console.log(`✅ ${jobs.length} jobs created`);

  // Create testimonials
  const testimonials = await Promise.all([
    prisma.testimonial.create({
      data: {
        name: 'Rajesh Kumar',
        role: 'Software Engineer',
        company: 'TechCorp India',
        content: 'Recluta helped me land my dream job in just 3 weeks. Their team was incredibly professional and guided me through every step of the process. Highly recommended!',
        rating: 5,
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'Priya Sharma',
        role: 'HR Director',
        company: 'Fintech Solutions Ltd',
        content: 'We have been working with Recluta for our hiring needs for the past 2 years. Their quality of candidates and turnaround time is exceptional. Best recruitment partner we\'ve had.',
        rating: 5,
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'Amit Patel',
        role: 'Operations Manager',
        company: 'Manufacturing Plus',
        content: 'Recluta found us 15 quality engineers for our new plant within 45 days. Their understanding of the manufacturing sector is unmatched. Great team!',
        rating: 5,
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'Sunita Verma',
        role: 'Marketing Manager',
        company: 'Consumer Goods Co.',
        content: 'The best recruitment agency I\'ve worked with. Very professional, transparent, and they really understand what both candidates and companies are looking for.',
        rating: 4,
        isActive: true,
        isFeatured: false,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'Deepak Mehta',
        role: 'CFO',
        company: 'NBFC Capital Ltd',
        content: 'Recluta placed our entire senior leadership team within 60 days. Their network in the BFSI sector is exceptional. We continue to rely on them for all our hiring needs.',
        rating: 5,
        isActive: true,
        isFeatured: true,
      },
    }),
  ]);
  console.log(`✅ ${testimonials.length} testimonials created`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
