import HeroSectionBgImg from "./../assets/prapti-main.webp";

const HalfAbout = () => {
  return (
    <section className='py-12 md:py-24'>
      <div className='container px-4 md:px-6'>
        <div className='grid gap-12 lg:grid-cols-2 lg:gap-16 items-center'>
          <div className='space-y-4'>
            <div className='inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm'>
              Our Story
            </div>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
              How It All Began
            </h2>
            <div className='space-y-4 text-gray-500'>
              <p>
                Prapti Foundation was established in 2017 by a group of
                passionate animal lovers who couldn't ignore the plight of stray
                dogs in Golaghat. What started as informal feeding programs and
                emergency medical assistance gradually evolved into a formal
                shelter that now provides comprehensive care for homeless dogs.
              </p>
              <p>
                Over the years, we have rescued hundreds of dogs from dire
                situations, provided them with medical care, rehabilitation, and
                helped many find loving forever homes. We believe that every dog
                deserves dignity, care, and the chance to live a happy life.
              </p>
              <p>
                Today, Prapti Foundation stands as a sanctuary for stray dogs, a
                place where they can recover from injury or illness, receive
                nourishment, and experience the love and kindness they deserve.
              </p>
            </div>
          </div>
          <div className='relative rounded-lg overflow-hidden'>
            <img
              src={HeroSectionBgImg}
              alt="Prapti Foundation's journey"
              className='w-full h-full object-cover'
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HalfAbout;
