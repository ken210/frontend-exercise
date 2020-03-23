import React, { useState, useEffect } from "react";
import escapeRegExp from "escape-string-regexp";
import i18n from "./i18n";
import styles from "./styles.module.scss";
import MultiSelectItem from "./multi-select-item";
import searchIcon from "./search.svg";

const addToSelectedItems = (arr: string[], item: string) => {
  const newArr = [...arr];
  newArr.push(item);
  newArr.sort();

  return newArr;
};

const removeFromArray = (arr: string[], item: string) => {
  const index = arr.indexOf(item);
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
};

type MultiSelectProps = {
  title: string;
  getItems: () => Promise<string[]>;
  onSubmit: (selected: string[]) => void;
  preselectedItems: string[];
};

const MultiSelect = ({
  title,
  getItems,
  onSubmit,
  preselectedItems = []
}: MultiSelectProps) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>(
    preselectedItems
  );
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    const getData = async () => {
      try {
        setItems(await getItems());
        setLoading(false);
      } catch (err) {
        setError(err);
      }
    };

    getData();
  }, [getItems]);

  const selectItem = (item: string) => {
    setSelectedItems(addToSelectedItems(selectedItems, item));
  };

  const removeItem = (item: string) => {
    setSelectedItems(removeFromArray(selectedItems, item));
  };

  const filterList = (event: React.ChangeEvent<HTMLInputElement>) => {
    // we want to escape regexp chars like "?"
    setFilter(escapeRegExp(event.target.value));
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(selectedItems);
  };

  const re = new RegExp(filter, "i");
  const otherItems = items.filter((item) => {
    // check if item matches filter AND is not selected
    // checking filter first to short-circuit and avoid some() loop
    return (
      re.test(item) && !selectedItems.some((selected) => selected === item)
    );
  });

  return (
    <form className={styles.container} onSubmit={submitHandler}>
      <h3>{title}</h3>
      <div className={styles.search}>
        <input
          placeholder={i18n["Search ..."]}
          onChange={filterList}
          role="search"
        />
        <img src={searchIcon} className={styles["search-icon"]} alt="" />
      </div>
      <div className={styles.scroll} role="main">
        {loading ? (
          <p>{i18n["Loading..."]}</p>
        ) : error ? (
          <p>{i18n["Error loading list"]}</p>
        ) : (
          <ul>
            {selectedItems.map((item) => (
              <li key={item}>
                <MultiSelectItem
                  search={filter}
                  selected={true}
                  onChange={removeItem}
                >
                  {item}
                </MultiSelectItem>
              </li>
            ))}
            {otherItems.map((item) => (
              <li key={item}>
                <MultiSelectItem
                  key={item}
                  search={filter}
                  selected={false}
                  onChange={selectItem}
                >
                  {item}
                </MultiSelectItem>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        type="submit"
        className={styles.submit}
        disabled={!!loading || !!error}
      >
        Toepassen
      </button>
    </form>
  );
};

export default MultiSelect;
