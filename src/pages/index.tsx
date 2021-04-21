const EIGHT_HOURS = 8 * 60 * 60;

interface IProps {
  episodes: Array<any>;
}

const Home: React.FC<IProps> = props => {
  return (
    <>
      <h1>Index!!</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </>
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
export async function getStaticProps() {
  const response = await fetch("http://localhost:3333/episodes");
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: EIGHT_HOURS,
  };
}

export default Home;
