// TODO: THIS IS THE LANDING PAGE THAT THE USER WILL ALWAYS FIRST SEE.
// Make sure that the marketing text always reflects the app marketing. create an aesthetic properly-designed landing page that fits the theme of the app
// start completely from scratch to make this landing page using aesthetic design principles and tailwind styling to create a unique and thematic landing page.

import { motion } from "framer-motion";
import { Loader } from "lucide-react";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center"
    >
      <div className="max-w-5xl mx-auto relative px-4">
        {/* landing page goes here */}
      <div className="flex items-center justify-center min-h-[200px]">
        404 Page Not Found
      </div>
      </div>
    </motion.div>
  );
}
