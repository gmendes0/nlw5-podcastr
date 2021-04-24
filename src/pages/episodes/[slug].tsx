import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { api } from "../../services/api";
import { covertDurationToTimeString } from "../../utils/convertDurationToTimeString";

import styles from "../../styles/episode.module.scss";
import Link from "next/link";
import Head from "next/head";
import { usePlayer } from "../../contexts/PlayerContext";

type IRawEpisode = {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  file: {
    url: string;
    duration: number;
    type: string;
  };
};

type IEpisode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
};

type IProps = {
  episode: IEpisode;
};

const Episode: React.FC<IProps> = ({ episode }) => {
  /**
   * Fallback true: essa verificação faz com que seja exibido algo enquanto as
   * informações dos parametros (no caso "episode") não foram carregados
   */
  //  const router = useRouter();
  // if (router.isFallback) {
  //   return <p>Carregando...</p>;
  // }

  const { play } = usePlayer();

  return (
    <>
      <Head>
        <title>{episode.title} - Podcastr</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.episode}>
          <div className={styles.thumbnailContainer}>
            <Link href="/">
              <button type="button">
                <img src="/arrow-left.svg" alt="Voltar" />
              </button>
            </Link>

            <Image
              width={700}
              height={160}
              src={episode.thumbnail}
              objectFit="cover"
            />

            <button type="button" onClick={() => play(episode)}>
              <img src="/play.svg" alt="Tocar episódio" />
            </button>
          </div>

          <header>
            <h1>{episode.title}</h1>
            <span>{episode.members}</span>
            <span>{episode.publishedAt}</span>
            <span>{episode.durationAsString}</span>
          </header>

          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: episode.description }}
          />
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get<IRawEpisode[]>("episodes", {
    params: {
      _limit: 2,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const paths = data.map(episode => ({ params: { slug: episode.id } }));

  return {
    paths, // páginas que serão geradas no momento do build
    /**
     * Fallback false: retorna 404 para os paths que não foram passados acima
     * Fallback true: executa o que está no getStaticProps no lado do client
     * Fallback blocking: executa o que está no getStaticProps no lado do server
     */
    fallback: "blocking", // comportamento das páginas que não foram geradas no momento do build
  };
};

export const getStaticProps: GetStaticProps = async ctx => {
  const ONE_DAY = 60 * 60 * 24;

  const { slug } = ctx.params;
  const { data } = await api.get<IRawEpisode>(`episodes/${slug}`);

  const episode: IEpisode = {
    id: data.id,
    title: data.title,
    members: data.members,
    thumbnail: data.thumbnail,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    duration: data.file.duration,
    durationAsString: covertDurationToTimeString(data.file.duration),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: { episode },
    revalidate: ONE_DAY,
  };
};

export default Episode;
