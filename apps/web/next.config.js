/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable persistent filesystem packfile cache on Windows to prevent ENOENT vendor-chunks corruption
      config.cache = false;
    }
    return config;
  },
  async redirects() {
    return [
      // Deoria Drug House / Akhil Deoria aliases & legacy .html paths
      { source: '/deoria-drug-house', destination: '/pharmacy/deoria-drug-house', permanent: true },
      { source: '/deoria-drug-house.html', destination: '/pharmacy/deoria-drug-house', permanent: true },
      { source: '/akhil-deoria', destination: '/pharmacy/deoria-drug-house', permanent: true },
      { source: '/akhil-deoria.html', destination: '/pharmacy/deoria-drug-house', permanent: true },
      { source: '/akhil', destination: '/pharmacy/deoria-drug-house', permanent: true },
      { source: '/deoriadrug', destination: '/pharmacy/deoria-drug-house', permanent: true },
      { source: '/deoriadrughouse', destination: '/pharmacy/deoria-drug-house', permanent: true },
      { source: '/sanjeevani-medicos', destination: '/pharmacy/deoria-drug-house', permanent: true },
      { source: '/sanjeevani-medicos.html', destination: '/pharmacy/deoria-drug-house', permanent: true },

      // Maa Vindhyavasini
      { source: '/maa-vindhyavasini-medicos-deoria', destination: '/pharmacy/maa-vindhyavasini-medicos-deoria', permanent: true },
      { source: '/maa-vindhyavasini-medicos-deoria.html', destination: '/pharmacy/maa-vindhyavasini-medicos-deoria', permanent: true },
      { source: '/maa-vindhyavasini-medicos', destination: '/pharmacy/maa-vindhyavasini-medicos-deoria', permanent: true },
      { source: '/vindhyavasini-deoria', destination: '/pharmacy/maa-vindhyavasini-medicos-deoria', permanent: true },

      // Kushwaha Medical Store
      { source: '/kushwaha-medical-store-deoria', destination: '/pharmacy/kushwaha-medical-store-deoria', permanent: true },
      { source: '/kushwaha-medical-store-deoria.html', destination: '/pharmacy/kushwaha-medical-store-deoria', permanent: true },
      { source: '/kushwaha-medicals', destination: '/pharmacy/kushwaha-medical-store-deoria', permanent: true },
      { source: '/kushwaha-store-deoria', destination: '/pharmacy/kushwaha-medical-store-deoria', permanent: true },

      // Raghav Chemist
      { source: '/raghav-chemist-deoria', destination: '/pharmacy/raghav-chemist-deoria', permanent: true },
      { source: '/raghav-chemist-deoria.html', destination: '/pharmacy/raghav-chemist-deoria', permanent: true },
      { source: '/raghav-chemist', destination: '/pharmacy/raghav-chemist-deoria', permanent: true },
      { source: '/raghav-medicals-deoria', destination: '/pharmacy/raghav-chemist-deoria', permanent: true },

      // Ganga Medical Hall
      { source: '/ganga-medical-hall-kanpur', destination: '/pharmacy/ganga-medical-hall-kanpur', permanent: true },
      { source: '/ganga-medical-hall-kanpur.html', destination: '/pharmacy/ganga-medical-hall-kanpur', permanent: true },
      { source: '/ganga-medicals', destination: '/pharmacy/ganga-medical-hall-kanpur', permanent: true },
      { source: '/ganga-chemist-kanpur', destination: '/pharmacy/ganga-medical-hall-kanpur', permanent: true },

      // Awadh Care Chemist
      { source: '/awadh-care-chemist-lucknow', destination: '/pharmacy/awadh-care-chemist-lucknow', permanent: true },
      { source: '/awadh-care-chemist-lucknow.html', destination: '/pharmacy/awadh-care-chemist-lucknow', permanent: true },
      { source: '/awadh-care-chemist', destination: '/pharmacy/awadh-care-chemist-lucknow', permanent: true },
      { source: '/awadh-lucknow', destination: '/pharmacy/awadh-care-chemist-lucknow', permanent: true },
      { source: '/sanjeevani-lucknow', destination: '/pharmacy/awadh-care-chemist-lucknow', permanent: true },
    ];
  },
};

module.exports = nextConfig;
