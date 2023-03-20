import Head from 'next/head';
import { withPageAuthRequired, UserProfile } from '@auth0/nextjs-auth0/client';
import useSWR from 'swr';
import styles from '@/styles/manage.module.scss';

import Sidebar from '@/components/manage/Sidebar';
import CreateNew from '@/components/manage/CreateNew';
import RecentFiles from '@/components/manage/RecentFiles';

const handler = async (url: string) => {
  let response = await fetch(url, { method: 'POST' });
  response = await response.json();
  return response;
}

function Manage({ user }: { user: UserProfile }) {
  const { data, error } = useSWR(`/api/user/add`, handler);
  if (error) console.log(`failed to add user ${user.nickname}:\n${error.message}`);
  return (
    <>
      <Head>
        <title>Pixit! - Recent Files</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header>
        <Sidebar user={user} />
      </header>
      <main className={styles['main-content']}>
        <CreateNew />
        <RecentFiles user={user} />
      </main>
    </>
  );
}

export default withPageAuthRequired(Manage);