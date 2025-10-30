import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  const courses = [
    { title: "React Basics", description: "Learn the fundamentals of React, including components, state, and props." },
    { title: "Laravel for Beginners", description: "Get started with Laravel, build your first CRUD application." },
    { title: "JavaScript Essentials", description: "Master the core concepts of JavaScript for modern web development." },
    { title: "Advanced CSS", description: "Learn Flexbox, Grid, and animations to style beautiful web apps." },
    { title: "Node.js Fundamentals", description: "Understand backend development with Node.js and Express." },
    { title: "Database Design", description: "Learn how to design and manage relational databases effectively." },
  ];

  // Smooth scroll function
  const scrollToCourses = (e) => {
    e.preventDefault();
    const coursesSection = document.getElementById('courses');
    coursesSection.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div>
      {/* Landing Section */}
      <section className="bg-center bg-no-repeat bg-[url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1470&q=80')] bg-green-900 bg-blend-multiply">
        <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
            Learn, Master, and Succeed with Learnify
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
            Unlock your skills with structured courses, engaging modules, and interactive quizzes. Build your future from the nest today!
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
            <Link 
              to="/register"
              
              className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-gradient-to-br from-green-400 via-teal-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 focus:ring-4 focus:ring-green-300"
            >
              Register
              <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
              </svg>
            </Link>
            <Link
              to='/login'
              className="inline-flex justify-center items-center py-3 px-5 sm:ms-4 text-base font-medium text-center text-white rounded-lg border border-white hover:bg-white hover:text-green-900 focus:ring-4 focus:ring-gray-400"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      
    </div>
  )
}
