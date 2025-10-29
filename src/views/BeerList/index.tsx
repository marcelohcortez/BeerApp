/**
 * Renders a list of breweries with search and pagination functionality.
 *
 * @returns {JSX.Element} representing the brewery list component.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  CircularProgress,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import SportsBar from "@mui/icons-material/SportsBar";
import SortIcon from "@mui/icons-material/Sort";

import { Beer, Meta } from "../../types";
import { fetchData, fetchMetaData, searchData } from "./utils";
import styles from "./BeerList.module.css";

const BeerList = () => {
  const navigate = useNavigate();
  const [beerList, setBeerList] = useState<Array<Beer>>([]);
  const [searchResult, setSearchResult] = useState<Array<Beer>>([]);
  const [totalBrewers, setTotalBrewers] = useState<Meta>({ total: "" } as Meta);
  const [page, setPage] = useState<number>(1);
  const [listSort, setListSort] = useState<string>("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const perPage = 9;
  const totalPages = Math.round(parseInt(totalBrewers.total) / perPage);

  useEffect(() => {
    // Custom parameters for the fetchData function
    const customListParam = {
      per_page: perPage,
      page: page,
      sort: `type,name:${listSort}`,
    };

    fetchData.bind(this, setBeerList, customListParam)();
  }, [page, listSort]);

  useEffect(() => {
    fetchMetaData.bind(this, setTotalBrewers)();
  }, [beerList]);

  useEffect(() => {
    searchData.bind(this, setSearchResult, searchQuery)();
  }, [searchQuery]);

  const onBeerClick = (id: string) => navigate(`/beer/${id}`);

  const handleChange = (value: number) => {
    setPage(value);
  };

  const handleSort = () => {
    const newSort = listSort === "asc" ? "desc" : "asc";
    setListSort(newSort);
  };

  const handleSearchClick = (option: Beer | null) => {
    if (option) {
      window.location.href = `beer/${option?.id}`;
    }
  };

  const loading = () => {
    return <CircularProgress className={styles.loadingIcon} disableShrink />;
  };

  return (
    <article>
      <section>
        <header className={styles.beerListHeader}>
          <h1 className={styles.beerTitle}>Breweries Listing</h1>
        </header>
        <main>
          <div className={styles.beerListTopBar}>
            {/* This search looks up on the entire API */}
            <Autocomplete
              className={styles.breweriesSearch}
              disablePortal
              id="breweriesSearch"
              options={searchResult}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField {...params} label="Search" />}
              onInputChange={(_, value) => setSearchQuery(value)}
              onChange={(_, option) => handleSearchClick(option)}
            />
            <SortIcon
              fontSize={"large"}
              sx={{ ":hover": { color: orange[600], cursor: "pointer" } }}
              onClick={() => handleSort()}
            />
          </div>
          {beerList.length === 0 && loading()}
          {beerList.length > 0 && (
            <>
              <List className={styles.beerList}>
                {/* verify if it's an array to avoid issues when building the project */}
                {Array.isArray(beerList) &&
                  beerList.map((beer) => (
                    <ListItemButton
                      key={beer.id}
                      onClick={onBeerClick.bind(this, beer.id)}
                      className={styles.beerListItemButton}
                    >
                      <ListItemAvatar>
                        <Avatar className={styles.beerListItemAvatar}>
                          <SportsBar />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primaryTypographyProps={{
                          style: { fontWeight: "bold" },
                        }}
                        primary={beer.name}
                        secondary={`Type: ${beer.brewery_type}`}
                      />
                    </ListItemButton>
                  ))}
              </List>
              <Stack className={styles.beerListPaginationContainer} spacing={2}>
                <Pagination
                  color={"primary"}
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => handleChange(value)}
                  className={styles.beerListPagination}
                />
              </Stack>
            </>
          )}
        </main>
      </section>
    </article>
  );
};

export default BeerList;
