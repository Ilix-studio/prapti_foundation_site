import { Badge } from "@/components/ui/badge";

import { getAwardCategoryName } from "@/types/award.types";
import React from "react";
import { Link } from "react-router-dom";

// Updated Photo interface to match API response
export interface AwardPhoto {
  _id: string;
  title: string;
  description?: string;
  src: string;
  alt: string;
  category: {
    _id: string;
    name: string;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AwardPhotoProps {
  award: AwardPhoto;
}

const AwardCard: React.FC<AwardPhotoProps> = ({ award }) => {
  return (
    <article className='space-y-2 group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300'>
      <Link to={`/award/${award._id}`}>
        <img
          src={award.src}
          alt={award.alt}
          className='aspect-video object-cover w-full transition-transform group-hover:scale-105 duration-300'
        />
      </Link>

      <div className='space-y-3 p-4'>
        <div className='flex items-center gap-2 flex-wrap'>
          <Badge className='text-orange-500 border-orange-200 bg-orange-50'>
            {getAwardCategoryName(award.category)}
          </Badge>
        </div>
        <h2 className='text-xl font-bold group-hover:text-orange-500 transition-colors'>
          <Link to={`/blog/${award._id}`}>{award.title}</Link>
        </h2>
      </div>
    </article>
  );
};

export default AwardCard;
