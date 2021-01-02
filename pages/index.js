import Head from 'next/head';
import styles from '../styles/Home.module.css';
import App from '../src/app';

const Home = () => (
    <div>
        <Head>
            <meta charset="utf-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            <meta name="theme-color" content="#000000" />
            <meta name="description" content="Video to GIF converter" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link
                href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800&display=swap"
                rel="stylesheet"
            />
            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/icons/apple-touch-icon.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/icons/favicon-32x32.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/icons/favicon-16x16.png"
            />
            <link rel="manifest" href="/icons/site.webmanifest" />
            <link
                rel="mask-icon"
                href="/icons/safari-pinned-tab.svg"
                color="#5bbad5"
            />
            <link rel="shortcut icon" href="/icons/favicon.ico" />
            <meta name="msapplication-TileColor" content="#da532c" />
            <meta
                name="msapplication-config"
                content="/icons/browserconfig.xml"
            />
            <meta name="theme-color" content="#ffffff" />
            <title>Vid2GIF</title>
        </Head>
        <main>
            <App />
        </main>
    </div>
);
export default Home;
