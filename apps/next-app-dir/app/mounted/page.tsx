'use client';

import { useRouter } from '@bprogress/next';
// import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Mounted = () => {
  const router = useRouter();
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    router.replace('/mounted');
    console.log('Home mounted');
  }, [router, counter]);

  return (
    <>
      <h1 className="text-4xl">BProgress</h1>

      <button
        className="default"
        onClick={() => setCounter((prev) => prev + 1)}
      >
        Counter: {counter}
      </button>
    </>
  );
};

export default Mounted;
