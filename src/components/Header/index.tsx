import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import Link from "next/link";

import styles from "./styles.module.scss";

const Header: React.FC = () => {
  const formatedDate = format(new Date(), "EEEEEE, d MMM", {
    locale: ptBR,
  });

  return (
    <header className={styles.container}>
      <Link href="/">
        <a>
          <img src="/logo.svg" alt="Podcastr" />
        </a>
      </Link>
      <p>O melhor para você ouvir sempre</p>
      <span>{formatedDate}</span>
    </header>
  );
};

export default Header;
