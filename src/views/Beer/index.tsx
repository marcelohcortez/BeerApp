import { useEffect, useState } from 'react';
import { Beer as IBeer } from '../../types';
import { fetchData } from './utils';
import { useParams } from 'react-router-dom';

import bgBeer from '../../images/bgBeer.jpg';
import styles from './Beer.module.css';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PinDropIcon from '@mui/icons-material/PinDrop';
import PublicIcon from '@mui/icons-material/Public';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import FlagIcon from '@mui/icons-material/Flag';
import StoreIcon from '@mui/icons-material/Store';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const Beer = () => {
  const { id } = useParams();
  const [beer, setBeer] = useState<IBeer>();

  // eslint-disable-next-line
  useEffect(fetchData.bind(this, setBeer, id), [id]);
  console.log(beer)

  return (
    
    <article>
      <section className={styles.beerSection}>
        <header style={{backgroundImage: `url(${bgBeer})`}} className={styles.beerHeader}>
          <h1 className={styles.beerTitle}>{beer?.name}</h1>
          <span className={styles.beerAddFavorite}><FavoriteBorderIcon/></span>
        </header>
        <main>         
          <div className={styles.beerDetails}>
            <span><b><StoreIcon/> </b> {beer?.brewery_type}</span>
            <span><b><PinDropIcon/> </b> {beer?.address_1}</span>
            <span><b><LocationCityIcon/></b> {beer?.city}</span>
            <span><b><FlagIcon/> </b> {beer?.country}</span>
            <span><b><LocalPhoneIcon/> </b> <a href={`tel:${beer?.phone}`}>{beer?.phone}</a></span>
            <span><b><PublicIcon/> </b> <a href={beer?.website_url} rel="noreferrer" target="_blank">{beer?.website_url}</a></span>
          </div>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${beer?.latitude},${beer?.longitude}`}
            rel="noreferrer"
            target="_blank"
            className={styles.beerMap}
          >
            Check on map
          </a>
        </main>
      </section>
    </article>
  );
};

export default Beer;
