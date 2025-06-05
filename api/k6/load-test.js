import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

// TODO: include  auth process instead of using hardcoded token
const AUTH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxZjRiMTM2Ny1lNGIwLTQzNDEtOWNhZC1jMmJmNDc2N2ZiNDUiLCJlbWFpbCI6ImFsZXVtQGFsZXVtLmNvbSIsImlhdCI6MTc0NzYyNDcwNCwiYXVkIjoiYWxldW0iLCJpc3MiOiJhbGV1bSJ9.FzMPbaQNJsOG7DJWfjJJLw_JTqtvrI0qWNuT4vMo1l8';

const GetBooksDuration = new Trend('get_books_duration');
const GetBooksFailRate = new Rate('get_books_fail_rate');
const GetBooksReqs = new Counter('get_books_reqs');

const PostBookDuration = new Trend('post_book_duration');
const PostBookFailRate = new Rate('post_book_fail_rate');
const PostBookReqs = new Counter('post_book_reqs');

export const options = {
  stages: [
    // 단계별로 부하를 조절 - Ramping VU
    { duration: '30s', target: 50 }, // 30 seconds to ramp up to 50 VUs
    { duration: '1m', target: 50 }, // 1 minute to maintain 50 VUs (normal load)
    { duration: '30s', target: 100 }, // 30 seconds to ramp up to 100 VUs
    { duration: '1m', target: 100 }, // 1 minute to maintain 100 VUs (near max load)
    { duration: '30s', target: 0 }, // 30 seconds to ramp down to 0 VUs (cool down)
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'], // total error rate less than 2%
    'http_req_duration{scenario:get_books_scenario}': ['p(95)<600'], // GET /books 95%ile 600ms
    'http_req_duration{scenario:post_book_scenario}': ['p(95)<1000'], // POST /books 95%ile 1000ms
  },
  // scenarios: { //  executor를 scenarios로 옮겨 사용 가능
  //   get_books_scenario: {
  //     executor: 'ramping-vus',
  //     exec: 'getBooks',
  //     stages: ...
  //   },
  //   post_book_scenario: {
  //     executor: 'ramping-vus',
  //     exec: 'postBook',
  //     stages: ...
  //   },
  // }
};

// Scenario 1: Get books list
function getBooks() {
  group('GET /books Scenario', function () {
    const requestParams = {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    };
    const res = http.get('http://localhost:3001/books', requestParams);
    GetBooksDuration.add(res.timings.duration);
    GetBooksReqs.add(1);
    GetBooksFailRate.add(res.status !== 200);
    check(res, { 'GET /books status is 200': (r) => r.status === 200 });
    sleep(1);
  });
}

// Scenario 2: Register new book
function postBook() {
  group('POST /books Scenario', function () {
    const requestParams = {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };
    const payload = JSON.stringify({
      title: `K6 Book - ${Math.random()}`,
      author: 'Aleum',
      description: 'A book generated during k6 load testing.',
      category: 'Test',
      publisher: 'Aleum',
      year: new Date().getFullYear(),
    });
    const res = http.post(
      'http://localhost:3001/books',
      payload,
      requestParams,
    );
    PostBookDuration.add(res.timings.duration);
    PostBookReqs.add(1);
    PostBookFailRate.add(res.status !== 201);
    check(res, { 'POST /books status is 201': (r) => r.status === 200 });
    sleep(2);
  });
}

export default function () {
  // VU들이 실행할 로직: 여기서는 80% 확률로 GET, 20% 확률로 POST 실행
  if (__VU % 5 === 0) {
    // 간단한 방법으로 비율 나누기 (더 정교한 방법도 있음)
    postBook();
  } else {
    getBooks();
  }
}
