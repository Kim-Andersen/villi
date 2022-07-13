import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });

/**
 * "hhmm" (without colon).
 * Ex: "0000", "1545", or "2359"
 */
ajv.addFormat("24hour", /^([01][0-9]|2[0-3])([0-5][0-9])$/); 

export default ajv;