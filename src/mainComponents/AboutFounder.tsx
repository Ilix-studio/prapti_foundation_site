// frontend/components/AboutFounder.tsx
import React from "react";
import { Award, GraduationCap } from "lucide-react";
import LazyImage from "./common/LazyImage";

const FOUNDER_IMAGE_URL =
  "https://res.cloudinary.com/doakqvah3/image/upload/q_auto/f_auto/v1778645736/Screenshot_2026-05-13_at_09.45.19_frc7oa.png"; // TODO: replace with Cloudinary URL

const FOUNDER = {
  name: "Dr. Prapti Thakur",
  image: FOUNDER_IMAGE_URL,
  roles: [
    { icon: Award, label: "Founder", org: "Prapti Foundation" },
    { icon: GraduationCap, label: "Principal", org: "Sarupathar College" },
  ],
  bio: [
    "Dr. Prapti Thakur is an educator and animal welfare advocate dedicated to building compassionate communities across Assam. As Principal of Sarupathar College, she has championed academic excellence alongside social responsibility for over a decade.",
    "She founded the Prapti Foundation to give voice to the voiceless — rescuing, rehabilitating, and rehoming street dogs while raising awareness about animal rights, sterilisation, and humane treatment. Her work bridges education and grassroots action.",
  ],
} as const;

const AboutFounder: React.FC = () => {
  return (
    <section className='py-12 md:py-24 bg-gray-50'>
      <div className='container px-4 md:px-6 mx-auto'>
        <div className='text-center space-y-4 max-w-3xl mx-auto mb-12'>
          <div className='inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm'>
            About the Founder
          </div>
          <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
            Meet Our Founder
          </h2>
          <p className='text-gray-500'>
            The vision and dedication that drive our mission forward.
          </p>
        </div>

        <div className='max-w-5xl mx-auto bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
          <div className='grid md:grid-cols-2'>
            {/* Image */}
            <div className='aspect-square md:aspect-auto md:h-full bg-linear-to-br from-orange-100 to-orange-200 flex items-center justify-center'>
              {/* Image */}
              <LazyImage
                src={FOUNDER.image}
                alt={`Portrait of ${FOUNDER.name}`}
                wrapperClassName='relative aspect-square md:aspect-auto md:h-full bg-linear-to-br from-orange-100 to-orange-200 flex items-center justify-center overflow-hidden'
              />
            </div>

            {/* Content */}
            <div className='p-6 md:p-10 flex flex-col justify-center space-y-5'>
              <div className='space-y-1'>
                <h3 className='text-2xl md:text-3xl font-bold'>
                  {FOUNDER.name}
                </h3>
                <div className='h-1 w-12 bg-orange-500 rounded-full' />
              </div>

              <ul aria-label='Roles' className='space-y-2'>
                {FOUNDER.roles.map(({ icon: Icon, label, org }) => (
                  <li key={label} className='flex items-start gap-3'>
                    <span className='mt-0.5 p-1.5 rounded-md bg-orange-100 text-orange-600'>
                      <Icon className='w-4 h-4' aria-hidden='true' />
                    </span>
                    <span className='text-gray-700'>
                      <span className='font-semibold'>{label}</span>
                      <span className='text-gray-500'> — {org}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className='space-y-3 text-gray-600 leading-relaxed'>
                {FOUNDER.bio.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutFounder;
