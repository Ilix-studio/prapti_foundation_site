import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, PawPrint, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Header } from "@/mainComponents/Header";
import Footer from "../../mainComponents/Footer";

import { dogs, Dog } from "../../mockdata/DogsData";
import DogCard from "./DogCard";

const OurDogs: React.FC = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [temperamentFilter, setTemperamentFilter] = useState<string>("all");
  const [compatibilityFilters, setCompatibilityFilters] = useState({
    children: false,
    dogs: false,
    cats: false,
  });

  // State for mobile filter visibility
  const [showFilters, setShowFilters] = useState(false);

  // Filtered dogs based on current filters
  const [filteredDogs, setFilteredDogs] = useState<Dog[]>(dogs);

  // Effect to apply filters
  useEffect(() => {
    let result = [...dogs];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (dog) =>
          dog.name.toLowerCase().includes(term) ||
          dog.breed.toLowerCase().includes(term) ||
          dog.description.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((dog) => dog.adoptionStatus === statusFilter);
    }

    // Apply size filter
    if (sizeFilter !== "all") {
      result = result.filter((dog) => dog.size === sizeFilter);
    }

    // Apply age filter
    if (ageFilter !== "all") {
      if (ageFilter === "puppy") {
        result = result.filter((dog) => dog.age.includes("month"));
      } else if (ageFilter === "adult") {
        result = result.filter(
          (dog) =>
            dog.age.includes("year") && parseInt(dog.age.split(" ")[0]) <= 7
        );
      } else if (ageFilter === "senior") {
        result = result.filter(
          (dog) =>
            dog.age.includes("year") && parseInt(dog.age.split(" ")[0]) > 7
        );
      }
    }

    // Apply temperament filter
    if (temperamentFilter !== "all") {
      result = result.filter((dog) =>
        dog.temperament.includes(temperamentFilter)
      );
    }

    // Apply compatibility filters
    if (compatibilityFilters.children) {
      result = result.filter((dog) => dog.goodWith.children);
    }
    if (compatibilityFilters.dogs) {
      result = result.filter((dog) => dog.goodWith.dogs);
    }
    if (compatibilityFilters.cats) {
      result = result.filter((dog) => dog.goodWith.cats);
    }

    setFilteredDogs(result);
  }, [
    searchTerm,
    statusFilter,
    sizeFilter,
    ageFilter,
    temperamentFilter,
    compatibilityFilters,
  ]);

  // Function to clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSizeFilter("all");
    setAgeFilter("all");
    setTemperamentFilter("all");
    setCompatibilityFilters({
      children: false,
      dogs: false,
      cats: false,
    });
  };

  // Get all unique temperaments for the filter
  const allTemperaments = [
    ...new Set(dogs.flatMap((dog) => dog.temperament)),
  ].sort();

  // Function to toggle compatibility filters
  const toggleCompatibilityFilter = (
    key: keyof typeof compatibilityFilters
  ) => {
    setCompatibilityFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Calculate active filter count for badge
  const activeFilterCount = [
    statusFilter !== "all",
    sizeFilter !== "all",
    ageFilter !== "all",
    temperamentFilter !== "all",
    compatibilityFilters.children,
    compatibilityFilters.dogs,
    compatibilityFilters.cats,
  ].filter(Boolean).length;

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />

      <main className='flex-1'>
        {/* Hero Banner */}
        <section className='relative py-12 bg-orange-200'>
          <div className='container px-4 md:px-6 text-center'>
            <motion.h1
              className='text-3xl md:text-4xl font-bold text-black mb-4'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Meet Our Dogs
            </motion.h1>
            <motion.p
              className='max-w-2xl mx-auto text-black/90'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Browse our available dogs and find your perfect companion. Each
              dog has been rescued, rehabilitated, and is now ready for their
              forever home.
            </motion.p>
          </div>
        </section>

        {/* Search and Filters Section */}
        <section className='py-8 bg-amber-50 border-b'>
          <div className='container px-4 md:px-6'>
            <div className='md:flex md:justify-between md:items-center gap-4'>
              {/* Search Bar */}
              <div className='relative mb-4 md:mb-0 md:flex-1 max-w-xl'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500' />
                <Input
                  placeholder='Search by name, breed, or traits...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>

              {/* Desktop Filters Button */}
              <div className='hidden md:flex md:items-center gap-2'>
                <Button
                  variant='outline'
                  className='flex items-center gap-2'
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className='h-4 w-4' />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className='ml-1 bg-orange-500 hover:bg-orange-600'>
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>

                {activeFilterCount > 0 && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-500'
                    onClick={clearFilters}
                  >
                    <X className='h-4 w-4 mr-1' />
                    Clear All
                  </Button>
                )}
              </div>

              {/* Mobile Filter Toggle */}
              <div className='flex items-center gap-2 md:hidden'>
                <Button
                  variant='outline'
                  className='flex items-center gap-2 w-full'
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className='h-4 w-4' />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className='ml-1 bg-orange-500 hover:bg-orange-600'>
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>

                {activeFilterCount > 0 && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-500'
                    onClick={clearFilters}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <motion.div
                className='mt-4 p-4 bg-white rounded-lg shadow-sm border'
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                  {/* Status Filter */}
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                      Adoption Status
                    </label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='All Statuses' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Statuses</SelectItem>
                        <SelectItem value='Available'>Available</SelectItem>
                        <SelectItem value='Pending'>Pending</SelectItem>
                        <SelectItem value='Adopted'>Adopted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Size Filter */}
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Size</label>
                    <Select value={sizeFilter} onValueChange={setSizeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder='All Sizes' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Sizes</SelectItem>
                        <SelectItem value='Small'>Small</SelectItem>
                        <SelectItem value='Medium'>Medium</SelectItem>
                        <SelectItem value='Large'>Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Age Filter */}
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Age</label>
                    <Select value={ageFilter} onValueChange={setAgeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder='All Ages' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Ages</SelectItem>
                        <SelectItem value='puppy'>Puppy (-1 year)</SelectItem>
                        <SelectItem value='adult'>Adult (1-7 years)</SelectItem>
                        <SelectItem value='senior'>
                          Senior (8+ years)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Temperament Filter */}
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Temperament</label>
                    <Select
                      value={temperamentFilter}
                      onValueChange={setTemperamentFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='All Temperaments' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Temperaments</SelectItem>
                        {allTemperaments.map((temp) => (
                          <SelectItem key={temp} value={temp}>
                            {temp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Good With Filters */}
                <div className='mt-4'>
                  <p className='text-sm font-medium mb-2'>Good With</p>
                  <div className='flex flex-wrap gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      className={
                        compatibilityFilters.children
                          ? "bg-green-100 text-green-800 border-green-300"
                          : ""
                      }
                      onClick={() => toggleCompatibilityFilter("children")}
                    >
                      {compatibilityFilters.children ? (
                        <Check className='h-3 w-3 mr-1' />
                      ) : null}
                      Children
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className={
                        compatibilityFilters.dogs
                          ? "bg-green-100 text-green-800 border-green-300"
                          : ""
                      }
                      onClick={() => toggleCompatibilityFilter("dogs")}
                    >
                      {compatibilityFilters.dogs ? (
                        <Check className='h-3 w-3 mr-1' />
                      ) : null}
                      Other Dogs
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className={
                        compatibilityFilters.cats
                          ? "bg-green-100 text-green-800 border-green-300"
                          : ""
                      }
                      onClick={() => toggleCompatibilityFilter("cats")}
                    >
                      {compatibilityFilters.cats ? (
                        <Check className='h-3 w-3 mr-1' />
                      ) : null}
                      Cats
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Dogs Display Section */}
        <section className='py-12'>
          <div className='container px-4 md:px-6'>
            {/* Results Count and Sort */}
            <div className='flex justify-between items-center mb-6'>
              <p className='text-gray-600'>
                Showing{" "}
                <span className='font-semibold'>{filteredDogs.length}</span>{" "}
                dogs
              </p>

              <Select defaultValue='recent'>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='recent'>Most Recent</SelectItem>
                  <SelectItem value='alpha'>Alphabetical</SelectItem>
                  <SelectItem value='age-asc'>Age (Youngest)</SelectItem>
                  <SelectItem value='age-desc'>Age (Oldest)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dogs Grid */}
            {filteredDogs.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {filteredDogs.map((dog) => (
                  <DogCard key={dog.id} dog={dog} />
                ))}
              </div>
            ) : (
              <div className='text-center py-12'>
                <div className='inline-flex rounded-full bg-amber-100 p-6 mb-4'>
                  <PawPrint className='h-10 w-10 text-amber-600' />
                </div>
                <h3 className='text-xl font-bold mb-2'>No Dogs Found</h3>
                <p className='text-gray-600 mb-6 max-w-md mx-auto'>
                  We couldn't find any dogs matching your search criteria. Try
                  adjusting your filters or search term.
                </p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </section>

        {/* Adoption FAQ Accordion */}
        <section className='py-12 bg-amber-50'>
          <div className='container px-4 md:px-6'>
            <h2 className='text-2xl font-bold text-center mb-8'>
              Adoption FAQ
            </h2>

            <div className='max-w-3xl mx-auto'>
              <Accordion
                type='single'
                collapsible
                className='bg-white rounded-lg shadow'
              >
                <AccordionItem value='item-1'>
                  <AccordionTrigger className='px-6'>
                    What is the adoption process like?
                  </AccordionTrigger>
                  <AccordionContent className='px-6 text-gray-600'>
                    Our adoption process begins with you submitting an adoption
                    application. Once reviewed, we'll arrange a meet-and-greet
                    with the dog you're interested in. If it's a good match,
                    we'll conduct a home check, and finally, complete the
                    adoption paperwork. The entire process typically takes 1-2
                    weeks.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value='item-2'>
                  <AccordionTrigger className='px-6'>
                    Is there an adoption fee?
                  </AccordionTrigger>
                  <AccordionContent className='px-6 text-gray-600'>
                    Yes, there is an adoption fee of ₹2,000 which helps cover
                    the cost of vaccinations, spaying/neutering, microchipping,
                    and general care while the dog was in our shelter. This fee
                    helps ensure that you're committed to providing a good home
                    for the dog.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value='item-3'>
                  <AccordionTrigger className='px-6'>
                    Do the dogs come with veterinary records?
                  </AccordionTrigger>
                  <AccordionContent className='px-6 text-gray-600'>
                    Absolutely! All our dogs come with complete veterinary
                    records, including vaccination history, spay/neuter
                    certificate, and any medical treatments they've received. We
                    believe in full transparency about each dog's health status.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value='item-4'>
                  <AccordionTrigger className='px-6'>
                    What if the adoption doesn't work out?
                  </AccordionTrigger>
                  <AccordionContent className='px-6 text-gray-600'>
                    We understand that sometimes, despite everyone's best
                    intentions, an adoption may not work out. If this happens,
                    we ask that you return the dog to us rather than giving them
                    to someone else. We never want our dogs to be homeless
                    again.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value='item-5'>
                  <AccordionTrigger className='px-6'>
                    Can I adopt if I don't live in Golaghat?
                  </AccordionTrigger>
                  <AccordionContent className='px-6 text-gray-600'>
                    Yes, we consider adopters from nearby areas. However, you
                    will need to be able to visit our shelter for the
                    meet-and-greet and be available for a home check. For very
                    distant locations, we may need to make special arrangements.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OurDogs;
