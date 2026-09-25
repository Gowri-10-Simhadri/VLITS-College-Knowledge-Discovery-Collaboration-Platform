import http from 'http';

const testEndpoints = [
  { path: '/api/health', method: 'GET', desc: 'Health check' },
  { path: '/api/projects', method: 'GET', desc: 'Projects Repository' },
  { path: '/api/projects/featured', method: 'GET', desc: 'Featured Projects' },
  { path: '/api/projects/proj_01', method: 'GET', desc: 'Single Capstone Project Detail (proj_01)' },
  { path: '/api/search/suggestions?q=Traffic', method: 'GET', desc: 'Search Suggestions' },
  { path: '/api/graph', method: 'GET', desc: 'Interactive Knowledge Graph' },
  { path: '/api/users/collaborators', method: 'GET', desc: 'Student Collaborators' },
  { path: '/api/users/faculty', method: 'GET', desc: 'Faculty Directory' },
  { path: '/api/skills', method: 'GET', desc: 'Skills Explorer' },
  { path: '/api/skills/Computer%20Vision', method: 'GET', desc: 'Deep-dive Skill Knowledge Path' },
  { path: '/api/research', method: 'GET', desc: 'Research Papers Archive' },
  { path: '/api/resources', method: 'GET', desc: 'Datasets & Computing Resources' }
];

async function runTests() {
  console.log('🧪 Running Comprehensive College Knowledge Engine API Test Suite...\n');
  let passed = 0;
  let failed = 0;

  for (const ep of testEndpoints) {
    try {
      const res = await makeRequest(ep.path, ep.method);
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log(`✅ [PASS] ${ep.desc} (${ep.path}) -> HTTP ${res.statusCode}`);
        passed++;
      } else {
        console.error(`❌ [FAIL] ${ep.desc} (${ep.path}) -> HTTP ${res.statusCode}: ${res.body}`);
        failed++;
      }
    } catch (err) {
      console.error(`❌ [ERROR] ${ep.desc} (${ep.path}) -> ${err.message}`);
      failed++;
    }
  }

  console.log(`\n=========================================`);
  console.log(`Summary: Total Tests: ${testEndpoints.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`=========================================`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 All backend API endpoints are 100% operational!');
    process.exit(0);
  }
}

function makeRequest(path, method) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    });

    req.on('error', (e) => reject(e));
    req.end();
  });
}

runTests();
