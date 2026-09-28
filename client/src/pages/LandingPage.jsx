import React from 'react';
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  ArrowRight,
  Calendar,
  Pill,
  FlaskConical,
  Sparkles,
  UserCheck,
  HeartHandshake,
  Award,
  ChevronRight,
  TrendingUp,
  Stethoscope,
  Activity
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import productServices from '../services/medicalService';
import medicalService from '../services/medicalService';
import Loader from '../components/common/Loader';


const MOCK_CATEGORIES = [
  {
    id: 'pharmacy',
    name: 'Online Pharmacy',
    desc: 'Doorstep medicine delivery with 100% genuine guarantee & Rx verification',
    icon: Pill,
    badge: 'Express 2h',
    badgeVariant: 'success',
    color: 'from-emerald-500/10 to-teal-500/10 text-teal-700 border-teal-200/50',
    count: '15,000+ Items',
  },
  {
    id: 'doctors',
    name: 'Consult Doctors',
    desc: 'Video or clinic visits with top board-certified healthcare specialists',
    icon: Stethoscope,
    badge: '35+ Specialties',
    badgeVariant: 'info',
    color: 'from-sky-500/10 to-blue-500/10 text-sky-700 border-sky-200/50',
    count: '1,200+ Doctors',
  },
  {
    id: 'lab',
    name: 'Diagnostic Lab Tests',
    desc: 'Certified home sample collection with verified digital reports in 24 hours',
    icon: FlaskConical,
    badge: 'Free Home Pickup',
    badgeVariant: 'warning',
    color: 'from-amber-500/10 to-orange-500/10 text-amber-700 border-amber-200/50',
    count: '300+ Test Packages',
  },
  {
    id: 'ai-hub',
    name: 'MediTrust AI Suite',
    desc: 'Instant prescription explainer, symptom analyzer & 24/7 clinical AI triage',
    icon: Sparkles,
    badge: 'AI Powered',
    badgeVariant: 'purple',
    color: 'from-indigo-500/10 to-purple-500/10 text-indigo-700 border-indigo-200/50',
    count: 'Instant Answers',
  },
];

const MOCK_FEATURED_DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins, MD',
    specialty: 'Cardiologist',
    experience: '14 yrs exp.',
    hospital: 'Mount Sinai Heart Center',
    rating: 4.9,
    reviewsCount: 382,
    fee: '$95',
    nextAvailable: 'Today, 3:30 PM',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    verified: true,
  },
  {
    id: 'doc-2',
    name: 'Dr. Marcus Vance, DO',
    specialty: 'Dermatologist',
    experience: '11 yrs exp.',
    hospital: 'Boston Skin & Wellness Clinic',
    rating: 4.8,
    reviewsCount: 260,
    fee: '$85',
    nextAvailable: 'Tomorrow, 10:00 AM',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    verified: true,
  },
  {
    id: 'doc-3',
    name: 'Dr. Elena Rostova, MD',
    specialty: 'Pediatric Specialist',
    experience: '16 yrs exp.',
    hospital: "Children's Health Pavilion",
    rating: 5.0,
    reviewsCount: 440,
    fee: '$90',
    nextAvailable: 'Today, 5:15 PM',
    image: 'https://images.unsplash.com/photo-1594824813576-9694c979d50a?auto=format&fit=crop&q=80&w=400',
    verified: true,
  },
  {
    id: 'doc-4',
    name: 'Dr. David Kim, MBBS',
    specialty: 'Neurologist',
    experience: '12 yrs exp.',
    hospital: 'Metropolitan Neuro Institute',
    rating: 4.9,
    reviewsCount: 310,
    fee: '$110',
    nextAvailable: 'Wed, 11:30 AM',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    verified: true,
  },
];


