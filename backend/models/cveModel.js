const mongoose = require('mongoose');

const cveDescriptionSchema = new mongoose.Schema({
    lang: String,
    value: String
});

const cvssDataSchema = new mongoose.Schema({
    version: String,
    vectorString: String,
    accessVector: String,
    accessComplexity: String,
    authentication: String,
    confidentialityImpact: String,
    integrityImpact: String,
    availabilityImpact: String,
    baseScore: Number
});

const metricSchema = new mongoose.Schema({
    source: String,
    type: String,
    cvssData: cvssDataSchema,
    baseSeverity: String,
    exploitabilityScore: Number,
    impactScore: Number,
    acInsufInfo: Boolean,
    obtainAllPrivilege: Boolean,
    obtainUserPrivilege: Boolean,
    obtainOtherPrivilege: Boolean,
    userInteractionRequired: Boolean
});

const weaknessDescriptionSchema = new mongoose.Schema({
    lang: String,
    value: String
});

const weaknessSchema = new mongoose.Schema({
    source: String,
    type: String,
    description: [weaknessDescriptionSchema]
});

const cpeMatchSchema = new mongoose.Schema({
    vulnerable: Boolean,
    criteria: String,
    matchCriteriaId: String
});

const nodeSchema = new mongoose.Schema({
    operator: String,
    negate: Boolean,
    cpeMatch: [cpeMatchSchema]
});

const configurationSchema = new mongoose.Schema({
    nodes: [nodeSchema]
});

const referenceSchema = new mongoose.Schema({
    url: String,
    source: String
});

const cveSchema = new mongoose.Schema({
    cve: {
        id: String,
        sourceIdentifier: String,
        published: Date,
        lastModified: Date,
        vulnStatus: String,
        descriptions: [cveDescriptionSchema]
    },
    weaknesses: [weaknessSchema],
    configurations: [configurationSchema],
    references: [referenceSchema],
    metrics: {
        cvssMetricV2: [metricSchema]
    }
});


module.exports = mongoose.model('cvelist',cveSchema)
