import { Camera, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PhotoImage {
  _id: string;
  src: string;
  alt: string;
  cloudinaryPublicId: string;
}

export interface PhotoCategory {
  _id: string;
  name: string;
  type: string;
}

export interface PhotoEntry {
  _id: string;
  images: PhotoImage[];
  title: string;
  category: PhotoCategory;
  date: string;
  location?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_PHOTOS: PhotoEntry[] = [
  {
    _id: "692e9bc153f519bd7338b8c0",
    images: [
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1764662207/prapti-foundation-images/mjbljp78z5wyqwi9dbzv.jpg",
        alt: "WhatsApp Image 2025-11-15 at 20",
        cloudinaryPublicId: "prapti-foundation-images/mjbljp78z5wyqwi9dbzv",
        _id: "692e9bc153f519bd7338b8c1",
      },
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1764662207/prapti-foundation-images/d5kny8nm0dqafpn5bt8o.jpg",
        alt: "WhatsApp Image 2025-11-15 at 20",
        cloudinaryPublicId: "prapti-foundation-images/d5kny8nm0dqafpn5bt8o",
        _id: "692e9bc153f519bd7338b8c2",
      },
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1764662207/prapti-foundation-images/cxpzv3c98dlcz8nofmpr.jpg",
        alt: "WhatsApp Image 2025-11-15 at 20",
        cloudinaryPublicId: "prapti-foundation-images/cxpzv3c98dlcz8nofmpr",
        _id: "692e9bc153f519bd7338b8c3",
      },
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1764662207/prapti-foundation-images/l2ntvzcuz8nyk1qfvcwd.jpg",
        alt: "WhatsApp Image 2025-11-15 at 20",
        cloudinaryPublicId: "prapti-foundation-images/l2ntvzcuz8nyk1qfvcwd",
        _id: "692e9bc153f519bd7338b8c4",
      },
    ],
    title: "খাদ্য যোগান - ১৫/১১/২০২৫",
    category: {
      _id: "68a5b9de65b3d1a0bf8db851",
      name: "Street Feeding",
      type: "photo",
    },
    date: "2025-11-15T00:00:00.000Z",
    location: "Golaghat",
    description:
      "আজি ১৫/১১/২০২৫ তাৰিখ শনিবাৰ আন দিনৰ দৰে আজিও পদ পথৰ কুকুৰবোৰক খাদ্য যোগান ধৰা হয় |",
    isActive: true,
    createdAt: "2025-12-02T07:56:49.458Z",
    updatedAt: "2025-12-02T07:56:49.458Z",
  },
  {
    _id: "691772259b8c6d2e725af9b7",
    images: [
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1763144228/prapti-foundation-images/tvuvg04v6juz3gc0jecs.jpg",
        alt: "WhatsApp Image 2025-11-13 at 20",
        cloudinaryPublicId: "prapti-foundation-images/tvuvg04v6juz3gc0jecs",
        _id: "691772259b8c6d2e725af9b8",
      },
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1763144228/prapti-foundation-images/cdsbsfx776uw4vukdv3t.jpg",
        alt: "WhatsApp Image 2025-11-13 at 20",
        cloudinaryPublicId: "prapti-foundation-images/cdsbsfx776uw4vukdv3t",
        _id: "691772259b8c6d2e725af9b9",
      },
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1763144228/prapti-foundation-images/crihcdeiqtkhgyvcbx25.jpg",
        alt: "WhatsApp Image 2025-11-13 at 20",
        cloudinaryPublicId: "prapti-foundation-images/crihcdeiqtkhgyvcbx25",
        _id: "691772259b8c6d2e725af9ba",
      },
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1763144228/prapti-foundation-images/uxf4q8sk8xv72ihxfbea.jpg",
        alt: "WhatsApp Image 2025-11-13 at 20",
        cloudinaryPublicId: "prapti-foundation-images/uxf4q8sk8xv72ihxfbea",
        _id: "691772259b8c6d2e725af9bb",
      },
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1763144228/prapti-foundation-images/zikcakkdte1jwjgba4qw.jpg",
        alt: "WhatsApp Image 2025-11-13 at 20",
        cloudinaryPublicId: "prapti-foundation-images/zikcakkdte1jwjgba4qw",
        _id: "691772259b8c6d2e725af9bc",
      },
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1763144313/prapti-foundation-images/sorquvnns6rxh4wbsgpg.png",
        alt: "domains-added",
        cloudinaryPublicId: "prapti-foundation-images/sorquvnns6rxh4wbsgpg",
        _id: "6917727a9b8c6d2e725afa26",
      },
    ],
    title: "খাদ্য যোগান - ১৩/১১/২০২৫",
    category: {
      _id: "68a5b9de65b3d1a0bf8db851",
      name: "Street Feeding",
      type: "photo",
    },
    date: "2025-11-13T00:00:00.000Z",
    location: "Golaghat",
    description:
      "আজি ১৩/১১/২০২৫ তাৰিখ বৃহস্পতিবাৰ আন দিনৰ দৰে আজিও পদ পথৰ কুকুৰবোৰক খাদ্য যোগান ধৰা হব ।",
    isActive: true,
    createdAt: "2025-11-14T18:17:09.661Z",
    updatedAt: "2025-11-14T18:18:34.888Z",
  },
  {
    _id: "691165f2ae4bef2891c5e66c",
    images: [
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1762747889/prapti-foundation-images/vxzvnb2h5pzyv5lyi6iq.jpg",
        alt: "care21",
        cloudinaryPublicId: "prapti-foundation-images/vxzvnb2h5pzyv5lyi6iq",
        _id: "691165f2ae4bef2891c5e66d",
      },
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1762747889/prapti-foundation-images/xjlo63bbgcjstur8xikt.jpg",
        alt: "care22",
        cloudinaryPublicId: "prapti-foundation-images/xjlo63bbgcjstur8xikt",
        _id: "691165f2ae4bef2891c5e66e",
      },
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1762747889/prapti-foundation-images/iwvh39tvgxns0ltlbju5.jpg",
        alt: "catre24",
        cloudinaryPublicId: "prapti-foundation-images/iwvh39tvgxns0ltlbju5",
        _id: "691165f2ae4bef2891c5e66f",
      },
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1762747889/prapti-foundation-images/tjux0reukdnftrgmsioe.jpg",
        alt: "care23",
        cloudinaryPublicId: "prapti-foundation-images/tjux0reukdnftrgmsioe",
        _id: "691165f2ae4bef2891c5e670",
      },
    ],
    title: "Quality time with Paws",
    category: {
      _id: "68a5b63865b3d1a0bf8db820",
      name: "Inside Foundation",
      type: "photo",
    },
    date: "2025-09-07T00:00:00.000Z",
    location: "Rangajan",
    description: "Quality time with Paws",
    isActive: true,
    createdAt: "2025-11-10T04:11:30.633Z",
    updatedAt: "2025-11-10T04:11:30.633Z",
  },
  {
    _id: "691163fdae4bef2891c5e5d4",
    images: [
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1762747388/prapti-foundation-images/ylbsiknnhnsze1ekv1kw.jpg",
        alt: "paws2",
        cloudinaryPublicId: "prapti-foundation-images/ylbsiknnhnsze1ekv1kw",
        _id: "691163fdae4bef2891c5e5d5",
      },
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1762747960/prapti-foundation-images/po1iffcqozwd7oxiph85.jpg",
        alt: "paws",
        cloudinaryPublicId: "prapti-foundation-images/po1iffcqozwd7oxiph85",
        _id: "69116639ae4bef2891c5e6d8",
      },
    ],
    title: "Cute Puppies",
    category: {
      _id: "68a5b63865b3d1a0bf8db820",
      name: "Inside Foundation",
      type: "photo",
    },
    date: "2025-11-04T00:00:00.000Z",
    location: "Rangajan",
    description: "Our Cute Puppies",
    isActive: true,
    createdAt: "2025-11-10T04:03:09.476Z",
    updatedAt: "2025-11-10T04:12:41.603Z",
  },
  {
    _id: "68a5bb4065b3d1a0bf8db8a6",
    images: [
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1755691839/prapti-foundation-images/oyoqv5ejb2zd9ohrml4m.png",
        alt: "Screenshot 2025-08-20 at 17",
        cloudinaryPublicId: "prapti-foundation-images/oyoqv5ejb2zd9ohrml4m",
        _id: "68a5bb4065b3d1a0bf8db8a7",
      },
    ],
    title: "Peace at the Sanctuary: Dogs Find Rest and Safety",
    category: {
      _id: "68a5b63865b3d1a0bf8db820",
      name: "Inside Foundation",
      type: "photo",
    },
    date: "2025-08-20T12:10:40.732Z",
    isActive: true,
    createdAt: "2025-08-20T12:10:40.978Z",
    updatedAt: "2025-08-20T12:10:40.978Z",
  },
  {
    _id: "68a5ba1c65b3d1a0bf8db856",
    images: [
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1755691545/prapti-foundation-images/nqziho8v15zqkhc4yfyb.png",
        alt: "Daily Nourishment: Feeding Time for Street Dogs",
        cloudinaryPublicId: "prapti-foundation-images/nqziho8v15zqkhc4yfyb",
        _id: "68a5ba1c65b3d1a0bf8db857",
      },
    ],
    title: "Daily Nourishment: Feeding Time for Street Dogs",
    category: {
      _id: "68a5b9de65b3d1a0bf8db851",
      name: "Street Feeding",
      type: "photo",
    },
    date: "2025-08-12T00:00:00.000Z",
    location: "Golaghat Town",
    isActive: true,
    createdAt: "2025-08-20T12:05:48.431Z",
    updatedAt: "2025-08-20T12:05:48.431Z",
  },
  {
    _id: "68a5b6c065b3d1a0bf8db832",
    images: [
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1755690686/prapti-foundation-images/leoiy3tz92h8oxow0nhl.png",
        alt: "Screenshot 2025-08-20 at 17",
        cloudinaryPublicId: "prapti-foundation-images/leoiy3tz92h8oxow0nhl",
        _id: "68a5b6c065b3d1a0bf8db833",
      },
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1762746616/prapti-foundation-images/foegrmvdhzkaxwvnr8r8.jpg",
        alt: "care1",
        cloudinaryPublicId: "prapti-foundation-images/foegrmvdhzkaxwvnr8r8",
        _id: "691160f8ae4bef2891c5e350",
      },
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1762746621/prapti-foundation-images/qtsjarntxuogb8vqbmlr.jpg",
        alt: "care11",
        cloudinaryPublicId: "prapti-foundation-images/qtsjarntxuogb8vqbmlr",
        _id: "691160feae4bef2891c5e35d",
      },
      {
        src: "https://res.cloudinary.com/dvd64tgi0/image/upload/v1762746695/prapti-foundation-images/jzzgwgz4cwsfpqcirgbq.jpg",
        alt: "care12",
        cloudinaryPublicId: "prapti-foundation-images/jzzgwgz4cwsfpqcirgbq",
        _id: "69116148ae4bef2891c5e39a",
      },
    ],
    title: "Rescued and Loved: Life at Prapti Foundation",
    category: {
      _id: "68a5b63865b3d1a0bf8db820",
      name: "Inside Foundation",
      type: "photo",
    },
    date: "2025-07-29T00:00:00.000Z",
    location: "Golaghat",
    isActive: true,
    createdAt: "2025-08-20T11:51:28.963Z",
    updatedAt: "2025-11-10T03:51:37.123Z",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Category badge color map ─────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  "Street Feeding": "bg-orange-100 text-orange-700",
  "Inside Foundation": "bg-green-100 text-green-700",
  Rescue: "bg-red-100 text-red-700",
  Awards: "bg-yellow-100 text-yellow-700",
  "Dogs Events": "bg-blue-100 text-blue-700",
};

