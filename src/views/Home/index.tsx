/**
 * Represents the Home component.
 * This component displays a list of breweries and allows the user to filter and save their * favorite ones.
 *
 * @returns {JSX.Element} representing the home component.
 */
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Checkbox,
  Paper,
  TextField,
  Link,
  CircularProgress,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

import { fetchData } from "./utils";
import { Beer } from "../../types";

import styles from "./Home.module.css";

const Home = () => {
  const [beerList, setBeerList] = useState<Array<Beer>>([]);
  const [savedList, setSavedList] = useState<Array<Beer>>([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData.bind(this, setBeerList)();

    const getBeerFavorites = window.localStorage.getItem("BEER_FAVORITES");

    if (getBeerFavorites) {
      setSavedList(JSON.parse(getBeerFavorites));
    }
  }, []);

  // Use useEffect to manage loading state when dependencies change
  useEffect(() => {
    if (Array.isArray(beerList) && beerList.length > 0) {
      setLoading(true);

      // Use a small timeout to show loading state briefly
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [beerList, filterQuery]);

  // Use useMemo to avoid recalculating if dependencies haven't changed
  const filteredItems = useMemo(() => {
    // Only filter if we have data and not loading
    return Array.isArray(beerList)
      ? beerList.filter((beerListItem) =>
          beerListItem.name.toLowerCase().includes(filterQuery.toLowerCase())
        )
      : [];
  }, [beerList, filterQuery]);

  const handleReloadList = () => {
    // clear query data and fetch random breweries again
    setFilterQuery("");
    fetchData.bind(this, setBeerList)();
  };

  const handleClickFavorite = (beer: Beer): void => {
    // check if clicked item is already in the fav list or not
    if (savedList.includes(beer)) {
      // save to the localStorage before updating the state
      // that way we avoid missing items in the localStorage
      setSavedList((prev) => {
        const updatedList = prev.filter((obj) => obj.id !== beer.id);
        window.localStorage.setItem(
          "BEER_FAVORITES",
          JSON.stringify(updatedList)
        );
        return updatedList;
      });
    } else {
      setSavedList((prev) => {
        const updatedList = [...prev, beer];
        window.localStorage.setItem(
          "BEER_FAVORITES",
          JSON.stringify(updatedList)
        );
        return updatedList;
      });
    }
  };

  const handleClearFavorites = (): void => {
    setSavedList([]);
    window.localStorage.setItem("BEER_FAVORITES", JSON.stringify([]));
  };

  const isFavorite = (beer: Beer): boolean =>
    savedList.includes(beer) ? true : false;

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
                {/* The search in the Breweries List page is handled differently */}
                <TextField
                  className={styles.searchField}
                  label="Filter..."
                  variant="outlined"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                />
                <Button
                  className={styles.buttonReload}
                  variant="contained"
                  onClick={handleReloadList}
                >
                  Reload list
                </Button>
              </div>
              {filteredItems.length === 0 && !loading && (
                <p className={styles.noItemsFound}>No items found</p>
              )}
              {loading && (
                <CircularProgress
                  className={styles.loadingIcon}
                  disableShrink
                />
              )}
              {filteredItems.length > 0 && (
                <ul className={styles.list}>
                  {filteredItems.map((beer, index) => (
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
                </ul>
              )}
            </div>
          </Paper>

          <Paper>
            <div className={styles.listContainer}>
              <div className={styles.listHeader}>
                <h3>Saved items</h3>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleClearFavorites}
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
              </ul>
              {!savedList.length && <p>No saved items</p>}
            </div>
          </Paper>
        </main>
      </section>
    </article>
  );
};

export default Home;
