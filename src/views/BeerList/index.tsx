import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { orange } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import SportsBar from '@mui/icons-material/SportsBar';
import SortIcon from '@mui/icons-material/Sort';

import { Beer, Meta } from '../../types';
import { fetchData, fetchMetaData, searchData } from './utils';
import styles from './BeerList.module.css';

const BeerList = () => {
  const navigate = useNavigate();
  const [beerList, setBeerList] = useState<Array<Beer>>([]);
  const [searchResult, setSearchResult] = useState<Array<Beer>>([]);
  const [totalBrewers, setTotalBrewers] = useState<Meta>();
  const [perPage,] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>();
  const [listSort, setListSort] = useState<string>("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect( () => { 
    // Custom parameters for the fetchData function
    const customListParam = {per_page: perPage, page: page, sort: `type,name:${listSort}`};

    fetchData.bind(this, setBeerList, customListParam)();   
  }, [page, perPage, listSort]);

  useEffect( () => { 
    fetchMetaData.bind(this, setTotalBrewers)();
    if (totalBrewers) {
      setTotalPages(Math.round(parseInt(totalBrewers?.total) / perPage));
    }
     
  }, [beerList]);

  useEffect( () => { 
    searchData.bind(this, setSearchResult, searchQuery)();     
  }, [searchQuery]);

  const onBeerClick = (id: string) => navigate(`/beer/${id}`);

  const handleChange = (value: number) => {
    setPage(value);
  }

  const handleSort = () => {
    // done like this, but it could be done in a simpler way
    // taking 'true' as if it was 'asc and 'false' as 'desc'
    // that way this function wouldn't need to exist
    if (listSort === "asc") {
      return setListSort("desc");
    }

    return setListSort("asc");
  }

  const handleSearchClick = (option: Beer | null) => {
    if(option) {
      window.location.href = `beer/${option?.id}`;
    }
  }

  return (
    <article>
      <section>
        <header className={styles.beerListHeader}>
          <h1 className={styles.beerTitle}>Brewers Listing</h1>
        </header>
        <main>
          <div className={styles.beerListTopBar}>
            {/* This search looks up on the entire API */}
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={searchResult}
              getOptionLabel={option => option.name}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Search" />}
              onInputChange={(_, value) => setSearchQuery(value)}
              onChange={(_, option) => handleSearchClick(option)}
            />
            <SortIcon 
              fontSize={'large'}
              sx={{ ":hover": {color: orange[600], cursor: 'pointer'} }}
              onClick={() => handleSort()}
            />
          </div>
          <List>
            {beerList.map((beer) => (
              <ListItemButton 
                key={beer.id} 
                onClick={onBeerClick.bind(this, beer.id)}
                className={styles.beerListItemButton}
              >
                <ListItemAvatar>
                  <Avatar>
                    <SportsBar />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primaryTypographyProps={{ style: {fontWeight: "bold"} }} 
                  primary={beer.name} 
                  secondary={beer.brewery_type} 
                />
              </ListItemButton>
            ))}
          </List>
          <Stack spacing={2}>
            <Pagination
              color={"primary"}
              count={totalPages} 
              page={page}
              onChange={(_, value) => handleChange(value)}
              className={styles.beerListPagination}
            />
          </Stack>
        </main>
      </section>
    </article>
  );
};

export default BeerList;
