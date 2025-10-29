import React, { memo } from "react";
import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import SportsBar from "@mui/icons-material/SportsBar";
import { Beer } from "../../types";
import styles from "../../views/BeerList/BeerList.module.css";

interface BeerListItemProps {
  beer: Beer;
  onClick: (id: string) => void;
}

const BeerListItem: React.FC<BeerListItemProps> = memo(({ beer, onClick }) => {
  const handleClick = () => onClick(beer.id);

  return (
    <ListItemButton
      onClick={handleClick}
      className={styles.beerListItemButton}
      role="listitem"
      aria-label={`View details for ${beer.name}, ${beer.brewery_type} brewery`}
      component="li"
    >
      <ListItemAvatar>
        <Avatar className={styles.beerListItemAvatar} aria-hidden="true">
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
  );
});

BeerListItem.displayName = "BeerListItem";

export default BeerListItem;
