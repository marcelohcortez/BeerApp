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
    <article role="main" aria-labelledby="brewery-name">
      <section className={styles.beerSection}>
        <header className={styles.beerHeader}>
          <h1 id="brewery-name" className={styles.beerTitle}>
            {beer?.name}
          </h1>
        </header>
        <main>
          <section className={styles.beerDetails} aria-label="Brewery details">
            <div className={styles.beerDetail}>
              <StoreIcon aria-hidden="true" />
              <p>
                <span className="sr-only">Brewery type: </span>
                <b>Type:</b> {capitalize(beer?.brewery_type)}
              </p>
            </div>
            <div className={styles.beerDetail}>
              <PinDropIcon aria-hidden="true" />
              <p>
                <span className="sr-only">Address: </span>
                {beer?.address_1}
              </p>
            </div>
            <div className={styles.beerDetail}>
              <LocationCityIcon aria-hidden="true" />
              <p>
                <span className="sr-only">City: </span>
                {beer?.city}
              </p>
            </div>
            <div className={styles.beerDetail}>
              <FlagIcon aria-hidden="true" />
              <p>
                <span className="sr-only">Country: </span>
                {beer?.country}
              </p>
            </div>
            <div className={styles.beerDetail}>
              <LocalPhoneIcon aria-hidden="true" />
              <p>
                <span className="sr-only">Phone number: </span>
                <a
                  href={`tel:+${cleanPhoneNumber(beer?.phone)}`}
                  aria-label={`Call ${beer?.name} at ${beer?.phone}`}
                >
                  {beer?.phone}
                </a>
              </p>
            </div>
            {beer?.website_url && (
              <div className={styles.beerDetail}>
                <PublicIcon aria-hidden="true" />
                <p>
                  <span className="sr-only">Website: </span>
                  <a
                    href={beer?.website_url}
                    rel="noreferrer"
                    target="_blank"
                    aria-label={`Visit ${beer?.name} website (opens in new tab)`}
                  >
                    Click to visit
                  </a>
                </p>
              </div>
            )}
          </section>
          <iframe
            title={`Map showing location of ${beer?.name}`}
            className={styles.beerMap}
            src={`https://www.google.com/maps/embed/v1/search?q=${beer?.latitude},${beer?.longitude}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
            aria-label={`Interactive map showing the location of ${beer?.name}`}
          ></iframe>
        </main>
      </section>
    </article>
  );
};

export default Beer;
