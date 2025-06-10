async function asyncTest() {
  return new Promise((resolve, reject) => {
    console.log('test');
    resolve('test');
  });
}

async function asyncTest2() {
  console.log('hola');
  throw new Error('este es un error');
}

async function test() {
  try {
    // await asyncTest2();
    asyncTest2();
    console.log('aqui');
  } catch (error) {
    console.log('adios', error);
  }
}

test();
console.log('happy end');
