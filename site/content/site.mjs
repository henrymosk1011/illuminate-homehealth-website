// Everything the site says about the business lives here.
// House style: no dashes of any kind in visible copy (write "follow up", not "follow-up";
// phone numbers as "(818) 987 4173"). `npm run check` fails the build if one slips in.

export const SITE = {
  name: 'Illuminate Home Health Care, Inc.',
  shortName: 'Illuminate Home Health',
  url: 'https://www.illuminatehomehealth.com',
  description:
    'Illuminate Home Health Care provides skilled nursing, physical, occupational and speech therapy, medical social services and home health aides for patients across Los Angeles and the San Fernando Valley.',
  phone: '(818) 987 4173',
  phoneHref: 'tel:+18189874173',
  phoneE164: '+1 818 987 4173',
  fax: '(818) 235 0135',
  faxHref: 'tel:+18182350135',
  faxE164: '+1 818 235 0135',
  email: 'contact@illuminatehomehealth.com',
  address: {
    street: '10545 Burbank Blvd, Suite 137',
    city: 'North Hollywood',
    region: 'CA',
    zip: '91601',
    country: 'US',
  },
  mapsUrl: 'https://maps.app.goo.gl/GX7ESrkXE8mKDvqf6',
  license: '550005596',
  founded: 'more than ten years',
  // Set this to a Google Analytics 4 ID (G-XXXXXXX) to turn on analytics site wide.
  gaId: '',
  designer: { name: 'TENELEVENMEDIA', url: 'https://www.tenelevenmedia.com/' },
  areas: [
    'North Hollywood',
    'Burbank',
    'Glendale',
    'Studio City',
    'Sherman Oaks',
    'Van Nuys',
    'Valley Village',
    'Toluca Lake',
    'Encino',
    'Sun Valley',
    'Pasadena',
    'Los Angeles',
  ],
  insurers: [
    { name: 'UnitedHealthcare', logo: '/assets/img/insurers/unitedhealthcare.webp', w: 606, h: 186 },
    { name: 'Carelon', logo: '/assets/img/insurers/carelon.webp', w: 998, h: 256 },
  ],
};

export const NAV = [
  { href: '/services/', label: 'Services' },
  { href: '/about/', label: 'About' },
  { href: '/referrals/', label: 'Referrals' },
  { href: '/faq/', label: 'FAQ' },
  { href: '/contact/', label: 'Contact' },
];

export const STATS = [
  { value: 400, suffix: '+', label: 'Patients cared for' },
  { value: 10, suffix: '+', label: 'Years serving Los Angeles' },
  { value: 20, suffix: '+', label: 'Nurses, therapists and staff' },
  { value: 24, suffix: '/7', label: 'Support for urgent needs' },
];

export const VALUES = [
  {
    title: 'Responsibility',
    text: 'We earn trust through reliable, dedicated care. When we say we will be there, we are there, on time and fully prepared.',
  },
  {
    title: 'Care',
    text: 'Every plan is built around the person, not the diagnosis. We tailor each visit to what helps you heal and feel well.',
  },
  {
    title: 'Respect',
    text: 'We honor every patient and every home with dignity, patience and understanding, and we listen before we act.',
  },
  {
    title: 'Love',
    text: 'Kindness is part of the treatment. We bring warmth into every room because healing grows best where people feel cared for.',
  },
];

export const STEPS = [
  {
    title: 'Reach out',
    text: 'Call or send us a message. We answer your questions, explain your options and verify your insurance coverage.',
  },
  {
    title: 'We coordinate with your doctor',
    text: 'Home health care is ordered by a physician. We work directly with your doctor or hospital discharge planner to put everything in place.',
  },
  {
    title: 'Your first visit',
    text: 'A nurse or therapist visits your home, completes a full assessment and builds a personal plan of care around your goals.',
  },
  {
    title: 'Care that moves you forward',
    text: 'Your team visits on a steady schedule, tracks your progress and keeps your physician and family informed along the way.',
  },
];

export const TESTIMONIALS = [
  {
    quote: 'Illuminate’s amazingly compassionate staff made me feel understood and supported throughout my recovery journey.',
    name: 'Martha J.',
    place: 'La Verne, CA',
  },
  {
    quote: 'Finding hope again, thanks to the empowering guidance and care of this remarkable team.',
    name: 'John W.',
    place: 'La Crescenta, CA',
  },
  {
    quote: 'A life changing experience. I am so grateful for the personalized care and a newfound sense of purpose.',
    name: 'Sabina M.',
    place: 'Los Angeles, CA',
  },
];

