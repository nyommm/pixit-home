import Head from 'next/head';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import styles from '@/styles/home.module.scss';

export default function Home() {
  const { user } = useUser();
  const navItems = (
    <>
      {user ? null : <Link className={styles['navbar__links__link']} href="#">Try The Editor</Link>}
      {user ? <a className={styles['navbar__links__link']} href="api/auth/logout">Logout</a> : null}
      {user ? <Link className={styles['navbar__links__avatar']} href="manage">{user.nickname[0].toUpperCase()}</Link> : null}
      {user ? null : <a className={styles['navbar__links__link']} href="api/auth/login">Login&#47;Register</a>}
    </>
  );
  return (
    <>
      <Head>
        <title>Pixit! - Free, Online Pixel Art Editor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header className={styles['navbar']}>
        <div className={styles['navbar__logo']}>Pixit!</div>
        <div className={styles['navbar__links']}>
          {navItems}
        </div>
      </header>
      <main className={styles['main-content']}>
        <section className={styles['description-section']}>
          <h1 className={styles['description-section__h1']}>Pixit!</h1>
          <h3 className={styles['description-section__h3']}>
            A free, online pixel art editor built with React. 
            Pixit! has all the tools and features you need to create 
            beautiful pixel art directly on your favourite web browser.
          </h3>
        </section>
        <section className={styles['get-started-section']}>
          <a className={styles['get-started-section__a']} href="manage">Get Started</a>
          <h3 className={styles['get-started-section__h3']}>
            Can&apos;t wait to try Pixit! click <a className={styles['get-started-section__h3__a']} href="#">here</a>.
          </h3>
        </section>
      </main>
    </>
  );
}
