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
                <strong className='text-black'>
                  {" "}
                  Prapti Foundation was established in 2017 by a group of
                  passionate animal lovers who couldn't ignore the plight of
                  stray dogs in Golaghat.
                </strong>{" "}
                What started as informal feeding programs and emergency medical
                assistance gradually evolved into a formal shelter that now
                provides comprehensive care for homeless dogs.
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
          <div className='relative overflow-hidden'>
            {/* Outer decorative border container */}

            {/* Inner border with geometric pattern */}
            <div className='relative p-3 bg-white rounded-xl shadow-inner'>
              {/* Corner decorative elements */}
              <div className='absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-400 rounded-tl-xl'></div>
              <div className='absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-orange-400 rounded-tr-xl'></div>
              <div className='absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-orange-400 rounded-bl-xl'></div>
              <div className='absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-400 rounded-br-xl'></div>

              {/* Main image container */}
              <div className='relative overflow-hidden rounded-lg'>
                <img
                  src={HeroSectionBgImg}
                  alt="Prapti Foundation's journey"
                  className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HalfAbout;
