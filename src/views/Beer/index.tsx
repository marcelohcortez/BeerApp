/**
 * Renders the selected brewery info.
 *
 * @returns {JSX.Element} representing the brewery component.
 */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import PinDropIcon from "@mui/icons-material/PinDrop";
import PublicIcon from "@mui/icons-material/Public";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import FlagIcon from "@mui/icons-material/Flag";
import StoreIcon from "@mui/icons-material/Store";

import { Beer as IBeer } from "../../types";
import { fetchData } from "./utils";
import { capitalize, cleanPhoneNumber } from "../../utils/string";

import styles from "./Beer.module.css";

const Beer = () => {
  const { id } = useParams();
  const [beer, setBeer] = useState<IBeer>();

  // eslint-disable-next-line
  useEffect(fetchData.bind(this, setBeer, id), [id]);

  return (
    <article>
      <section className={styles.beerSection}>
        <header className={styles.beerHeader}>
          <h1 className={styles.beerTitle}>{beer?.name}</h1>
        </header>
        <main>
          <div className={styles.beerDetails}>
            <span className={styles.beerDetail}>
              <StoreIcon />
              <p>
                <b>Type:</b> {capitalize(beer?.brewery_type)}
              </p>
            </span>
            <span className={styles.beerDetail}>
              <PinDropIcon />
              <p>{beer?.address_1}</p>
            </span>
            <span className={styles.beerDetail}>
              <LocationCityIcon />
              <p>{beer?.city}</p>
            </span>
            <span className={styles.beerDetail}>
              <FlagIcon />
              <p>{beer?.country}</p>
            </span>
            <span className={styles.beerDetail}>
              <LocalPhoneIcon />
              <p>
                <a href={`tel:+${cleanPhoneNumber(beer?.phone)}`}>
                  {beer?.phone}
                </a>
              </p>
            </span>
            {beer?.website_url && (
              <span className={styles.beerDetail}>
                <PublicIcon />
                <p>
                  <a href={beer?.website_url} rel="noreferrer" target="_blank">
                    Click to visit
                  </a>
                </p>
              </span>
            )}
          </div>
          <iframe
            title="Brewery Map"
            className={styles.beerMap}
            src={`https://www.google.com/maps/embed/v1/search?q=${beer?.latitude},${beer?.longitude}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
          ></iframe>
        </main>
      </section>
    </article>
  );
};

export default Beer;
