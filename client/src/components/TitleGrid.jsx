import React from 'react'
import TitleCard from './TitleCard'
import { motion } from 'framer-motion'

const TitleGrid = ({ titles }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
    >
      {titles.map((title) => (
        <motion.div key={title._id} variants={itemVariants}>
          <TitleCard title={title} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default TitleGrid