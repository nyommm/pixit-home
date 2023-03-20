import Head from 'next/head';
import { withPageAuthRequired, UserProfile } from '@auth0/nextjs-auth0/client';
import styles from '@/styles/manage.module.scss';

import Sidebar from '@/components/manage/Sidebar';
import CreateNew from '@/components/manage/CreateNew';
import AllFiles from '@/components/manage/AllFiles';

function Manage({ user }: { user: UserProfile }) {
  return (
    <>
      <Head>
        <title>Pixit! - Your Files</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header>
        <Sidebar user={user} />
      </header>
      <main className={styles['main-content']}>
        <CreateNew />
        <AllFiles user={user} />
      </main>
    </>
  );
}

export default withPageAuthRequired(Manage);