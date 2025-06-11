import http from 'k6/http';
import { check, sleep } from 'k6';

const AUTH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxZjRiMTM2Ny1lNGIwLTQzNDEtOWNhZC1jMmJmNDc2N2ZiNDUiLCJlbWFpbCI6ImFsZXVtQGFsZXVtLmNvbSIsImlhdCI6MTc0NzYyNDcwNCwiYXVkIjoiYWxldW0iLCJpc3MiOiJhbGV1bSJ9.FzMPbaQNJsOG7DJWfjJJLw_JTqtvrI0qWNuT4vMo1l8';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 10 },
    { duration: '20s', target: 0 },
  ],
};

export default function () {
  const requestParams = {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  };
  const res = http.get(
    'http://localhost:3001/cpu-test/fibonacci?n=40',
    requestParams,
  );
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