function categoryStyle(name: string): string {
  return CATEGORY_COLORS[name] ?? "bg-gray-200 text-gray-600";
}

// ─── Component ────────────────────────────────────────────────────────────────

const FallbackGallery = () => {
  // Show first 6 active entries, most recent first
  const displayPhotos = MOCK_PHOTOS.filter((p) => p.isActive)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <section id='gallery' className='py-12 md:py-16 lg:py-24 bg-slate-50'>
      <div className='container px-4 sm:px-6'>
        <div className='text-center max-w-3xl mx-auto mb-10 md:mb-12'>
          <div className='inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm'>
            Our Pawfect Moments
          </div>
          <p className='text-muted-foreground mt-4 px-2'>
            A glimpse into our work, community engagement, and public events.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 max-w-7xl mx-auto'>
          {displayPhotos.map((photo) => {
            const cover = photo.images[0];
            const extraCount = photo.images.length - 1;

            return (
              <div
                key={photo._id}
                className='rounded-xl relative overflow-hidden h-60 md:h-80 w-full group'
              >
                {/* Cover image */}
                {cover ? (
                  <img
                    src={cover.src}
                    alt={cover.alt || photo.title}
                    className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className='absolute inset-0 bg-gray-200 flex items-center justify-center'>
                    <Camera className='w-12 h-12 text-gray-400' />
                  </div>
                )}

                {/* Image count pill */}
                {extraCount > 0 && (
                  <div className='absolute top-4 right-4 bg-black/50 text-white text-[11px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm'>
                    +{extraCount} more
                  </div>
                )}

                {/* Category badge */}
                <div className='absolute top-4 left-4'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${categoryStyle(
                      photo.category.name,
                    )}`}
                  >
                    {photo.category.name}
                  </span>
                </div>

                {/* Bottom overlay */}
                <div className='absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent'>
                  <h3 className='text-white text-base font-semibold mb-1 line-clamp-1'>
                    {photo.title}
                  </h3>
                  <div className='flex items-center gap-3 text-white/80 text-xs'>
                    <span className='flex items-center gap-1'>
                      <Calendar className='h-3.5 w-3.5' />
                      {formatDate(photo.date)}
                    </span>
                    {photo.location && (
                      <span className='truncate'>📍 {photo.location}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className='text-center mt-8'>
          <Link to='' aria-disabled={true}>
            <Button
              variant='outline'
              className='px-6 py-3 font-medium rounded-lg border-orange-500 text-orange-500 hover:bg-orange-50'
              disabled
            >
              View Full Gallery
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </Link>
        </div>

        <p className='text-sm text-gray-500 text-center mt-4 italic underline'>
          Limited Mode : Live Data temporarily unavailable
        </p>
      </div>
    </section>
  );
};

export default FallbackGallery;
