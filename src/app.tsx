import React from "react";
import Multiselect from "./multi-select";
import { getProductGroups } from "./api";
import { useLocalStorage } from "./hooks";
import styles from "./app.module.scss";

const App = () => {
  const [selectedProducts, setSelectedProducts] = useLocalStorage<string[]>(
    "product-group",
    []
  );

  return (
    <div className={styles.app}>
      <Multiselect
        title="Productgroep"
        getItems={getProductGroups}
        preselectedItems={selectedProducts}
        onSubmit={(selected: string[]) => {
          setSelectedProducts(selected);
          console.log("Changed product groups selection:");
          console.log(selected);
        }}
      />
    </div>
  );
};

export default App;
