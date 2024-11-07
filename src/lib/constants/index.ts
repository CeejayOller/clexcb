  // Mock Data
  export const MOCK_CLIENTS = [
    { id: '1', name: 'ABC Company', address: 'Manila, Philippines' },
    { id: '2', name: 'XYZ Corporation', address: 'Cebu, Philippines' },
    { id: '3', name: 'Global Trading Co.', address: 'Davao, Philippines' },
  ];
  
  export const MOCK_EXPORTERS = [
    { id: '1', name: 'China Exports Ltd.', address: 'Shanghai, China' },
    { id: '2', name: 'Korea Trade Co.', address: 'Seoul, South Korea' },
    { id: '3', name: 'Japan Suppliers Inc.', address: 'Tokyo, Japan' },
  ];
  
  export const INCOTERMS = [
    'EXW - Ex Works',
    'FCA - Free Carrier',
    'CPT - Carriage Paid To',
    'CIP - Carriage and Insurance Paid To',
    'DAP - Delivered at Place',
    'DPU - Delivered at Place Unloaded',
    'DDP - Delivered Duty Paid',
    'FAS - Free Alongside Ship',
    'FOB - Free on Board',
    'CFR - Cost and Freight',
    'CIF - Cost, Insurance and Freight',
  ];
  
  export const REQUIRED_DOCUMENTS = [
    { type: 'bl', name: 'Bill of Lading', required: true, forType: 'sea' },
    { type: 'awb', name: 'Air Way Bill', required: true, forType: 'air' },
    { type: 'invoice', name: 'Commercial Invoice', required: true, forType: 'both' },
    { type: 'packing', name: 'Packing List', required: true, forType: 'both' },
    { type: 'certificate', name: 'Certificate of Origin', required: false, forType: 'both' },
  ] as const;
  
  export const PACKAGE_CODES = [
  { code: 'PKG', description: 'Package' },
  { code: 'CTN', description: 'Carton' },
  { code: 'PLT', description: 'Pallet' },
];