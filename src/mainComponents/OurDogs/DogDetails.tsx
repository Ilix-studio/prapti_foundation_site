import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Clock,
  Check,
  ArrowLeft,
  Calendar,
  Ruler,
  MapPin,
  Info,
  AlertCircle,
  Users,
  Dog as DogIcon,
  Cat,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "../../mainComponents/Header";
import Footer from "../../mainComponents/Footer";
import { dogs, Dog } from "../../mockdata/DogsData";

const DogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dog, setDog] = useState<Dog | null>(null);
  const [similarDogs, setSimilarDogs] = useState<Dog[]>([]);

  useEffect(() => {
    // Find the dog with the matching ID
    const foundDog = dogs.find((d) => d.id === id);

    if (foundDog) {
      setDog(foundDog);

      // Find similar dogs (same size or temperament)
      const similar = dogs
        .filter(
          (d) =>
            d.id !== id &&
            d.adoptionStatus === "Available" &&
            (d.size === foundDog.size ||
              d.temperament.some((t) => foundDog.temperament.includes(t)))
        )
        .slice(0, 3);

      setSimilarDogs(similar);
    } else {
      // If dog not found, navigate to 404 page
      navigate("/not-found");
    }
  }, [id, navigate]);

  if (!dog) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500'></div>
      </div>
    );
  }

  // Function to determine the status badge
  const getStatusBadge = () => {
    switch (dog.adoptionStatus) {
      case "Available":
        return (
          <Badge className='bg-green-500 hover:bg-green-600'>
            <Check className='h-3 w-3 mr-1' />
            Available for Adoption
          </Badge>
        );
      case "Pending":
        return (
          <Badge className='bg-amber-500 hover:bg-amber-600'>
            <Clock className='h-3 w-3 mr-1' />
            Adoption Pending
          </Badge>
        );
      case "Adopted":
        return (
          <Badge className='bg-blue-500 hover:bg-blue-600'>
            <Heart className='h-3 w-3 mr-1' />
            Already Adopted
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />

      <main className='flex-1'>
        {/* Back Button */}
        <div className='container px-4 md:px-6 pt-6'>
          <Link
            to='/our-dogs'
            className='inline-flex items-center text-orange-500 hover:text-orange-600'
          >
            <ArrowLeft className='h-4 w-4 mr-1' />
            Back to all dogs
          </Link>
        </div>

        {/* Dog Profile Section */}
        <section className='py-8'>
          <div className='container px-4 md:px-6'>
            <div className='grid md:grid-cols-2 gap-8'>
              {/* Dog Image */}
              <motion.div
                className='rounded-lg overflow-hidden shadow-md'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={dog.image}
                  alt={dog.name}
                  className='w-full h-auto object-cover aspect-square'
                />
              </motion.div>

              {/* Dog Info */}
              <motion.div
                className='space-y-4'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className='space-y-2'>
                  <div className='flex items-center gap-3'>
                    <h1 className='text-3xl font-bold'>{dog.name}</h1>
                    {getStatusBadge()}
                  </div>
                  <p className='text-gray-600'>{dog.breed}</p>
                </div>

                {/* Quick Details */}
                <div className='grid grid-cols-2 md:grid-cols-3 gap-3 py-3'>
                  <div className='flex items-center gap-2 text-gray-700'>
                    <Calendar className='h-4 w-4 text-orange-500' />
                    <span>{dog.age}</span>
                  </div>
                  <div className='flex items-center gap-2 text-gray-700'>
                    <Ruler className='h-4 w-4 text-orange-500' />
                    <span>{dog.size}</span>
                  </div>
                  <div className='flex items-center gap-2 text-gray-700'>
                    <MapPin className='h-4 w-4 text-orange-500' />
                    <span>Golaghat</span>
                  </div>
                </div>

                {/* Temperament */}
                <div>
                  <h3 className='text-sm text-gray-500 mb-2'>Temperament</h3>
                  <div className='flex flex-wrap gap-2'>
                    {dog.temperament.map((trait, index) => (
                      <Badge
                        key={index}
                        variant='outline'
                        className='bg-orange-50 text-orange-800 border-orange-200'
                      >
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Good With */}
                <div>
                  <h3 className='text-sm text-gray-500 mb-2'>Good With</h3>
                  <div className='flex gap-4'>
                    <div className='flex flex-col items-center'>
                      <div
                        className={`p-2 rounded-full ${
                          dog.goodWith.children
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Users className='h-5 w-5' />
                      </div>
                      <span className='text-xs mt-1'>Children</span>
                      {dog.goodWith.children ? (
                        <CheckCircle className='h-4 w-4 text-green-600 mt-1' />
                      ) : (
                        <XCircle className='h-4 w-4 text-gray-400 mt-1' />
                      )}
                    </div>

                    <div className='flex flex-col items-center'>
                      <div
                        className={`p-2 rounded-full ${
                          dog.goodWith.dogs
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <DogIcon className='h-5 w-5' />
                      </div>
                      <span className='text-xs mt-1'>Dogs</span>
                      {dog.goodWith.dogs ? (
                        <CheckCircle className='h-4 w-4 text-green-600 mt-1' />
                      ) : (
                        <XCircle className='h-4 w-4 text-gray-400 mt-1' />
                      )}
                    </div>

                    <div className='flex flex-col items-center'>
                      <div
                        className={`p-2 rounded-full ${
                          dog.goodWith.cats
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Cat className='h-5 w-5' />
                      </div>
                      <span className='text-xs mt-1'>Cats</span>
                      {dog.goodWith.cats ? (
                        <CheckCircle className='h-4 w-4 text-green-600 mt-1' />
                      ) : (
                        <XCircle className='h-4 w-4 text-gray-400 mt-1' />
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className='text-gray-700'>{dog.description}</p>

                {/* Training Level */}
                <div className='border rounded-md p-4 bg-amber-50'>
                  <div className='flex items-start gap-3'>
                    <div className='bg-amber-100 p-2 rounded-full'>
                      <Info className='h-5 w-5 text-amber-600' />
                    </div>
                    <div>
                      <h3 className='font-medium'>
                        Training Level: {dog.trainingLevel}
                      </h3>
                      <p className='text-sm text-gray-600'>
                        {dog.trainingLevel === "Untrained" &&
                          "Needs basic training for commands and house rules."}
                        {dog.trainingLevel === "Basic" &&
                          "Knows basic commands like sit, stay, and come."}
                        {dog.trainingLevel === "Well-trained" &&
                          "Well-trained with good obedience and house manners."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                {dog.adoptionStatus === "Available" && (
                  <div className='pt-4'>
                    <Link to='/adopt'>
                      <Button className='w-full bg-orange-500 hover:bg-orange-600'>
                        <Heart className='h-4 w-4 mr-2' />
                        Adopt {dog.name}
                      </Button>
                    </Link>
                  </div>
                )}

                {dog.adoptionStatus === "Pending" && (
                  <div className='pt-4 border rounded-md p-4 bg-amber-50'>
                    <div className='flex items-start gap-3'>
                      <div className='bg-amber-100 p-2 rounded-full'>
                        <AlertCircle className='h-5 w-5 text-amber-600' />
                      </div>
                      <div>
                        <h3 className='font-medium'>Adoption Pending</h3>
                        <p className='text-sm text-gray-600'>
                          {dog.name} is currently in the adoption process with
                          another family. If this changes, we will update their
                          status.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {dog.adoptionStatus === "Adopted" && (
                  <div className='pt-4 border rounded-md p-4 bg-blue-50'>
                    <div className='flex items-start gap-3'>
                      <div className='bg-blue-100 p-2 rounded-full'>
                        <Heart className='h-5 w-5 text-blue-600' />
                      </div>
                      <div>
                        <h3 className='font-medium'>
                          {dog.name} Has Found Their Forever Home
                        </h3>
                        <p className='text-sm text-gray-600'>
                          Good news! {dog.name} has been adopted. Check out
                          other dogs who are still looking for homes.
                        </p>
                        <Link
                          to='/our-dogs'
                          className='text-blue-600 text-sm hover:underline mt-2 inline-block'
                        >
                          See available dogs
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Detailed Information Tabs */}
        <section className='py-8 bg-gray-50'>
          <div className='container px-4 md:px-6'>
            <Tabs defaultValue='medical' className='w-full'>
              <TabsList className='grid w-full md:w-auto grid-cols-3'>
                <TabsTrigger value='medical'>Medical Info</TabsTrigger>
                <TabsTrigger value='behavioral'>Behavioral Info</TabsTrigger>
                <TabsTrigger value='adoption'>Adoption Process</TabsTrigger>
              </TabsList>

              <TabsContent
                value='medical'
                className='p-4 bg-white rounded-md mt-4 shadow-sm'
              >
                <div className='space-y-4'>
                  <h2 className='text-xl font-semibold'>Medical Information</h2>

                  <div className='grid md:grid-cols-2 gap-4'>
                    <div className='border rounded-md p-4'>
                      <h3 className='font-medium mb-2'>Vaccinations</h3>
                      <ul className='text-sm text-gray-600 space-y-1'>
                        <li className='flex items-center'>
                          <Check className='h-4 w-4 text-green-500 mr-2' />
                          Rabies Vaccination
                        </li>
                        <li className='flex items-center'>
                          <Check className='h-4 w-4 text-green-500 mr-2' />
                          DHPP (Distemper, Hepatitis, Parainfluenza, Parvo)
                        </li>
                        <li className='flex items-center'>
                          <Check className='h-4 w-4 text-green-500 mr-2' />
                          Bordetella (Kennel Cough)
                        </li>
                      </ul>
                    </div>

                    <div className='border rounded-md p-4'>
                      <h3 className='font-medium mb-2'>Preventative Care</h3>
                      <ul className='text-sm text-gray-600 space-y-1'>
                        <li className='flex items-center'>
                          <Check className='h-4 w-4 text-green-500 mr-2' />
                          Spayed/Neutered
                        </li>
                        <li className='flex items-center'>
                          <Check className='h-4 w-4 text-green-500 mr-2' />
                          Dewormed
                        </li>
                        <li className='flex items-center'>
                          <Check className='h-4 w-4 text-green-500 mr-2' />
                          Microchipped
                        </li>
                      </ul>
                    </div>
                  </div>

                  {dog.medicalNeeds && dog.medicalNeeds.length > 0 ? (
                    <div className='border rounded-md p-4 bg-amber-50'>
                      <h3 className='font-medium mb-2'>
                        Special Medical Needs
                      </h3>
                      <ul className='text-sm text-gray-600 space-y-1'>
                        {dog.medicalNeeds.map((need, index) => (
                          <li key={index} className='flex items-start'>
                            <AlertCircle className='h-4 w-4 text-amber-500 mr-2 mt-0.5' />
                            {need}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className='border rounded-md p-4 bg-green-50'>
                      <div className='flex items-center'>
                        <Check className='h-5 w-5 text-green-500 mr-2' />
                        <p className='text-green-700'>
                          No known medical issues
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent
                value='behavioral'
                className='p-4 bg-white rounded-md mt-4 shadow-sm'
              >
                <div className='space-y-4'>
                  <h2 className='text-xl font-semibold'>
                    Behavioral Information
                  </h2>

                  <div className='grid md:grid-cols-2 gap-4'>
                    <div className='border rounded-md p-4'>
                      <h3 className='font-medium mb-2'>Personality Traits</h3>
                      <ul className='text-sm text-gray-600 space-y-1'>
                        {dog.temperament.map((trait, index) => (
                          <li key={index} className='flex items-center'>
                            <Check className='h-4 w-4 text-green-500 mr-2' />
                            {trait}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className='border rounded-md p-4'>
                      <h3 className='font-medium mb-2'>Training & Behavior</h3>
                      <p className='text-sm text-gray-600 mb-2'>
                        {dog.trainingLevel === "Untrained" &&
                          "Currently learning basic commands and house training."}
                        {dog.trainingLevel === "Basic" &&
                          "Has mastered basic commands and is house trained."}
                        {dog.trainingLevel === "Well-trained" &&
                          "Has excellent obedience skills and is well-behaved."}
                      </p>
                      <p className='text-sm text-gray-600'>
                        Every dog is unique and will require ongoing training
                        and adjustment period in a new home.
                      </p>
                    </div>
                  </div>

                  <div className='border rounded-md p-4'>
                    <h3 className='font-medium mb-2'>Ideal Home Environment</h3>
                    <p className='text-sm text-gray-600'>
                      Based on {dog.name}'s temperament and history, they would
                      thrive in a home that is:
                    </p>
                    <ul className='text-sm text-gray-600 mt-2 space-y-1'>
                      {dog.size === "Large" && (
                        <li className='flex items-start'>
                          <Check className='h-4 w-4 text-green-500 mr-2 mt-0.5' />
                          Spacious enough for a large dog to move comfortably
                        </li>
                      )}

                      {dog.temperament.includes("Energetic") && (
                        <li className='flex items-start'>
                          <Check className='h-4 w-4 text-green-500 mr-2 mt-0.5' />
                          Active, with opportunities for regular exercise
                        </li>
                      )}

                      {dog.temperament.includes("Shy") && (
                        <li className='flex items-start'>
                          <Check className='h-4 w-4 text-green-500 mr-2 mt-0.5' />
                          Calm and quiet, with patient owners who will help
                          build confidence
                        </li>
                      )}

                      {(dog.temperament.includes("Loyal") ||
                        dog.temperament.includes("Affectionate")) && (
                        <li className='flex items-start'>
                          <Check className='h-4 w-4 text-green-500 mr-2 mt-0.5' />
                          Loving and attentive, where {dog.name} can form strong
                          bonds
                        </li>
                      )}

                      {!dog.goodWith.children && (
                        <li className='flex items-start'>
                          <Check className='h-4 w-4 text-green-500 mr-2 mt-0.5' />
                          Adult-only household without children
                        </li>
                      )}

                      {!dog.goodWith.dogs && (
                        <li className='flex items-start'>
                          <Check className='h-4 w-4 text-green-500 mr-2 mt-0.5' />
                          Single-dog household with no other canine companions
                        </li>
                      )}

                      {!dog.goodWith.cats && (
                        <li className='flex items-start'>
                          <Check className='h-4 w-4 text-green-500 mr-2 mt-0.5' />
                          Home without cats or small pets
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value='adoption'
                className='p-4 bg-white rounded-md mt-4 shadow-sm'
              >
                <div className='space-y-4'>
                  <h2 className='text-xl font-semibold'>Adoption Process</h2>

                  <div className='space-y-4'>
                    <div className='flex items-start gap-3'>
                      <div className='bg-orange-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0'>
                        <span className='font-medium text-orange-600'>3</span>
                      </div>
                      <div>
                        <h3 className='font-medium'>Home Check</h3>
                        <p className='text-sm text-gray-600'>
                          We'll schedule a visit to your home to ensure it's
                          safe and suitable for {dog.name}.
                        </p>
                      </div>
                    </div>

                    <div className='flex items-start gap-3'>
                      <div className='bg-orange-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0'>
                        <span className='font-medium text-orange-600'>4</span>
                      </div>
                      <div>
                        <h3 className='font-medium'>Complete the Adoption</h3>
                        <p className='text-sm text-gray-600'>
                          Pay the adoption fee (₹2,000), sign the adoption
                          contract, and welcome {dog.name} to your family!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='border rounded-md p-4 bg-blue-50 mt-6'>
                    <h3 className='font-medium mb-2'>Adoption Fee Details</h3>
                    <p className='text-sm text-gray-600'>
                      The adoption fee of ₹2,000 helps cover:
                    </p>
                    <ul className='text-sm text-gray-600 mt-2 space-y-1'>
                      <li className='flex items-start'>
                        <Check className='h-4 w-4 text-blue-500 mr-2 mt-0.5' />
                        Vaccinations and health check
                      </li>
                      <li className='flex items-start'>
                        <Check className='h-4 w-4 text-blue-500 mr-2 mt-0.5' />
                        Spaying/neutering
                      </li>
                      <li className='flex items-start'>
                        <Check className='h-4 w-4 text-blue-500 mr-2 mt-0.5' />
                        Microchipping
                      </li>
                      <li className='flex items-start'>
                        <Check className='h-4 w-4 text-blue-500 mr-2 mt-0.5' />
                        Deworming and flea treatment
                      </li>
                      <li className='flex items-start'>
                        <Check className='h-4 w-4 text-blue-500 mr-2 mt-0.5' />
                        Food and care while at the shelter
                      </li>
                    </ul>
                  </div>

                  {dog.adoptionStatus === "Available" && (
                    <div className='mt-6'>
                      <Link to='/adopt'>
                        <Button className='w-full bg-orange-500 hover:bg-orange-600'>
                          Start Adoption Process
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Similar Dogs Section */}
        {similarDogs.length > 0 && (
          <section className='py-12'>
            <div className='container px-4 md:px-6'>
              <h2 className='text-2xl font-bold mb-6'>
                Similar Dogs You Might Like
              </h2>
              <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {similarDogs.map((similarDog) => (
                  <Link
                    key={similarDog.id}
                    to={`/dog-details/${similarDog.id}`}
                    className='block group'
                  >
                    <div className='border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
                      <div className='aspect-square overflow-hidden'>
                        <img
                          src={similarDog.image}
                          alt={similarDog.name}
                          className='w-full h-full object-cover transition-transform group-hover:scale-105'
                        />
                      </div>
                      <div className='p-4'>
                        <h3 className='font-semibold text-lg group-hover:text-orange-500'>
                          {similarDog.name}
                        </h3>
                        <p className='text-sm text-gray-600'>
                          {similarDog.breed} • {similarDog.age}
                        </p>
                        <div className='flex flex-wrap gap-2 mt-2'>
                          {similarDog.temperament
                            .slice(0, 2)
                            .map((trait, index) => (
                              <Badge
                                key={index}
                                variant='outline'
                                className='bg-orange-50 text-orange-800 border-orange-200'
                              >
                                {trait}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Call to Action Section */}
        <section className='py-12 bg-amber-50'>
          <div className='container px-4 md:px-6 text-center'>
            <h2 className='text-2xl font-bold mb-4'>
              Looking for a Different Type of Dog?
            </h2>
            <p className='text-gray-600 max-w-2xl mx-auto mb-6'>
              We have many more wonderful dogs waiting for their forever homes.
              Browse our available dogs or contact us to discuss your
              preferences.
            </p>
            <div className='flex flex-col sm:flex-row justify-center gap-4'>
              <Link to='/our-dogs'>
                <Button className='bg-orange-500 hover:bg-orange-600 min-w-[200px]'>
                  See All Available Dogs
                </Button>
              </Link>
              <Link to='/contact'>
                <Button
                  variant='outline'
                  className='border-orange-500 text-orange-500 hover:bg-orange-50 min-w-[200px]'
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DogDetails;
