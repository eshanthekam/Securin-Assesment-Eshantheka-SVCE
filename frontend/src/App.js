import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import CVEList from './components/CVEList'; 
import CVEDetailsPage from './components/CVEDetailsPage';

function App() {
  return (
	<>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<CVEList />} />
				<Route path="/list/:cveId" element={<CVEDetailsPage />} />
			</Routes>
      </BrowserRouter>
    </>
  )
}

export default App
