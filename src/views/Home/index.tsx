import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Checkbox, Paper, TextField, Link } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

import { fetchData } from './utils';
import { Beer } from '../../types';

import styles from './Home.module.css';

const Home = () => {
  const [beerList, setBeerList] = useState<Array<Beer>>([]);
  const [savedList, setSavedList] = useState<Array<Beer>>([]);
  const [filterQuery, setFilterQuery] = useState("");

  // eslint-disable-next-line
  useEffect(fetchData.bind(this, setBeerList), [])

  useEffect( () => {
    const getBeerFavorites: string | null = window.localStorage.getItem('BEER_FAVORITES')
    
    // populate the savedList with the content from localStorage if any
    if (getBeerFavorites) {
      setSavedList(JSON.parse(getBeerFavorites))
    }
  }, [beerList])

  // use useMemo to reduce performance cost
  const filteredItems = useMemo(() => {
    // filter the beerList and return all items that match the query
    return beerList.filter(beerListItem => beerListItem.name.toLowerCase().includes(filterQuery.toLowerCase()))
  }, [beerList, filterQuery])

  const handleReloadList = () => {
    // clear query data and fetch random breweries again
    setFilterQuery("")
    fetchData.bind(this, setBeerList)()
  }

  const handleClickFavorite = (beer: Beer): void => {
    // check if clicked item is already in the fav list
    if (!savedList.includes(beer)) {
      setSavedList([...savedList, beer])
    } else {
      setSavedList(savedList.filter((obj) => ( obj.id !== beer.id )))
    }
    // update the saved items in the localStorage
    window.localStorage.setItem('BEER_FAVORITES', JSON.stringify(savedList));
  }

  const handleClearFavorites = () => {
    setSavedList([])
    window.localStorage.setItem("BEER_FAVORITES", "");
  }

  const isFavorite = (beer: Beer) =>{
    if (savedList.includes(beer)) {
      return true
    }
    
    return false
  }

  return (
    <article>
      <section>
        <header className={styles.homeHeader}>
          <h1 className={styles.homeTitle}>You've Got Questions.</h1>
          <h2 className={styles.homeSubTitle}>We've Got Beer.</h2>
        </header>
        <main>
          <Paper>
            <div className={styles.listContainer}>
              <div className={styles.listHeader}>
                {/* This search is limited to filtering the items already displayed in the random list */}
                <TextField 
                  label='Filter...'
                  variant='outlined'
                  value={filterQuery}
                  onChange={e => setFilterQuery(e.target.value)}
                />
                <Button variant='contained' onClick={() => handleReloadList()}>Reload list</Button>
              </div>
              <ul className={styles.list}>
                {filteredItems.map((beer, index) => (
                  <li key={index.toString()}>
                    <Checkbox 
                      checked={isFavorite(beer)}
                      icon={<FavoriteBorder />} 
                      checkedIcon={<Favorite />}
                      onChange={() => handleClickFavorite( beer)}
                    />
                    <Link component={RouterLink} to={`/beer/${beer.id}`}>
                      {beer.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Paper>

          <Paper>
            <div className={styles.listContainer}>
              <div className={styles.listHeader}>
                <h3>Saved items</h3>
                <Button 
                  variant='contained'
                  size='small'
                  onClick={() => handleClearFavorites()}
                >
                  Remove all items
                </Button>
              </div>
              <ul className={styles.list}>
                {savedList.map((beer, index) => (
                  <li key={index.toString()}>
                    <Checkbox 
                      checked={isFavorite(beer)}
                      icon={<FavoriteBorder />} 
                      checkedIcon={<Favorite />}
                      onChange={() => handleClickFavorite(beer)}
                    />
                    <Link component={RouterLink} to={`/beer/${beer.id}`}>
                      {beer.name}
                    </Link>
                  </li>
                ))}
                {!savedList.length && <p>No saved items</p>}
              </ul>
            </div>
          </Paper>
        </main>
      </section>
    </article>
  );
};

export default Home;
