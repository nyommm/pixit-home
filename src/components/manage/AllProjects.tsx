import { UserProfile } from '@auth0/nextjs-auth0/client';
import useSWR from 'swr';
import styles from '@/styles/manage.module.scss';
import ListItem from './shared/ListItem';
import ListHeader from './shared/ListHeader';

const handler = async (url: string) => {
  let response = await fetch(url, { method: 'GET' });
  response = await response.json();
  return response;
}

export default function AllProjects({ user }: { user: UserProfile }) {
  const { data, error, isLoading } = useSWR(`/api/projects/allProjects`, handler);
  let jsx;
  if (isLoading) {
    jsx = <p className={styles['section__empty']}>{`Loading projects for ${user.nickname}...`}</p>;
  }
  else if (error) {
    jsx = <p className={styles['section__empty']}>{`Failed to fetch projects for ${user.nickname}! Try again later.`}</p>;
  }
  else if (data?.body && data.body.projects && data.body.projects.length > 0) {
    jsx = (
      <ul className={styles['list-container']}>
        <ListHeader names={['Project Name', 'Owner', 'Last Modified On', 'Created Date']}/>
        {data.body.projects.map((project) => {
          const updatedDate = new Date(project.updatedDate);
          const createdDate = new Date(project.createdDate);
          let links = [{ url: `/manage/projects/${project.projectId}`, title: project.projectName }];
          let fields = [
            `${project.owner.userName}`,
            `${updatedDate.toLocaleDateString()} ${updatedDate.toLocaleTimeString()}`,
            `${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`,
          ];
          return <ListItem key={project.projectId} links={links} fields={fields} />;
        })}
      </ul>
    );
  } else {
    jsx = <p className={styles['section__empty']}>So empty! Create your first project using the button above.</p>;
  }
  return (
    <section className={styles['section']}>
      <h1 className={styles['section__title']}>All Projects</h1>
      {jsx}
    </section>
  );
}