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

// NestJS 애플리케이션을 실행함.
// 터미널에서 k6 run book-api-test.js를 실행함.
// MemoryMonitorService 로그를 실시간으로 관찰하며 HeapUsed가 지속적으로 증가하는지 확인    .
// k6의 RPS, 응답 시간 변화 추이를 확인. (메모리가 부족해지면 응답 시간이 급격히 늘어날 것임.)
// 메모리가 특정 임계점을 넘거나, 응답이 매우 느려지면 http://localhost:3000/debug/heapdump를 호출하여 힙덤프를 생성함.
// 애플리케이션이 OOM으로 크래시되면 로그를 확인해야 함.
// 힙덤프를 분석하여 BooksService.viewedBookIds가 많은 메모리를 차지하고 있는지 확인해야 함.
