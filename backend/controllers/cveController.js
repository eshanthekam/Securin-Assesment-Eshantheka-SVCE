const bcrypt  = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const axios = require('axios')
const CVE = require('../models/cveModel')

const transformData = (vulnerability) => {
    const cveID = vulnerability.cve.id || "";
    const sourceIdentifier = vulnerability.cve.sourceIdentifier || "";
    const publishedDate = vulnerability.cve.published ? new Date(vulnerability.cve.published) : null;
    const modifiedDate = vulnerability.cve.lastModified ? new Date(vulnerability.cve.lastModified) : null;
    const status = vulnerability.cve.vulnStatus || "";
    const descriptions = vulnerability.cve.descriptions || [];
    
     const metricsData = vulnerability.metrics?.cvssMetricV2; 
    
     const metrics = metricsData ? {
         source: metricsData.source || "",
         type: metricsData.type || "",
         cvssData: {
             version: metricsData.cvssData.version || "",
             vectorString: metricsData.cvssData.vectorString || "",
             accessVector: metricsData.cvssData.accessVector || "",
             accessComplexity: metricsData.cvssData.accessComplexity || "",
             authentication: metricsData.cvssData.authentication || "",
             confidentialityImpact: metricsData.cvssData.confidentialityImpact || "",
             integrityImpact: metricsData.cvssData.integrityImpact || "",
             availabilityImpact: metricsData.cvssData.availabilityImpact || "",
             baseScore: metricsData.cvssData.baseScore || 0
         },
         baseSeverity: metricsData.baseSeverity || "",
         exploitabilityScore: metricsData.exploitabilityScore || 0,
         impactScore: metricsData.impactScore || 0,
         acInsufInfo: metricsData.acInsufInfo || false,
         obtainAllPrivilege: metricsData.obtainAllPrivilege || false,
         obtainCVEPrivilege: metricsData.obtainUserPrivilege || false,
         obtainOtherPrivilege: metricsData.obtainOtherPrivilege || false,
         userInteractionRequired: metricsData.userInteractionRequired || false
     } : {};
 
    
    const weaknesses = vulnerability.cve.weaknesses || [];
    const configurations = vulnerability.cve.configurations || [];
    const references = vulnerability.cve.references || [];

    return {
        cve: {
            id: cveID,
            sourceIdentifier,
            published: publishedDate,
            lastModified: modifiedDate,
            vulnStatus: status,
            descriptions,
            metrics
        },
        weaknesses,
        configurations,
        references
    };
};

// @desc fetchList
// @route GET api/cve/fetch
const fetchList = asyncHandler (async(req,res) => {
    try {
        const response = await axios.get(process.env.API);
        const vulnerabilities = response.data?.vulnerabilities || [];
        const formattedData = vulnerabilities.map(transformData);
        await CVE.deleteMany({});
        await CVE.insertMany(formattedData);
        console.log('Data fetched and stored successfully');
        res.status(200).json({"message":"fetched"})
       
    } 
    catch (error) {
        console.error('Error fetching and storing the data:', error.message);
    }
});

// @desc getList
// @route GET api/cve/list
const getList = asyncHandler(async(req,res)=>{
    const {page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    // console.log({page,limit})

    const cves = await CVE.find({},{
        _id: 0, 'cve.id': 1, 'cve.sourceIdentifier':1, 'cve.published': 1,
        'cve.lastModified': 1, 'cve.vulnStatus': 1 
    }).skip(skip).limit(parseInt(limit))

    if(!cves){
        res.status(400)
        throw new Error('error in fetching cves');
    }
    res.status(200).json(cves)
})

// @desc getItem
// @route GET api/cve/list/:id
const getCVE = asyncHandler(async(req,res)=>{
    const cveID = req.params.id;
    // console.log(cveID)

    const cveItem = await CVE.findOne({'cve.id': cveID },
     { _id: 0, cve: 1, weaknesses: 1, configurations: 1, references: 1 });

    if(!cveItem){
        res.status(400)
        throw new Error('error in fetching cve');
    }
    res.status(200).json(cveItem)
})

module.exports = {
    fetchList,
    getList,
    getCVE

}