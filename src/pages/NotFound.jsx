import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-8">
      <img src="/assets/images/sad-wif.svg" alt="Sad WIF" className="mx-auto w-48 animate-pulse" /> {/* Assume image */}
      <h1 className="text-4xl">404 - Page Not Found</h1>
      <Link to="/" className="bg-primary-pink p-4 rounded mt-4 inline-block">Back Home</Link>
    </motion.div>
  );
};

export default NotFound;
