/**
 * Footer component.
 * Renders a footer with copyright information.
 */
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.container}>
      <div className={styles.inner}>All rights reserved &#169; 2024 </div>
    </footer>
  );
};

export default Footer;