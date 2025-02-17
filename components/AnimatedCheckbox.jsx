import { motion, AnimatePresence } from 'framer-motion';
// AnimatedCheckbox: an animated checkbox that supports checked, unchecked, and indeterminate states.
export default function AnimatedCheckbox({ checked, indeterminate, onChange, size = 24 }) {
  const state = checked ? 'checked' : indeterminate ? 'indeterminate' : 'unchecked';
  const variants = {
    unchecked: { backgroundColor: '#fff', borderColor: '#ccc' },
    indeterminate: { backgroundColor: '#93c5fd', borderColor: '#93c5fd' },
    checked: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  };

  return (
    <motion.div
      onClick={(e) => {
        e.stopPropagation();
        onChange(e);
      }}
      animate={state}
      variants={variants}
      transition={{ duration: 0.2 }}
      style={{ width: size, height: size }}
      className="border-2 rounded flex items-center justify-center cursor-pointer"
    >
      <AnimatePresence>
        {checked && (
          <motion.svg
            key="check"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="w-3 h-3 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </motion.svg>
        )}
        {!checked && indeterminate && (
          <motion.div
            key="indeterminate"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="w-3 h-0.5 bg-white"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}