export const TEAM_ROLES = [
  'Registered Nurses',
  'Licensed Vocational Nurses',
  'Physical Therapists',
  'Occupational Therapists',
  'Speech Language Pathologists',
  'Medical Social Workers',
  'Certified Home Health Aides',
];

export const FAQS = [
  {
    q: 'What is home health care?',
    a: 'Home health care is skilled medical care provided in your home under a physician’s orders. It can include nursing, physical, occupational and speech therapy, medical social services and home health aide support. The goal is to help you recover, regain independence and manage your health safely where you are most comfortable.',
  },
  {
    q: 'Who qualifies for home health care?',
    a: 'Most patients qualify when a physician orders care, the patient needs skilled nursing or therapy, and leaving home takes considerable effort. Every situation is different, so call us and our intake team will walk through yours.',
  },
  {
    q: 'What insurance plans do you accept?',
    a: 'We work with most major insurance providers, including UnitedHealthcare and Carelon. Contact us and we will verify your coverage and explain your benefits before care begins.',
  },
  {
    q: 'Do I need a referral from my doctor?',
    a: 'Home health services require a physician’s order. If you do not have one yet, reach out anyway. We will coordinate with your doctor or hospital discharge planner on your behalf.',
  },
  {
    q: 'How do I schedule care with Illuminate?',
    a: 'Simply call us at (818) 987 4173 or send a message through our contact form, and we will promptly help you schedule your first visit.',
  },
  {
    q: 'What areas do you serve?',
    a: 'We are based in North Hollywood and care for patients throughout the San Fernando Valley and greater Los Angeles. Call us to confirm availability in your neighborhood.',
  },
  {
    q: 'Can I request a specific clinician for my visits?',
    a: 'Yes. We do our best to honor preferences whenever possible, because continuity and comfort make a real difference in recovery.',
  },
  {
    q: 'How do you coordinate care for patients with complex needs?',
    a: 'Our nurses, therapists and social workers collaborate closely and stay in regular contact with your physician. Together we build one personalized plan, so transitions are seamless and care stays consistent.',
  },
  {
    q: 'What safety measures do you follow during home visits?',
    a: 'We follow CDC infection control guidelines and provide our staff with the protective equipment they need to keep you and your family safe.',
  },
  {
    q: 'Is help available outside of regular business hours?',
    a: 'Yes. Our team is available 24/7 for urgent needs of current patients. Call us anytime. For a medical emergency, always call 911 first.',
  },
];

