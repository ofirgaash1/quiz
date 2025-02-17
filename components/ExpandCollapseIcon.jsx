import { motion } from 'framer-motion';
// ExpandCollapseIcon: an animated chevron that rotates when expanded.
export default function ExpandCollapseIcon({ expanded }) {
  return (
    <motion.svg
      animate={{ rotate: expanded ? 90 : 0 }}
      transition={{ duration: 0.2 }}
      className="w-6 h-6 text-gray-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </motion.svg>
  );
}