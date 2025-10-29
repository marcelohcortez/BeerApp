/**
 * Footer component.
 * Renders a footer with copyright information.
 */
import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.container}>
      <div className={styles.inner}>
        All rights reserved &#169; {currentYear}{" "}
      </div>
    </footer>
  );
};

export default Footer;
