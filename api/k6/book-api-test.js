import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

// TODO: include  auth process instead of using hardcoded token
const AUTH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxZjRiMTM2Ny1lNGIwLTQzNDEtOWNhZC1jMmJmNDc2N2ZiNDUiLCJlbWFpbCI6ImFsZXVtQGFsZXVtLmNvbSIsImlhdCI6MTc0NzYyNDcwNCwiYXVkIjoiYWxldW0iLCJpc3MiOiJhbGV1bSJ9.FzMPbaQNJsOG7DJWfjJJLw_JTqtvrI0qWNuT4vMo1l8';

const GetBooksDuration = new Trend('get_books_duration');
const GetBooksFailRate = new Rate('get_books_fail_rate');
const GetBooksReqs = new Counter('get_books_reqs');

export const options = {
  vus: 100, // 100 Virtual Users
  duration: '1m', // 1 minute
  thresholds: {
    http_req_failed: ['rate<0.01'], // HTTP error rate must be less than 1%
    http_req_duration: ['p(95)<500'], // 95% of all requests must respond within 500ms
    get_books_duration: ['p(95)<450'], // 95% of get_books requests must respond within 450ms
  },
};

export default function () {
  const requestParams = {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  };
  const res = http.get('http://localhost:3001/books', requestParams);

  // Record response time
  GetBooksDuration.add(res.timings.duration);
  GetBooksReqs.add(1);
  GetBooksFailRate.add(res.status !== 200);

  // Response validation
  check(res, {
    'GET /books status is 200': (r) => r.status === 200,
    'GET /books response is not empty': (r) => r.body !== null,
  });

  sleep(1); // time between each request
}

// (optional) customize summary information after test completion
// export function handleSummary(data) {
//   console.log('Finished executing specific API test: GET /books');
//   // if needed, process the data object to output or save in a file
//   return {
//     'summary.html': htmlReport(data), // possible to create HTML report using k6-reporter
//     stdout: textSummary(data, { indent: ' ', enableColors: true }),
//   };
// }