const MOCK_TESTIMONIALS = [
  {
    id: 1,
    quote: "MediTrust made managing my elderly mother's prescriptions and monthly blood tests effortless. The home sample collector arrived right at 7:30 AM and reports were ready by evening.",
    author: 'Clara Montgomery',
    title: 'Verified Patient • New York',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    tag: 'Home Lab Tests',
  },
  {
    id: 2,
    quote: "The AI prescription explainer accurately decoded my doctor's messy handwriting, laid out the dosage chart clearly, and helped me order the medicines with one tap.",
    author: 'Julian Ramos',
    title: 'Verified Patient • Chicago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    tag: 'AI Prescription Tool',
  },
  {
    id: 3,
    quote: "Finding a board-certified dermatologist and completing a HD video consultation within 20 minutes was incredible. MediTrust sets the standard for modern telehealth.",
    author: 'Dr. Rebecca Chen',
    title: 'Healthcare Analyst • Seattle',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    tag: 'Video Consultation',
  },
];

export default function LandingPage({ onNavigate }) {


  const { data, isLoading, isSuccess, isError, error } = useQuery({ queryKey: ['items'], queryFn: medicalService.fetchData })


  if (isLoading) {
    return <Loader />
  }


  if (isError) {
    return (
      <div className="h-screen">
        <h1 className="text-center">{error.message || "Something Went Wrong!!"}</h1>
      </div>
    )
  }


  return (
    <div className="space-y-20 pb-20">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 bg-gradient-to-b from-teal-50/70 via-sky-50/40 to-white">

        {/* Subtle background glow circles */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 left-5 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Headline and Search */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/70 border border-teal-200/80 text-teal-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                Trusted Digital Healthcare Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Your Health, Verified & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-700 to-indigo-600">Delivered</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Consult with verified doctors, order authentic medicines with fast doorstep delivery, book home diagnostic lab tests, and leverage clinical AI health tools.
              </p>

              {/* Omnibox Healthcare Search Bar */}
              <div className="bg-white p-2.5 rounded-2xl shadow-xl shadow-teal-900/5 border border-slate-200/80 max-w-xl mx-auto lg:mx-0">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="flex items-center w-full px-3 py-2 text-slate-400">
                    <Search className="w-5 h-5 text-teal-600 shrink-0 mr-3" />
                    <input
                      type="text"
                      placeholder="Search medicines, doctors, or tests..."
                      className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full sm:w-auto shrink-0 shadow-sm"
                      onClick={() => onNavigate('pharmacy')}
                    >
                      Find Care
                    </Button>
                  </div>
                </div>

                {/* Popular Search Tags */}
                <div className="pt-2 px-3 border-t border-slate-100 mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                  <span className="font-semibold text-slate-600">Popular:</span>
                  <button onClick={() => onNavigate('doctors')} className="px-2 py-0.5 rounded-md hover:bg-slate-100 text-teal-700 hover:text-teal-800 transition-colors">Cardiologist</button>
                  <span>•</span>
                  <button onClick={() => onNavigate('pharmacy')} className="px-2 py-0.5 rounded-md hover:bg-slate-100 text-teal-700 hover:text-teal-800 transition-colors">Amoxicillin</button>
                  <span>•</span>
                  <button onClick={() => onNavigate('lab')} className="px-2 py-0.5 rounded-md hover:bg-slate-100 text-teal-700 hover:text-teal-800 transition-colors">Full Body Checkup</button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">100% Verified</p>
                    <p className="text-[11px] text-slate-500">Licensed Doctors</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">24/7 Access</p>
                    <p className="text-[11px] text-slate-500">Instant Consults</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600 shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">NABL Labs</p>
                    <p className="text-[11px] text-slate-500">Accredited Tests</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Illustration & Floating Interactive Badges */}
            <div className="lg:col-span-5 relative flex justify-center">

              <div className="relative w-full max-w-md">

                {/* Main Visual Image Card */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 relative group">
                  <img
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800"
                    alt="Healthcare consultation"
                    className="w-full h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <Badge variant="purple" size="sm" className="mb-2">
                      Telehealth & Home Care
                    </Badge>
                    <p className="text-sm font-semibold">Comprehensive Clinical Care at Your Fingertips</p>
                  </div>
                </div>

                {/* Floating Card: Available Doctor Slot */}
                <div className="absolute -top-4 -left-4 sm:-left-8 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce-subtle">
                  <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-teal-500/30">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Doctor Available</p>
                    <p className="text-[11px] text-teal-600 font-medium">Slot in 15 mins</p>
                  </div>
                </div>

                {/* Floating Card: AI Prescription Status */}
                <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-bold text-slate-800">AI Assistant</p>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-[11px] text-slate-500">Prescription Interpreted</p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: CATEGORY TILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="info" size="sm" className="mb-2">
            Integrated Healthcare
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Everything You Need for Total Well-Being
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Seamlessly navigate between essential clinical services designed with patient safety first.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onNavigate(cat.id)}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 hover:border-teal-400 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center border shadow-xs group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant={cat.badgeVariant} size="sm">
                      {cat.badge}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-teal-700">
                  <span>{cat.count}</span>
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: FEATURED DOCTORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="info" size="sm" className="mb-2">
              Verified Physicians
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Consult Top Specialists Today
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Connect via high-definition video or book in-clinic appointments with zero wait time.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('doctors')}
            icon={ArrowRight}
            iconPosition="right"
          >
            View All Doctors
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.doctors.map((doctor) => (
            <Card key={doctor._id} hoverEffect className="flex flex-col justify-between h-full p-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{doctor.user.name}</h3>
                <p className="text-xs font-semibold text-teal-700">{doctor.specialization}</p>
                <p className="text-xs text-slate-500 mt-1">{doctor.clinicName}</p>

                <div className="mt-3 py-2 px-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Next Available:</span>
                  <span className="font-semibold text-teal-700">{doctor.workingHours.start} -{doctor.workingHours.end} </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Fee</span>
                  <span className="text-sm font-bold text-slate-900">{doctor.consultationFee}</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate('doctor-booking')}
                  className="w-auto"
                >
                  Book Visit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* SECTION 4: FEATURED MEDICINES */}
      <section className="bg-slate-100/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <Badge variant="success" size="sm" className="mb-2">
                Express Pharmacy
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Popular Healthcare Essentials
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Authentic medications with tamper-proof packaging and fast home dispatch.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('pharmacy')}
              icon={ArrowRight}
              iconPosition="right"
            >
              Browse Pharmacy
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.medicines.map((med) => (
              <Card key={med._id} hoverEffect className="flex flex-col justify-between h-full p-4 bg-white">
                <div>
                  <div className="relative rounded-xl overflow-hidden aspect-square mb-3 bg-slate-50 flex items-center justify-center p-4">
                    <img
                      src={med.image}
                      alt={med.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <span className="text-[11px] font-medium text-teal-600 uppercase tracking-wider">{med.category}</span>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5 line-clamp-1">{med.name}</h3>
                  <p className="text-xs text-slate-400">{med.name}</p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{med.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-slate-900">${med.price.toFixed(2)}</span>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onNavigate('product-detail')}
                  >
                    Order Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: AI SPOTLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-950 text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl" />
          <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Next-Generation Clinical Intelligence
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Confused by Your Prescription or Symptoms?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                MediTrust AI safely analyzes medication instructions, deciphers handwriting, breaks down potential drug interactions, and helps guide your next clinical step.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Button
                  variant="ai"
                  size="md"
                  onClick={() => onNavigate('ai-prescription')}
                  icon={Sparkles}
                >
                  Explain My Prescription
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  onClick={() => onNavigate('ai-chat')}
                >
                  Chat With AI
                </Button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-400/20 text-teal-300 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Instant Analysis</p>
                  <p className="text-[11px] text-slate-300">Under 5 seconds</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 italic">
                "Uploaded my discharge summary and it categorized all 4 medications by exact timing and food interactions."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="purple" size="sm" className="mb-2">
            Patient Stories
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Trusted by Over 50,000 Families
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Read authentic experiences from patients who rely on MediTrust for their healthcare journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_TESTIMONIALS.map((t) => (
            <Card key={t.id} className="flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Badge variant="neutral" size="sm">
                    {t.tag}
                  </Badge>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.author}</h4>
                  <p className="text-[11px] text-slate-500">{t.title}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
}
