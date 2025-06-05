import React from 'react';

function Content1() {
  const testimonials = [
    {
      name: 'Dani, Pacific Heights',
      image: 'https://via.placeholder.com/100',
      quote:
        "I'm a testimonial. Click to edit me and add text that says something nice about you and your services.",
    },
    {
      name: 'Tommy, Stonestown',
      image: 'https://via.placeholder.com/100',
      quote:
        "I'm a testimonial. Click to edit me and add text that says something nice about you and your services.",
    },
    {
      name: 'Jill & Emma, Hayes Valley',
      image: 'https://via.placeholder.com/100',
      quote:
        "I'm a testimonial. Click to edit me and add text that says something nice about you and your services.",
    },
  ];

  return (
    <section className='bg-slate-100 text-[#004B62] py-24'>
      <div className='container mx-auto px-4'>
        <h2 className='text-2xl font-bold mb-8'>What Our Happy Clients Say</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300'
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className='w-24 h-24 rounded-full mb-4'
              />
              <p className='text-lg mb-4'>{testimonial.quote}</p>
              <p className='text-sm font-bold'>{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Content1;
