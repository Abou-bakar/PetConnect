import React from 'react';
import pet from '../assets/pic4.png';
import pets from '../assets/pic5.png';
import petss from '../assets/pic6.png';
import petsss from '../assets/pic7.png';

function ContentPage() {
  return (
    <div className='bg-slate-100 min-h-screen'>
      {/* Hero Section */}
      <section className='bg-slate-100 text-[#004B62] py-24'>
        <div className='container mx-auto px-4'>
          <h1 className='text-4xl font-bold mb-4'>
            Your pet deserves to be pampered!
          </h1>
          <p className='text-lg mb-8'>
            At Pet Connect, we provide top-notch grooming services for your
            furry friends.
          </p>
          <button className='bg-white text-[#004B62] font-bold py-2 px-4 rounded-full hover:bg-blue-200'>
            Book an Appointment
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className='py-16 text-[#004B62]'>
        <div className='container mx-auto px-4'>
          <h2 className='text-2xl font-bold mb-8'>Our Services</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300'>
              <h3 className='text-xl font-bold mb-2'>Bath or Shower</h3>
              <p>
                Give your pet a refreshing bath or shower to keep them clean and
                healthy.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300'>
              <h3 className='text-xl font-bold mb-2'>
                Hands-On Pet Assessment
              </h3>
              <p>
                Our experienced groomers will assess your pet's needs and
                provide personalized care.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300'>
              <h3 className='text-xl font-bold mb-2'>Safe Drying</h3>
              <p>
                We use gentle drying techniques to ensure your pet's comfort and
                safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className='py-16 text-[#004B62]'>
        <div className='container mx-auto px-4'>
          <h2 className='text-2xl font-bold mb-8'>See Our Happy Clients</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            <img
              src={pet}
              alt='Pet Grooming'
              className='rounded-lg shadow-lg bg-white h-64 w-72 hover transform hover:scale-105 transition-transform duration-300'
            />
            <img
              src={pets}
              alt='Pet Grooming'
              className='rounded-lg shadow-lg bg-white h-64 w-72 transform hover:scale-105 transition-transform duration-300 '
            />
            <img
              src={petss}
              alt='Pet Grooming'
              className='rounded-lg shadow-lg bg-white h-64 w-72 transform hover:scale-105 transition-transform duration-300'
            />
            <img
              src={petsss}
              alt='Pet Grooming'
              className='rounded-lg shadow-lg bg-white h-64 w-72 transform hover:scale-105 transition-transform duration-300'
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContentPage;
