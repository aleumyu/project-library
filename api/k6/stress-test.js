import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

// TODO: include  auth process instead of using hardcoded token
const AUTH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxZjRiMTM2Ny1lNGIwLTQzNDEtOWNhZC1jMmJmNDc2N2ZiNDUiLCJlbWFpbCI6ImFsZXVtQGFsZXVtLmNvbSIsImlhdCI6MTc0NzYyNDcwNCwiYXVkIjoiYWxldW0iLCJpc3MiOiJhbGV1bSJ9.FzMPbaQNJsOG7DJWfjJJLw_JTqtvrI0qWNuT4vMo1l8';

const ApiDuration = new Trend('api_duration');
const ApiFailRate = new Rate('api_fail_rate');

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // 2 minutes to ramp up to 100 VUs
    { duration: '5m', target: 100 }, // 5 minutes to maintain 100 VUs (high load)
    { duration: '2m', target: 300 }, // 2 minutes to ramp up to 300 VUs (start of high load)
    { duration: '5m', target: 300 }, // 5 minutes to maintain 300 VUs (test system limits)
    { duration: '2m', target: 500 }, // 2 minutes to ramp up to 500 VUs (more load)
    { duration: '5m', target: 500 }, // 5 minutes to maintain 500 VUs
    { duration: '5m', target: 0 }, // 5 minutes to ramp down to 0 VUs (test recovery)
  ],
  thresholds: {
    // 스트레스 테스트에서는 특정 임계값을 넘어서는 것을 관찰하는 것이 목적일 수 있으므로,
    // 실패 기준을 너무 엄격하게 잡지 않거나, 특정 단계에서만 적용.
    // EG: 'http_req_failed': ['rate<0.5'], // 전체 에러율 50% 미만 (높은 허용치)
  },
};

export default function () {
  const requestParams = {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  };
  // 스트레스 테스트에서는 다양한 종류의 요청을 mix,
  // 리소스를 많이 소모하는 요청(예: 복잡한 쿼리, 대용량 데이터 POST) 위주로.

  // EG: 70% 확률로 GET /books, 30% 확률로 POST /books (더 많은 데이터 생성 유도)
  const scenarioRoll = Math.random();

  if (scenarioRoll < 0.7) {
    const resGet = http.get('http://localhost:3001/books', requestParams);
    ApiDuration.add(resGet.timings.duration);
    ApiFailRate.add(resGet.status !== 200);
    check(resGet, {
      'GET /books was successful (or expected error)': (r) =>
        r.status === 200 || r.status >= 400,
    });
  } else {
    const payload = JSON.stringify({
      title: `K6 Stress Test - ${__VU}-${__ITER}`,
      author: 'k6 Stress User',
      description:
        'A book generated during k6 stress testing for resource consumption.',
      category: 'StressTesting',
      publisher: 'k6 Overload Publishing',
      year: new Date().getFullYear(),
    });
    const params = {
      headers: {
        ...requestParams.headers,
        'Content-Type': 'application/json',
      },
    };
    const resPost = http.post('http://localhost:3001/books', payload, params);
    ApiDuration.add(resPost.timings.duration);
    ApiFailRate.add(resPost.status !== 201);
    check(resPost, {
      'POST /books was successful (or expected error)': (r) =>
        r.status === 201 || r.status >= 400,
    });
  }

  sleep(0.5); // 스트레스 테스트에서는 요청 간격을 짧게
}
