import Link from 'next/link';
import { PrismaClient } from "@prisma/client";
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next";

type Query = {
  itemId: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const prisma = new PrismaClient();
  const items = await prisma.item.findMany({ select: { id: true } });

  return {
    paths: items.map(item => `/${item.id}`),
    fallback: false,
  };
}

export const getStaticProps = async (context: GetStaticPropsContext<Query>) => {
  const prisma = new PrismaClient();

  return {
    props: {
      item: await prisma.item.findOne({
        where: {
          id: parseInt(context.params.itemId, 10),
        },
        select: {
          id: true,
          title: true,
          parentId: true,
          content: true,
          children: {
            select: {
              id: true,
              title: true,
              style: true,
            },
          },
        },
      }),
    }
  }
}

export default function Item(props: InferGetStaticPropsType<typeof getStaticProps>) {
  if (props.item.children.length) {
    return (
      <ul>
        {props.item.children.map(item => (
          <li key={item.id}>
            <Link href={`/${item.id}`}>
              <a>
                {item.title}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: props.item.content }} />;
}
