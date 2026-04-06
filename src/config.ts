const DEV_STAAX = 'http://localhost:8000';
const DEV_INVEX = 'http://localhost:8001';
const DEV_BUDGEX = 'http://localhost:8002';

const PROD_STAAX = 'https://api.lifexos.co.in';
const PROD_INVEX = 'https://invex.lifexos.co.in';
const PROD_BUDGEX = 'https://budgex-api.lifexos.co.in';

export const STAAX_URL = __DEV__ ? DEV_STAAX : PROD_STAAX;
export const INVEX_URL = __DEV__ ? DEV_INVEX : PROD_INVEX;
export const BUDGEX_URL = __DEV__ ? DEV_BUDGEX : PROD_BUDGEX;
