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
      "https://firebasestorage.googleapis.com/v0/b/tsangpool-honda-otp.firebasestorage.app/o/prapti-team-member%2FScreenshot%202025-12-14%20at%2020.05.44.png?alt=media&token=5853a738-5c81-46ba-8606-55f1d9058b2e",
  },
  {
    id: 2,
    name: "Abhishek Boney Sinha",

    image:
      "https://firebasestorage.googleapis.com/v0/b/tsangpool-honda-otp.firebasestorage.app/o/prapti-team-member%2FScreenshot%202025-12-14%20at%2020.06.48.png?alt=media&token=9d5e5d7d-3cd3-45ee-b425-5ecca1cf0945",
  },
  {
    id: 3,
    name: "Nayan Das",

    image:
      "https://firebasestorage.googleapis.com/v0/b/tsangpool-honda-otp.firebasestorage.app/o/prapti-team-member%2FScreenshot%202025-12-14%20at%2020.07.28.png?alt=media&token=bbb4a254-4c66-411e-8730-590ee6ef46ec",
  },
  {
    id: 4,
    name: "Moheswar Deka",

    image:
      "https://firebasestorage.googleapis.com/v0/b/tsangpool-honda-otp.firebasestorage.app/o/prapti-team-member%2FScreenshot%202025-12-14%20at%2020.08.16.png?alt=media&token=dd5aeaf3-e16b-4bba-a9f3-740be35098e3",
  },
  {
    id: 5,
    name: "Partha Hazarika",

    image:
      "https://firebasestorage.googleapis.com/v0/b/tsangpool-honda-otp.firebasestorage.app/o/prapti-team-member%2FWhatsApp%20Image%202025-12-12%20at%2011.47.28%20AM.png?alt=media&token=f8c7797e-de06-4a4f-a4c5-a8907c9555ef",
  },
  {
    id: 6,
    name: "Dr. Jajneswar Bari ",

    image:
      "https://firebasestorage.googleapis.com/v0/b/tsangpool-honda-otp.firebasestorage.app/o/prapti-team-member%2FWhatsApp%20Image%202025-12-12%20at%202.30.32%20PM.png?alt=media&token=56a507e4-a428-4252-8046-0fa508e25cae",
  },
  {
    id: 7,
    name: "Pompy Borah",

    image:
      "https://firebasestorage.googleapis.com/v0/b/tsangpool-honda-otp.firebasestorage.app/o/prapti-team-member%2FScreenshot%202025-12-14%20at%2020.15.36.png?alt=media&token=105058a6-44ce-4db6-b6e1-a4990dd9b78b",
  },
  // {
  //   id: 8,
  //   name: "John Doe",
  //   role: "xx",
  //   experience: "xx",
  //   image: "",
  // },
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
