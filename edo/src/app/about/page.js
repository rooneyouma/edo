"use client";

import React from "react";
import Link from "next/link";
import {
  UsersIcon,
  LightBulbIcon,
  HeartIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const AboutPage = () => {
  const values = [
    {
      icon: <HeartIcon className="h-8 w-8 text-[#009688]" />,
      title: "Customer First",
      description:
        "We put our customers at the center of everything we do, ensuring their success is our success.",
    },
    {
      icon: <LightBulbIcon className="h-8 w-8 text-[#009688]" />,
      title: "Innovation",
      description:
        "We continuously innovate to provide the best solutions for property management challenges.",
    },
    {
      icon: <UsersIcon className="h-8 w-8 text-[#009688]" />,
      title: "Community",
      description:
        "We believe in building strong communities for property managers, tenants, and landlords.",
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-[#009688]" />,
      title: "Transparency",
      description:
        "We operate with complete transparency in our pricing, processes, and communications.",
    },
  ];

  const team = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "10+ years in property management technology",
    },
    {
      name: "Sarah Williams",
      role: "CTO",
      bio: "Former tech lead at major real estate platforms",
    },
    {
      name: "Michael Chen",
      role: "Head of Product",
      bio: "Specializes in user experience and product design",
    },
    {
      name: "Emma Rodriguez",
      role: "Customer Success",
      bio: "Ensures every customer gets the most from our platform",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-[#009688] to-[#33bbaa] bg-clip-text text-transparent">
                edo
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              We're on a mission to transform property management through
              technology that's simple, powerful, and designed for the modern
              world.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/pricing"
                className="px-8 py-3 bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                View Pricing
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 bg-white text-[#009688] font-bold rounded-xl shadow-lg border border-[#009688] hover:bg-gray-50 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded in 2020, edo emerged from a simple observation: property
                management technology was unnecessarily complex and expensive.
              </p>
              <p>
                Our founders, all former property managers themselves,
                understood the pain points firsthand. They set out to build a
                platform that would make property management intuitive,
                efficient, and accessible to everyone.
              </p>
              <p>
                Today, edo serves thousands of property managers, landlords, and
                tenants across the country, helping them save time, reduce
                costs, and improve their rental experience.
              </p>
            </div>
          </div>
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center text-gray-500">
            Company Image
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our Values
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These principles guide everything we do at edo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="mb-4">{value.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Team */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The passionate people behind edo
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 text-center hover:shadow-lg transition-all duration-300"
            >
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {member.name}
              </h3>
              <p className="text-[#009688] font-medium mb-2">{member.role}</p>
              <p className="text-gray-600 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-[#009688] to-[#33bbaa] rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Join the edo Community
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Experience the future of property management with our intuitive
            platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-white text-[#009688] font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-all duration-300"
            >
              Get Started Free
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              Schedule a Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
