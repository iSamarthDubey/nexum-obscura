import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
const Home = () => {
  return (
    <>
    <Header/>

    
    <section
      id="home"
      className="min-h-screen bg-[#0D1117] flex flex-col justify-center items-center text-center px-6"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-orbitron text-[#00C2FF] mb-6"
      >
        Hidden Connections. <span className="text-[#00FF85]">Revealed.</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-lg md:text-xl text-[#E0E0E0] max-w-2xl mb-8 font-inter"
      >
        Nexum Obscura empowers cybersecurity investigators to detect hidden
        threats, visualize networks, and flag suspicious activities in
        real-time.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="flex gap-4"
      >
        <button className="bg-[#00C2FF] hover:bg-[#00C2FF]/80 text-black font-bold px-6 py-3 rounded-2xl shadow-lg">
          Get Started
        </button>
        <button className="bg-[#00FF85] hover:bg-[#00FF85]/80 text-black font-bold px-6 py-3 rounded-2xl shadow-lg">
          Learn More
        </button>
      </motion.div>
    </section>
    <Footer/>
    </>
  );
};
export default Home;
