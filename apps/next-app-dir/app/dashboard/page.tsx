'use client';

import Link from 'next/link';
import { useRouter } from '@bprogress/next';

const Dashboard = () => {
  const router = useRouter();

  // useEffect(() => {
  //   setTimeout(() => {
  //     router.push('/');
  //   }, 3000);
  // }, [router]);

  return (
    <>
      <Link href="/">Home</Link>

      <button onClick={() => router.push('/dashboard')}>
        Pushing same url have no effect
      </button>

      <button onClick={() => router.forward()}>Forward</button>

      <button className="back" onClick={() => router.back()}>
        Back
      </button>

      <button
        className="back"
        onClick={() => router.back({ showProgress: false })}
      >
        Back without progress bar
      </button>

      <button
        onClick={() =>
          router.push('/dashboard', undefined, {
            disableSameURL: true,
            basePath: '/docs',
          })
        }
      >
        Push with disableSameURL true
      </button>
    </>
  );
};

export default Dashboard;
