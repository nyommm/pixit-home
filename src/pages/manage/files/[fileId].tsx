import { useRouter } from 'next/router';
import Head from 'next/head';
import { withPageAuthRequired, UserProfile } from '@auth0/nextjs-auth0/client';
import useSWR from 'swr';
import Sidebar from '@/components/manage/Sidebar';
import FileMetaData from '@/components/manage/file/FileMetaData';
import FileContributors from '@/components/manage/file/FileContributors';
import styles from '@/styles/manage.module.scss';

const handler = async (url: string) => {
  let response = await fetch(url, { method: 'GET' });
  response = await response.json();
  return response;
}

function FileInfo({ user }: { user: UserProfile }) {
  const router = useRouter();
  const { fileId } = router.query;
  const { data, error, isLoading } = useSWR(`/api/files/${fileId}`, handler);
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
        {error
          ? <p className={styles['section__empty']}>Failed to fetch file data! Please try again later.</p>
          : (<>
              <FileMetaData data={data?.body?.file} isLoading={isLoading} />
              <FileContributors data={data?.body?.file} isLoading={isLoading} />
            </>)}
      </main>
    </>
  );
}

export default withPageAuthRequired(FileInfo);