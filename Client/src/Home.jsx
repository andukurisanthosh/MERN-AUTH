import React from 'react'
import NavBar from './Components/NavBar.jsx'
import Header from './Components/Header.jsx'

const Home = () => {
  return (
    <div className='flex flex-item item-center justify-center min-h-screen bg-[url("/bg_image.png")]bg-cover bg-center '>
      <NavBar />
      <Header />
    </div>
  )
}

export default Home
