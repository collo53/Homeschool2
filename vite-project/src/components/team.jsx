import React from "react";

function Team() {
  const teamMembers = [
    {
      name: "John Gathage",
      role: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      quote:
        "Education is not preparation for life; education is life itself. We are committed to making learning engaging and accessible.",
    },
    {
      name: "Marion Mumbua",
      role: "Co-Founder & Director",
      image:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      quote:
        "Our goal is to nurture curiosity and build strong foundations for lifelong learning in every child we work with.",
    },
  ];

  return (
    <section className="relative bg-white px-6 py-24 sm:py-32 lg:px-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(50rem_60rem_at_top,var(--color-indigo-100),white)] opacity-30" />

      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-16">
          Meet Our Team
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="mx-auto size-24 rounded-full shadow-md"
              />

              <blockquote className="mt-6 text-gray-700 italic">
                “{member.quote}”
              </blockquote>

              <figcaption className="mt-6 flex flex-col items-center">
                <div className="font-semibold text-gray-900 text-lg">
                  {member.name}
                </div>
                <div className="text-gray-500 text-sm">{member.role}</div>
              </figcaption>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Team;
