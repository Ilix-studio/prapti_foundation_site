// frontend/components/OurTeam.tsx
import React from "react";
import { User } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  image?: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Dhrubajyoti Mech",
    image:
      "https://res.cloudinary.com/doakqvah3/image/upload/q_auto/f_auto/v1777246163/WhatsApp_Image_2026-04-27_at_4.31.07_AM_1_zhoa3l.jpg",
  },

  {
    id: 2,
    name: "Nayan Das",

    image:
      "https://res.cloudinary.com/doakqvah3/image/upload/q_auto/f_auto/v1778239943/WhatsApp_Image_2026-05-08_at_12.18.46_PM_rbf8wf.jpg",
  },
  {
    id: 3,
    name: "Moheswar Deka",

    image:
      "https://res.cloudinary.com/doakqvah3/image/upload/q_auto/f_auto/v1777246162/WhatsApp_Image_2026-04-27_at_4.31.06_AM_1_hhsd65.jpg",
  },
  {
    id: 4,
    name: "Partha Hazarika",
    image:
      "https://res.cloudinary.com/doakqvah3/image/upload/q_auto/f_auto/v1778239943/WhatsApp_Image_2026-05-08_at_12.30.08_PM_ixwvbo.jpg",
  },

  {
    id: 5,
    name: "Pompy Devi",

    image:
      "https://res.cloudinary.com/doakqvah3/image/upload/q_auto/f_auto/v1777246163/WhatsApp_Image_2026-04-27_at_4.31.06_AM_fzmjeq.jpg",
  },
  {
    id: 6,
    name: "Madhurjya Gogoi",
    image:
      "https://res.cloudinary.com/doakqvah3/image/upload/q_auto/f_auto/v1778847439/WhatsApp_Image_2026-05-13_at_10.38.51_PM_azt1fb.jpg",
  },
  {
    id: 7,
    name: "Pratyasha Phukan",
    image:
      "https://res.cloudinary.com/doakqvah3/image/upload/q_auto/f_auto/v1778847440/WhatsApp_Image_2026-05-13_at_12.48.31_PM_zyklmq.jpg",
  },
  {
    id: 8,
    name: "Kamal",
    image:
      "https://res.cloudinary.com/doakqvah3/image/upload/q_auto/f_auto/v1778847440/WhatsApp_Image_2026-05-13_at_12.48.28_PM_hmrin2.jpg",
  },
];

const OurTeam: React.FC = () => {
  return (
    <section className='py-12 md:py-24 bg-gray-50'>
      <div className='container px-4 md:px-6'>
        <div className='text-center space-y-4 max-w-3xl mx-auto mb-12'>
          <div className='inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm'>
            Our Team
          </div>
          <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
            Meet the People Behind Our Mission
          </h2>
          <p className='text-gray-500'>
            Dedicated professionals working tirelessly to rescue and care for
            dogs in need.
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className='bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'
            >
              <div className='aspect-square bg-linear-to-br from-orange-100 to-orange-200 flex items-center justify-center'>
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <User className='w-24 h-24 text-orange-500' />
                )}
              </div>
              <div className='p-6 text-center space-y-2'>
                <h3 className='text-xl font-semibold'>{member.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
