// frontend/components/OurTeam.tsx
import React from "react";
import { User } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  experience: string;
  image?: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "John Doe",
    role: "xx",
    experience: "xx",
    image: undefined,
  },
  {
    id: 2,
    name: "John Doe",
    role: "xx",
    experience: "xx",
    image: undefined,
  },
  {
    id: 3,
    name: "John Doe",
    role: "xx",
    experience: "xx",
    image: undefined,
  },
  {
    id: 4,
    name: "John Doe",
    role: "xx",
    experience: "xx",
    image: undefined,
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
              <div className='aspect-square bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center'>
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
                <p className='text-orange-600 font-medium'>{member.role}</p>
                <p className='text-sm text-gray-500'>
                  {member.experience} of experience
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
