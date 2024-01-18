import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { orange, blue } from '@mui/material/colors';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import SportsBar from '@mui/icons-material/SportsBar';
import SortIcon from '@mui/icons-material/Sort';

import { Beer, Meta } from '../../types';
import { fetchData, fetchMetaData } from './utils';
import styles from './BeerList.module.css';


const BeerList = () => {
  const navigate = useNavigate();
  const [beerList, setBeerList] = useState<Array<Beer>>([]);
  const [perPage, setPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>();
  const [totalBrewers, setTotalBrewers] = useState<Meta>();
  const [listSort, setListSort] = useState<string>("asc")

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

  const onBeerClick = (id: string) => navigate(`/beer/${id}`);

  const handleChange = (_: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }

  const handleSort = () => {
    if (listSort === "asc") {
      return setListSort("desc")
    }

    return setListSort("asc")
  }

  return (
    <article>
      <section>
        <header className={styles.beerListHeader}>
          <h1>Brewers Listing</h1>
        </header>
        <main>
          <div className={styles.sortingIcon}>
            <SortIcon 
              fontSize={'large'}
              sx={{ ":hover": {color: orange[600], cursor: 'pointer'} }}
              onClick={() => handleSort()}
            />
          </div>
          <List>
            {beerList.map((beer) => (
              <ListItemButton key={beer.id} 
                onClick={onBeerClick.bind(this, beer.id)}
                sx={{ ":hover": {bgcolor: orange[600]} }}
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
              onChange={handleChange}
              className={styles.beerListPagination}
            />
          </Stack>
        </main>
      </section>
    </article>
  );
};

export default BeerList;
