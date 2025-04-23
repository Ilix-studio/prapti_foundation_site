import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Check, Clock, PawPrint } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dog } from "@/mockdata/DogsData";

interface DogCardProps {
  dog: Dog;
}

const DogCard: React.FC<DogCardProps> = ({ dog }) => {
  // Function to determine the badge color and text based on adoption status
  const getStatusBadge = () => {
    switch (dog.adoptionStatus) {
      case "Available":
        return (
          <Badge className='absolute top-3 right-3 bg-green-500 hover:bg-green-600'>
            <Check className='h-3 w-3 mr-1' />
            Available
          </Badge>
        );
      case "Pending":
        return (
          <Badge className='absolute top-3 right-3 bg-amber-500 hover:bg-amber-600'>
            <Clock className='h-3 w-3 mr-1' />
            Pending
          </Badge>
        );
      case "Adopted":
        return (
          <Badge className='absolute top-3 right-3 bg-blue-500 hover:bg-blue-600'>
            <Heart className='h-3 w-3 mr-1' />
            Adopted
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='relative'>
        {/* Dog Image */}
        <img
          src={dog.image}
          alt={`${dog.name} - ${dog.breed}`}
          className='w-full h-64 object-cover'
        />

        {/* Status Badge */}
        {getStatusBadge()}
      </div>

      <div className='p-5'>
        {/* Dog Name and Age */}
        <div className='flex justify-between items-center mb-2'>
          <h3 className='text-xl font-bold'>{dog.name}</h3>
          <span className='text-sm text-gray-600'>{dog.age}</span>
        </div>

        {/* Breed */}
        <p className='text-gray-600 text-sm mb-3'>{dog.breed}</p>

        {/* Attributes */}
        <div className='flex flex-wrap gap-2 mb-4'>
          <Badge
            variant='outline'
            className='bg-amber-50 text-amber-800 border-amber-200'
          >
            {dog.gender}
          </Badge>
          <Badge
            variant='outline'
            className='bg-blue-50 text-blue-800 border-blue-200'
          >
            {dog.size}
          </Badge>
          {dog.temperament.slice(0, 2).map((trait, index) => (
            <Badge
              key={index}
              variant='outline'
              className='bg-orange-50 text-orange-800 border-orange-200'
            >
              {trait}
            </Badge>
          ))}
        </div>

        {/* Short Description */}
        <p className='text-gray-700 mb-4 line-clamp-2'>{dog.description}</p>

        {/* Good With Indicators */}
        <div className='flex gap-2 mb-4'>
          <div
            className={`flex items-center text-xs px-2 py-1 rounded-full ${
              dog.goodWith.children
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-500 line-through"
            }`}
          >
            Kids
          </div>
          <div
            className={`flex items-center text-xs px-2 py-1 rounded-full ${
              dog.goodWith.dogs
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-500 line-through"
            }`}
          >
            Dogs
          </div>
          <div
            className={`flex items-center text-xs px-2 py-1 rounded-full ${
              dog.goodWith.cats
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-500 line-through"
            }`}
          >
            Cats
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-2 mt-auto'>
          <Link to={`/dog-details/${dog.id}`} className='flex-1'>
            <Button
              variant='outline'
              className='w-full border-orange-500 text-orange-500 hover:bg-orange-50'
            >
              Details
            </Button>
          </Link>

          {dog.adoptionStatus === "Available" && (
            <Link to='/adopt' className='flex-1'>
              <Button className='w-full bg-orange-500 hover:bg-orange-600'>
                <Heart className='h-4 w-4 mr-2' />
                Adopt
              </Button>
            </Link>
          )}

          {dog.adoptionStatus === "Pending" && (
            <Button disabled className='flex-1 opacity-70'>
              <Clock className='h-4 w-4 mr-2' />
              Pending
            </Button>
          )}

          {dog.adoptionStatus === "Adopted" && (
            <Button disabled className='flex-1 opacity-70'>
              <PawPrint className='h-4 w-4 mr-2' />
              Adopted
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DogCard;
