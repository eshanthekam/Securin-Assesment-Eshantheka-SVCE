import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CVEList() {
	const [data, setData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(20);
 
	const navigate = useNavigate();

	useEffect(()=>{
		const fetchData = async () => {
			try {
				const response = await axios.get('http://localhost:5000/api/cve/list', {
          			params: {
						page: currentPage,
						limit: limit
          			}
        		});
				setData(response.data);
			} 
			catch (error) {
				console.error('Error fetching data:', error);
			}
		};
		fetchData();
	},[currentPage, limit]);

	const handleChange=(e)=>{
		setLimit(e.target.value)
	}

	const fetchDataMutation = async()=>{
		try{
			const response = await axios.get('http://localhost:5000/api/cve/fetch', true);
		}
		catch(err){
			console.error('Error fetching data:', err);
		}
	}

	return (
    	<>
			<div className='mx-[5%]'>
				<button className='bg-black text-white px-4 py-2 m-2 flex justify-center text-xl rounded-md'
					onClick={fetchDataMutation}
				>Fetch</button>
				<h1 className=' p-2 m-2 flex flex-row justify-center items-center font-bold text-2xl'>CVE List</h1>
				<div className='flex justify-between m-2'>
					<button disabled={currentPage<2} onClick={()=>{setCurrentPage(currentPage-1)}} >
						<i class="fa-solid fa-arrow-left text-3xl hover:scale-95"></i>
					</button>
					<div className=' font-semibold p-2'>
						<span className='m-2'>Limit:</span>
						<input className='p-2 rounded-md border w-[75%]' type='text' value={limit} onChange={handleChange}/>
					</div>
					<button onClick={()=>{setCurrentPage(currentPage+1)}}>
						<i class="fa-solid fa-arrow-right text-3xl hover:scale-95"></i>
					</button>
				</div>
				<table className='cursor-default w-full'>
					<thead className=''>
						<tr className='py-[5%] text-lg font-semibold '>
							<th className='p-2 tracking-wide text-center border border-gray-900'>CVE-ID</th>
							<th className='p-2 tracking-wide text-center border border-gray-900'>Identifier</th>
							<th className='p-2 tracking-wide text-center border border-gray-900'>Published Date</th>
							<th className='p-2 tracking-wide text-center border border-gray-900'>Last Modified Date</th>
							<th className='p-2 tracking-wide text-center border border-gray-900'>Status</th>
						</tr>
					</thead>
					<tbody className='divide-y divide font-medium'>
						{
							data.map((item)=>{
								return(
									<tr className=''>
										<td className='p-2 text-sm tracking-wide text-center whitespace-nowrap border border-1 '>
											<button onClick={()=>{navigate(`/list/${item.cve.id}`)}}>
												{item.cve.id}
											</button>
										</td>
										<td className='p-2 text-sm tracking-wide text-center whitespace-nowrap border border-1 '>{item.cve.sourceIdentifier}</td>
										<td className='p-2 text-sm tracking-wide text-center whitespace-nowrap border border-1 '>{item.cve.published}</td>
										<td className='p-2 text-sm tracking-wide text-center whitespace-nowrap border border-1 '>{item.cve.lastModified}</td>
										<td className='p-2 text-sm tracking-wide text-center whitespace-nowrap border border-1 '>{item.cve.vulnStatus}</td>
									</tr>
								)
							})
						}
					</tbody>
            	</table>
				
				<div className='flex justify-between m-2'>
					<button disabled={currentPage<2} onClick={()=>{setCurrentPage(currentPage-1)}} >
						<i class="fa-solid fa-arrow-left text-3xl hover:scale-95"></i>
					</button>
					<button onClick={()=>{setCurrentPage(currentPage+1)}}>
						<i class="fa-solid fa-arrow-right text-3xl hover:scale-95"></i>
					</button>
				</div>
			</div>
		
			

		</>
  	)
}

export default CVEList
