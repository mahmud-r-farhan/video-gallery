import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FaPlay, FaTimes, FaChevronLeft, FaChevronRight, FaExpand, FaCompress, FaShare, FaDownload } from 'react-icons/fa';
import { BiSearch, BiX } from 'react-icons/bi';
import projects, { categories } from '../data/projects';

const Gallery = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [category, setCategory] = useState('all');
  const [imageError, setImageError] = useState({});
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  const ref = useRef(null);
  const modalRef = useRef(null);
  const searchInputRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const categoryOptions = ['all', ...categories.map(cat => cat.name.toLowerCase())];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = category === 'all' || project.category === category;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openProject = useCallback((project) => {
    const projectIndex = filteredProjects.findIndex(p => p.id === project.id);
    setCurrentProjectIndex(projectIndex);
    setSelectedProject(project);
    setIsPlaying(false);
    document.body.style.overflow = 'hidden';
  }, [filteredProjects]);

  const closeProject = useCallback(() => {
    setSelectedProject(null);
    setIsPlaying(false);
    setIsFullscreen(false);
    document.body.style.overflow = 'auto';
  }, []);

  const navigateProject = useCallback((direction) => {
    const newIndex = direction === 'next' 
      ? (currentProjectIndex + 1) % filteredProjects.length
      : (currentProjectIndex - 1 + filteredProjects.length) % filteredProjects.length;
    
    setCurrentProjectIndex(newIndex);
    setSelectedProject(filteredProjects[newIndex]);
    setIsPlaying(false);
  }, [currentProjectIndex, filteredProjects]);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    setIsPlaying(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleShare = async () => {
    if (navigator.share && selectedProject) {
      try {
        await navigator.share({
          title: selectedProject.title,
          text: selectedProject.description,
          url: window.location.href
        });
      } catch (error) {
        navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube')) {
      return url + '?autoplay=1&rel=0';
    } else if (url.includes('vimeo')) {
      return url + '?autoplay=1';
    }
    return url;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedProject) {
        // Global shortcuts
        if (e.key === '/' && !isSearchActive) {
          e.preventDefault();
          setIsSearchActive(true);
          setTimeout(() => searchInputRef.current?.focus(), 100);
        }
        return;
      }
      // Modal shortcuts
      switch (e.key) {
        case 'Escape':
          closeProject();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          navigateProject('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateProject('next');
          break;
        case ' ':
          e.preventDefault();
          if (!isPlaying) {
            setIsPlaying(true);
          }
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          handleShare();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, isPlaying, navigateProject, closeProject, isSearchActive]);

  // Handle image errors
  const handleImageError = (id) => {
    setImageError(prev => ({ ...prev, [id]: true }));
  };

  // Search functionality
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (!isSearchActive) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
    }
  };

  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // search animations
  const searchVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: { 
      width: "100%", 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  // hover animations
  const buttonHoverAnimation = {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  };

  // card hover animation
  const cardHoverAnimation = {
    scale: 1.03,
    y: -8,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  };

  return (
    <section id="gallery" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          variants={containerAnimation}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.h2 
            variants={itemAnimation}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 text-white tracking-tight"
          >
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Videos</span>
          </motion.h2>
          <motion.div 
            variants={itemAnimation}
            className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mb-6 rounded-full"
          />
          <motion.p 
            variants={itemAnimation}
            className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed"
          >
            Explore a curated selection of cinematic projects showcasing storytelling and visual artistry.
            <span className="block text-sm blur-sm text-gray-400/10 md:text-gray-400 md:blur-none mt-2">Press "/" to search or use arrow keys to navigate</span>
          </motion.p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-12 sm:mb-16"
        >
          {/* Search Bar */}
          <div className="mb-8 flex justify-start">
            <motion.div className="relative w-full max-w-md">
              <div className="relative flex items-center">
                <motion.button
                  onClick={toggleSearch}
                  className={`flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-all duration-300 ${
                    isSearchActive ? 'w-full' : 'w-auto'
                  }`}
                  whileHover={buttonHoverAnimation}
                  whileTap={{ scale: 0.95 }}
                >
                  <BiSearch size={20} />
                  {!isSearchActive && <span>Search Projects</span>}
                </motion.button>
                <AnimatePresence>
                  {isSearchActive && (
                    <motion.div
                      variants={searchVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute inset-0 flex items-center"
                    >
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onBlur={() => !searchTerm && setIsSearchActive(false)}
                        placeholder="Search projects..."
                        className="w-full px-4 py-2 pl-10 bg-gray-800 border border-yellow-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                      <BiSearch size={20} className="absolute left-3 text-gray-400" />
                      {searchTerm && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSearchTerm('');
                            searchInputRef.current?.focus();
                          }}
                          className="absolute right-3 text-gray-400 hover:text-white"
                        >
                          <BiX size={20} />
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {categoryOptions.map((cat) => (
              <motion.button
                key={cat}
                variants={itemAnimation}
                className={`px-6 py-3 rounded-full uppercase tracking-widest text-sm font-semibold transition-all duration-300 ${
                  category === cat
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg shadow-yellow-400/30'
                    : 'border border-gray-600 text-gray-200 hover:border-yellow-400 hover:text-yellow-400'
                } focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50`}
                onClick={() => setCategory(cat)}
                whileHover={buttonHoverAnimation}
                whileTap={{ scale: 0.95 }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          layout
          variants={containerAnimation}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-3 gap-6 sm:gap-8"> {/* Adjust Grid */}
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                variants={itemAnimation}
                className="relative group cursor-pointer rounded-2xl overflow-hidden h-72 sm:h-80 shadow-xl bg-gray-900"
                onClick={() => openProject(project)}
                whileHover={cardHoverAnimation}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
              >
                {!imageError[project.id] ? (
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={() => handleImageError(project.id)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
                    <span className="text-gray-400 text-sm font-medium">Image unavailable</span>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                  <motion.h3 
                    className="text-lg sm:text-xl font-bold text-white mb-1"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {project.title}
                  </motion.h3>
                  <motion.p 
                    className="text-yellow-400 text-sm uppercase tracking-wider mb-3"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {project.category}
                  </motion.p>
                  <motion.div 
                    className="flex items-center space-x-3"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <FaPlay className="text-black ml-1" size={16} />
                    </div>
                    <span className="text-white text-sm font-medium">View Project</span>
                  </motion.div>
                </div>

                {/* Category badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-yellow-400 uppercase tracking-wider font-semibold">
                  {project.category}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No results message */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">No projects found matching your criteria.</p>
            <button
              onClick={() => { setCategory('all'); setSearchTerm(''); }}
              className="mt-4 px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-6 ${isFullscreen ? 'p-0' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProject}
          >
            <motion.div
              ref={modalRef}
              className={`relative bg-gray-900 w-full overflow-y-auto rounded-2xl shadow-2xl border border-gray-800 ${
                isFullscreen ? 'max-w-none max-h-none h-full rounded-none' : 'max-w-6xl max-h-[90vh]'
              }`}
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center space-x-4">
                  <span className="text-white text-sm">
                    {currentProjectIndex + 1} / {filteredProjects.length}
                  </span>
                  <span className="text-gray-400 text-sm">Use ← → to navigate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-colors duration-300"
                    title="Share (S)"
                  >
                    <FaShare size={16} />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-colors duration-300"
                    title="Fullscreen (F)"
                  >
                    {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
                  </button>
                  <button
                    onClick={closeProject}
                    className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center text-white hover:bg-red-500 transition-colors duration-300"
                    title="Close (Esc)"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              </div>

              {/* Navigation Buttons */}
              {filteredProjects.length > 1 && (
                <>
                  <button
                    onClick={() => navigateProject('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-colors duration-300"
                    title="Previous (←)"
                  >
                    <FaChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => navigateProject('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-colors duration-300"
                    title="Next (→)"
                  >
                    <FaChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Video Section */}
              <div className={`relative bg-black ${isFullscreen ? 'h-full' : 'aspect-video'}`}>
                {isPlaying ? (
                  <iframe
                    src={getEmbedUrl(selectedProject.videoUrl)}
                    className="w-full h-full"
                    title={selectedProject.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img
                      src={selectedProject.thumbnailUrl}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handlePlayClick}
                        title="Play (Space)"
                      >
                        <FaPlay className="text-black ml-1" size={24} />
                      </motion.button>
                    </div>
                  </>
                )}
              </div>

              {/* Project Details */}
              {!isFullscreen && (
                <motion.div
                  className="p-6 sm:p-8 md:p-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-white">
                    {selectedProject.title}
                  </h2>
                  <p className="text-yellow-400 text-sm uppercase tracking-widest mb-4">
                    {selectedProject.category}
                  </p>
                  <p className="text-gray-200 mb-8 text-base sm:text-lg leading-relaxed">
                    {selectedProject.description}
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-yellow-400 font-semibold mb-4 text-lg">Project Details</h3>
                      <ul className="text-gray-200 space-y-3">
                        <li><span className="font-semibold">Client:</span> {selectedProject.client}</li>
                        <li><span className="font-semibold">Director:</span> {selectedProject.director}</li>
                        <li><span className="font-semibold">Year:</span> {selectedProject.year}</li>
                        <li><span className="font-semibold">Location:</span> {selectedProject.location}</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-yellow-400 font-semibold mb-4 text-lg">Technical Specs</h3>
                      <ul className="text-gray-200 space-y-3">
                        <li><span className="font-semibold">Camera:</span> {selectedProject.camera}</li>
                        <li><span className="font-semibold">Lenses:</span> {selectedProject.lenses}</li>
                        <li><span className="font-semibold">Format:</span> {selectedProject.format}</li>
                        <li><span className="font-semibold">Aspect Ratio:</span> {selectedProject.aspectRatio}</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;