import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PinDropIcon from '@mui/icons-material/PinDrop';
import PublicIcon from '@mui/icons-material/Public';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import FlagIcon from '@mui/icons-material/Flag';
import StoreIcon from '@mui/icons-material/Store';

import { Beer as IBeer } from '../../types';
import { fetchData } from './utils';

import styles from './Beer.module.css';

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
            <span><b><StoreIcon/> </b> {beer?.brewery_type}</span>
            <span><b><PinDropIcon/> </b> {beer?.address_1}</span>
            <span><b><LocationCityIcon/></b> {beer?.city}</span>
            <span><b><FlagIcon/> </b> {beer?.country}</span>
            <span><b><LocalPhoneIcon/> </b> <a href={`tel:${beer?.phone}`}>{beer?.phone}</a></span>
            {beer?.website_url && <span><b><PublicIcon/> </b> <a href={beer?.website_url} rel="noreferrer" target="_blank">{beer?.website_url}</a></span>}
          </div>
          <iframe
            title='Brewery Map'
            className={styles.beerMap}
            src={`https://www.google.com/maps/embed/v1/search?q=${beer?.latitude},${beer?.longitude}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}>
          </iframe>
        </main>
      </section>
    </article>
  );
};

export default Beer;
