"use client";
import { Card, Carousel } from "@/components/projects/apple-cards-carousel";
import { data } from "@/components/projects/Data";
import { motion } from "framer-motion";


export default function AllProjects() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} layout={true} />
  ));

  return (
    <div className="w-full h-full pt-8">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-7xl mx-auto text-xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 font-sans"
      >
        My Projects
      </motion.h2>
      <Carousel items={cards} />
    </div>
  );
}
