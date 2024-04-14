import React, { useState } from "react";
import { Input } from "antd";
import { useImages } from "../store/images";

const { Search } = Input;
type Props = {
  loading: boolean;
};

const SearchBox = ({ loading }: Props) => {
  const [category, setCategory] = useState<string | undefined>();
  const searchCategory = useImages((state) => state.searchCategory);

  return (
    <>
      <Search
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="input search loading default"
        loading={loading}
        // onClick={async () => await searchCategory({ category })}
        onSearch={async () => {
          await searchCategory({ category });
        }}
      />
    </>
  );
};
export default SearchBox;
