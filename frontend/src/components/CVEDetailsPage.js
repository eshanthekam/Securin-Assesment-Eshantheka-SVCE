import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function CVEDetailsPage() {
	
	const params = useParams() 
	const [data,setData]  = useState(null);
	let id = params.cveId;

	const formatCVEData = (data) => {
		const formattedData = { ...data };
	
		if (formattedData.cve?.published?.$date) {
		  formattedData.cve.published.$date = new Date(formattedData.cve.published.$date).toLocaleDateString();
		}
		if (formattedData.cve?.lastModified?.$date) {
		  formattedData.cve.lastModified.$date = new Date(formattedData.cve.lastModified.$date).toLocaleDateString();
		}
		return formattedData;
	};

	useEffect(() => {
		const fetchCVEDetails = async () => {
		  try {
			const response = await axios.get(`http://localhost:5000/api/cve/list/${id}`);
			const formattedData = formatCVEData(response.data);
			setData(formattedData);
			console.log(formattedData)
		} 
		catch (error) {
			console.error(error);
		}
		};
	
		fetchCVEDetails();
	}, [id]);
	

  	return (
    	<>
			<div className='m-5'>
				{data?(
					<>
						<table className='overflow-auto rounded-lg shadow-md my-[2%] w-full'>
							<tr className='py-[5%] text-lg font-semibold '>
								<th className='text-3xl'>
									{id}
								</th>
							</tr>
							<tr className='py-[5%] text-lg  '>
								<th className='font-semibold'>Descriptions:</th>
								<td>
									{data.cve?.descriptions && data.cve.descriptions.length > 0 ? (
										data.cve.descriptions.map((description, index) => (
											<p key={index}>{description.value}</p>
										))
										) : (
											<p>No descriptions available</p>
									)}
								</td>
							</tr>
							<tr className='py-[5%] text-lg  '>
								<th className='font-semibold'>CVSSV2 Metrics:</th>
								<td>
									{
										data.weaknesses && data.weaknesses.length>0?(
											// console.log(data.weaknesses[0])
											data.weaknesses[0].description.map((description, index) => (
												<>
												<div key={index}><span className='font-semibold'>Language:</span>{description.lang}</div>
												<div key={index}><span className='font-semibold'>Values:</span>{description.value}</div>
												</>
											))
										):(
											<p>No Weaknesses available</p>
										)
									}
								</td>
								
							</tr>
							
							<tr className='py-[5%] text-lg  '>
								<th className='font-semibold'>Configurations:</th>
							</tr>
							<tr>
								<table className='cursor-default w-full'>
									<tr className='py-[5%] text-lg font-semibold '>
										<th className='p-2 tracking-wide text-center border border-gray-900'>Criteria</th>
										<th className='p-2 tracking-wide text-center border border-gray-900'>MatchCriteria Id</th>
										<th className='p-2 tracking-wide text-center border border-gray-900'>Vulnerable</th>

									</tr>
									{data.configurations[0].nodes[0].cpeMatch.map((item)=>{
										return (<>
											<tr>
												<td className='p-2 tracking-wide text-center border border-gray-900'>
													{item.criteria}
												</td>
												<td className='p-2 tracking-wide text-center border border-gray-900'>
													{item.matchCriteriaId}
												</td>
												<td className='p-2 tracking-wide text-center border border-gray-900'>
													{String(item.vulnerable)}
												</td>
											</tr>
										</>)
										
									})
									}
								</table>
							</tr>
							<tr className='py-[5%] text-lg'>
								<th className='font-semibold'>
									References
								</th>
							</tr>
							<tr>
							<table className='cursor-default w-full'>
								<tr className='py-[5%] text-lg font-semibold '>
									<th className='p-2 tracking-wide text-center border border-gray-900'>Source</th>
									<th className='p-2 tracking-wide text-center border border-gray-900'>URL </th>
								</tr>
								{
									// console.log(data.references)
									data.references.map((item)=>{
										return(<>
											<tr>
												<td className='p-2 tracking-wide text-center border border-gray-900'>
													{item.source}
												</td>
												<td className='p-2 tracking-wide text-center border border-gray-900'>
													{item.url}
												</td>

											</tr>
										</>)
									})
								}
							</table>

							</tr>
						</table>
					</>
				):(
					<>
						Loading
					</>
				)}
				
			</div>
		
		</>
  	)
}

export default CVEDetailsPage
