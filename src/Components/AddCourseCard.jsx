import React from 'react'
import SpotlightCard from './ReactBits/SpotlightCard'
import '../CSS/CourseCard.css'
import { Link } from 'react-router-dom'

const AddCourseCard = () => {
  return (
    <div className='cursor-pointer'> 
      <SpotlightCard className="custom-spotlight-card flex flex-col items-center justify-center spotCard gap-2 text-white h-120 w-90" spotlightColor="rgba(116, 234, 247, 0.300)">
            <div className='h-40 w-40  rounded-[50%] addCourseCard flex items-center justify-center relative'>
                <Link to='/home/admin/addCourse' className='text-9xl mt-[-20px]'>+</Link>
            </div>
                <div className='text-4xl mt-2 text-cyan-200'>Add Course</div>
      </SpotlightCard>
    </div>
  )
}

export default AddCourseCard
