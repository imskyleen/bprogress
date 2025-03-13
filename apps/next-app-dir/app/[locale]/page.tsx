"use client";

import { Link } from "@/i18n/navigation";
import { useProgress, useRouter } from "@bprogress/next";
import { useRouter as useNextIntlRouter } from "@/i18n/navigation";

export default function Home() {
  const router = useRouter({
    customRouter: useNextIntlRouter,
  });
  const nextIntlRouter = useNextIntlRouter();
  const { start, stop, pause, resume, getOptions, setOptions } = useProgress();

  return (
    <>
      <h1 className="text-4xl">BProgress</h1>

      <button
        className="default"
        onClick={() => console.log("getOptions", getOptions())}
      >
        getOptions
      </button>
      <button
        className="default"
        onClick={() =>
          setOptions((prev) => ({ ...prev, showSpinner: !prev.showSpinner }))
        }
      >
        toggle showSpinner
      </button>

      <button className="default" onClick={() => start()}>
        Start progress
      </button>
      <button className="default" onClick={() => stop()}>
        Stop progress
      </button>
      <button className="default" onClick={pause}>
        Pause progress
      </button>
      <button className="default" onClick={resume}>
        Resume progress
      </button>

      <button onClick={() => nextIntlRouter.push("/dashboard")}>
        Dashboard
      </button>

      <a href="file.txt" download>
        Download
      </a>
      <Link href="/">Same route</Link>
      <Link href="/?test=param">Sallow</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/load">Load</Link>
      <Link
        href="/dashboard"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span>Dashboard</span>

        <span
          style={{
            marginTop: 15,
          }}
          onClick={(e) => e.preventDefault()}
          data-prevent-progress={true}
        >
          e.preventDefault()
        </span>
      </Link>
      <Link href="#test">Link with href</Link>
      <Link href="/dashboard" data-disable-progress={true}>
        Link with bprogress disabled
      </Link>
      <button onClick={() => router.back()}>Back</button>
      <button onClick={() => router.forward()}>Forward</button>
      <button
        onClick={() =>
          router.push("/", {
            disableSameURL: false,
            i18nPath: true,
          })
        }
      >
        Push disableSameURL false
      </button>
      <button
        onClick={() =>
          router.push("/dashboard", {
            locale: "en",
            i18nPath: true,
          })
        }
      >
        Push Dashboard
      </button>
      <button onClick={() => router.refresh()}>Refresh</button>
      <button
        onClick={() =>
          router.push("/", {
            disableSameURL: true,
            i18nPath: true,
          })
        }
      >
        Push with disableSameURL true
      </button>
      <button
        className="replace"
        onClick={() => router.replace("/dashboard", { i18nPath: true })}
      >
        Replace Dashboard
      </button>
      <button onClick={() => router.push("/?test=param", { i18nPath: true })}>
        Push with param
      </button>
      <button
        onClick={() =>
          router.push("/dashboard", {
            showProgress: false,
            i18nPath: true,
          })
        }
      >
        Push Dashboard without progress bar
      </button>
      <Link
        className="a"
        href="https://www.npmjs.com/package/@bprogress/next"
        target="_blank"
        rel="noopener noreferrer"
      >
        Link with target=`&quot;`_blank`&quot;` not affected
      </Link>
      <Link
        className="a"
        href="mailto:john.doe@exemple.com"
        rel="noopener noreferrer"
      >
        Link with mailto not affected
      </Link>
      <Link className="a" href="tel:0000000000" rel="noopener noreferrer">
        Link with tel not affected
      </Link>
      <a
        className="a"
        href="blob:http://localhost:3000/123456789"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        Link with blob not affected
      </a>
      <a className="a">Link without href won&apos;t throw error</a>

      <p
        style={{
          marginTop: 10,
          marginBottom: 5,
        }}
      >
        In a svg element :
      </p>
      <svg>
        <Link href="/dashboard">
          <circle cx={30} cy={30} r={30} />
        </Link>
      </svg>
    </>
  );
}
