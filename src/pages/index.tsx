import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { api } from "../services/api";
import { covertDurationToTimeString } from "../utils/convertDurationToTimeString";

import styles from "../styles/home.module.scss";

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
  url: string;
};

type IProps = {
  latestEpisodes: Array<IEpisode>;
  allEpisodes: Array<IEpisode>;
};

const Home: React.FC<IProps> = ({ latestEpisodes, allEpisodes }) => {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map(episode => (
            <li key={episode.id}>
              {/**
               * Otimização de imagem
               *
               * A largura e altura aqui é a medida na qual voce quer carregar a imagem
               * (ela pode ser exibida com um tamanho diferente depois)
               *
               * Nesse caso ela está 3x maior que o que vai ser utilizado de fato
               */}
              <Image
                width={192}
                height={192}
                src={episode.thumbnail}
                alt={episode.title}
                objectFit="cover"
              />

              <div className={styles.episodeDetails}>
                <Link href={`/episodes/${episode.id}`}>
                  <a>{episode.title}</a>
                </Link>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <button type="button">
                <img src="/play-green.svg" alt="Tocar episódio" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {allEpisodes.map(episode => (
              <tr key={episode.id}>
                <td style={{ width: 72 }}>
                  <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />
                </td>
                <td>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                </td>
                <td>{episode.members}</td>
                <td style={{ width: 100 }}>{episode.publishedAt}</td>
                <td>{episode.durationAsString}</td>
                <td>
                  <button type="button">
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

/**
 * Método SSR
 *
 * - É possível acessar através das props do componente
 *
 * - Ao usar, o primeiro carregamento do componente é feito no server
 *
 * - É executado em todas as requests
 */
// export async function getServerSideProps() {
//   const response = await fetch("http://localhost:3333/episodes");
//   const data = await response.json();

//   return { props: { episodes: data } };
// }

/**
 * Método SSG
 *
 * - Só funciona em prod
 */
export const getStaticProps: GetStaticProps = async () => {
  const EIGHT_HOURS = 8 * 60 * 60;

  const response = await api.get<IRawEpisode[]>("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });
  const { data } = response;

  /**
   * A formatação dos dados foi feita antes de criar o componente, pois
   * se ela fosse feita no retorno do componente, sempre que o estado do componente
   * fosse alterado, a formatação iria acontecer novamente de forma desnecessária,
   * podendo diminuir a performance da aplicação.
   */
  const episodes = data.map(episode => {
    const formated: IEpisode = {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      thumbnail: episode.thumbnail,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: episode.file.duration,
      durationAsString: covertDurationToTimeString(episode.file.duration),
      description: episode.description,
      url: episode.file.url,
    };

    return formated;
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: EIGHT_HOURS,
  };
};

export default Home;
