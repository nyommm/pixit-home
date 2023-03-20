import { useRouter } from 'next/router';
import Head from 'next/head';
import { withPageAuthRequired, UserProfile } from '@auth0/nextjs-auth0/client';
import useSWR from 'swr';
import Sidebar from '@/components/manage/Sidebar';
import ProjectMetaData from '@/components/manage/project/ProjectMetaData';
import ProjectCollaborators from '@/components/manage/project/ProjectCollaborators';
import ProjectFiles from '@/components/manage/project/ProjectFiles';
import styles from '@/styles/manage.module.scss';

const handler = async (url: string) => {
  let response = await fetch(url, { method: 'GET' });
  response = await response.json();
  return response;
}

function FileInfo({ user }: { user: UserProfile }) {
  const router = useRouter();
  const { projectId } = router.query;
  const { data, error, isLoading } = useSWR(`/api/projects/${projectId}`, handler);
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
        {error
          ? <p className={styles['section__empty']}>Failed to fetch project data! Please try again later.</p>
          : (<>
              <ProjectMetaData data={data?.body?.project} isLoading={isLoading} />
              <ProjectFiles data={data?.body?.project} isLoading={isLoading} />
              <ProjectCollaborators data={data?.body?.project} isLoading={isLoading} />
            </>)}
      </main>
    </>
  );
}

export default withPageAuthRequired(FileInfo);