// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      staticDistDir: 'dist',        // Vite build output
      numberOfRuns: 3
    },
    assert: {
      // Treat these as gates; tweak if needed
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'metrics/first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'metrics/largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'metrics/cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'metrics/total-blocking-time': ['warn', { maxNumericValue: 300 }]
      }
    },
    upload: { target: 'temporary-public-storage' }
  }
}
