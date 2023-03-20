import Head from 'next/head';
import { withPageAuthRequired, UserProfile } from '@auth0/nextjs-auth0/client';
import styles from '@/styles/manage.module.scss';

import Sidebar from '@/components/manage/Sidebar';
import CreateNew from '@/components/manage/CreateNew';
import AllProjects from '@/components/manage/AllProjects';

function Manage({ user }: { user: UserProfile }) {
  return (
    <>
      <Head>
        <title>Pixit! - Your Projects</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header>
        <Sidebar user={user} />
      </header>
      <main className={styles['main-content']}>
        <CreateNew />
        <AllProjects user={user} />
      </main>
    </>
  );
}

export default withPageAuthRequired(Manage);