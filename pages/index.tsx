import Head from 'next/head'
import Link from 'next/link'
import { InferGetStaticPropsType } from 'next';
import { PrismaClient } from '@prisma/client';

export const getStaticProps = async () => {
  const prisma = new PrismaClient();

  return {
    props: {
      institution: await prisma.institution.findFirst({
        include: {
          items: {
            where: {
              parentId: null,
            },
          },
        },
      }),
    },
  };
};

export default function Home(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <Head>
        <title>Home - {props.institution.name}</title>
      </Head>
      <ul>
        {props.institution.items.map(item => (
          <li key={item.id}>
            <Link href={`/${item.id}`}>
              <a>
                {item.title}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
