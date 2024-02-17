import React from "react";
import styles from "../styles/search.module.css";

const Search = ({ handleSearch }) => {
  return (
    <div className={styles.search}>
      <img
        width={19}
        style={{
          marginLeft: "1rem",
          marginRight: "10px",
          filter: "invert(1)",
          opacity: "0.6",
        }}
        src="https://cdn-icons-png.flaticon.com/128/8669/8669664.png"
      />
      <input
        className={styles.searchBar}
        placeholder="Search all notes"
        type="text"
        onChange={(eve) => handleSearch(eve.target.value)}
      />
    </div>
  );
};

export default Search;