export const SERVICES = [
  {
    slug: 'skilled-nursing',
    name: 'Skilled Nursing',
    image: 'skilled-nursing',
    alt: 'A nurse sits beside an older woman resting in bed at home, both smiling',
    short: 'Licensed nurses who manage complex care at home with precision, patience and warmth.',
    lead: 'Hospital level nursing expertise, delivered in the comfort of home. Our licensed nurses assess, treat, teach and coordinate with your physician at every visit.',
    body: [
      'Skilled nursing is the heart of home health care. Whether you are healing from surgery, adjusting to a new diagnosis or living with a chronic condition, our registered and licensed vocational nurses bring clinical skill to your living room and treat you like family while they are there.',
      'Each visit is guided by your physician’s orders and your personal plan of care. We watch for changes early, keep your doctor informed and make sure you and your family feel confident between visits.',
    ],
    includes: [
      'Health assessments and vital sign monitoring',
      'Wound care and dressing changes',
      'Medication management and teaching',
      'Chronic disease management for heart failure, COPD and diabetes',
      'Injections as ordered by your physician',
      'Catheter and ostomy care',
      'Pain management support',
      'Education for patients and caregivers',
    ],
    helps: [
      'Recovering after surgery or a hospital stay',
      'Living with a chronic or complex condition',
      'Managing new medications or a new diagnosis',
      'Wounds that need professional care',
    ],
  },
  {
    slug: 'physical-therapy',
    name: 'Physical Therapy',
    image: 'physical-therapy',
    alt: 'A caregiver helps an older woman stand with her walker in a sunny living room',
    short: 'Rebuild strength, balance and confidence with a therapist who works where you actually live.',
    lead: 'Customized rehabilitation that restores mobility, strength and function, practiced in the rooms and on the stairs you use every day.',
    body: [
      'Therapy at home is therapy that sticks. Our physical therapists design exercise programs around your real environment, so every session builds the exact skills you need to move safely through your own home.',
      'We focus on what matters most to you, from walking to the mailbox to getting back to the kitchen, and we adjust the plan as your strength returns.',
    ],
    includes: [
      'Strength and endurance training',
      'Balance training and fall prevention',
      'Gait training and safe use of walkers or canes',
      'Home safety assessments',
      'Rehabilitation after joint replacement',
      'Pain relief through guided movement',
      'Personalized home exercise programs',
    ],
    helps: [
      'Recovering after hip or knee replacement',
      'Regaining function after a stroke',
      'Recent falls or a fear of falling',
      'Weakness after illness or a hospital stay',
    ],
  },
  {
    slug: 'occupational-therapy',
    name: 'Occupational Therapy',
    image: 'occupational-therapy',
    alt: 'A caregiver guides an older couple through a hands on activity at a table',
    short: 'Practical strategies and tools that make everyday tasks easier, safer and more independent.',
    lead: 'Personalized interventions that enhance daily function and independence, so you can keep doing the things that make home feel like home.',
    body: [
      'Occupational therapy is about the moments that fill a day: getting dressed, bathing, cooking, reading the mail. Our occupational therapists help you relearn and adapt these tasks so you can do more on your own, with less strain and more confidence.',
      'We also look at the home itself, recommending simple changes and adaptive equipment that make a measurable difference in safety.',
    ],
    includes: [
      'Training for bathing, dressing and grooming',
      'Energy conservation techniques',
      'Adaptive equipment recommendations',
      'Home modification guidance',
      'Fine motor and coordination exercises',
      'Cognitive strategies for daily routines',
    ],
    helps: [
      'Adjusting after a stroke or neurological change',
      'Living with arthritis or limited mobility',
      'Returning home after surgery',
      'Changes in memory or attention',
    ],
  },
  {
    slug: 'speech-therapy',
    name: 'Speech Therapy',
    image: 'speech-therapy',
    alt: 'A therapist in a bright room listens closely to an older woman as she speaks',
    short: 'Targeted therapy that restores communication, cognition and safe swallowing.',
    lead: 'Targeted therapies that improve communication, cognition and swallowing, for a fuller and safer quality of life at home.',
    body: [
      'Being understood is fundamental. Our speech language pathologists help patients regain clear speech, find their words, strengthen memory and swallow safely after illness or injury.',
      'Sessions happen at your kitchen table, with the people you talk to every day, so progress carries straight into real conversations and real meals.',
    ],
    includes: [
      'Speech and language therapy',
      'Swallowing evaluation and therapy',
      'Cognitive and memory exercises',
      'Voice therapy',
      'Communication strategies for families',
    ],
    helps: [
      'Speech or language changes after a stroke',
      'Parkinson’s disease and other neurological conditions',
      'Difficulty chewing or swallowing',
      'Memory and word finding challenges',
    ],
  },
  {
    slug: 'medical-social-services',
    name: 'Medical Social Services',
    image: 'social-services',
    alt: 'Two women sit together on a sofa in quiet conversation',
    short: 'Guidance through the emotional, financial and practical side of illness.',
    lead: 'Comprehensive support that addresses emotional, social and practical needs, so families can focus on healing instead of paperwork.',
    body: [
      'A health change affects the whole household. Our medical social workers help patients and families cope with the emotional weight of illness and untangle the practical questions that come with it.',
      'From understanding benefits to finding community programs, we connect you with the resources that make life at home sustainable.',
    ],
    includes: [
      'Counseling for patients and families',
      'Help navigating insurance and benefits',
      'Connections to community resources',
      'Long term care planning',
      'Information about advance directives',
    ],
    helps: [
      'Families facing a new or serious diagnosis',
      'Patients who need community support services',
      'Caregivers who feel stretched thin',
    ],
  },
  {
    slug: 'home-health-aide',
    name: 'Home Health Aide',
    image: 'home-health-aide',
    alt: 'A smiling caregiver shares a laugh with an older woman in a green sweater',
    short: 'Certified aides who help with personal care so patients feel comfortable, clean and cared for.',
    lead: 'Professional care that preserves comfort and dignity, with help for the daily activities that recovery can make difficult.',
    body: [
      'Our certified home health aides work under the supervision of your nurse or therapist to support personal care, mobility and the exercises in your care plan.',
      'They are often the friendly face patients see most, and we choose aides for their patience and kindness as much as their skill.',
    ],
    includes: [
      'Bathing, grooming and personal hygiene',
      'Help with dressing',
      'Mobility and transfer assistance',
      'Support with prescribed exercises',
      'Light meal preparation related to care',
    ],
    helps: [
      'Patients receiving skilled nursing or therapy at home',
      'Anyone who needs help with personal care while recovering',
    ],
  },
  {
    slug: 'alzheimers-dementia-care',
    name: 'Alzheimer’s and Dementia Care',
    image: 'alzheimers-care',
    alt: 'A caregiver gently holds the hands of an older woman',
    short: 'Patient, specialized support for people living with memory loss and the families who love them.',
    lead: 'Specialized, compassionate support tailored to the unique needs of people living with Alzheimer’s disease and other forms of dementia.',
    body: [
      'Familiar surroundings can be a powerful comfort for someone living with memory loss. Our team helps patients stay safely at home with routines, supervision and clinical care designed around changing needs.',
      'We support families too, with education and guidance that make each day calmer and more connected.',
    ],
    includes: [
      'Cognitive and behavioral monitoring',
      'Medication oversight',
      'Home safety planning',
      'Calming routines that reduce confusion and anxiety',
      'Caregiver education and support',
    ],
    helps: [
      'People in any stage of Alzheimer’s disease or dementia',
      'Families caring for a loved one at home',
    ],
  },
  {
    slug: 'post-hospital-care',
    name: 'Care After Hospitalization',
    image: 'after-hospital',
    alt: 'A clinician sits with an older man in his living room and talks through his recovery',
    short: 'A smooth transition from hospital to home, with support that helps prevent a return trip.',
    lead: 'Seamless recovery care after a hospital stay or general surgery, so the trip home is the start of healing, not a setback.',
    body: [
      'The first days home are the most important. We coordinate with your discharge planner and physician before you leave, then visit early to review medications, check incisions and watch for warning signs.',
      'With nursing and therapy working together, patients regain strength sooner and families know exactly what to expect.',
    ],
    includes: [
      'Coordination with discharge planners and physicians',
      'Medication reconciliation',
      'Monitoring for warning signs',
      'Wound and incision care',
      'Therapy to rebuild strength and mobility',
      'Clear education for patients and families',
    ],
    helps: [
      'Recovering after general surgery',
      'Returning home after a hospital or rehab stay',
      'Patients at higher risk of readmission',
    ],
  },
  {
    slug: 'medication-management',
    name: 'Medication Management',
    image: 'medication',
    alt: 'An orange weekly pill organizer with morning and evening compartments',
    short: 'Clear schedules, careful reviews and timely reminders that keep treatment on track.',
    lead: 'Timely prompts and careful oversight for optimal medication adherence and better health management.',
    body: [
      'Many patients juggle several prescriptions at once, and small mistakes add up. Our nurses review every medication, organize clear schedules and teach patients and caregivers what each one does.',
      'We stay in touch with your physician and pharmacy, so changes are caught early and your plan stays current.',
    ],
    includes: [
      'Medication review and reconciliation',
      'Organized schedules and pill planners',
      'Education on purpose and side effects',
      'Monitoring for interactions and reactions',
      'Communication with your physician and pharmacy',
    ],
    helps: [
      'Patients taking several medications',
      'Anyone starting a new prescription',
      'Families helping a loved one stay on schedule',
    ],
  },
  {
    slug: 'geriatric-care-management',
    name: 'Geriatric Care Management',
    image: 'geriatric-care',
    alt: 'A care manager reviews a plan with an older woman in her living room',
    short: 'A coordinated plan that supports wellbeing and independence for older adults.',
    lead: 'Comprehensive support that enhances wellbeing and independence for older adults, with one team keeping every piece of care connected.',
    body: [
      'As needs grow, care can become scattered across doctors, specialists and services. Our team brings it together with a single plan, regular check ins and a clear point of contact for the whole family.',
      'We look at health, safety and quality of life as a whole, and adjust the plan as circumstances change.',
    ],
    includes: [
      'Comprehensive needs assessment',
      'Care plan development',
      'Coordination across providers',
      'Family meetings and updates',
      'Ongoing monitoring and adjustments',
    ],
    helps: [
      'Older adults with several health needs',
      'Families coordinating care from a distance',
      'Anyone planning for safe aging at home',
    ],
  },
];
