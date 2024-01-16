import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Beer, Meta } from '../../types';
import { fetchData, fetchMetaData } from './utils';

import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import SportsBar from '@mui/icons-material/SportsBar';

const BeerList = () => {
  const navigate = useNavigate();
  const [beerList, setBeerList] = useState<Array<Beer>>([]);
  const [perPage, setPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>();
  const [totalBrewers, setTotalBrewers] = useState<Meta>();

  useEffect( () => { 
    // Custom parameters for the fetchData function
    const customParam = {per_page: perPage, page: setPage};

    fetchData(setBeerList, customParam);
    fetchMetaData(setTotalBrewers);

    if (totalBrewers) {
      setTotalPages(Math.round(parseInt(totalBrewers?.total) / perPage))
    }
  }, [page, perPage, totalBrewers]);

  const onBeerClick = (id: string) => navigate(`/beer/${id}`);

  const handleChange = (_: ChangeEvent<unknown>, value: number) => {
    setPage(value) 
  }

  return (
    <article>
      <section>
        <header>
          <h1>Brewers</h1>
        </header>
        <main>
            <List>
            {beerList.map((beer) => (
              <ListItemButton key={beer.id} onClick={onBeerClick.bind(this, beer.id)}>
                <ListItemAvatar>
                  <Avatar>
                    <SportsBar />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={beer.name} secondary={beer.brewery_type} />
              </ListItemButton>
            ))}
          </List>
          <Stack spacing={2}>
            <Pagination count={totalPages} 
              color="primary"
              page={page}
              onChange={handleChange}
            />
          </Stack>
        </main>
      </section>
    </article>
  );
};

export default BeerList;
